# DAFFA FAZLY — Portfolio Final

Final polish focused on calm, native scrolling, responsive certificate cards, and a dark contact finale.
# DAFFA FAZLY — Data Science Portfolio

V22 updates the Toolkit section to use PNG assets instead of SVG. Brand marks are rendered as local PNGs where available; Tableau, Power BI, and Pentaho use transparent PNG CDN assets with local PNG fallbacks. The icons are sized through CSS so the small rounded icon boxes remain consistent with the monochrome editorial theme.

The portfolio can still be opened locally. Internet access is only needed for the three remote PNG brand assets.

Icon references: Simple Icons provides popular brand icons under CC0; Power BI official icon resources are also published by Microsoft under their stated licenses.


V23: Toolkit cards are borderless and non-magnetic; only the small rounded icon and tool name remain visible.

## V26 update
- Toolkit icons enlarged slightly for better visibility.
- Toolkit hover boxes remain disabled; only icon motion is used.
- Custom cursor now uses a smooth lag and inverse/difference treatment so it remains visible on both dark and light sections.
- Cursor expands smoothly over links, magnetic elements, and toolkit items.

## V28 revision
- Selected Work hover restored as a full-width white inverse band entering from the left.
- Hovered project typography changes to black while other rows remain untouched.
- Subtle horizontal movement is applied to the hovered row content.
- Custom cursor is positioned immediately at page load and remains above the work hover layer.


## Certifications
The Certifications archive now contains 18 real credentials. Lightweight WebP previews live in `assets/certificates/`, while the original PDFs are preserved in `assets/certificates/originals/`. Selecting a certificate opens a preview with an “OPEN ORIGINAL PDF” action.


V38 visual revision: Certifications uses a light grey editorial archive; Contact uses a dark closing section.


## Scroll performance

The current build keeps native browser scrolling and the existing visual motion, but reduces scroll-time repaint cost. `requestAnimationFrame` follows the display refresh rate automatically (including high-refresh screens), blur is limited to visible editorial targets, cursors stop animating when settled, and below-fold certificate/project media uses lazy decoding/loading. Actual FPS depends on the visitor's browser, GPU, display, and page embedding environment.


## CV download
The site bundles `assets/docs/Daffa-Fazly-Rashidan-CV.pdf`. The persistent `CV ↓` control and the Contact-section download link use the native HTML `download` attribute.

## Final CV package
The bundled CV has been refined into a one-page ATS-friendly version. Website CV download buttons continue to target `assets/docs/Daffa-Fazly-Rashidan-CV.pdf`. An editable DOCX source is included at `assets/docs/Daffa-Fazly-Rashidan-CV-Editable.docx` for future updates.

## Behance-inspired editorial refinement (V33)
- Added a dedicated **Majadigi confidential case study** focused on ETL, data quality, integration, and executive dashboard datasets without exposing internal government data.
- Kept the existing monochrome big-type identity; no extra color system, heavy motion, or image previews were added, so scroll performance remains lightweight.


## V50 — Ambient animated gradient
- Added a FeralUI-inspired slow **Sky / Mesh** background using large radial-gradient fields.
- Motion stays monochrome (paper, silver, graphite, pearl) so the existing Data Science / Information Design identity remains intact.
- Each blob moves with compositor-friendly `transform` animation rather than redrawing a canvas on every frame.
- Off-screen section animations are paused with `IntersectionObserver`; only visible sections animate.
- Fine-pointer devices get a very small cursor-parallax response throttled through `requestAnimationFrame`.
- `prefers-reduced-motion` and coarse-pointer devices automatically receive the static/low-motion version.
- Applied across homepage panels and the hero areas of project/certification subpages.
