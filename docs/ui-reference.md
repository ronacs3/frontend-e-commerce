# Store UI reference

Reference: https://github.com/EricTsai83/add-item-to-cart-animation

The storefront adapts the reference's white canvas, centered heading, gray image
wells, rounded product cards, subtle shadows, and blue interaction borders.
It keeps TechShop's real catalog, filters, accounts, and checkout navigation.

All three stylesheet entrypoints are imported directly from `src/app/layout.js`:

- `globals.css`: Tailwind, base colors and shared animation utilities.
- `showcase.css`: storefront, product cards, product details and footer.
- `application.css`: authentication, checkout, cart, account and admin layouts.

The previous browser output contained the new introduction markup without its
styles. Direct imports remove the failed nested stylesheet import path. Global
`!important` color substitutions have been removed; existing utility classes and
Ant Design tokens now use the same blue palette. Ant Design has a stable CSS
variable key (`techshop`) to prevent server/client class mismatches and uses the
Vietnamese locale.

`SiteShell` provides a shared page frame and responsive admin navigation.
`AuthShell` provides a compact authentication form layout without fixed overlays.
The cart uses responsive item rows instead of a desktop-only table. Checkout
steps, totals, product rows and button labels adapt to narrow screens. Tables
scroll inside their panels. Missing pages, unavailable orders and runtime errors
have visible recovery states.

Product imagery comes from inventory. Empty and unavailable catalog states remain
visible instead of substituting fictional products. Product flights respect the
system reduced-motion preference.

Validation:

- `node --test tests/*.test.mjs`: 17 passing tests.
- ESLint: no errors; the existing native image warning in `ProductImage.js` remains.
- `npm run build`: successful production compilation and prerendering.
- Chrome with Playwright: 36 public route/viewport checks against the production
  server at 320, 768, 1024 and 1440 pixels, including CSS loading, hydration and
  page overflow checks.
- An isolated fixture backend was used for 45 populated product/cart/checkout/
  account/admin checks at 320, 768 and 1440 pixels, plus ten checks at 1024 pixels.
  No fixture records or credentials were added to the application or real backend.
- Interactive checks cover adding to cart, flight cleanup, quantity changes,
  removing items, form validation, demo login and the product editor modal,
  plus the mobile compare bar/modal, navigation, search and reduced motion.

Production screenshots: [desktop](ui-previews/desktop.png) and
[mobile authentication](ui-previews/mobile.png).

To rerun the optional browser regression check, install Playwright in a local
development tool environment and make Chrome available, then run:

```powershell
$env:PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
$env:UI_BASE_URL = 'http://localhost:3000'
node tests/browser-ui.mjs
```

`PLAYWRIGHT_MODULE` can be omitted when `playwright` is installed in this project.
Set `UI_BROWSER_PATH` to use an explicit Chromium executable. `NEXT_DIST_DIR`
allows an isolated Next.js build directory while the normal dev server is running.
