import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { legalCopy } from '../src/legal-copy.mjs';
import { legalPage, escape, home, familyPage, notFound } from '../src/templates.mjs';
import { families } from '../src/projects.mjs';

test('public policies preserve all approved paragraphs and exclude review-only content', () => {
  for (const [route, key] of [['privacy','Privacy'], ['legal','Legal and Licenses']]) {
    const html = legalPage(route);
    const text = html.replace(/<[^>]*>/g, '');
    for (const entry of legalCopy[key]) assert.ok(text.includes(escape(entry.text)), `${route}: ${entry.text}`);
    assert.doesNotMatch(html, /\[publication date\]|Review notes|Confirm before publishing|Matthew|Downs|Missouri|@gmail|attorney-reviewed|GDPR compliant/i);
    assert.match(html, /Last updated: 8 October 2026/);
    assert.match(html, /href="mailto:legal@cosmiklabs.org"/);
  }
  assert.match(legalPage('privacy'), /Correspondence may be retained indefinitely; there is no routine deletion schedule\./);
  assert.match(legalPage('privacy'), /not a determination of a visitor’s residence/);
  assert.match(legalPage('legal'), /https:\/\/github.com\/cosmiklabs\/brand\/blob\/main\/LICENSE.md/);
});

test('shared footer policy links resolve from home, family, legal and missing pages', () => {
  for (const html of [home(), familyPage(families[0]), legalPage('privacy'), legalPage('legal'), notFound()]) {
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)[0];
    assert.match(footer, /href="(?:\.\/|\.\.\/|\.\.\/\.\.\/|\/)privacy\/">Privacy<\/a>/);
    assert.match(footer, /href="(?:\.\/|\.\.\/|\.\.\/\.\.\/|\/)legal\/">Legal &amp; Licenses<\/a>/);
  }
});

test('built legal pages preserve publication canonical URLs and indexing choices', async () => {
  for (const route of ['privacy', 'legal']) {
    const html = await readFile(new URL(`../site/${route}/index.html`, import.meta.url), 'utf8');
    if (process.env.SITE_URL) {
      const url = new URL(`${route}/`, process.env.SITE_URL.endsWith('/') ? process.env.SITE_URL : process.env.SITE_URL + '/').href;
      assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
      assert.doesNotMatch(html, /name="robots"/);
    } else assert.match(html, /noindex, nofollow/);
  }
});
