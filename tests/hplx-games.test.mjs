import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { families, featuredWork, legacyRoutes } from '../src/projects.mjs';
import { home, catalog, familyPage, about, legalPage, retailLinks } from '../src/templates.mjs';

const hplx = families.find(family => family.id === 'hplx');
const html = familyPage(hplx);
const games = html.match(/<section class="family-games"[\s\S]*?<\/section>/)[0];
const future = html.match(/<details class="future-plans"[\s\S]*?<\/details>/)[0];

test('three game groups are visible within one HPLX family at distinct development stages', () => {
  assert.deepEqual(hplx.games.map(({id, status}) => [id, status]), [
    ['tdd', 'In development'], ['amfp', 'In development'], ['penumbra', 'Early development'],
  ]);
  assert.equal((games.match(/<article class="game-detail"/g) || []).length, 3);
  for (const game of hplx.games) {
    const article = games.match(new RegExp(`<article class="game-detail" id="${game.id}">[\\s\\S]*?</article>`))[0];
    const visible = article.split('<details>')[0];
    assert.ok(visible.includes(`<h3>${game.name}</h3>`));
    assert.ok(visible.includes(`<span class="status">${game.status}</span>`));
    assert.ok(visible.includes(retailLinks(game.id)), `${game.id} storefront links stay visible`);
    assert.match(article, /development progress, not a public release/);
  }
  assert.doesNotMatch(future, /id="(?:amfp|penumbra)"/);
  assert.match(future, /id="hpl3"/);
});

test('Amnesia testing and Penumbra early work are not presented as finished compatibility', () => {
  const tdd = hplx.games.find(game => game.id === 'tdd');
  const amfp = hplx.games.find(game => game.id === 'amfp');
  const penumbra = hplx.games.find(game => game.id === 'penumbra');
  assert.match(tdd.progress, /Full campaign playthroughs.*still in progress/);
  assert.match(amfp.progress, /development tests/);
  assert.match(amfp.progress, /full campaign playthrough.*still ahead/);
  assert.match(penumbra.description, /starting with Overture and HPL1 compatibility/);
  assert.match(penumbra.description, /Black Plague and Requiem are planned to follow/);
  assert.match(penumbra.progress, /first goal is loading/);
  assert.match(penumbra.progress, /Playable support.*later milestones/);
  assert.match(html, /no public release or download yet/);
  assert.match(html, /no release dates are announced/);
});

test('homepage, family directory, About and legal scope consistently reflect the growing family', () => {
  for (const page of [home(), about(), legalPage('legal')]) {
    for (const name of ['The Dark Descent', 'A Machine for Pigs', 'Penumbra']) assert.ok(page.includes(name), name);
  }
  assert.match(catalog(), /Amnesia and Penumbra/);
  assert.equal(featuredWork.focusTitle, 'Amnesia & Penumbra');
  assert.match(legalPage('legal'), /Work on the Penumbra series has begun/);
  assert.match(legalPage('legal'), /Black Plague and Requiem are planned to follow/);
  for (const page of [home(), catalog(), html, about(), legalPage('legal')]) {
    assert.doesNotMatch(page, /Work has not started|AMFP is future work|Penumbra series are future directions|Current development focuses on HPL2 and Amnesia: The Dark Descent|Windows is the only platform verified/i);
    assert.doesNotMatch(page, /hpl1_formats|hpl1_compat|hplx-amnesia|hplx-penumbra|docs\/ROADMAP|campaign_validated/);
  }
});

test('the existing AMFP route now lands on its visible game article', () => {
  assert.equal(legacyRoutes.find(route => route.id === 'amfp').fragment, 'amfp');
  assert.match(games, /id="amfp"/);
  assert.equal((html.match(/id="amfp"/g) || []).length, 1);
});

test('additional game articles have spacing without changing the centered Ember identity', async () => {
  const css = await readFile(new URL('../assets/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.game-detail\+\.game-detail\{[^}]*margin-top:var\(--c-space-12\)[^}]*border-top:1px solid var\(--c-divider\)/);
  assert.match(css, /\.family-identity\{width:15rem;max-width:100%;text-align:center\}/);
  assert.match(html, /site\.css\?v=20261014-hplx-games/);
});
