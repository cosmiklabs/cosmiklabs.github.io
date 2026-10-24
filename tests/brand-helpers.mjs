// Shared helpers for brand tests: resolve the published baseline and family colour roles per mode.
import assert from 'node:assert/strict';
import { assetBytes } from '../src/assets.mjs';

export const text = path => assetBytes(path).toString('utf8');
export const blocks = css => [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
  selectors: selectors.trim(),
  declarations: Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()])),
}));

/** Resolve a token for a mode, following var() and choosing the light-dark() branch the mode selects. */
export function resolve(key, values, mode) {
  let value = values[key];
  const seen = new Set();
  for (;;) {
    assert.ok(value, `Missing ${key}`);
    const pair = value.match(/^light-dark\((.+), (.+)\)$/);
    if (pair) { value = mode === 'light' ? pair[1] : pair[2]; continue; }
    const reference = value.match(/^var\((--[\w-]+)\)$/);
    if (!reference) return value;
    assert.ok(!seen.has(value), 'Token cycle');
    seen.add(value);
    value = values[reference[1]];
  }
}

/** Values in effect inside a family scope in a mode: baseline, its mode block, then the family's blocks. */
export function modeValues(familyCss, mode) {
  const base = blocks(text('assets/brand/cosmik.css'));
  const baseMode = base.find(b => mode === 'dark' ? b.selectors.startsWith(':root,') : b.selectors === '[data-theme="light"]');
  return Object.assign({}, base[0].declarations, baseMode.declarations, ...blocks(familyCss).map(b => b.declarations));
}

const luminance = hex => { assert.match(hex, /^#[\da-f]{6}$/i); const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
export const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

/** The site's applied text, accent, control and focus pairs; returns how many were checked. */
export function checkContrast(familyCss) {
  let count = 0;
  for (const mode of ['dark', 'light']) {
    const v = modeValues(familyCss, mode);
    const pairs = [];
    for (const surface of ['bg', 'surface', 'raised']) {
      for (const fg of ['text', 'muted', 'link', 'link-hover', 'accent']) pairs.push([fg, surface, 4.5]);
      for (const fg of ['focus', 'border']) pairs.push([fg, surface, 3]);
    }
    pairs.push(['status-fg', 'status-bg', 4.5], ['status-border', 'status-bg', 3]);
    for (const action of ['action-primary', 'action-primary-hover', 'action-primary-active']) pairs.push(['action-primary-fg', action, 4.5]);
    for (const [fg, bg, min] of pairs) {
      const ratio = contrast(resolve(`--c-${fg}`, v, mode), resolve(`--c-${bg}`, v, mode));
      assert.ok(ratio >= min, `${mode} ${fg}/${bg}: ${ratio.toFixed(2)} < ${min}`);
      count++;
    }
  }
  return count;
}
