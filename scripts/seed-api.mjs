import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_API = 'https://ecommerce-backend-nestjs-liard.vercel.app/api';
const root = new URL('../', import.meta.url);

export async function seedApi({ data, adminToken, customerPassword, baseUrl = DEFAULT_API, state = {}, save = async () => {}, fetchImpl = fetch, log = () => {} }) {
  if (!adminToken) throw new Error('Thiếu SEED_ADMIN_TOKEN.');
  if (!customerPassword || customerPassword.length < 8 || customerPassword.length > 128) throw new Error('Mật khẩu khách demo cần từ 8 đến 128 ký tự.');
  const request = async (path, { method = 'GET', token = adminToken, body } = {}) => {
    const response = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}${path}`, {
      method,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      // Do not print response bodies: auth responses can contain credentials.
      const error = new Error(`${method} ${path}: HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  };
  const profile = await request('/users/profile');
  if (!profile.isAdmin) throw new Error('Tài khoản hiện tại không có quyền quản trị. Chưa tạo dữ liệu.');
  if (state.baseUrl && state.baseUrl !== baseUrl) throw new Error('Checkpoint thuộc backend khác. Hãy dùng file checkpoint riêng.');
  state.baseUrl = baseUrl;
  for (const kind of ['categories', 'products', 'coupons', 'customers', 'orders']) state[kind] ||= {};
  const remember = async (kind, key, record) => {
    const id = record?._id || record?.id;
    if (!id) throw new Error(`${kind}/${key}: backend không trả ID. Dừng để kiểm tra trước khi chạy lại.`);
    state[kind][key] = id;
    await save(state);
    return id;
  };
  const list = async path => {
    const records = await request(path);
    if (!Array.isArray(records)) throw new Error(`${path}: danh sách trả về không phải mảng.`);
    return records;
  };
  for (const [kind, keyOf, payloadOf] of [
    ['categories', item => item.name, item => item],
    ['products', item => item.key, item => item.body],
    ['coupons', item => item.code, item => item],
  ]) {
    const existing = await list(`/${kind}`);
    for (const item of data[kind]) {
      const key = keyOf(item);
      if (state[kind][key]) { log(`Bỏ qua ${kind}: ${key}`); continue; }
      const body = payloadOf(item);
      const found = existing.find(record => kind === 'coupons' ? record.code === body.code : record.name === body.name);
      if (found && kind === 'products' && found.brand !== body.brand) throw new Error(`Tên sản phẩm trùng với dữ liệu khác: ${body.name}`);
      if (found && kind === 'coupons' && (found.discount !== body.discount || JSON.stringify(found.applicableCategories || []) !== JSON.stringify(body.applicableCategories || []))) throw new Error(`Mã giảm giá trùng nhưng khác cấu hình: ${body.code}`);
      const record = found || await request(`/${kind}`, { method: 'POST', body });
      await remember(kind, key, record);
      log(`${found ? 'Dùng lại' : 'Đã tạo'} ${kind}: ${key}`);
    }
  }
  const customerTokens = new Map();
  for (const customer of data.customers) {
    const credentials = { email: customer.email, password: customerPassword };
    let account;
    if (!state.customers[customer.key]) {
      try {
        account = await request('/users', { method: 'POST', token: null, body: { name: customer.name, ...credentials } });
      } catch (error) {
        if (![400, 409].includes(error.status)) throw error;
        // Only retry login for this exact demo email and explicitly configured password.
        account = await request('/users/login', { method: 'POST', token: null, body: credentials });
      }
      await remember('customers', customer.key, account);
    } else {
      account = await request('/users/login', { method: 'POST', token: null, body: credentials });
    }
    if (!account.token) throw new Error(`Backend không trả token khách demo: ${customer.key}`);
    customerTokens.set(customer.key, account.token);
    log(`Sẵn sàng khách demo: ${customer.key}`);
  }
  for (const order of data.orders) {
    if (state.orders[order.key]) { log(`Bỏ qua đơn đã tạo: ${order.key}`); continue; }
    const body = {
      orderItems: order.items.map(item => {
        const product = state.products[item.product];
        if (!product) throw new Error(`Không tìm thấy sản phẩm cho đơn: ${item.product}`);
        return { product, qty: item.qty };
      }),
      shippingAddress: data.shippingAddress,
      paymentMethod: 'COD',
      ...(order.couponCode ? { couponCode: order.couponCode } : {}),
    };
    const token = customerTokens.get(order.customer);
    if (!token) throw new Error(`Không tìm thấy khách demo: ${order.customer}`);
    const previous = await request('/orders/myorders', { token });
    if (!Array.isArray(previous)) throw new Error('Lịch sử đơn hàng không phải mảng.');
    const signature = items => JSON.stringify(items.map(item => [item.product?._id || item.product, item.qty]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
    const found = previous.find(item => item.shippingAddress?.address === body.shippingAddress.address && (item.couponCode || '') === (body.couponCode || '') && signature(item.orderItems || []) === signature(body.orderItems));
    if (found) { await remember('orders', order.key, found); log(`Dùng lại đơn demo: ${order.key}`); continue; }
    const record = await request('/orders', { method: 'POST', token, body });
    await remember('orders', order.key, record);
    log(`Đã tạo đơn demo: ${order.key}`);
  }
  state.completedAt = new Date().toISOString();
  await save(state);
  return state;
}

async function main() {
  const credentialsPath = fileURLToPath(new URL('.env.seed.local', root));
  if (existsSync(credentialsPath)) process.loadEnvFile(credentialsPath);
  const data = JSON.parse(await readFile(new URL('data/api-seed.json', root), 'utf8'));
  const summary = Object.fromEntries(['categories', 'products', 'coupons', 'customers', 'orders'].map(key => [key, data[key].length]));
  console.log(JSON.stringify({ backend: process.env.SEED_API_URL || DEFAULT_API, ...summary }, null, 2));
  if (!process.argv.includes('--apply')) { console.log('Xem trước. Dùng --apply để nạp dữ liệu.'); return; }
  const baseUrl = process.env.SEED_API_URL || DEFAULT_API;
  let adminToken = process.env.SEED_ADMIN_TOKEN;
  if (!adminToken && process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Đăng nhập admin: HTTP ${response.status}`);
    adminToken = (await response.json()).token;
  }
  if (!adminToken) throw new Error('Cần SEED_ADMIN_TOKEN hoặc SEED_ADMIN_EMAIL và SEED_ADMIN_PASSWORD.');
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD || `Demo-${randomBytes(18).toString('base64url')}!`;
  if (!process.env.SEED_CUSTOMER_PASSWORD) {
    // This file is ignored by git. It contains demo credentials, never the admin JWT.
    await writeFile(credentialsPath, `SEED_CUSTOMER_PASSWORD=${customerPassword}\n`, { flag: 'a', mode: 0o600 });
  }
  const checkpointPath = new URL('.seed-api.local.json', root);
  const state = existsSync(checkpointPath) ? JSON.parse(await readFile(checkpointPath, 'utf8')) : {};
  const result = await seedApi({ data, adminToken, customerPassword, baseUrl, state,
    save: value => writeFile(checkpointPath, JSON.stringify(value, null, 2) + '\n'), log: console.log });
  const inventory = await fetch(`${baseUrl}/products`).then(response => response.json());
  const ids = new Set(inventory.map(product => product._id));
  if (!Object.values(result.products).every(id => ids.has(id))) throw new Error('Đối chiếu danh sách sản phẩm sau khi nạp chưa đạt.');
  console.log('Đã nạp và đối chiếu dữ liệu. ID được lưu trong .seed-api.local.json. Mật khẩu demo nằm trong .env.seed.local.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
