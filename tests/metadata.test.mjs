import test from 'node:test';
import assert from 'node:assert/strict';
import {shareMetadata} from '../src/templates.mjs';
const page = {title:'A & B', description:'"Quoted"', route:'projects/example'};
test('share metadata escapes content and uses only an explicit publication address', () => {
  const privateTags = shareMetadata(page, '');
  assert.match(privateTags, /A &amp; B/);
  assert.match(privateTags, /&quot;Quoted&quot;/);
  assert.doesNotMatch(privateTags, /canonical|og:url|og:image/);
  const published = shareMetadata(page, 'https://example.com/base/');
  assert.match(published, /https:\/\/example.com\/base\/projects\/example\//);
  assert.match(published, /https:\/\/example.com\/base\/assets\/cosmik-512.png/);
  const redirect = shareMetadata({...page,redirect:'projects/family/#game'}, 'https://example.com/');
  assert.match(redirect, /href="https:\/\/example.com\/projects\/family\/"/);
  assert.doesNotMatch(redirect, /#game/);
  assert.doesNotMatch(shareMetadata({...page,canonical:false}, 'https://example.com/'), /canonical|og:url/);
  for (const bad of ['http://example.com','https://user:password@example.com','https://example.com/?q=x','https://example.com/#x']) {
    assert.throws(() => shareMetadata(page,bad), /SITE_URL/);
  }
});
