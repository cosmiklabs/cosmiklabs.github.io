import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { families, legacyRoutes } from '../src/projects.mjs';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(projectRoot,'site');
async function walk(dir) { const out=[]; for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);out.push(...e.isDirectory()?await walk(p):[p]);} return out; }
const files=await walk(root);
const htmlFiles=files.filter(f=>f.endsWith('.html'));
const pages=new Map(await Promise.all(htmlFiles.map(async f=>[path.relative(root,f).split(path.sep).join('/'),await readFile(f,'utf8')])));

test('the complete build preserves all eight original routes',()=>{
 assert.deepEqual([...pages.keys()].sort(),['404.html','about/index.html','index.html','projects/amfp/index.html','projects/hplx-editor/index.html','projects/hplx/index.html','projects/index.html','projects/tdd/index.html'].sort());
});

test('every local link, stylesheet, font and fragment resolves',async()=>{
 for(const [name,html] of pages){
  for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^https?:/.test(href))continue;
   const [pathname,fragment]=href.split('#');
   let target=pathname.startsWith('/')?path.join(root,pathname):path.resolve(path.dirname(path.join(root,name)),pathname||path.basename(name));
   if((await stat(target)).isDirectory())target=path.join(target,'index.html');
   assert.ok(files.includes(target),`${name}: ${href}`);
   if(fragment)assert.match(await readFile(target,'utf8'),new RegExp(`id="${fragment}"`));
  }
 }
 const css=await readFile(path.join(root,'assets/site.css'),'utf8');
 for(const [,url] of css.matchAll(/url\('([^']+)'\)/g))assert.ok((await stat(path.join(root,'assets',url))).size>0);
});

test('all pages have a unique title, one h1, landmarks, labels and no JavaScript dependency',()=>{
 const titles=[];
 for(const [name,html] of pages){
  assert.match(html,/<html lang="en"/);assert.equal((html.match(/<h1[> ]/g)||[]).length,1,name);
  assert.match(html,/<main id="main" tabindex="-1">/);assert.match(html,/<a class="skip-link" href="#main">/);
  assert.match(html,/<nav aria-label="Main navigation">/);assert.match(html,/<meta name="description"/);
  assert.match(html,/<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.doesNotMatch(html,/<script|onclick=|javascript:/i);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${name} duplicate IDs`);
  for(const [img] of html.matchAll(/<img\b[^>]*>/g))assert.match(img,/alt="[^"]*"/);
  for(const [svg] of html.matchAll(/<svg\b[^>]*>/g))assert.match(svg,/aria-hidden="true"/);
  titles.push(html.match(/<title>(.*?)<\/title>/)[1]);
 }
 assert.equal(new Set(titles).size,titles.length);
});

test('homepage feature and stable family list are separate, without repeated project cards',()=>{
 const html=pages.get('index.html');
 assert.equal((html.match(/class="featured-work"/g)||[]).length,1);
 assert.equal((html.match(/class="family-row"/g)||[]).length,families.length);
 assert.match(html,/data-featured-family="hplx"/);
 assert.doesNotMatch(html,/directory-controls|project-card|project-grid|assets\/art\//);
 const index=pages.get('projects/index.html');
 assert.equal((index.match(/class="family-row"/g)||[]).length,families.length);
 assert.doesNotMatch(index,/projects\/(tdd|amfp|hplx-editor)\//);
});

test('HPLX houses games, engine, launcher, editor and future context together',()=>{
 const html=pages.get('projects/hplx/index.html');
 for(const id of ['games','tdd','tools','engine','launcher','editor','development','amfp','penumbra'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/The HPLX family/);assert.match(html,/planned editor/);
 assert.match(html,/The editor is not built yet/);assert.match(html,/within each HPLX game/);
 assert.match(html,/Work has not started/);assert.match(html,/No release dates/);
 assert.match(html,/only platform verified/);assert.match(html,/no public release or download yet/);
 assert.match(html,/unaffiliated with the original creators/);
 assert.equal((html.match(/<details[> ]/g)||[]).length,2);
 assert.equal((html.match(/<summary>/g)||[]).length,2);
});

test('old detail URLs have working redirect targets and readable fallback links',()=>{
 for(const route of legacyRoutes){
  const html=pages.get(`projects/${route.id}/index.html`);
  const target=`../../projects/${route.familyId}/#${route.fragment}`;
  assert.ok(html.includes(`content="0; url=${target}"`));assert.ok(html.includes(`href="${target}"`));
  assert.match(html,/Part of HPLX/);
 }
});

test('private source, download and external service links are absent',()=>{
 const approved=new Set(['https://github.com/cosmiklabs','https://github.com/cosmiklabs/brand']);
 for(const [name,html] of pages){
  const urls=[...html.matchAll(/(?:href|src)="(https?:[^"]+)"/g)].map(m=>m[1]);
  for(const url of urls)assert.ok(approved.has(url)||(process.env.SITE_URL && url.startsWith(new URL(process.env.SITE_URL).origin + '/')),`${name}: unexpected ${url}`);
  assert.doesNotMatch(html,/Download now|Play now|View source|fully compatible|cosmik-labs|localhost|\/workspace\/|analytics|api[_-]?key/i);
  assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 }
});

test('approved baseline tokens, unchanged emblems and fonts are pinned',async()=>{
 const gitHash=bytes=>createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
 const expected={
  'brand-tokens.css':'3033047a35e29cb543a1fbdff73396524630240f',
  'emblem.svg':'5519818f64e11a3dc1f0fdbd3aacc563451e8541',
  'cosmik-512.png':'e022596fa2c583da56c01f7536e8d44306b0dae7',
  'cosmik.ico':'4521a86f042673f72c1ed99365fb4964a44a199c',
  'cosmik-apple-touch-180.png':'9cbc0683f24f7564a88fabe6a649f7990d54c066',
  'fonts/Inter-Regular.woff2':'2bcd222ecfae996d035ff72bf70672305cc29261',
  'fonts/Inter-Medium.woff2':'fdfdcc699fc1e19eb1943c2896e8d66e17b538ff',
  'fonts/Inter-SemiBold.woff2':'fbae113d2855e22c06376495bd2dfe5f02411272',
  'fonts/IBMPlexMono-Regular.woff2':'b62779f207175f77b7a736f94ac57437171f9586',
 };
 for(const [name,sha] of Object.entries(expected))assert.equal(gitHash(await readFile(path.join(root,'assets',name))),sha,name);
 for(const name of ['Inter-OFL.txt','IBM-Plex-OFL.txt'])assert.match(await readFile(path.join(root,'assets/fonts',name),'utf8'),/SIL OPEN FONT LICENSE/);
 const tokens=await readFile(path.join(root,'assets/brand-tokens.css'),'utf8');assert.match(tokens,/APPROVED/);assert.doesNotMatch(tokens,/Spectral|hplx-amber/);
 for(const html of pages.values()){assert.match(html,/width="48" height="48" alt=""><span>Cosmik<\/span>/);assert.doesNotMatch(html,/<span>COSMIK<\/span>/);}
});

test('site CSS uses defined semantic roles, visible focus, responsive layout and reduced motion',async()=>{
 const css=await readFile(path.join(root,'assets/site.css'),'utf8');
 const tokens=await readFile(path.join(root,'assets/brand-tokens.css'),'utf8');
 for(const [,token] of css.matchAll(/var\((--c-[\w-]+)/g))assert.ok(tokens.includes(`${token}:`),`undefined token ${token}`);
 assert.doesNotMatch(css,/#(?:[0-9a-f]{3}){1,2}\b|rgba?\(|hsla?\(|var\(--c-primitive-|@import|https?:\/\//i);
 assert.match(css,/:focus-visible/);assert.match(css,/max-width:720px/);assert.match(css,/max-width:380px/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/scroll-behavior:auto/);
 assert.match(css,/--c-layout-control-min/);assert.match(css,/flex-wrap:wrap/);
 assert.doesNotMatch(css,/overflow-x:hidden|text-overflow:ellipsis|line-clamp/);
});

test('Pages publishes only the generated site without a custom domain or package publishing',async()=>{
 const sourceFiles=await walk(projectRoot);
 const workflow=await readFile(path.join(projectRoot,'.github/workflows/pages.yml'),'utf8');
 assert.match(workflow,/path: site/);
 assert.match(workflow,/run: npm run check/);
 assert.match(workflow,/branches: \[main\]/);
 assert.doesNotMatch(workflow,/contents: write|pull_request_target/);
 assert.ok(!sourceFiles.some(f=>path.basename(f)==='CNAME'));
 const pkg=JSON.parse(await readFile(path.join(projectRoot,'package.json'),'utf8'));
 assert.equal(pkg.private,true);assert.ok(!pkg.scripts.deploy);
});
