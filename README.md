# Cosmik website

A private, unpublished website for Cosmik’s independent gaming workshop. **GitHub Pages is off. There is no deployment workflow, external preview or custom domain.** This repository does not publish the site when code changes.

## Run locally

Requires Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the current build.
- `npm run check` rebuilds and runs all automated tests.

Rebuild after source edits. `PORT` changes the preview port. The development server binds only to localhost. Generated pages also work as local files, except for the root-absolute 404 navigation intended for eventual root-level hosting.

## Site structure

Cosmik’s homepage highlights **current featured work**, independently of its permanent **project-family destinations**. HPLX is the current feature, not a permanent premise of the homepage. The Projects index lists families rather than treating repositories, games and tools as equivalent products.

HPLX has one family page at `/projects/hplx/`, containing:

- Games: The Dark Descent and its current development progress
- Engine and tools: the engine, launcher and planned editor
- Development: present availability and clearly separated future directions

The home feature is configured by `featuredWork` in `src/projects.mjs`. To feature another family, add that family and its page content, then point `featuredWork.familyId` at its ID and change the editorial copy. The directory and navigation do not change when the feature changes. A regression test exercises this independently.

Eight routes are retained:

| Route | Purpose |
|---|---|
| `/` | Cosmik introduction, featured work and family navigation |
| `/projects/` | Compact family directory |
| `/projects/hplx/` | HPLX family, including games and tools |
| `/about/` | The personal workshop and its scope |
| `/projects/tdd/` | Redirect and fallback link to the family’s `#tdd` section |
| `/projects/amfp/` | Redirect and fallback link to the visible `#future` disclosure |
| `/projects/hplx-editor/` | Redirect and fallback link to the family’s `#editor` section |
| `/404.html` | Missing-page recovery |

The AMFP redirect lands on the visible future-work disclosure, rather than relying on a browser to open a closed disclosure when targeting its contents. Native `details`/`summary` controls reveal supporting development detail without JavaScript. There are no search filters, client scripts, trackers, cookies, external fonts or data-submitting forms.

### Files

- `src/projects.mjs`: family data, editable featured work, old-route mapping and validation
- `src/templates.mjs`: shared shell and semantic static templates
- `src/themes.mjs`: approval-gated family identity registry
- `assets/family-themes.css`: scoped family-theme boundary
- `assets/site.css`: responsive site styles using approved semantic tokens
- `assets/brand-tokens.css`: exact pinned approved baseline from the brand repository
- `scripts/build.mjs`: dependency-free generator
- `scripts/serve.mjs`: localhost-only static preview server
- `tests/`: family-model, HTML/asset/link/brand, and HTTP-server regression tests
- `site/`: generated output, ignored by Git

## Content boundaries

HPLX names the ecosystem here: engine, game reimplementations, launcher and editor. The engine is labeled **HPLX Engine** when discussed separately. The Dark Descent, engine and launcher are in development; the editor is **Planned** and not built. The current editor direction is editing tools linked into each HPLX game, with in-viewport playtesting, not a promised standalone download.

The Dark Descent’s menus, saves and custom-story launching are implemented, and opening campaign sections have documented playtests. Later campaign validation, menu checks and lighting comparisons remain open. Windows is the only verified platform. Launcher infrastructure exists, but end-to-end desktop validation is still in progress.

AMFP is future work that has not started. Penumbra/HPL1 is a future direction beyond current HPL2 work. These are not release promises. There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases. The package catalog’s internal availability flags do not mean public download availability.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Approved brand baseline

Pinned to [cosmiklabs/brand at af89b8c](https://github.com/cosmiklabs/brand/tree/af89b8c2dd4f4426379d8b2af3b65ac4c13d21bf), the approved 7 October 2026 baseline:

- Exact `tokens/cosmik/cosmik.css` snapshot
- Black and warm off-white; hierarchy through type, space and structure
- Self-hosted Inter and IBM Plex Mono with their SIL Open Font License notices
- Accepted emblem geometry, unchanged
- A live “Cosmik” interface label in Inter Medium beside a 48 px emblem with a 12 px gap; no recreated wordmark
- Static branding, semantic color roles, visible focus and reduced-motion support

### Family themes and identity

Family pages have a `data-family` content boundary. The shared Cosmik header, global navigation and footer stay outside it; home, Projects and About remain baseline. Nested detail pages inherit their family's theme by supplying the same `familyId` to the shared shell. The preserved detail redirects do this too.

`src/themes.mjs` gates theme assets by approval, including explicit website-only use. Theme and logo decisions are independent. Register a selected stylesheet or approved logo under `assets/families/<family>/`. Every family CSS override must be restricted to its `data-family` scope and explicit dark/light modes. A family may alter semantic colors and heading type; shared interface type, navigation structure, spacing, layout and interactions stay consistent.

The owner selected the existing HPLX warm theme for this private website on 7 October 2026. HPLX pages now use the kit’s warm dark surfaces, bone text, lantern-amber accents, parchment light sections and Spectral headings. Body text, controls and labels remain Inter/Plex. The Cosmik home, Projects, About, global navigation and footer stay monochrome.

`assets/families/hplx/theme.css` starts with the exact generated `tokens/hplx/hplx.css` from the pinned brand commit, followed by local font loading and a small, family-scoped application of the accent. Spectral SemiBold is self-hosted with its SIL Open Font License. Tests verify the source hash, asset hashes, selector isolation, all implemented contrast pairs and inheritance through dark/light sections.

This is approval to use the existing theme in the private website, not a change to the public brand kit’s proposed status or approval of every family asset. The HPLX logo remains absent: the page uses plain HPLX text, with no Cosmik emblem as its product symbol. No new logo, imagery or launcher changes are included. There are no simulated product screenshots, generic space wallpaper or ornamental logo repeats. The old abstract art is no longer part of the generated site.

## Validation and remaining review

`npm run check` verifies:

- Family-only navigation and changing featured work without changing destinations
- All eight routes, redirect fallback links, local assets and fragments
- One H1, unique IDs/titles, landmarks, image alternatives and native disclosures
- Exact token/emblem/font hashes and preserved font licenses
- Semantic-token-only styling, responsive and reduced-motion hooks
- Absence of private-source/download links, external scripts and deployment configuration
- Local HTTP routes, redirects, 404s, invalid URLs, MIME types and cache behavior

The October 7 refresh passes the automated suite. The cloud browser refused the localhost preview with `net::ERR_BLOCKED_BY_CLIENT`; **interactive browser, screenshot, responsive-layout and assistive-technology review were not completed**. Static and HTTP checks are not browser certification. Before publication, review desktop and 320 px layouts, 200% text sizing, keyboard focus, repeated native disclosure toggles, Back/Forward and reduced motion in a supported browser.

The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control; privacy is provided by the private repository and disabled hosting. Publication, indexing and any hosting settings require a separate decision.
