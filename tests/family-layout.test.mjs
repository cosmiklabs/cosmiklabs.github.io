import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { families, validateContent, featuredWork } from '../src/projects.mjs';
import { familyPage, familyHeading } from '../src/templates.mjs';
import { resolveFamilyTheme } from '../src/themes.mjs';

const hero = html => html.match(/<header class="family-heading">[\s\S]*?<\/header>/)?.[0];
test('every registered family and future baseline family use the same hero component', () => {
 const future = {...families[1], id:'future', name:'Future', heading:['A different length heading'], description:'Short copy.'};
 for (const family of [...families, future]) {
  const html = familyPage(family);
  assert.equal(hero(html), familyHeading(family, resolveFamilyTheme(family.id), '../../'));
  assert.equal((html.match(/class="family-heading"/g)||[]).length, 1);
  assert.equal((html.match(/class="breadcrumbs"/g)||[]).length, 1);
  assert.equal((html.match(/class="family-bottom wrap"/g)||[]).length, 1);
  assert.doesNotMatch(html, /volsyn-heading|page-heading|style=/);
  assert.match(hero(html), /family-identity[\s\S]*<h1>[\s\S]*endorsement[\s\S]*family-introduction[\s\S]*<h2>[\s\S]*<p>[\s\S]*class="status"/);
 }
 assert.doesNotMatch(familyPage(future), /Your game|Frictional|family-games/);
});

test('shared family content requirements and escaping are enforced', () => {
 assert.throws(()=>validateContent([{...families[0], heading:[]}], featuredWork), /shared template/);
 assert.throws(()=>validateContent([{...families[0], description:''}], featuredWork), /shared template/);
 const html=familyPage({...families[1], heading:['<script>unsafe</script>']});
 assert.doesNotMatch(html, /<script>/);
 assert.match(html, /&lt;script&gt;/);
});

test('family themes cannot introduce typography, geometry or layout differences', async () => {
 for (const family of families) {
  const stylesheet=resolveFamilyTheme(family.id).stylesheet;
  if (!stylesheet) continue;
  const css = (await readFile(new URL(`../${stylesheet}`, import.meta.url),'utf8')).replace(/\/\*[\s\S]*?\*\//g,'');
  assert.doesNotMatch(css, /--c-(?:type|space|layout|motion|radius|breakpoint)-|@font-face|@media|@import/);
  for (const [,body] of css.matchAll(/\{([^{}]*)\}/g)) {
   for (const declaration of body.split(';').map(x=>x.trim()).filter(Boolean)) {
    const name=declaration.slice(0,declaration.indexOf(':')).trim();
    if (name.startsWith('--c-')) assert.match(declaration.slice(declaration.indexOf(':')+1).trim(), /^(?:#[a-f0-9]{6}(?:[a-f0-9]{2})?|var\(--c-[a-z0-9-]+\))$/i, `${family.id}: non-color token ${name}`);
    assert.ok(name.startsWith('--c-') || ['color','color-scheme','border-top-color'].includes(name), `${family.id}: ${name}`);
   }
  }
 }
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 assert.doesNotMatch(css, /\[data-family=|volsyn-heading|hplx-heading/);
 assert.match(css, /\.family-heading\{display:grid;grid-template-columns:minmax\(0,1fr\) minmax\(0,1.25fr\)/);
 assert.match(css, /\.family-heading \.family-identity h1\{margin:0\}/);
 assert.match(css, /html\{scrollbar-gutter:stable;/); // Long and short pages keep identical horizontal origins.
 assert.match(css, /@media\(max-width:720px\)/);
 assert.doesNotMatch(css, /\.family-heading[^{}]*\{[^}]*\b(?:height|min-height):/);
});

test('all CSS links have content-derived cache keys, including family overrides', async () => {
 for (const family of families) {
  const html=familyPage(family);
  for (const [,path,hash] of html.matchAll(/href="\.\.\/\.\.\/(assets\/[^"?]+\.css)\?v=([a-f0-9]{12})"/g)) {
   const bytes=await readFile(new URL(`../${path}`,import.meta.url));
   assert.equal(hash,createHash('sha256').update(bytes).digest('hex').slice(0,12));
  }
  assert.equal((html.match(/\.css\?v=[a-f0-9]{12}/g)||[]).length,resolveFamilyTheme(family.id).stylesheet ? 4 : 3);
 }
});
