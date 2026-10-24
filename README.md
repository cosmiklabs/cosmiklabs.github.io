# Cosmik website

The public website for Cosmik’s independent software workshop, hosted at https://cosmiklabs.org/. The website source and history are public. The HPLX engine and game repositories remain private; the former app and its package catalog are archived.

## Publication

GitHub Pages uses `.github/workflows/pages.yml`. Pushes to `main` or a manual workflow run build and test the site with Node.js 22, then publish only generated `site/` output. Source templates, tests, README and Git metadata are not in that output. Official GitHub actions are pinned to commit hashes; deployment permissions are limited to the deploy job. The custom domain `cosmiklabs.org` is set in the repository's Pages settings, not by a `CNAME` file.

Search indexing is enabled for the published build (owner, 8 October 2026). Local builds without `SITE_URL` retain `noindex, nofollow`.

## Run locally

Requires Node.js 22 or later. No third-party build dependencies or install step.

- `npm run dev` builds and serves at `http://127.0.0.1:4173`.
- `npm run build` generates `site/`.
- `npm run preview` serves the current build.
- `npm run check` rebuilds and runs all automated tests.
- `npm run brand:verify` checks the vendored brand releases; see [Updating the brand](#updating-the-brand).

Rebuild after source edits. `PORT` changes the preview port; `CHECK_PORT` changes the port `scripts/check-browser.mjs` serves on. The development server binds only to localhost. Generated pages also work as local files, except for the root-absolute 404 navigation used by root-level hosting.

## Editing

Edit family data and `featuredWork.familyId` in `src/projects.mjs`, page templates in `src/templates.mjs`, and theme approvals in `src/themes.mjs`. Featured work is independent of permanent family destinations. Generated output belongs in ignored `site/`.

## Content boundaries

HPLX is presented as an editor for creating custom stories for the original Amnesia: The Dark Descent, for the people who make them (owner, 19 October 2026). It appears under **Story creation**. The editor is **In development**: built and being tested, not released. The reimplementation and **HPLX Engine** support custom-story authoring and playtesting inside the editor. Their purpose is a better, easier creation workflow.

There are no downloads, release dates, public product-source links, complete-compatibility claims or game assets on this website. The product repositories remain private and have no releases. Public copy does not describe other-game attempts or campaign validation. The old AMFP URL redirects to the current editor section without retaining an obsolete roadmap entry.

Public links are restricted to the Cosmik organization and brand repository. Original creators’ names, assets, credits and licenses remain separate from the Cosmik endorsement. No blanket code, brand or artwork license is applied by this repository.

## Brand provenance and approvals

Brand files are vendored from three tagged releases, each with a lock that records
its repository, tag, commit and the SHA-256 of every file:

| Directory | Release | Lock |
| --- | --- | --- |
| `vendor/brand/` | [cosmiklabs/brand](https://github.com/cosmiklabs/brand) v0.10.0, the Cosmik foundation | `vendor/brand/brand.lock.json` |
| `vendor/brand-tectra/` | [cosmiklabs/brand-tectra](https://github.com/cosmiklabs/brand-tectra) v0.2.2 | `vendor/brand-tectra/brand-tectra.lock.json` |
| `vendor/brand-hplx/` | [cosmiklabs/brand-hplx](https://github.com/cosmiklabs/brand-hplx) v0.1.1 | `vendor/brand-hplx/brand-hplx.lock.json` |

Never edit anything under `vendor/`. Each product brand carries the foundation it
was built on under its own `vendor/brand/`; all three copies are brand v0.10.0, byte
for byte, and pages load the baseline once, from `vendor/brand/`.

`brand-provenance.json` names the locks and maps every published brand file to its
vendored source. The build copies only those files into `site/`: the baseline
`cosmik.css`, the shared `controls.css`, Inter and IBM Plex Mono with their notices,
each family's colour roles, and the Latch and Glimmer marks the pages show. Ember,
Spectral and the other kit files stay in `vendor/` and are not published. The Cosmik
emblem and icons are not part of the brand distribution, so they stay committed in
`assets/`; `brand-provenance.json` records their source paths and hashes at brand
v0.9.1. Preserve all bundled font license notices.

Stylesheets load in the order the brand's consumer guide gives: `cosmik.css`, the
family's `tokens.css` on family pages, `controls.css`, then the site's own
`site.css`, `family-themes.css` and the family's `theme.css`.

### Family colours and explicit modes

The page root is always `data-theme="dark"`, and some sections set
`data-theme="light"`. The vendored family CSS sets each colour role once with
`light-dark()` on `[data-family]` and `[data-family] [data-theme]`, and the baseline
sets `color-scheme` on every `data-theme`. So the nearest explicit theme picks the
family's dark or light value, with the same results as the earlier hand-written
dark and light blocks: every resolved colour role is unchanged in both modes.

Family pages keep the site's color-only family contract. The build publishes each
family's `tokens.css` from its vendored tokens through `colourRoles()` in
`src/brand.mjs`, which keeps every colour declaration line unchanged and removes
typography roles and shadow geometry. That removes HPLX's Spectral heading roles, so
HPLX keeps the shared Inter headings, as decided for this site. Any other kind of
declaration in a future release fails the build until it is reviewed. The family's
`theme.css` is this site's own colour application: where the accent appears.

### Shared controls

Calls to action use `c-button c-button--primary`, with the site's `.button` adding
only its layout. Links in running text use `c-link`. The Motion selector uses
`c-select c-select--dense`, which returns to the standard target and body size on
touch so focusing it never zooms. Global link hover and active colours have zero specificity, so control
classes keep their own colours. The site's global `:focus-visible` ring matches the
controls' ring and still covers navigation links, disclosures and other elements.
Status labels use `c-status` (the label type in a pill, with no control
affordance); the site's `.status` adds only wrapping and the smaller label step in
the home page's project rows.

### Updating the brand

Check out the new tags of `cosmiklabs/brand`, `cosmiklabs/brand-tectra` and
`cosmiklabs/brand-hplx`, clean and exactly at each tag, then:

```sh
npm run brand:sync -- --brand ../brand --brand-tectra ../brand-tectra --brand-hplx ../brand-hplx
npm run brand:verify -- --brand ../brand --brand-tectra ../brand-tectra --brand-hplx ../brand-hplx
npm run check
```

`brand:sync` runs each release's own vendor tool and rewrites the locks.
`brand:verify` checks every vendored file against its lock, and with checkouts also
proves each lock against its release tag. Both fail if the product brands were built
on a different foundation release from `vendor/brand/`. Without checkouts,
`npm run brand:verify` checks the files against the locks; the tests run the same
check. Read the brand changelogs, then compare the pages in both modes.

The owner approved the existing HPLX warm theme for this website on 7 October. This does not change the brand kit's proposed family status. The HPLX page now pairs the owner-approved Glimmer symbol with an ordinary live HPLX name. Family overrides stay inside their `data-family` boundary and explicit dark/light modes; shared navigation, layout, interactions and interface type stay consistent. The Cosmik home, Projects, About, header and footer use the baseline.

### HPLX Glimmer symbol

Glimmer is the official HPLX symbol, approved on 17 October 2026. The family header uses the exact transparent amber master; the homepage and Projects listings use its neutral white variant. Both preserve the approved two-path geometry and square 64 × 64 viewBox. The HPLX family hero uses a responsive horizontal lockup: the symbol sits to the left of the live product name, with the endorsement below the name. Hero symbols scale with the display type at 1.35em; listing symbols are 32 × 32. Decorative image alternatives avoid repeating adjacent live text. Cosmik’s global identity remains unchanged.

Canonical source: `vendor/brand-hplx/assets/` from brand-hplx v0.1.1. Ember is retained there for provenance; no active template uses it and it is not published. No glow, crop or reconstructed wordmark is added.

## Remaining review

The October 7 issue fixes pass the automated suite. Headless Chrome checked the home, Projects, HPLX and About pages at 1280, 768, 390 and 320 CSS pixels with 100% and 200% root text size; no horizontal page overflow remained. Homepage desktop and mobile captures were visually reviewed. Full browser zoom, complete keyboard/assistive-technology checks, Back/Forward and other browser engines remain unverified. These checks are not product accessibility certification.

For the October 8 Ember integration, the master SVG was independently rendered and inspected and all 30 automated tests pass, including the new identity checks. Live browser QA for this change remains unverified because the cloud browser cannot connect to the localhost preview. The earlier rendering checks above describe the previous revision.

Set `SITE_URL` to the final HTTPS base URL when building publication previews to emit canonical URLs and absolute share-image URLs; unset previews omit those URLs. Social cards use the unmodified 512 px plate icon from the pinned brand kit. Redirects name their destination as canonical, and 404 pages omit it. The preview includes `noindex, nofollow` metadata as an extra precaution. That is not access control. Publication was approved on 8 October 2026; the website and this source repository are now public. Search indexing is enabled in publication builds.


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

## Product-family page pattern

Every entry in `families` renders through `familyPage()` and `familyHeading()`.
Add the name, pillar, heading lines, description and status in `src/projects.mjs`;
register approved artwork and palette in `src/themes.mjs`. Do not create a
family-specific hero, generic `page-heading` fallback, or per-family layout CSS.

The shared pattern owns the breadcrumb, two-column hero, logo-left/name-right
identity with endorsement below the name, heading typography, description and
status spacing, section grid and return link. At 720px it stacks into one column;
the logo and title scale together. Keep content at its natural height. Optional
sections may differ, but must use the shared `section-grid` spacing. Do not add
filler, fixed heights or family-specific offsets to make pages appear equal.

Family stylesheets may change colors only. The HPLX amber palette and Tectra
mineral-teal palette retain their approved values; both use shared Inter headings.
The global header and footer remain outside the theme boundary. Approved SVG
geometry is never altered to correct layout. Missing logos retain the identity
column without inventing artwork.

CSS URLs use content hashes from `src/assets.mjs`, so every CSS change invalidates
its own cached URL automatically. Run `npm run check` and
`SITE_URL=https://cosmiklabs.org npm run check`, then visually compare both pages
at desktop and narrow widths. Tests enforce the shared structure for existing
and future families, color-only themes, and content-addressed stylesheets.

## Tectra rebrand (21 October 2026)

Tectra replaces deprecated Volsyn at `/projects/tectra/`. The old
`/projects/volsyn/` address redirects to Tectra and uses its canonical URL.
Listings and metadata use Tectra; the shared product-family layout is unchanged.

Tectra's palette and Latch symbols come from `vendor/brand-tectra/` (brand-tectra
v0.2.2). The dark and white Latch SVGs are published unchanged.

## Product websites

Product websites live in their own repositories. The Tectra website draft for `tectra.app` is [cosmiklabs/website-tectra](https://github.com/cosmiklabs/website-tectra), renamed from `cosmiklabs/tectra-website`. The product brands are [cosmiklabs/brand-tectra](https://github.com/cosmiklabs/brand-tectra) and [cosmiklabs/brand-hplx](https://github.com/cosmiklabs/brand-hplx).

## Featured project and motion

The homepage features Tectra while retaining HPLX as a separate project. Motion defaults to System; a page-local Motion selector offers Reduce and Full without saving tracking/storage data. CSS resolves the effective brand duration and responds to OS changes live. Explicit scoped overrides follow the nearest data-motion boundary. Content and navigation work without JavaScript; the optional selector stays hidden until enhanced. Scrolling is immediate in all modes.
