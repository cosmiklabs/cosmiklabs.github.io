import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { families, featuredWork, legacyRoutes } from '../src/projects.mjs';
import { home, catalog, familyPage, about, legalPage } from '../src/templates.mjs';

const hplx = families.find(family => family.id === 'hplx');
const html = familyPage(hplx);


test('the editor leads, The Dark Descent sits underneath it, for custom-story playtesting', () => {
  assert.deepEqual(hplx.tools.map(({id, status}) => [id, status]), [['editor', 'In development'], ['engine', 'In development']]);
  assert.deepEqual(hplx.games.map(({id, status}) => [id, status]), [['tdd', 'In development']]);
  assert.ok(html.indexOf('id="editor"') < html.indexOf('id="tdd"'));
  assert.doesNotMatch(html, /campaign|A Machine for Pigs|Penumbra|HPL3|other games|paused|on its own|future-plans/i);
  assert.match(html, /creating custom stories for the original Amnesia: The Dark Descent/);
  assert.doesNotMatch(html, /so your story runs|for every player|faithful reimplementation/);
});

test('progress copy does not present the editor or the game as finished', () => {
  const editor = hplx.tools.find(tool => tool.id === 'editor');
  assert.match(editor.progress, /being tested[\s\S]*isn’t released yet/);
  assert.match(html, /no public release or download yet/);
  assert.match(html, /No release date has been announced/);
});

test('HPLX remains an editor project when Tectra is featured', () => {
  assert.equal(featuredWork.familyId, 'tectra');
  assert.match(home(), /projects\/hplx\//);
  assert.match(catalog(), /editor for (?:Amnesia: )?The Dark Descent’s custom stories/);
  assert.match(about(), /editor for (?:Amnesia: )?The Dark Descent’s custom stories/);
  assert.match(legalPage('legal'), /independent editor for Amnesia: The Dark Descent’s custom stories/);
  for (const page of [home(), catalog(), html, about(), legalPage('legal')]) {
    assert.doesNotMatch(page, /desktop app|HPLX App|Work has begun|Amnesia and Penumbra|Windows is the only platform verified/i);
    assert.doesNotMatch(page, /hpl1_formats|hpl1_compat|hplx-amnesia|hplx-penumbra|docs\/ROADMAP|campaign_validated|campaign|Penumbra|other games|paused/);
  }
});

test('the existing AMFP route leads to the current editor without obsolete copy', () => {
  assert.equal(legacyRoutes.find(route => route.id === 'amfp').fragment, 'editor');
  assert.equal(legacyRoutes.find(route => route.id === 'amfp').name, 'HPLX story creation');
});

test('stacked detail articles keep their spacing and the horizontal Glimmer identity', async () => {
  const css = await readFile(new URL('../assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.game-detail\+\.game-detail\{[^}]*margin-top:var\(--c-space-12\)[^}]*border-top:1px solid var\(--c-divider\)/);
  assert.match(css, /\.family-identity\{display:grid;grid-template-columns:1.35em minmax\(0,1fr\)/);
  assert.match(html, /site\.css\?v=[a-f0-9]{12}/);
});
