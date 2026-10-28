import test from 'node:test';
import assert from 'node:assert/strict';
import { selectFeaturedProduct, getProductImages, clampQuantity } from '../src/lib/showcase.mjs';

test('uses real, available headphone inventory for the featured product', () => {
  const laptop = { _id: 'laptop', category: 'Laptop', countInStock: 1 };
  const headphones = { _id: 'headphones', category: 'Tai nghe', countInStock: 3 };
  assert.equal(selectFeaturedProduct([laptop, headphones]), headphones);
  assert.equal(selectFeaturedProduct([]), null);
  assert.equal(selectFeaturedProduct([{ name: 'Demo', countInStock: 10 }]), null);
});

test('gallery removes duplicates and invalid image entries', () => {
  assert.deepEqual(getProductImages({ image: '/main.jpg', images: [null, '', '/main.jpg', '/side.jpg'] }), ['/main.jpg', '/side.jpg']);
  assert.deepEqual(getProductImages({ images: 'invalid' }), []);
});

test('purchase quantity stays within available inventory', () => {
  assert.equal(clampQuantity(5, 2), 2);
  assert.equal(clampQuantity(-1, 2), 1);
  assert.equal(clampQuantity(1.8, 3), 1);
  assert.equal(clampQuantity(1, 0), 0);
});
