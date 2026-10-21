import test from 'node:test';
import assert from 'node:assert/strict';
import { families, featuredWork } from '../src/projects.mjs';
import { home, catalog, familyPage } from '../src/templates.mjs';

test('Tectra has a restrained listing and minimal development page', () => {
  const tectra = families.find(family => family.id === 'tectra');
  assert.equal(tectra.description, 'Tectra is a tool for designing and refining 3D structures with AI assistance. Bring an idea for a structure into focus through design, iteration and visual review.');
  assert.equal(tectra.status, 'In development');
  assert.equal(featuredWork.familyId, 'hplx');
  for (const html of [home(), catalog()]) {
    assert.match(html, /href="(?:\.\/|\.\.\/)?projects\/tectra\/"/);
    assert.match(html, /Design and refine 3D structures with AI assistance\./);
  }
  const html = familyPage(tectra);
  assert.match(html, /<h1>Tectra<\/h1>/);
  assert.match(html, /Tectra is a tool for designing and refining 3D structures with AI assistance\./);
  assert.match(html, /In development/);
  assert.match(html, /data-family="tectra" data-family-theme="approved-for-website"/);
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.match(main, /assets\/families\/tectra\/tectra-latch-dark\.svg/);
  assert.doesNotMatch(main, /agent|pipeline|MCP|SaaS|pricing|signup|beta|roadmap|Tecton|HPLX|Frictional/i);
});

test('Tectra preserves the approved two-path Latch geometry and colors', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const [variant, color] of [['dark', '#71D6C3'], ['white', '#FFFFFF']]) {
    const svg = await readFile(new URL(`../assets/families/tectra/tectra-latch-${variant}.svg`, import.meta.url), 'utf8');
    assert.match(svg, /viewBox="0 0 64 64"/);
    assert.match(svg, /d="M8 12H36L24 24H20V40L8 52Z"/);
    assert.match(svg, /d="M56 12L44 24V40H40L28 52H56Z"/);
    assert.equal((svg.match(new RegExp(`fill="${color}"`, 'g')) || []).length, 2);
  }
});

test('Tectra lockup removes inherited heading margin and loads its current stylesheet', async () => {
 const {readFile}=await import('node:fs/promises');
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 assert.match(css,/\.family-heading \.family-identity h1\{margin:0\}/);
 const html=familyPage(families.find(f=>f.id==='tectra'));
 assert.match(html,/site\.css\?v=[a-f0-9]{12}/);
 assert.match(html,/<div class="family-identity"><img[^>]+><h1>Tectra<\/h1><p class="endorsement">/);
});


test('deprecated Volsyn address redirects to Tectra without obsolete product content', async () => {
 const { legacyRoutes } = await import('../src/projects.mjs');
 const { legacyPage } = await import('../src/templates.mjs');
 const route=legacyRoutes.find(r=>r.id==='volsyn');
 assert.equal(route.familyId,'tectra');
 const html=legacyPage(route);
 assert.match(html,/http-equiv="refresh" content="0; url=..\/..\/projects\/tectra\/"/);
 assert.match(html,/href="..\/..\/projects\/tectra\/"/);
 assert.doesNotMatch(html,/Volsyn|Part of HPLX|#undefined/);
 if(process.env.SITE_URL) assert.ok(html.includes(`rel="canonical" href="${new URL('projects/tectra/', process.env.SITE_URL.endsWith('/') ? process.env.SITE_URL : process.env.SITE_URL+'/')}"`));
 for(const page of [home(),catalog(),familyPage(families.find(f=>f.id==='tectra'))]) assert.doesNotMatch(page,/volsyn/i);
});


test('Tectra symbols are byte-identical to the pinned reorganized brand kit', async () => {
 const {readFile}=await import('node:fs/promises');
 const {createHash}=await import('node:crypto');
 const expected={"dark": "7cd0e0eb53e3c92b2f141264401528dacadb7d6ab2698f506cdaf4e711c0cd67", "white": "621a1ac71204c3a9f9fa76d7c164fcf71285b062e31d93dcd4e0a3155cdeb6f9"};
 for(const [variant, hash] of Object.entries(expected)) {
  const data=await readFile(new URL(`../assets/families/tectra/tectra-latch-${variant}.svg`,import.meta.url));
  assert.equal(createHash('sha256').update(data).digest('hex'),hash);
 }
});
