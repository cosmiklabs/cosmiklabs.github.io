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

HPLX is presented as an editor for Amnesia: The Dark Descent’s custom stories, for the people who make them (owner, 15 October 2026). It appears under **Story creation**. The editor is **In development**: built and being tested, not released. The Dark Descent’s reimplementation and the **HPLX Engine** are in development and are presented as the game underneath the editor, which also runs on its own. There is no desktop app.

The Dark Descent’s menus, saves and custom-story launching are implemented, and opening campaign sections have documented playtests. Later campaign validation, menu checks and lighting comparisons remain open. Windows is the only verified platform. 

Work on A Machine for Pigs and Penumbra is paused, and no HPL3 game is planned. These are not release promises. There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Brand provenance and approvals

Pinned to [cosmiklabs/brand at af89b8c](https://github.com/cosmiklabs/brand/tree/af89b8c2dd4f4426379d8b2af3b65ac4c13d21bf), the approved 7 October 2026 baseline. `assets/brand-tokens.css` is the exact generated baseline; the HPLX theme starts with that commit's generated family CSS. Preserve the unmodified emblem and the bundled Inter, IBM Plex Mono and Spectral SIL Open Font License notices. Tests check the pinned assets.

The owner approved the existing HPLX warm theme for this website on 7 October. This does not change the brand kit's proposed family status. The HPLX page now pairs the owner-approved Glimmer symbol with an ordinary live HPLX name. Family overrides stay inside their `data-family` boundary and explicit dark/light modes; shared navigation, layout, interactions and interface type stay consistent. The Cosmik home, Projects, About, header and footer use the baseline.

### HPLX Glimmer symbol

Glimmer is the official HPLX symbol, approved on 17 October 2026. The family header uses the exact transparent amber master; the homepage and Projects listings use its neutral white variant. Both preserve the approved two-path geometry and square 64 × 64 viewBox. The hero displays the symbol at 128 × 128 CSS pixels, centered above the live HPLX name; listing symbols are 32 × 32. Decorative image alternatives avoid repeating adjacent live text. Cosmik’s global identity and Tecton’s Latch remain unchanged.

Canonical source: [cosmiklabs/brand at cba2b2e](https://github.com/cosmiklabs/brand/tree/cba2b2e266a71fd7041f49cd621916fe2b83f376/assets/hplx). Historical Ember files are retained for provenance but no active template uses them. No glow, crop or reconstructed wordmark is added.

## Remaining review

The October 7 issue fixes pass the automated suite. Headless Chrome checked the home, Projects, HPLX and About pages at 1280, 768, 390 and 320 CSS pixels with 100% and 200% root text size; no horizontal page overflow remained. Homepage desktop and mobile captures were visually reviewed. Full browser zoom, complete keyboard/assistive-technology checks, Back/Forward and other browser engines remain unverified. These checks are not product accessibility certification.

For the October 8 Ember integration, the master SVG was independently rendered and inspected and all 30 automated tests pass, including the new identity checks. Live browser QA for this change remains unverified because the cloud browser cannot connect to the localhost preview. The earlier rendering checks above describe the previous revision.

Set `SITE_URL` to the final HTTPS base URL when building publication previews to emit canonical URLs and absolute share-image URLs; unset previews omit those URLs. Social cards use the unmodified 512 px plate icon from the pinned brand kit. Redirects name their destination as canonical, and 404 pages omit it. The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control. Publication was approved on 8 October 2026; the website and this source repository are now public. Search indexing is enabled in publication builds; no custom domain is configured.


## Public policy pages

`src/legal-copy.mjs` holds the approved Privacy text (8 October 2026) and Legal & Licenses text (8 October 2026). The 15 October revision of Legal & Licenses changes only its date and the factual "What HPLX is" paragraph; a test pins every other legal paragraph and the whole Privacy text. `legalPage()` renders `/privacy/` and `/legal/`; shared footer links appear on every page. Correspondence retention is indefinite with no routine deletion schedule. The pages describe configured analytics without claiming verified beacon delivery or guaranteed visitor-residence exclusions. The public brand license is linked, not modified. Review-only notes are excluded from the source and generated site.

Run `npm run check` and `SITE_URL=https://cosmiklabs.org npm run check` to validate both preview and public metadata, links, policy text and preserved routes. Deployment retains the configured Pages base URL and existing indexing behavior.

### HPLX requirements and independence

The HPLX page prominently states the owner’s retail-install requirement, never-bundled original assets, independence from Frictional Games, and commitment never to require payment to use HPLX. The original retail games are separate. Legal & Licenses distinguishes ownership from the GPLv3 source release, with a link to Frictional Games’ official announcement. The Dark Descent and its editor are the only focus; AMFP and Penumbra are paused, and HPL3 is not planned. No software license was changed.

### Original retail game links

`src/retail-links.mjs` lists original PC editions separately from HPLX availability. The Dark Descent and A Machine for Pigs link to Steam, GOG, Epic Games Store and the Humble Store URLs linked by their official game websites. The Penumbra series links to the complete retail collection on Steam and GOG (Overture, Black Plague and Requiem). No individual HPL3 games or new HPLX support commitments are introduced.

Steam, GOG and Epic product/package listings were verified on 8 October 2026. The Humble destinations are taken from the official [TDD site](https://www.amnesiagame.com/) and [AMFP purchase page](https://aamfp.com/buy); the current Humble listings could not be independently retrieved. Links make no price, regional availability or HPLX store-build compatibility claim. The notice explains that local PC files are needed and console purchases do not provide them.


## October 17 family refresh

The umbrella now describes an independent software workshop. The previous Reimagine / Extend / Create pillars are retired. HPLX stays featured; the stable directory now has HPLX and Tecton, with a dedicated Tecton destination. Tecton’s marketing leads with the authoring workflow and creative outcomes. Public copy describes the customer experience without implementation or commercial-model detail. No paid-only, free-tier, credit, pricing, signup, download, or launch promise is made.

Tecton's approved mineral-teal roles are mapped from [brand commit d9726b6](https://github.com/cosmiklabs/brand/commit/d9726b6431cdf11d6fcb5e903f8b1711aa87534f), `tokens/tecton/tecton.css`, to explicit dark/light declarations compatible with the existing site. Its typography inherits Inter and IBM Plex Mono. The approved angle-only Latch symbol sits beside the live product name. A neutral white symbol identifies Tecton in the monochrome family directory. Navigation and footer remain monochrome. No private showcase assets or implementation material are published by this draft.

The existing legal and privacy text is unchanged: the free-use commitment already applies specifically to HPLX, licensing is project-specific, and this informational website still has no accounts, payments or uploads. A future operational SaaS would need its own reviewed terms and privacy disclosures.

Validation for this draft: 48 automated tests pass in preview and publication metadata modes. Tests cover internal links, fragments, theme scope, role resolution, text contrast, visible focus styles, retained HPLX identity and unchanged policy text. Chromium rendering was attempted but could not start because the sandbox rejected its process socket. No visual, keyboard, zoom or screen-reader acceptance is claimed for this revision. The owner approved publication on 17 October 2026. Pushes to main publish automatically through the existing Pages workflow.
