# Cosmik website

The public website for Cosmik’s independent software workshop, hosted at https://cosmiklabs.github.io/. The website source and history are public. The HPLX engine and game repositories remain private; the former app and its package catalog are archived.

## Publication

GitHub Pages uses `.github/workflows/pages.yml`. Pushes to `main` or a manual workflow run build and test the site with Node.js 22, then publish only generated `site/` output. Source templates, tests, README and Git metadata are not in that output. Official GitHub actions are pinned to commit hashes; deployment permissions are limited to the deploy job. No custom domain is configured.

Search indexing is enabled for the published build (owner, 8 October 2026). Local builds without `SITE_URL` retain `noindex, nofollow`.

## Run locally

Requires Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the current build.
- `npm run check` rebuilds and runs all automated tests.

Rebuild after source edits. `PORT` changes the preview port. The development server binds only to localhost. Generated pages also work as local files, except for the root-absolute 404 navigation used by root-level hosting.

## Editing

Edit family data and `featuredWork.familyId` in `src/projects.mjs`, page templates in `src/templates.mjs`, and theme approvals in `src/themes.mjs`. Featured work is independent of permanent family destinations. Generated output belongs in ignored `site/`.

## Content boundaries

HPLX is presented as an editor for creating custom stories for the original Amnesia: The Dark Descent, for the people who make them (owner, 19 October 2026). It appears under **Story creation**. The editor is **In development**: built and being tested, not released. The reimplementation and **HPLX Engine** support custom-story authoring and playtesting inside the editor. Their purpose is a better, easier creation workflow.

There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases. Public copy does not describe other-game attempts or campaign validation. The old AMFP URL redirects to the current editor section without retaining an obsolete roadmap entry.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Brand provenance and approvals

Pinned to [cosmiklabs/brand at af89b8c](https://github.com/cosmiklabs/brand/tree/af89b8c2dd4f4426379d8b2af3b65ac4c13d21bf), the approved 7 October 2026 baseline. `assets/brand-tokens.css` is the exact generated baseline; the HPLX theme starts with that commit's generated family CSS. Preserve the unmodified emblem and the bundled Inter, IBM Plex Mono and Spectral SIL Open Font License notices. Tests check the pinned assets.

The owner approved the existing HPLX warm theme for this website on 7 October. This does not change the brand kit's proposed family status. The HPLX page now pairs the owner-approved Glimmer symbol with an ordinary live HPLX name. Family overrides stay inside their `data-family` boundary and explicit dark/light modes; shared navigation, layout, interactions and interface type stay consistent. The Cosmik home, Projects, About, header and footer use the baseline.

### HPLX Glimmer symbol

Glimmer is the official HPLX symbol, approved on 17 October 2026. The family header uses the exact transparent amber master; the homepage and Projects listings use its neutral white variant. Both preserve the approved two-path geometry and square 64 × 64 viewBox. The HPLX family hero uses a responsive horizontal lockup: the symbol sits to the left of the live product name, with the endorsement below the name. Hero symbols scale with the display type at 1.35em; listing symbols are 32 × 32. Decorative image alternatives avoid repeating adjacent live text. Cosmik’s global identity remains unchanged.

Canonical source: [cosmiklabs/brand at cba2b2e](https://github.com/cosmiklabs/brand/tree/cba2b2e266a71fd7041f49cd621916fe2b83f376/assets/hplx). Historical Ember files are retained for provenance but no active template uses them. No glow, crop or reconstructed wordmark is added.

## Remaining review

The October 7 issue fixes pass the automated suite. Headless Chrome checked the home, Projects, HPLX and About pages at 1280, 768, 390 and 320 CSS pixels with 100% and 200% root text size; no horizontal page overflow remained. Homepage desktop and mobile captures were visually reviewed. Full browser zoom, complete keyboard/assistive-technology checks, Back/Forward and other browser engines remain unverified. These checks are not product accessibility certification.

For the October 8 Ember integration, the master SVG was independently rendered and inspected and all 30 automated tests pass, including the new identity checks. Live browser QA for this change remains unverified because the cloud browser cannot connect to the localhost preview. The earlier rendering checks above describe the previous revision.

Set `SITE_URL` to the final HTTPS base URL when building publication previews to emit canonical URLs and absolute share-image URLs; unset previews omit those URLs. Social cards use the unmodified 512 px plate icon from the pinned brand kit. Redirects name their destination as canonical, and 404 pages omit it. The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control. Publication was approved on 8 October 2026; the website and this source repository are now public. Search indexing is enabled in publication builds; no custom domain is configured.


## Public policy pages

`src/legal-copy.mjs` holds the approved Privacy text (8 October 2026) and Legal & Licenses text (8 October 2026). The 19 October revision of Legal & Licenses changes only its date and the factual "What HPLX is" paragraph; a test pins every other legal paragraph and the whole Privacy text. `legalPage()` renders `/privacy/` and `/legal/`; shared footer links appear on every page. Correspondence retention is indefinite with no routine deletion schedule. The pages describe configured analytics without claiming verified beacon delivery or guaranteed visitor-residence exclusions. The public brand license is linked, not modified. Review-only notes are excluded from the source and generated site.

Run `npm run check` and `SITE_URL=https://cosmiklabs.org npm run check` to validate both preview and public metadata, links, policy text and preserved routes. Deployment retains the configured Pages base URL and existing indexing behavior.

### HPLX requirements and independence

The HPLX page prominently states the owner’s retail-install requirement, never-bundled original assets, independence from Frictional Games, and commitment never to require payment to use HPLX. The original retail games are separate. Legal & Licenses distinguishes ownership from the GPLv3 source release, with a link to Frictional Games’ official announcement. Custom-story creation for the original The Dark Descent is the sole focus. No software license was changed.

### Original retail game links

`src/retail-links.mjs` lists the original PC edition of The Dark Descent separately from HPLX availability, with Steam, GOG, Epic Games Store and Humble Store URLs linked by its official website.

Steam, GOG and Epic product listings were verified on 8 October 2026. The Humble destination is taken from the official [TDD site](https://www.amnesiagame.com/); the current Humble listing could not be independently retrieved. Links make no price, regional availability or HPLX store-build compatibility claim. The notice explains that local PC files are needed and console purchases do not provide them.


## Public project directory

The umbrella describes an independent software workshop. HPLX is the featured work and current public project family. Only listed public families generate pages; assets for removed families are not published. The existing legal and privacy text is unchanged.

Pushes to main publish automatically through the existing Pages workflow. Run `npm run check` in preview and publication metadata modes before publishing.
