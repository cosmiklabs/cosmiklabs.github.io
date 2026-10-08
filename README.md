# Cosmik website

A private, unpublished website for Cosmik’s independent gaming workshop. **GitHub Pages is off. There is no deployment workflow, external preview or custom domain.** This repository does not publish the site when code changes.

## Run locally

Requires Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the current build.
- `npm run check` rebuilds and runs all automated tests.

Rebuild after source edits. `PORT` changes the preview port. The development server binds only to localhost. Generated pages also work as local files, except for the root-absolute 404 navigation intended for eventual root-level hosting.

## Editing

Edit family data and `featuredWork.familyId` in `src/projects.mjs`, page templates in `src/templates.mjs`, and theme approvals in `src/themes.mjs`. Featured work is independent of permanent family destinations. Generated output belongs in ignored `site/`.

## Content boundaries

HPLX names the ecosystem here: engine, game reimplementations, launcher and editor. The engine is labeled **HPLX Engine** when discussed separately. The Dark Descent, engine and launcher are in development; the editor is **Planned** and not built. The current editor direction is editing tools linked into each HPLX game, with in-viewport playtesting, not a promised standalone download.

The Dark Descent’s menus, saves and custom-story launching are implemented, and opening campaign sections have documented playtests. Later campaign validation, menu checks and lighting comparisons remain open. Windows is the only verified platform. Launcher infrastructure exists, but end-to-end desktop validation is still in progress.

AMFP is future work that has not started. Penumbra/HPL1 is a future direction beyond current HPL2 work. These are not release promises. There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases. The package catalog’s internal availability flags do not mean public download availability.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Brand provenance and approvals

Pinned to [cosmiklabs/brand at af89b8c](https://github.com/cosmiklabs/brand/tree/af89b8c2dd4f4426379d8b2af3b65ac4c13d21bf), the approved 7 October 2026 baseline. `assets/brand-tokens.css` is the exact generated baseline; the HPLX theme starts with that commit's generated family CSS. Preserve the unmodified emblem and the bundled Inter, IBM Plex Mono and Spectral SIL Open Font License notices. Tests check the pinned assets.

The owner approved the existing HPLX warm theme for this private website on 7 October. This does not change the brand kit's proposed family status or approve an HPLX logo. HPLX uses plain text for its identity. Family overrides stay inside their `data-family` boundary and explicit dark/light modes; shared navigation, layout, interactions and interface type stay consistent. The Cosmik home, Projects, About, header and footer use the baseline.

## Remaining review

The October 7 refresh passes the automated suite. The cloud browser refused the localhost preview with `net::ERR_BLOCKED_BY_CLIENT`; **interactive browser, screenshot, responsive-layout and assistive-technology review were not completed**. Static and HTTP checks are not browser certification. Before publication, review desktop and 320 px layouts, 200% text sizing, keyboard focus, repeated native disclosure toggles, Back/Forward and reduced motion in a supported browser.

The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control; privacy is provided by the private repository and disabled hosting. Publication, indexing and any hosting settings require a separate decision.
