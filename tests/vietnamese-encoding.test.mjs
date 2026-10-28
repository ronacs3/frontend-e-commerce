import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const samples = {
  'src/components/Header.js': 'Đăng nhập',
  'src/components/ProductShowcase.jsx': 'Chạm công nghệ.',
  'src/components/HeadphoneViewer.jsx': 'Kéo để khám phá mọi góc nhìn',
  'src/components/Footer.js': 'Công nghệ tốt hơn.',
  'src/components/SearchBox.js': 'Bạn đang tìm thiết bị gì?',
  'src/components/ProductCard.js': 'Thêm vào giỏ:',
  'src/app/page.js': 'Bạn muốn khám phá gì?',
  'src/app/layout.js': 'Đến nội dung chính',
  'src/app/profile/page.js': 'Mật khẩu cần từ 8 đến 128 ký tự',
  'src/components/CompareFloatingBar.js': 'Không thể so sánh sản phẩm',
};

for (const [path, sample] of Object.entries(samples)) {
  test(`${path} preserves Vietnamese Unicode`, async () => {
    const source = await readFile(new URL('../' + path, import.meta.url), 'utf8');
    assert.ok(source.includes(sample), `Missing intact Vietnamese text: ${sample}`);
    const textWithoutUrls = source.replace(/https?:\/\/[^\s"'`<>]+/g, '');
    assert.doesNotMatch(textWithoutUrls, /[\p{L}]\?[\p{L}]|\uFFFD/u, 'Text contains corrupted letters');
  });
}
