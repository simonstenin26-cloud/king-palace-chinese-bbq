# CRAV template → King Palace adaptation

Reference: https://www.cravburgers.shop/
Inspected through web reading on September 12, 2026.

## Evidence and limitations

CONFIRMED: the source exposes a prominent burger hero, compact navigation, food-feature sections, an experience section, ingredient storytelling, a takeaway section, a closing order CTA and an oversized brand footer.

CONFIRMED: source image URLs use Next.js image optimization. This suggests a Next.js site; the complete runtime stack was not captured.

UNVERIFIED: actual font families, color values, computed spacing, breakpoints, animation timings, scroll libraries, and presence or absence of GPU surfaces. Browser automation was unavailable: the MCP connector required approval in a session with approval disabled, and local Chrome could not launch. No source screenshots, token probes, GPU classification, or pixel-diff results are claimed.

The clone-site measurement workflow stopped at its browser prerequisite. The user's requested adaptation was implemented through the frontend-design workflow using the accessible source topology and newly authored styling.

## Adaptation

| Reference structure | King Palace implementation |
| --- | --- |
| Food hero and primary CTA | Oversized BBQ headline, oval roast-meat photo and menu CTA |
| Featured burger sections | Three researched signature dishes |
| Experience and ingredient story | Cantonese dining and family-style sharing section |
| Product exploration | Searchable menu selections with six categories |
| Takeaway storytelling | Phone ordering and takeout callout |
| Closing CTA and footer | Store hours, map, directions, phone and large wordmark |

Custom palette: warm ivory #f5f0e5, red #aa2524, mustard #e9b95b, dark ink #292820. Fonts: Barlow Condensed and DM Sans, with system fallbacks. Static flavor strip; short image-hover zoom and button feedback, disabled by reduced-motion preference. No scroll hijacking or artificial page loader.

All implemented surfaces are HTML/CSS/SVG with remote raster photos and a Google Maps iframe. No GPU effect is part of this custom design.

## Asset provenance

- 3 distinct King Palace food photos: REAL external references, remotely embedded from The Infatuation; credit Tasty Planet. Restaurant ownership or reuse license has not been verified.
- Crown/wordmark and icons: newly authored SVG and typography; proposed identity, not the restaurant's official logo.
- 0 generated raster images.
- Text fallback designs for blocked remote images.

This deliverable is an adaptation. A source-versus-output pixel diff would not be a fidelity check for the intentionally changed content, identity, layout and palette. Responsive visual QA remains unavailable because browser execution is blocked.
