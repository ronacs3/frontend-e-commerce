# TechShop product showcase

Reference: [KaranChandekar/ecommerce-product-showcase](https://github.com/KaranChandekar/ecommerce-product-showcase). Its source was downloaded to a temporary directory for review. TechShop implements its own components around the existing NestJS API and Redux store.

## Direction

A Vietnamese product showcase: studio-style product media on the left, product information and buying controls on the right, swipeable photography, alternating editorial features and a compact navigation bar.

Palette follows the reference: paper #FAF8F5, charcoal #1A1A1A, gold #C9A96E and subdued beige borders. Darker gold #977443 is used for readable small text and Ant Design controls. Be Vietnam Pro remains the Vietnamese-compatible typeface.

The homepage features available inventory, preferring headphones. When no inventory exists, a procedural Three.js headphone model provides an explicitly illustrative, non-purchasable experience. Its color swatches do not represent backend variants. Product pages show actual product images, price, stock, quantity, reviews and related items. Cart and comparison use real product IDs.

Three.js is dynamically loaded near the viewport, pauses rendering offscreen, respects reduced motion and disposes GPU resources on unmount. WebGL failure retains a static image. Pointer drag and rotation buttons control the model; gallery supports touch, keyboard, thumbnails and navigation controls. Real products have a sticky purchase bar and a cart flight effect. No demo inventory, fake ratings, size variants or discounts are introduced.

## Verification

Run `npm run lint`, `node --test tests/*.test.mjs` and `npm run build`. Tests cover API transport, Vietnamese encoding, real-product selection, gallery images and inventory quantity bounds. Browser screenshot and WebGL interaction review remain necessary when a browser connection is available; no browser is exposed in this session.
