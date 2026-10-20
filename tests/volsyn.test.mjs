import test from 'node:test';
import assert from 'node:assert/strict';
import { families, featuredWork } from '../src/projects.mjs';
import { home, catalog, familyPage } from '../src/templates.mjs';

test('Volsyn has a restrained listing and minimal development page', () => {
  const volsyn = families.find(family => family.id === 'volsyn');
  assert.equal(volsyn.description, 'Volsyn is a tool for creating 3D structures.');
  assert.equal(volsyn.status, 'In development');
  assert.equal(featuredWork.familyId, 'hplx');
  for (const html of [home(), catalog()]) {
    assert.match(html, /href="(?:\.\/|\.\.\/)?projects\/volsyn\/"/);
    assert.match(html, /A tool for creating 3D structures\./);
  }
  const html = familyPage(volsyn);
  assert.match(html, /<h1>Volsyn<\/h1>/);
  assert.match(html, /Volsyn is a tool for creating 3D structures\./);
  assert.match(html, /In development/);
  assert.match(html, /data-family="volsyn" data-family-theme="baseline"/);
  const main = html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.doesNotMatch(main, /<img|agent|pipeline|MCP|SaaS|pricing|signup|beta|roadmap|Tecton|HPLX|Frictional/i);
});
