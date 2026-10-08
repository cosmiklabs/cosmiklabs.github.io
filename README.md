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

The owner approved the existing HPLX warm theme for this private website on 7 October. This does not change the brand kit's proposed family status. The HPLX page now pairs the separately selected Ember symbol with an ordinary live HPLX name. Family overrides stay inside their `data-family` boundary and explicit dark/light modes; shared navigation, layout, interactions and interface type stay consistent. The Cosmik home, Projects, About, header and footer use the baseline.

### HPLX Ember symbol

The HPLX family header uses the exact primary transparent amber SVG from [cosmiklabs/brand at 3cbb77f](https://github.com/cosmiklabs/brand/blob/3cbb77fdc84779ecc5ba89f052fb8b35bffe0046/assets/hplx/hplx-ember-amber.svg), selected on 8 October 2026. Its file hash, geometry, color and 400:150 aspect ratio are preserved. The symbol sits above the live product name with an empty image alternative to avoid repeating the adjacent HPLX text. The separate “A Cosmik project” endorsement and global Cosmik identity remain unchanged.

This is a symbol, not a recreated wordmark or combined lockup. No glow, crop, optical redesign or derived icon is added. Use follows the [asset guidance](https://github.com/cosmiklabs/brand/blob/3cbb77fdc84779ecc5ba89f052fb8b35bffe0046/assets/hplx/README.md) and the brand repository's [brand-use policy](https://github.com/cosmiklabs/brand/blob/3cbb77fdc84779ecc5ba89f052fb8b35bffe0046/LICENSE.md#2-brand-marks-trademark-style-policy).

## Remaining review

The October 7 issue fixes pass the automated suite. Headless Chrome checked the home, Projects, HPLX and About pages at 1280, 768, 390 and 320 CSS pixels with 100% and 200% root text size; no horizontal page overflow remained. Homepage desktop and mobile captures were visually reviewed. Full browser zoom, complete keyboard/assistive-technology checks, Back/Forward and other browser engines remain to be reviewed before publication. These checks are not product accessibility certification.

For the October 8 Ember integration, the master SVG was independently rendered and inspected and all 30 automated tests pass, including the new identity checks. Live browser QA for this change remains unverified because the cloud browser cannot connect to the localhost preview. The earlier rendering checks above describe the previous revision.

Set `SITE_URL` to the final HTTPS base URL when building publication previews to emit canonical URLs and absolute share-image URLs; unset previews omit those URLs. Social cards use the unmodified 512 px plate icon from the pinned brand kit. Redirects name their destination as canonical, and 404 pages omit it. The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control; privacy is provided by the private repository and disabled hosting. Publication, indexing and any hosting settings require a separate decision.
