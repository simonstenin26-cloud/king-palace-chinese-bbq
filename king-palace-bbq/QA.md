# Verification

Date: September 12, 2026

## Passed

- 8 Node tests: menu-data validity, category filters, cross-category search (including straight/curly apostrophes), market-price handling, Miami opening/closing boundaries, Wednesday closure, winter timezone offset and midnight, local references and Restaurant structured data.
- Syntax checks for all three JavaScript files used by the page.
- Balanced HTML structure for index.html and credits.html.
- All local asset/script/style/credit-page references exist.
- All nonempty fragment links have targets; no duplicate element IDs.
- Images have alternative text, the map iframe has a title, external new-tab links include noopener.
- CSS braces balanced. Responsive layouts at 1100, 800 and 560 pixels and a reduced-motion override are present in source.
- `serve.py --check` confirms the local preview files and `Open King Palace.command` passes zsh syntax validation. The launcher performs an HTTP health check before opening Chrome.

## Not verified in a browser

- Rendered layouts at desktop/tablet/mobile widths, screenshots, visual differences from CRAV, click/keyboard behavior in a real browser, external images/fonts and map loading.
- Browser MCP was rejected because it requires approval and this session's approval policy is never.
- Local Chrome launch terminated in the restricted environment.
- This agent sandbox rejects local HTTP server binding with Operation not permitted; the launcher is intended to run from the user's Mac Terminal/Finder environment, where it can bind localhost.
- Shell network access could not resolve the reference host.

No visual QA pass, live-server URL, source-fidelity percentage or deployment is claimed. The site can be opened directly from site/index.html and uses classic deferred scripts so menu interactions do not require an HTTP server. Remote photos/fonts/maps require an internet connection.

## Content limitations

The menu presents 38 selections with historical prices from an August 2025 listing, alongside a link to the full published menu. It does not assert those prices are current. Regular hours are corroborated by two restaurant listings; holidays and exceptional closures cannot be inferred. Opening status is based only on the listed regular schedule. Photo credit and source links are visible in the site. This is a design preview, not an endorsed official website.
