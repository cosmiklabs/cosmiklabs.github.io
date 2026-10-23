# Tectra website

Standalone product-site draft for `tectra.app`. This folder is self-contained and can be moved into its own repository without changing paths. It is not included in the parent Cosmik website build.

## Run

Node.js 22+. No dependencies or install step. From the parent repository, run `cd tectra.app` first. `npm run dev` prints the local preview URL (`http://127.0.0.1:4173`). To use another port: `PORT=4187 npm run dev`.

- `npm run check`: build the preview and run automated content/asset/accessibility-contract tests.
- `npm run dev`: build and serve at localhost:4173. Set `PORT` to use another port.
- `npm run build`: generate ignored `site/` output.

No deployment workflow, domain configuration, analytics, registration, payment or contact form is included. Preview metadata and robots.txt request no indexing, which is not access control. Publishing the repository source makes this copy and artwork public even if the generated site is not hosted. Public deployment and DNS require a separate decision.

## Extract into its own repository

Copy the complete `tectra.app/` directory, including its `.gitignore`, to a new directory outside the parent checkout. Use that directory as the new repository root; no imports or paths depend on the parent. The generated `site/` folder is disposable and ignored. Run `npm run check` and `npm run dev` from the extracted root. Initialize and push the new repository separately; no hosting configuration travels with this draft.

## Design and content

Tectra is the only product theme. The Cosmik token foundation supplies shared spacing/type primitives; Tectra mineral-teal color tokens apply globally, including header and footer. Brand assets remain unchanged. The approved lead is “Create structures for worlds real or imagined.” The slogan is “Describe the space. Shape what comes next.”

The project remains In development. Copy explains conversational design, connected parts/relationships, checked rules, visual references and iterative revisions. It does not announce availability, launch timing, pricing, a business model, competitive superiority or certified construction safety.

Motion is a progressive enhancement: bounded entrance/line-drawing animation, one-time section reveals and no scroll hijacking. Reduced-motion users get the complete static page. Content remains available when JavaScript is disabled.

## Replaceable visuals

`assets/media/structure-illustration.svg` is a conceptual placeholder, not output from the application. The figure with `data-asset-slot="viewport"` is reserved for a real app capture. Replace its image, dimensions and alt text together, and remove the placeholder caption only once the new image genuinely depicts the app. The hero line artwork is decorative conceptual art, not a screenshot.

## Asset provenance

Tectra Latch artwork and palette are pinned to [cosmiklabs/brand commit 67ddcac](https://github.com/cosmiklabs/brand/tree/67ddcacd2b5e7ef0ae8b3234b87c48000e13ff3f/kits/tectra). The palette's explicit-mode adaptation comes from the existing Cosmik website. Shared token baseline is pinned to [af89b8c](https://github.com/cosmiklabs/brand/tree/af89b8c2dd4f4426379d8b2af3b65ac4c13d21bf). Bundled Inter and IBM Plex Mono retain their OFL notices. Brand rights remain subject to the brand repository terms; no new blanket license is applied here.

## Verification

Automated tests check local links/assets, approved content boundaries, placeholder labeling, markup landmarks, motion fallbacks, mobile CSS and no-publication safeguards. These do not substitute for visual/browser review. Review desktop/mobile, reduced motion, keyboard navigation and final image composition before public deployment.
