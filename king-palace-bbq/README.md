# King Palace Chinese BBQ

A responsive restaurant website inspired by the supplied CRAV Burgers template. Plain HTML, CSS and JavaScript; no package installation or build step is required.

## Open the website

Double-click [Open King Palace.command](<Open King Palace.command>) in Finder. It checks the site, selects a free port from 4173–4183, verifies that `index.html` is being served, and opens a fresh Google Chrome window at `http://localhost:<port>/`. Keep the Terminal window open while viewing the site; press Control-C there to stop it.

If macOS blocks the launcher, right-click it in Finder, choose **Open**, then choose **Open** again. You can also run it from Terminal:

```sh
"/Users/simonstenin/output/king-palace-bbq/Open King Palace.command"
```

Menu search, filters and navigation also work over `file://` if you open [index.html](</Users/simonstenin/output/king-palace-bbq/site/index.html>) directly, but the launcher gives you a real localhost URL and map iframe behavior.

For a local HTTP preview, run from this folder:

```sh
python3 serve.py
```

## Included

- CRAV-inspired food-led landing page, featured dishes, restaurant story, takeout section, location and footer.
- 38 researched menu selections across six categories, plus a link to the full published menu listing.
- Historical menu prices clearly labeled with their August 2025 source date.
- Search across all selections, category filters, empty states and accessible button states.
- Phone ordering links and Google Maps directions. No simulated checkout or order confirmations.
- Weekly hours and open/closed status calculated in America/New_York, including Wednesday closure.
- Mobile navigation, keyboard Escape support, mobile call/menu bar and reduced-motion support.
- Restaurant structured data and page metadata.
- Public information/photo credits page with source links.

## Editing

- `site/index.html`: page sections, contact information, hours, SEO metadata.
- `site/styles.css`: color variables, typography and responsive layouts.
- `site/menu-data.js`: dishes, historical prices, categories and descriptions.
- `site/app.js`: filtering, mobile navigation, opening-hours logic and photo fallbacks.
- `site/menu-model.js`: testable search, price-formatting and timezone logic.

Update both the visible hours and JSON-LD when restaurant hours change. Opening status uses the schedule in `menu-model.js`, which must also be updated.

## Verification

Run `node --test tests/menu.test.cjs`. Eight checks passed for data validity, filtering, cross-category search, historical-price handling, opening/closing boundaries, Wednesday closure, daylight-saving offsets, local links, and structured metadata. JavaScript syntax and HTML structure checks also passed. See `QA.md` for the verification scope.

## Current limitations

The session blocked the browser connector, local Chrome launch, and shell network access. The source template was readable through web search, but its computed styles and animations could not be captured. This is a custom adaptation, not a verified pixel-perfect clone. Browser rendering and remote image availability have not been verified.

Photographs and fonts load remotely. Photos are preview references credited to Tasty Planet / The Infatuation, not licensed restaurant-owned assets. Designed text fallbacks display if images fail. Replace or license photos and confirm current prices before public launch. The proposed wordmark is not the official restaurant logo.

The site is a local preview. No public deployment has been made.
