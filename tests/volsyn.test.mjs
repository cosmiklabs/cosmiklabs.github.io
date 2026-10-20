import test from 'node:test';
import assert from 'node:assert/strict';
import { families, featuredWork } from '../src/projects.mjs';
import { home, catalog, familyPage } from '../src/templates.mjs';

test('Volsyn has a restrained listing and minimal development page', () => {
  const volsyn = families.find(family => family.id === 'volsyn');
  assert.equal(volsyn.description, 'Volsyn is a tool for designing and refining 3D structures with AI assistance. Bring an idea for a structure into focus through design, iteration and visual review.');
  assert.equal(volsyn.status, 'In development');
  assert.equal(featuredWork.familyId, 'hplx');
  for (const html of [home(), catalog()]) {
    assert.match(html, /href="(?:\.\/|\.\.\/)?projects\/volsyn\/"/);
    assert.match(html, /Design and refine 3D structures with AI assistance\./);
  }
  const html = familyPage(volsyn);
  assert.match(html, /<h1>Volsyn<\/h1>/);
  assert.match(html, /Volsyn is a tool for designing and refining 3D structures with AI assistance\./);
  assert.match(html, /In development/);
  assert.match(html, /data-family="volsyn" data-family-theme="approved-for-website"/);
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.match(main, /assets\/families\/volsyn\/volsyn-latch-dark\.svg/);
  assert.doesNotMatch(main, /agent|pipeline|MCP|SaaS|pricing|signup|beta|roadmap|Tecton|HPLX|Frictional/i);
});

test('Volsyn preserves the approved two-path Latch geometry and colors', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const [variant, color] of [['dark', '#71D6C3'], ['white', '#FFFFFF']]) {
    const svg = await readFile(new URL(`../assets/families/volsyn/volsyn-latch-${variant}.svg`, import.meta.url), 'utf8');
    assert.match(svg, /viewBox="0 0 64 64"/);
    assert.match(svg, /d="M8 12H36L24 24H20V40L8 52Z"/);
    assert.match(svg, /d="M56 12L44 24V40H40L28 52H56Z"/);
    assert.equal((svg.match(new RegExp(`fill="${color}"`, 'g')) || []).length, 2);
  }
});

test('Volsyn lockup removes inherited heading margin and loads its current stylesheet', async () => {
 const {readFile}=await import('node:fs/promises');
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 assert.match(css,/\.volsyn-heading \.family-identity h1\{margin:0\}/);
 const html=familyPage(families.find(f=>f.id==='volsyn'));
 assert.match(html,/site\.css\?v=20261020-volsyn-alignment/);
 assert.match(html,/<div class="family-identity"><img[^>]+><h1>Volsyn<\/h1><p class="endorsement">/);
});
