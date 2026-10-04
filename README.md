# Cosmik website

The first design implementation for Cosmik's project catalog. Source is private while the design and content are developed. **Nothing in this repository publishes or enables GitHub Pages.**

## Run locally

Requires Node.js 22 or later. There are no third-party build dependencies and no install step.

- `npm run dev` builds the site and serves it at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the existing build.
- `npm run check` builds and runs all automated tests.

Rebuild after edits. Set `PORT` to change the preview port. The preview server binds only to localhost and is intended for local development.

## Structure

- `src/projects.mjs`: catalog data. A project has its own permanent route and may name another project's ID as its `parent`.
- `src/templates.mjs`: shared layout and semantic page templates.
- `assets/site.css`: responsive website styles; no client-side JavaScript is required.
- `assets/brand-tokens.css`: semantic tokens from the published Cosmik brand kit v0.2.
- `assets/art/`: original abstract visual studies, explicitly not screenshots.
- `scripts/build.mjs`: dependency-free static generator.
- `tests/site.test.mjs`: static structure, local-link, catalog, escaping, and asset checks.
- `site/`: generated output, ignored by Git.

Pages: home, project index, HPLX, The Dark Descent, About, and a 404 page. Catalog entries have standalone routes regardless of their relationships. The current two projects are shown directly, without unused category filters. No external fonts, trackers, cookies, forms, or client-side dependencies are used.

## Content boundaries

Both projects are marked **In development**. No release version, playable demo, download, compatibility promise, roadmap date, or completed feature is claimed. Repository links for individual projects remain absent until public URLs are confirmed. `source: null` is intentional. Game artwork and assets are not included. AMFP is not presented as a committed project.

The header, footer, and About page link only to the public Cosmik organization and brand repository. Game names remain the property of their respective owners; the TDD page identifies this as an independent, unaffiliated reimplementation.

## Brand assets and rights

Emblems, semantic tokens, and type come from [cosmik-labs/brand](https://github.com/cosmik-labs/brand), v0.2 baseline commit `d71904ab02b551a1e6e975ac0d5f10d59bb5bfb2`. The approved emblem is used as a static identity; this site does not modify or finalize the separate logo animation work.

Inter and IBM Plex Mono are self-hosted. Their SIL Open Font License notices are retained in `assets/fonts/`. No blanket code, brand, or artwork license has been selected for this website repository.

## Validation and publication

`npm run check` verifies the generated HTML structure, local links and fragments, all six routes, parent relationships, font licensing files, and basic safety/accessibility hooks. It does not replace an interactive browser accessibility or responsive-layout review.

During the initial implementation, Chromium launch was blocked by the execution environment's socket permissions. Browser layout and interaction tests therefore remain to be run locally at desktop and phone widths before publication. Static design review images, if provided separately, are composition previews rather than browser screenshots.

The output is compatible with a future root-level GitHub Pages organization site. All regular navigation and assets use relative paths. The 404 uses root-absolute paths so it also works at unknown nested URLs. No deployment workflow, Pages setting, custom domain, or external preview is configured. Enabling hosting is a separate decision.
