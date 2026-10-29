import test from 'node:test';
import assert from 'node:assert/strict';
import { animateToCart } from '../src/lib/cart-animation.mjs';

test('flight reaches the bag center and cleans up on finish or cancellation', () => {
  let removed = 0;
  let frames;
  let flight;
  let pulses = 0;
  const cart = {
    isConnected: true,
    getBoundingClientRect: () => ({ left: 900, top: 20, width: 40, height: 40 }),
    animate: () => { pulses++; return { cancel() {} }; },
  };
  const node = {
    style: {}, setAttribute() {}, appendChild() {}, remove() { removed++; },
    animate(value) { frames = value; flight = { cancel() { this.oncancel?.(); } }; return flight; },
  };
  const oldWindow = globalThis.window;
  const oldDocument = globalThis.document;
  globalThis.window = { matchMedia: () => ({ matches: false }), innerWidth: 1000, innerHeight: 800 };
  globalThis.document = { querySelector: () => cart, createElement: (tag) => tag === 'span' ? node : {}, body: { appendChild() {} } };
  try {
    const source = { animate() {}, getBoundingClientRect: () => ({ left: 100, top: 200, bottom: 300, width: 100, height: 100 }) };
    const cancel = animateToCart({ source, image: '/product.png' });
    assert.match(frames.at(-1).transform, /translate\(770px, -210px\)/);
    assert.equal(frames.at(-1).opacity, 0);
    const middleY = Number(frames[15].transform.match(/translate\(385px, ([\d.-]+)px\)/)[1]);
    assert.ok(middleY < -105, 'midpoint rises above the straight path');
    flight.onfinish();
    assert.equal(removed, 1);
    assert.equal(pulses, 1);
    cancel();
    window.matchMedia = () => ({ matches: true });
    frames = null;
    animateToCart({ source });
    assert.equal(frames, null, 'reduced motion creates no flight');
  } finally {
    globalThis.window = oldWindow;
    globalThis.document = oldDocument;
  }
});
