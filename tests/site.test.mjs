import test from 'node:test';
import { retailGames } from '../src/retail-links.mjs';
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

test('the complete build includes published projects and public policies',()=>{
 assert.deepEqual([...pages.keys()].sort(),['404.html','about/index.html','privacy/index.html','legal/index.html','index.html','projects/amfp/index.html','projects/hplx-editor/index.html','projects/hplx/index.html','projects/index.html','projects/tdd/index.html','projects/tectra/index.html','projects/volsyn/index.html'].sort());
});

test('every local link, stylesheet, font and fragment resolves',async()=>{
 for(const [name,html] of pages){
  for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(?:https?:|mailto:)/.test(href))continue;
   const [resource,fragment]=href.split('#');
   const pathname=resource.split('?')[0];
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
  assert.doesNotMatch(html,/onclick=|javascript:/i);
  assert.equal((html.match(/<script /g)||[]).length,1);
  assert.match(html, /assets\/preferences\.mjs\?v=/);
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
 assert.match(html,/data-featured-family="tectra"/);
 assert.doesNotMatch(html,/directory-controls|project-card|project-grid|assets\/art\//);
 const index=pages.get('projects/index.html');
 assert.equal((index.match(/class="family-row"/g)||[]).length,families.length);
 assert.doesNotMatch(index,/projects\/(tdd|amfp|hplx-editor)\//);
});

test('HPLX leads with the editor, then built-in playtesting and its engine',()=>{
 const html=pages.get('projects/hplx/index.html');
 for(const id of ['make','editor','game','tdd','engine','development'])assert.match(html,new RegExp(`id="${id}"`));
 assert.doesNotMatch(html,/id="app"|desktop app/i);
 assert.ok(html.indexOf('id="make"') < html.indexOf('id="game"'));
 assert.match(html,/The HPLX project/);assert.match(html,/The editor is built and being tested/);
 assert.doesNotMatch(html,/paused|campaign|Penumbra|A Machine for Pigs/i);assert.match(html,/No release date/);
 assert.doesNotMatch(html,/only platform verified/);assert.match(html,/no public release or download yet/);
 assert.match(html,/unaffiliated with the original creators/);
 assert.equal((html.match(/<details[> ]/g)||[]).length,1);
 assert.equal((html.match(/<summary>/g)||[]).length,1);
});

test('old detail URLs have working redirect targets and readable fallback links',()=>{
 for(const route of legacyRoutes){
  const html=pages.get(`projects/${route.id}/index.html`);
  const target=`../../projects/${route.familyId}/${route.fragment ? `#${route.fragment}` : ''}`;
  assert.ok(html.includes(`content="0; url=${target}"`));assert.ok(html.includes(`href="${target}"`));
  assert.match(html,route.renamed ? /Continue to Tectra/ : /Part of HPLX/);
 }
});

test('private source, download and external service links are absent',()=>{
 const approved=new Set([...Object.values(retailGames).flatMap(game => game.stores.map(store => store.url)), 'https://frictionalgames.com/','https://github.com/cosmiklabs','https://github.com/cosmiklabs/brand','https://github.com/cosmiklabs/brand/blob/main/LICENSE.md','https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement','https://www.cloudflare.com/privacypolicy/','https://developers.cloudflare.com/speed/observatory/rum-beacon/','https://frictionalgames.com/2020-09-amnesia-is-now-open-source/']);
 for(const [name,html] of pages){
  const urls=[...html.matchAll(/(?:href|src)="(https?:[^"]+)"/g)].map(m=>m[1]);
  for(const url of urls)assert.ok(approved.has(url)||(process.env.SITE_URL && url.startsWith(new URL(process.env.SITE_URL).origin + '/')),`${name}: unexpected ${url}`);
  assert.doesNotMatch(html,/Download now|Play now|View source|fully compatible|cosmik-labs|localhost|\/workspace\/|api[_-]?key/i);
  if(process.env.SITE_URL) assert.doesNotMatch(html,/<meta name="robots"/);
  else assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 }
});

test('published brand files, emblems and fonts match their releases, with notices and nothing unused',async()=>{
 const {provenance,publishedBytes}=await import('../src/brand.mjs');
 for(const target of Object.keys(provenance.published))assert.ok((await readFile(path.join(root,target))).equals(publishedBytes(target)),target);
 for(const [target,{sha256}] of Object.entries(provenance.outsideDistribution.files))assert.equal(createHash('sha256').update(await readFile(path.join(root,target))).digest('hex'),sha256,target);
 for(const name of ['Inter-OFL.txt','IBM-Plex-OFL.txt'])assert.match(await readFile(path.join(root,'assets/fonts',name),'utf8'),/SIL OPEN FONT LICENSE/);
 const tokens=await readFile(path.join(root,'assets/brand/cosmik.css'),'utf8');assert.match(tokens,/APPROVED/);assert.doesNotMatch(tokens,/Spectral|hplx-amber/);
 assert.ok(!files.some(f=>/Spectral|ember|lockup|\.lock\.json|vendor/i.test(path.relative(root,f))),'only files pages use are published');
 for(const html of pages.values()){assert.match(html,/width="48" height="48" alt=""><span>Cosmik<\/span>/);assert.doesNotMatch(html,/<span>COSMIK<\/span>/);}
});

test('site CSS uses defined semantic roles, visible focus, responsive layout and reduced motion',async()=>{
 const css=await readFile(path.join(root,'assets/site.css'),'utf8');
 const tokens=await readFile(path.join(root,'assets/brand/cosmik.css'),'utf8');
 for(const [,token] of css.matchAll(/var\((--c-[\w-]+)/g))assert.ok(tokens.includes(`${token}:`),`undefined token ${token}`);
 assert.doesNotMatch(css,/#(?:[0-9a-f]{3}){1,2}\b|rgba?\(|hsla?\(|var\(--c-primitive-|@import|https?:\/\//i);
 assert.match(css,/:focus-visible/);assert.match(css,/max-width:720px/);assert.match(css,/max-width:380px/);
 assert.match(tokens,/@media \(prefers-reduced-motion: reduce\)/);assert.match(css,/scroll-behavior:auto/);
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



test('unpublished product pages and assets are absent from the complete build', async () => {
 for (const file of files) {
  assert.doesNotMatch(path.relative(root, file), /tecton/i);
  if (/\.(html|css|svg|xml|txt|json)$/.test(file)) {
   assert.doesNotMatch(await readFile(file, 'utf8'), /tecton|structural authoring|AI-assisted authoring/i, file);
  }
 }
});
