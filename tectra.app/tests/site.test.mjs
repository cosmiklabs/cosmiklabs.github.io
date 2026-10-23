import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(path.join(root,'site/index.html'),'utf8');
const css=await readFile(path.join(root,'assets/site.css'),'utf8');
const script=await readFile(path.join(root,'assets/motion.mjs'),'utf8');
test('approved identity and positioning are explicit',()=>{
 assert.match(html, /data-family="tectra" data-theme="dark"/);
 assert.match(html,/Create structures for worlds/);assert.match(html,/real or imagined/);
 assert.match(html,/Describe the space\.<br>Shape what comes next\./);
 assert.match(html,/In development/);assert.match(html,/Connected parts/);assert.match(html,/Checked rules/);
});
test('all local links and assets resolve, fragments have targets',async()=>{
 for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(href.startsWith('https://'))continue;
  const [file,id]=href.split('#');if(file)assert.ok((await stat(path.join(root,'site',file))).isFile(),href);
  if(id)assert.ok(html.includes(`id="${id}"`),href);
 }
 for(const [,font] of css.matchAll(/url\('([^']+)'\)/g))assert.ok((await stat(path.join(root,'assets',font))).size>0);
});
test('no commercial or release promises, competitor or confidential implementation copy',()=>{
 assert.doesNotMatch(html,/Meshy|chapel|pricing|payment|subscription|launch date|release date|coming soon|MCP|WGSL|benchmark|100x|\$\d|sign up|register|guarantee/i);
 assert.match(html,/not an announcement of availability/);
 assert.doesNotMatch(html,/no organic|cannot.*organic/i);
});
test('visual placeholders are labeled and replaceable, not fake screenshots',()=>{
 assert.match(html,/data-asset-slot="viewport"/);assert.match(html,/not an app screenshot/);
 assert.match(html,/Reserved for a future viewport capture/);
});
test('landmarks, accessible images and unique headings/ids exist',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<main id="main"/);
 assert.match(html,/href="#main">Skip to content/);assert.match(html,/nav aria-label="Main navigation"/);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const [img]of html.matchAll(/<img\b[^>]*>/g))assert.match(img,/alt="[^"]*"/);
});
test('motion is optional, bounded and respects reduced motion',()=>{
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(script,/prefers-reduced-motion: reduce/);
 assert.match(script,/IntersectionObserver/);assert.match(script,/observer.unobserve/);
 assert.doesNotMatch(css,/animation:[^;}]*infinite/);assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|localStorage|cookie/);
});
test('mobile layouts and no-publication safeguards are present',async()=>{
 assert.match(css,/@media\(max-width:700px\)/);assert.match(css,/grid-template-columns:1fr/);
 assert.match(html,/noindex,nofollow/);assert.match(await readFile(path.join(root,'site/robots.txt'),'utf8'),/Disallow: \//);
 assert.ok(!(await readdir(root)).includes('CNAME'));assert.ok(!(await readdir(root)).includes('.github'));
});
test('Tectra palette and approved logo geometry are retained',async()=>{
 const theme=await readFile(path.join(root,'assets/theme.css'),'utf8');assert.match(theme,/#71D6C3/);assert.match(theme,/#0F1719/);
 const logo=await readFile(path.join(root,'assets/tectra-latch-dark.svg'),'utf8');assert.match(logo,/viewBox="0 0 64 64"/);assert.equal((logo.match(/<path\b/g)||[]).length,2);
});
