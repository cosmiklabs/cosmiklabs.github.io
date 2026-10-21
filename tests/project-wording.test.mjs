import test from 'node:test';
import assert from 'node:assert/strict';
import { families, legacyRoutes } from '../src/projects.mjs';
import { home, catalog, about, familyPage, legacyPage, legalPage, notFound } from '../src/templates.mjs';

test('public copy, metadata and accessibility labels call work projects, not families', () => {
  const pages = [home(), catalog(), about(), ...families.map(familyPage), ...legacyRoutes.map(legacyPage), legalPage('privacy'), legalPage('legal'), notFound()];
  for (const html of pages) {
    const visibleText = html.replace(/<[^>]+>/g, ' ');
    const labels = [...html.matchAll(/(?:aria-label|alt|title|content)="([^"]*)"/g)].map(match => match[1]).join(' ');
    assert.doesNotMatch(visibleText + labels, /\bfamil(?:y|ies)\b/i);
  }
  assert.match(home(), /<h2 id="families-title">Projects<\/h2>/);
  assert.match(familyPage(families[0]), /All projects/);
});
