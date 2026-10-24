import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { publishedBytes } from './brand.mjs';

/** Bytes of a published asset: a vendored brand file, or a site-owned file under assets/. */
export function assetBytes(path) {
  return publishedBytes(path) ?? readFileSync(new URL(`../${path}`, import.meta.url));
}

/** Content-addressed URLs invalidate cached CSS whenever its bytes change. */
export function assetUrl(root, path) {
  const revision = createHash('sha256').update(assetBytes(path)).digest('hex').slice(0, 12);
  return `${root}${path}?v=${revision}`;
}
