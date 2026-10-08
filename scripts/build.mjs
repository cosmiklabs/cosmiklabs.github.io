import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { home, catalog, familyPage, legacyPage, about, notFound, legalPage } from '../src/templates.mjs';
import { families, legacyRoutes, validateContent } from '../src/projects.mjs';
validateContent();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'site');
const pages = new Map([
  ['index.html', home()], ['projects/index.html', catalog()],
  ...families.map(family => [`projects/${family.id}/index.html`, familyPage(family)]),
  ...legacyRoutes.map(route => [`projects/${route.id}/index.html`, legacyPage(route)]),
  ['about/index.html', about()], ['privacy/index.html', legalPage('privacy')], ['legal/index.html', legalPage('legal')], ['404.html', notFound()],
]);
await rm(output, { recursive: true, force: true });
for (const [name, html] of pages) {
  await mkdir(path.dirname(path.join(output, name)), {recursive: true});
  await writeFile(path.join(output, name), html);
}
await cp(path.join(root, 'assets'), path.join(output, 'assets'), {recursive: true});
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built ${pages.size} static pages in site/. No deployment was performed.`);

