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
- `assets/site.css`: responsive website styles; no client-side JavaScript is required for content or navigation.
- `assets/brand-tokens.css`: a copy of the Cosmik brand kit's `tokens/cosmik.css`. Site styles use its roles only, never raw colour values.
- `assets/art/`: original abstract visual studies, explicitly not screenshots.
- `scripts/build.mjs`: dependency-free static generator.
- `tests/site.test.mjs`: static structure, local-link, catalog, escaping, and asset checks.
- `site/`: generated output, ignored by Git.

Pages: home, project index, HPLX, Amnesia: The Dark Descent Redux, Amnesia: A Machine for Pigs Redux, HPLX Editor, About, and a 404 page. Catalog entries have standalone routes regardless of their relationships. The homepage presents explicitly curated `featured: true` entries; it does not duplicate the full catalog. The project index is an image-free directory with shared name/type/status/parent columns and compact stacked mobile rows. Entries are grouped beneath their parent by default. Optional local search and type/status filters match projects independently, so a child remains discoverable when its parent is filtered out.

`assets/catalog-model.mjs` contains pure grouping and matching helpers shared by the build and browser. `assets/catalog.mjs` progressively enhances the pre-rendered directory. Controls stay hidden until initialization succeeds; every project remains available without JavaScript. Search is limited to this project directory, runs locally, and makes no network request. No external fonts, trackers, cookies, data-submitting forms, or third-party client dependencies are used.

## Content boundaries

HPLX and Amnesia: The Dark Descent Redux are marked **In development**. Amnesia: A Machine for Pigs Redux is a stub explicitly marked **Not started**, with no game artwork or feature claims. No release version, playable demo, download, compatibility promise, roadmap date, or completed feature is claimed. Repository links for individual projects remain absent until public URLs are confirmed. `source: null` is intentional. Game artwork and assets are not included. Both Redux projects and HPLX Editor are HPLX children. HPLX Editor is **Planned** at `/projects/hplx-editor/`, with an initial scope of creating HPL2-compatible custom stories. This is intended functionality, not an available capability. The current HPLX scope is HPL2; no broader compatibility promise is made. The TDD route remains `/projects/tdd/`; the new AMFP stub is `/projects/amfp/`.

The header, footer, and About page link only to the public Cosmik organization and brand repository. Game names remain the property of their respective owners; the TDD page identifies this as an independent, unaffiliated reimplementation.

## Brand assets and rights

Emblems, semantic tokens, and type come from [cosmiklabs/brand](https://github.com/cosmiklabs/brand). Emblems and type are from the v0.2 baseline commit `d71904ab02b551a1e6e975ac0d5f10d59bb5bfb2`; the tokens and the IBM Plex Mono WOFF2 are from the kit's unreleased 0.3.0 changes (decorative-grey roles, native font format), to be re-pinned to the 0.3.0 tag once it is released. The approved emblem is used as a static identity; this site does not modify or finalize the separate logo animation work.

Inter and IBM Plex Mono are self-hosted. Their SIL Open Font License notices are retained in `assets/fonts/`. No blanket code, brand, or artwork license has been selected for this website repository.

## Validation and publication

`npm run check` verifies the generated HTML structure, local links and fragments, all eight routes, parent relationships, font licensing files, grouping/filtering/reset behavior, curated-home structure, and basic safety/accessibility hooks. It does not replace an interactive browser accessibility or responsive-layout review.

During the initial implementation, Chromium launch was blocked by the execution environment's socket permissions. Browser layout and interaction tests therefore remain to be run locally at desktop and phone widths before publication. Static design review images, if provided separately, are composition previews rather than browser screenshots.

The output is compatible with a future root-level GitHub Pages organization site. All regular navigation and assets use relative paths. The 404 uses root-absolute paths so it also works at unknown nested URLs. No deployment workflow, Pages setting, custom domain, or external preview is configured. Enabling hosting is a separate decision.
