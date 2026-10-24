# Tectra family kit

This repository is the Tectra family of the Cosmik brand: its tokens, the Latch
marks, the offline review board and this guide. It builds on the Cosmik foundation
from [`cosmiklabs/brand`](https://github.com/cosmiklabs/brand) **v0.10.0**, vendored
unchanged at `vendor/brand/` and pinned by `vendor/brand/brand.lock.json` (tag,
commit and SHA-256 of every file). The family's tokens are generated and checked by
the vendored `vendor/brand/scripts/family.mjs`, so the family contract, baseline
values and contrast pairs are the release's own, not a copy. Shared rules live in
the vendored [guide](vendor/brand/guide/README.md), including
[product families](vendor/brand/guide/families.md). This kit was split from
`cosmiklabs/brand` at v0.8.0 with its history; see [CHANGELOG.md](CHANGELOG.md).

Theme approved on 17 October 2026: cool mineral surfaces, restrained teal, clean utility typography and construction relationships. The palette, typography and applications have owner approval; rendered consumer accessibility QA remains required. This is a design reference, not a product release.

## Identity and hierarchy

The approved **Latch** is the original mark with only its cut angles corrected, accepted on 17 October 2026. Its exact two paths live in `latch.source.json`; do not close its openings, alter its proportions or use the later closed-fit/airy explorations. Use the supplied symbol or horizontal lockup. The lockup pairs the unchanged symbol with outlined Inter SemiBold; it is a typographic label treatment, not a custom-lettered wordmark. Keep the separate “A Cosmik project” endorsement at least 16 px away.

Use `tectra-latch-dark.svg` / `tectra-lockup-dark.svg` on dark surfaces and the `light` versions on light surfaces. Black and white variants serve monochrome applications. `currentColor` inherits colour when inlined; an external `<img>` does not inherit page text colour. All exports are transparent. Keep at least 8 source units of clear space around visible artwork (one sixth of the symbol's 48-unit visible width). The lockup's 16-unit symbol/label gap is fixed.

Recommended minimum CSS width: symbol 24 px; horizontal lockup 160 px. At 24 px, the narrowest 4-unit feature is 1.5 px; validate rendering on the actual display before using it smaller. No separate optical favicon redraw or platform icon package is approved. Preserve the viewBox, aspect ratio, silhouette and contrast. For linked identities use an accessible name such as “Tectra”; hide a decorative symbol from assistive technology when adjacent text already names the product.

When Tectra content is presented inside a Cosmik organisation surface, the enclosing organisation identity stays baseline. Tectra interfaces use their family kit; browser consumers apply `data-family="tectra"` in either mode. This is identity scoping, not a required header, footer or navigation layout. The kit applies to the family, including its documentation, bindings, adapters and showcase presentation; these are not separate logo systems.

## Marketing emphasis

Lead with what Tectra helps people create and how the intended authoring workflow supports their ideas. Explain envisioning, planning, building and reviewing in plain language, while distinguishing planned workflow from verified capabilities. Keep artistic direction with the creator.

Business-model labels are not the headline, hero badge or primary reason to use the product. Do not frame pricing as its defining feature. Pricing, access and any free-credit allowance remain undecided; do not promise a free tier, credits, a trial or a price. Explain commercial terms separately when they are settled and relevant.

## Product presentation

Use one Tectra family identity across the product, documentation and interfaces. Leave the user's artistic choices intact. Public copy explains useful outcomes and intended workflow without exposing implementation architecture or repository organisation. Distinguish verified capabilities from plans and avoid implying launch or availability.

Follow the shared [voice and organisation wording guidance](vendor/brand/guide/voice.md). A Tectra-specific line is not a new Cosmik-wide motto or promise.

## Colour and type

Consume semantic values from [the family tokens](tokens/family.json), never copied hex values. Light and dark roles are complete after generation. Teal marks focus, primary actions and selected emphasis; it does not mean success. Status uses words and structure. The family inherits neutral status roles; it does not invent approval, warning or error colour semantics.

Inter serves both headings and reading/interface text. IBM Plex Mono serves short dimensions, identifiers and technical labels, not paragraphs. No new font is required. Preserve existing font notices. Spacing, controls, radii, breakpoints and motion remain the baseline's.

## Imagery and examples

Lead with understandable constructions and their declared relationships: sections, joined members, precise annotated diagrams and real project views. Vary the subjects so the identity does not imply only buildings, a particular architectural style, or a game engine. A diagram is not a logo. Label illustrative diagrams and hypothetical values; never present them as tested outputs.

Keep a creator's chosen materials, lighting and aesthetic intact. The teal interface must not recolour the work itself. Avoid default blueprint grids, construction-site hazard stripes, horror imagery or decorative cosmic effects. Public examples require an explicit publication decision; the family kit does not authorize publishing private project evidence.

## Motion and accessibility

Follow the shared [interface](vendor/brand/guide/interface.md), [motion](vendor/brand/guide/motion.md) and [quality review](vendor/brand/guide/quality.md) guidance. Use inherited tokens and the effective motion preference; Tectra does not have a separate animation system. Construction relationships may be illustrated when explaining an edit, but a static snapshot must not be presented as live editing. Recurring identity stays static. Keep creator content, viewport movement and interface transitions distinct so preferences apply meaningfully.

## Deliverables and pending assets

- [Offline review board](specimen.html): two-mode visual direction and illustrative applications.
- [Component reference](https://github.com/cosmiklabs/brand/blob/v0.10.0/specimens/components.html) in `cosmiklabs/brand`: the shared controls Tectra inherits. Load `tokens/tectra.css` and apply `data-family="tectra"` to inspect them in Tectra.
- Generated CSS, JSON, DTCG and Rust under [tokens/](tokens/); use the [consumer guide](https://github.com/cosmiklabs/brand/blob/v0.10.0/kits/README.md) for integration.
- [Validation record](validation.md).

The symbol and supplied horizontal lockup are approved for integration. Platform icons, banners, identity animation and an optical small-size redraw remain separate future deliverables. Generate canonical variants with `node scripts/build-assets.mjs` (or `npm run build`); Inter's existing font notice continues to apply.

Tectra remains experimental; a brand kit does not certify API stability, host compatibility or software availability. Describe capabilities from current project evidence, separately from identity guidance.

## Consume this kit

Products (the Tectra app, `website-tectra`, or a Cosmik surface showing Tectra) sync
a release of this repository with the brand vendor tool it carries. Check out a
`vX.Y.Z` tag of this repository, clean and exactly at the tag, then, in the
consumer:

```sh
node <brand-tectra checkout>/vendor/brand/scripts/vendor.mjs sync --from <brand-tectra checkout> --into vendor/brand-tectra
node vendor/brand-tectra/vendor/brand/scripts/vendor.mjs verify vendor/brand-tectra
node vendor/brand-tectra/vendor/brand/scripts/vendor.mjs verify vendor/brand-tectra --release <brand-tectra checkout>
```

`sync` copies every file under `distribution` in [asset-manifest.json](asset-manifest.json)
after checking its SHA-256, and writes `vendor/brand-tectra/brand-tectra.lock.json`
(package, repository, tag, commit and every file's hash). The set includes the
Cosmik foundation this family was built and checked against, unchanged under
`vendor/brand-tectra/vendor/brand/` with its own `brand.lock.json`, so one
`verify` checks both layers and names any changed, missing or extra file in either.
Run it in CI; `--release` also proves the lock against the tag. Do not sync
`cosmiklabs/brand` separately beside it.

Load the stylesheets in this order and put `data-family="tectra"` on the scope:

```html
<link rel="stylesheet" href="vendor/brand-tectra/vendor/brand/kits/cosmik/tokens/cosmik.css">
<link rel="stylesheet" href="vendor/brand-tectra/tokens/tectra.css">
<link rel="stylesheet" href="vendor/brand-tectra/vendor/brand/kits/cosmik/components/controls.css">
```

`controls.css` is optional. Fonts are under `vendor/brand-tectra/vendor/brand/fonts/`
with their notices in `fonts/licenses/`; the marks are under
`vendor/brand-tectra/assets/`. `entry_points` in the manifest names each canonical
file, and the identity sections give each deliverable's role and status. Keep
[LICENSE.md](LICENSE.md) and the font notices. Never edit the synced copies; take
changes from a new release of this repository by syncing again.

## Working on the kit

Requires Node.js 22 or later; the scripts use Node.js built-ins only. Read
[AGENTS.md](AGENTS.md) first. Edit `tokens/family.json` and `assets/latch.source.json`,
never their generated outputs, and never edit `vendor/brand/`. The build derives the
manifest's `brand` and `distribution` sections from the lock and the files.

```sh
npm run build                     # verify vendor/brand, build tokens and marks, refresh manifest hashes
npm run check                     # vendored lock, family contract and contrast, then tests
node scripts/build.mjs --check    # rebuild from a clean commit; fail on generated drift
```

To update the foundation, check out `cosmiklabs/brand` at the new `vX.Y.Z` tag
(clean, exactly at the tag), read its changelog, then:

```sh
node <brand checkout>/scripts/vendor.mjs sync --from <brand checkout> --into vendor/brand
node vendor/brand/scripts/vendor.mjs verify vendor/brand --release <brand checkout>
npm run build && npm run check
```

Update `extends` in `tokens/family.json` if the baseline token version changed,
then review the regenerated tokens and the review board in both themes before
committing the new lock with the outputs. CI proves the lock against the tag it
records.
