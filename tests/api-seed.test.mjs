import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { seedApi } from '../scripts/seed-api.mjs';

const data = JSON.parse(await readFile(new URL('../data/api-seed.json', import.meta.url)));
const customerPassword = 'Local-Test-Password-Only!';

test('seed data covers catalog categories with valid DTO fields and real key references', () => {
  const categories = new Set(data.categories.map(item => item.name));
  const products = new Map(data.products.map(item => [item.key, item.body]));
  assert.equal(products.size, 12);
  for (const { body } of data.products) {
    assert.ok(categories.has(body.category));
    assert.ok(body.name.length <= 100);
    assert.ok(body.price >= 0 && Number.isInteger(body.countInStock) && body.countInStock >= 0);
    assert.ok(body.image.startsWith('https://'));
    assert.ok(!Object.hasOwn(body, 'key') && !Object.hasOwn(body, 'isPreOrder'));
  }
  for (const coupon of data.coupons) {
    assert.ok(coupon.discount >= 1 && coupon.discount <= 100);
    assert.ok(Date.parse(coupon.expirationDate) > Date.now());
    assert.ok(coupon.applicableCategories.every(category => categories.has(category)));
  }
  for (const order of data.orders) {
    assert.ok(data.customers.some(customer => customer.key === order.customer));
    assert.ok(order.items.every(item => products.has(item.product) && item.qty <= products.get(item.product).countInStock));
  }
});

test('refuses a non-admin token before any data is created', async () => {
  const calls = [];
  await assert.rejects(seedApi({ data, adminToken: 'test', customerPassword,
    fetchImpl: async (url, options) => { calls.push(options.method); return Response.json({ isAdmin: false }); },
  }), /quyền quản trị/);
  assert.deepEqual(calls, ['GET']);
});

test('creates categories before products, resolves actual product IDs, and skips a completed import', async () => {
  const db = { categories: [], products: [], coupons: [], customers: [], orders: [] };
  const calls = [];
  let sequence = 0;
  const fetchImpl = async (url, options) => {
    const path = new URL(url).pathname.replace('/api', '');
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ path, method: options.method });
    if (path === '/users/profile') return Response.json({ isAdmin: true });
    if (path === '/users/login') return Response.json({ token: 'customer-token', _id: db.customers.find(item => item.email === body.email)._id });
    if (path === '/orders/myorders') return Response.json(db.orders);
    const kind = path === '/users' ? 'customers' : path.slice(1);
    if (options.method === 'GET') return Response.json(db[kind]);
    if (path === '/products') assert.ok(db.categories.some(item => item.name === body.category));
    if (path === '/orders') {
      assert.ok(body.orderItems.every(item => db.products.some(product => product._id === item.product)));
      assert.equal(body.paymentMethod, 'COD');
      assert.equal(Object.hasOwn(body, 'isPaid'), false);
    }
    const item = { ...body, _id: `id-${++sequence}`, ...(kind === 'customers' ? { token: 'customer-token' } : {}) };
    db[kind].push(item);
    return Response.json(item, { status: 201 });
  };
  let state;
  await seedApi({ data, adminToken: 'admin-token', customerPassword, fetchImpl, save: value => { state = structuredClone(value); } });
  assert.deepEqual(Object.fromEntries(Object.entries(db).map(([key, values]) => [key, values.length])), { categories: 4, products: 12, coupons: 3, customers: 3, orders: 3 });
  calls.length = 0;
  await seedApi({ data, adminToken: 'admin-token', customerPassword, fetchImpl, state });
  assert.ok(calls.every(call => call.method === 'GET' || call.path === '/users/login'));
  // Recover IDs from the backend after a missing checkpoint without recreating orders.
  const recoveredState = { ...state, orders: {} };
  await seedApi({ data, adminToken: 'admin-token', customerPassword, fetchImpl, state: recoveredState });
  assert.equal(db.orders.length, 3);
});
