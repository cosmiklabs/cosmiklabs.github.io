import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { families, featuredWork, legacyRoutes } from '../src/projects.mjs';
import { home, catalog, familyPage, about, legalPage } from '../src/templates.mjs';

const hplx = families.find(family => family.id === 'hplx');
const html = familyPage(hplx);
const future = html.match(/<details class="future-plans"[\s\S]*?<\/details>/)[0];

test('the editor leads, The Dark Descent sits underneath it, and other games are paused', () => {
  assert.deepEqual(hplx.tools.map(({id, status}) => [id, status]), [['editor', 'In development'], ['engine', 'In development']]);
  assert.deepEqual(hplx.games.map(({id, status}) => [id, status]), [['tdd', 'In development']]);
  assert.ok(html.indexOf('id="editor"') < html.indexOf('id="tdd"'));
  for (const id of ['amfp', 'penumbra']) assert.match(future, new RegExp(`id="${id}"[\\s\\S]*?paused`));
  assert.doesNotMatch(future, /id="hpl3"/);
});

test('progress copy does not present the editor or the game as finished', () => {
  const tdd = hplx.games.find(game => game.id === 'tdd');
  const editor = hplx.tools.find(tool => tool.id === 'editor');
  assert.match(editor.progress, /being tested[\s\S]*isn’t released yet/);
  assert.match(tdd.progress, /still in progress/);
  assert.match(html, /no public release or download yet/);
  assert.match(html, /No release dates are announced/);
});

test('homepage, family directory, About and legal scope consistently present the editor', () => {
  assert.equal(featuredWork.focusTitle, 'The HPLX Editor');
  assert.match(catalog(), /editor for (?:Amnesia: )?The Dark Descent’s custom stories/);
  assert.match(about(), /editor for (?:Amnesia: )?The Dark Descent’s custom stories/);
  assert.match(legalPage('legal'), /independent editor for Amnesia: The Dark Descent’s custom stories/);
  for (const page of [home(), catalog(), html, about(), legalPage('legal')]) {
    assert.doesNotMatch(page, /desktop app|HPLX App|Work has begun|Amnesia and Penumbra|Windows is the only platform verified/i);
    assert.doesNotMatch(page, /hpl1_formats|hpl1_compat|hplx-amnesia|hplx-penumbra|docs\/ROADMAP|campaign_validated/);
  }
});

test('the existing AMFP route lands on its paused entry', () => {
  assert.equal(legacyRoutes.find(route => route.id === 'amfp').fragment, 'future');
  assert.equal((html.match(/id="amfp"/g) || []).length, 1);
});

test('stacked detail articles keep their spacing and the centered Ember identity', async () => {
  const css = await readFile(new URL('../assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.game-detail\+\.game-detail\{[^}]*margin-top:var\(--c-space-12\)[^}]*border-top:1px solid var\(--c-divider\)/);
  assert.match(css, /\.family-identity\{width:15rem;max-width:100%;text-align:center\}/);
  assert.match(html, /site\.css\?v=20261017-two-families/);
});
