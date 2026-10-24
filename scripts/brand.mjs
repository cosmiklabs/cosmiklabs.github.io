// Sync or verify the three vendored brand releases with the brand vendor tool.
//
//   npm run brand:sync -- --brand <checkout> --brand-tectra <checkout> --brand-hplx <checkout>
//   npm run brand:verify [-- --brand <checkout> --brand-tectra <checkout> --brand-hplx <checkout>]
//
// Each checkout must be clean and exactly at its vX.Y.Z tag. `sync` runs each release's own
// vendor tool, as the product brands' READMEs describe. `verify` checks every file against the
// locks; given checkouts, it also proves each lock against its release tag. Both confirm that the
// product brands carry the same foundation release as vendor/brand.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const releases = ['brand', 'brand-tectra', 'brand-hplx'];
const [command, ...args] = process.argv.slice(2);
const checkouts = {};
for (let i = 0; i < args.length; i += 2) {
  const name = args[i]?.replace(/^--/, '');
  if (!releases.includes(name) || !args[i + 1]) usage(`Unknown or incomplete option ${args[i]}.`);
  checkouts[name] = path.resolve(args[i + 1]);
}
if (command === 'sync' && releases.some(name => !checkouts[name])) usage('sync needs all three checkouts.');
if (!['sync', 'verify'].includes(command)) usage('Choose sync or verify.');

// The foundation syncs with its own tool; a product brand with the foundation it vendored.
const toolIn = (name, base) => name === 'brand' ? path.join(base, 'scripts/vendor.mjs') : path.join(base, 'vendor/brand/scripts/vendor.mjs');
for (const name of releases) {
  const into = `vendor/${name}`;
  if (command === 'sync') run(toolIn(name, checkouts[name]), 'sync', '--from', checkouts[name], '--into', into);
  run(toolIn(name, path.join(root, into)), 'verify', into, ...(checkouts[name] ? ['--release', checkouts[name]] : []));
}

const lock = dir => JSON.parse(readFileSync(path.join(root, dir, 'brand.lock.json'), 'utf8'));
const foundation = lock('vendor/brand');
for (const product of ['brand-tectra', 'brand-hplx']) {
  const nested = lock(`vendor/${product}/vendor/brand`);
  if (nested.commit !== foundation.commit || JSON.stringify(nested.files) !== JSON.stringify(foundation.files)) {
    console.error(`vendor/${product} was built on ${nested.repository} ${nested.tag}, but vendor/brand is ${foundation.tag}. Sync releases built on the same foundation.`);
    process.exit(1);
  }
}
console.log(`All three releases share ${foundation.repository} ${foundation.tag}; pages load its baseline once, from vendor/brand.`);

function run(...argv) {
  const result = spawnSync(process.execPath, argv, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function usage(message) {
  console.error(`${message}\nUsage: node scripts/brand.mjs sync|verify --brand <checkout> --brand-tectra <checkout> --brand-hplx <checkout>`);
  process.exit(2);
}
