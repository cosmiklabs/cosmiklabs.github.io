import test from 'node:test';
import assert from 'node:assert/strict';
import { families, featuredWork, legacyRoutes, validateContent } from '../src/projects.mjs';
import { home, catalog, familyList, escape } from '../src/templates.mjs';

test('the catalog contains families, not an equal list of games, tools and repositories', () => {
  validateContent();
  assert.deepEqual(families.map(f => f.id), ['hplx']);
  const hplx = families[0];
  assert.equal(hplx.name, 'HPLX');
  assert.equal(hplx.games[0].name, 'Amnesia: The Dark Descent');
  assert.deepEqual(hplx.tools.map(t => t.id), ['engine', 'launcher', 'editor']);
  assert.equal(hplx.tools.find(t => t.id === 'editor').status, 'Planned');
  assert.deepEqual(hplx.future.map(f => f.id), ['amfp', 'penumbra']);
});

test('feature can change without changing family destinations or navigation', () => {
  const next = { ...families[0], id: 'sample', name: 'Sample', pillar: 'create', scope: 'Original games', summary: 'A different family.' };
  const all = [...families, next];
  const feature = { ...featuredWork, familyId: 'sample', heading: 'A new feature.', description: 'New work.', focusTitle: 'New game', focusDescription: 'An experiment.' };
  validateContent(all, feature);
  const html = home(all, feature);
  const featured = html.match(/<section class="featured-work"[\s\S]*?<\/section>/)[0];
  assert.match(featured, /data-featured-family="sample"/);
  assert.match(featured, /Explore Sample/);
  assert.doesNotMatch(featured, /HPLX|Dark Descent/);
  assert.match(featured, /Featured work · Create/);
  assert.ok(html.indexOf('class="pillars wrap"') < html.indexOf('class="featured-work"'));
  assert.match(html, /<h3>Reimagine<\/h3>/);
  assert.match(html, /<h3>Extend<\/h3>/);
  assert.match(html, /<h3>Create<\/h3>/);
  for (const id of ['hplx', 'sample']) assert.match(html, new RegExp(`projects/${id}/`));
  const index = catalog(all);
  assert.equal((index.match(/class="family-row"/g) || []).length, 2);
});

test('feature and family validation rejects broken or duplicate destinations', () => {
  assert.throws(() => validateContent(families, {...featuredWork, familyId:'missing'}), /existing family/);
  assert.throws(() => validateContent([...families, families[0]]), /unique/);
  assert.throws(() => validateContent([{...families[0], id:'../bad'}]), /URL-safe/);
  assert.throws(() => validateContent([{...families[0], status:''}]), /status/);
  assert.throws(() => validateContent([{...families[0], pillar:'unknown'}]), /pillar/);
  assert.throws(() => home(families, {...featuredWork, familyId:'missing'}), /not found/);
});

test('old project destinations lead to the right context within HPLX', () => {
  assert.deepEqual(legacyRoutes.map(({id,fragment}) => [id,fragment]), [['tdd','tdd'],['amfp','future'],['hplx-editor','editor']]);
  assert.ok(legacyRoutes.every(route => route.familyId === 'hplx'));
});

test('text data is escaped wherever family listings and featured copy render', () => {
  assert.equal(escape('<b title="x">&\'</b>'), '&lt;b title=&quot;x&quot;&gt;&amp;&#39;&lt;/b&gt;');
  const sample = {...families[0], name:'<unsafe>', scope:'"scope"', summary:'<script>alert(1)</script>'};
  assert.doesNotMatch(familyList('./',[sample]), /<unsafe>|<script>/);
  const html=home([sample],{...featuredWork, heading:'<unsafe>', description:'<script>alert(1)</script>'});
  assert.doesNotMatch(html, /<unsafe>|<script>/);
});
