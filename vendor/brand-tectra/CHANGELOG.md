# Changes

The Tectra family's version is `version` in `tokens/family.json`; this repository's
`package.json` and `asset-manifest.json` carry the same version. Newest first.

## 0.2.1 · 24 October 2026

- **Consumers sync this repository with one tool.** Products run
  `node <brand-tectra>/vendor/brand/scripts/vendor.mjs sync --from <brand-tectra> --into vendor/brand-tectra`
  from a release tag, then `verify vendor/brand-tectra`, which checks this release
  and the vendored foundation inside it. This replaces copying files and checking
  hashes by hand. See the README's "Consume this kit".
- **Manifest shape shared with `brand-hplx`.** `brand` names the foundation
  (`repository`, `tag`, `commit`, `directory`, `lock`). The former `vendor`
  section is replaced by `distribution`: `{ path, sha256 }` for every file a
  consumer syncs, namely this family's tokens, marks, guide, review board,
  validation record, changelog and `LICENSE.md`, and every file under
  `vendor/brand/` including `brand.lock.json`. The build derives both sections;
  the check fails when the manifest, the lock and the files disagree. Vendored
  files no longer carry per-file roles in this manifest; their roles are in the
  foundation's own release.
- **Foundation `cosmiklabs/brand` v0.9.1**, vendored with its new `vendor.mjs`
  (lock `lockfileVersion` 2, commit `48afb82b1edd5f9a7ce01eedbd52b5e3484c3c69`). The
  baseline token version is still 0.7.0, so `extends` is unchanged.
- **Corrected family description.** `tokens/family.json` said the marks were in
  `kits/tectra/assets/`; they are in `assets/`. This changes the `proposals` text
  in `tectra.json` and `tectra.tokens.json`, so the family version moves to 0.2.1.
  No token value changes; the other generated changes are the version and the
  provenance header, which now names `@cosmiklabs/brand 0.9.1`. The marks are
  byte-identical. The `family-proposals-path` known gap is closed.
- `package.json` gains `repository`. CI reads the foundation's repository and tag
  from the lock.

## 0.2.0 · 24 October 2026 (split; not tagged)

- **Split from `cosmiklabs/brand`.** The Tectra kit moves out of `cosmiklabs/brand`,
  which removed `kits/tectra/` at v0.8.0, into this repository, with its history
  (`git subtree split` of `kits/tectra/`). Files that were under `kits/tectra/` are
  now at the repository root: `README.md`, `assets/`, `tokens/`, `specimen.html`,
  `specimen.css` and `validation.md`.
- **Builds on `cosmiklabs/brand` v0.8.0.** The foundation is vendored unchanged at
  `vendor/brand/` and pinned by `brand.lock.json` (commit
  `e416514a291fb71844280f7cf1e2759d195b7a4d`). Tokens are generated and checked by the
  vendored `family.mjs`; CI also proves the lock against the tag.
- **Tokens.** Regenerated outputs change only their provenance header, which now names
  `@cosmiklabs/brand 0.8.0 scripts/family.mjs` and `tokens/family.json`. `tectra.json`
  and every token value are byte-identical to Tectra 0.2.0 in brand v0.7.0.
- **Marks.** `scripts/build-assets.mjs` (formerly brand's `build-tectra-assets.mjs`)
  uses the vendored outline tools and Inter SemiBold; the ten SVGs are byte-identical.
- **Consumers.** `asset-manifest.json` lists every deliverable with its SHA-256, role
  and status, including the vendored foundation, and carries the former
  `tectra_identity` and family identity records. Paths change from
  `kits/tectra/...` to the repository root, and `kits/cosmik/...` and `fonts/...` to
  `vendor/brand/...`. The specimen loads the baseline CSS and fonts from `vendor/brand/`.
- Add `LICENSE.md` (the brand terms applied to this repository), `AGENTS.md`, the
  Tectra tests, and CI.

No mark, palette, token value or approved guidance changes. Tectra remains family
0.2.0 and extends Cosmik baseline 0.7.0. This state was not tagged; 0.2.1 is the
first release of this repository.
