import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/** Content-addressed URLs invalidate cached CSS whenever its bytes change. */
export function assetUrl(root, path) {
  const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
  const revision = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return `${root}${path}?v=${revision}`;
}
