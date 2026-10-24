import { readFileSync } from 'node:fs';

/**
 * Published brand files come from the vendored releases named in
 * brand-provenance.json, never from hand-copied files. The build copies exactly
 * the `published` set into site/, and src/assets.mjs hashes the same bytes.
 */
const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
export const provenance = JSON.parse(read('brand-provenance.json'));
export const locks = Object.fromEntries(Object.entries(provenance.locks).map(([name, path]) => [name, JSON.parse(read(path))]));

/** A colour value: a hex literal, a token reference or a light-dark() pair of them. */
const colour = String.raw`(?:#[0-9a-f]{6}(?:[0-9a-f]{2})?|var\(--c-[a-z0-9-]+\))`;
export const colourValue = new RegExp(`^(?:${colour}|light-dark\\(${colour}, ${colour}\\))$`, 'i');
/** Roles a family may set that are not colours. The website keeps the baseline for these. */
const nonColourRoles = /^--c-(?:type-[a-z0-9-]+|elevation-\d+-shadow)$/;

/**
 * Keep a vendored family's colour roles and drop its typography and shadow
 * geometry, so the site's family contract (colour only, shared Inter headings)
 * holds. Every kept line is byte-identical to the vendored line. Any other kind
 * of declaration fails the build instead of passing through unreviewed.
 */
export function colourRoles(css, source) {
  const lines = css.split('\n');
  const header = `/* Colour roles of ${source} (${releaseOf(source)}). Typography and shadow roles are removed by src/brand.mjs: the website keeps the shared Inter headings. */`;
  const kept = [header];
  for (const line of lines) {
    const declaration = line.match(/^\s*(--[\w-]+)\s*:\s*(.+);\s*$/);
    if (!declaration) { kept.push(line); continue; }
    const [, name, value] = declaration;
    if (colourValue.test(value)) kept.push(line);
    else if (!nonColourRoles.test(name)) throw new Error(`${source}: ${name} is neither a colour role nor a known typography or shadow role.`);
  }
  return kept.join('\n');
}

/** The lock (and so the release) a vendored path belongs to: the deepest lock directory that contains it. */
export function lockFor(path) {
  const owners = Object.entries(provenance.locks)
    .map(([name, lock]) => ({ name, dir: lock.slice(0, lock.lastIndexOf('/') + 1) }))
    .filter(({ dir }) => path.startsWith(dir))
    .sort((a, b) => b.dir.length - a.dir.length);
  if (!owners.length) throw new Error(`${path} is not inside a vendored release.`);
  const { name, dir } = owners[0];
  return { name, dir, lock: locks[name], file: path.slice(dir.length) };
}

function releaseOf(path) {
  const { lock } = lockFor(path);
  return `${lock.repository} ${lock.tag}`;
}

/** The bytes the site publishes at `target`, from the vendored file (derived if the provenance says so). */
export function publishedBytes(target) {
  const entry = provenance.published[target];
  if (!entry) return null;
  const bytes = read(entry.from);
  if (!entry.derive) return bytes;
  if (entry.derive !== 'colour-roles') throw new Error(`Unknown derivation ${entry.derive}.`);
  return Buffer.from(colourRoles(bytes.toString('utf8'), entry.from));
}
