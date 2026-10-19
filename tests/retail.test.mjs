import test from 'node:test';
import assert from 'node:assert/strict';
import { retailGames } from '../src/retail-links.mjs';
import { retailLinks, familyPage } from '../src/templates.mjs';
import { families } from '../src/projects.mjs';

test('each named retail game or series has verified PC storefront links', () => {
  assert.deepEqual(Object.keys(retailGames).sort(), ['tdd']);
  for (const [id, game] of Object.entries(retailGames)) {
    for (const store of game.stores) {
      assert.equal(new URL(store.url).protocol, 'https:');
      assert.match(retailLinks(id), new RegExp(store.name));
      assert.ok(retailLinks(id).includes(`href="${store.url}"`));
      assert.ok(retailLinks(id).includes(`aria-label="${game.name} on ${store.name}"`));
    }
  }
  for (const id of ['tdd']) assert.deepEqual(retailGames[id].stores.map(x => x.name), ['Steam','GOG','Epic Games Store','Humble Store']);
  assert.equal(retailLinks('hpl3'), '');
});

test('retail links remain separate from HPLX availability and support claims', () => {
  const html = familyPage(families[0]);
  assert.match(html, /href="https:\/\/frictionalgames.com\/">Frictional Games/);
  assert.match(html, /original PC game/);
  assert.match(html, /Individual store builds have not all been tested with HPLX/);
  assert.match(html, /no public release or download yet/);
  for (const id of Object.keys(retailGames)) {
    const article = html.match(new RegExp(`<article[^>]*id="${id}"[\\s\\S]*?<\\/article>`))[0];
    assert.ok(article.includes(retailLinks(id)));
  }
  assert.doesNotMatch(html, /\baffiliate\b|Xbox|PlayStation|Nintendo|Buy HPLX/i);
});
