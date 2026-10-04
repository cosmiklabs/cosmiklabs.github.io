import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {projects, projectById} from '../src/projects.mjs';
import {escape, projectPage, card} from '../src/templates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../site');
async function walk(dir) {const result=[];for (const entry of await readdir(dir,{withFileTypes:true})) {const name=path.join(dir,entry.name);result.push(...entry.isDirectory()?await walk(name):[name]);}return result;}
const files=await walk(root);
const htmlFiles=files.filter(name=>name.endsWith('.html'));
test('build produces the complete page set',()=>assert.equal(htmlFiles.length,4+projects.length));
test('catalog identifiers and parent relationships are valid and acyclic',()=>{
 assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
 for (const p of projects) {assert.match(p.id,/^[a-z0-9-]+$/);assert.ok(p.status);let parent=p.parent;const seen=new Set([p.id]);while(parent){assert.ok(projectById.has(parent));assert.ok(!seen.has(parent));seen.add(parent);parent=projectById.get(parent).parent;}}
 assert.equal(projectById.get('tdd').parent,'hplx');
});
test('all local HTML links, assets, and fragments resolve',async()=>{
 for (const file of htmlFiles){const html=await readFile(file,'utf8');for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|data:)/.test(href))continue;
  const [pathname,fragment]=href.split('#');
  let resolved=pathname.startsWith('/')?path.join(root,pathname):path.resolve(path.dirname(file),pathname || path.basename(file));
  const info=await stat(resolved);if(info.isDirectory())resolved=path.join(resolved,'index.html');
  assert.ok(files.includes(resolved),`${file}: ${href}`);
  if(fragment)assert.match(await readFile(resolved,'utf8'),new RegExp(`id="${fragment}"`));
 }}
});
test('every page has semantic landmarks and one descriptive h1',async()=>{
 const titles=[];
 for(const file of htmlFiles){const html=await readFile(file,'utf8');assert.match(html,/<html lang="en"/);assert.equal((html.match(/<h1[> ]/g)||[]).length,1);assert.match(html,/<main id="main"/);assert.match(html,/class="skip-link"/);assert.match(html,/<nav aria-label="Main navigation"/);assert.match(html,/<meta name="description"/);titles.push(html.match(/<title>(.*?)<\/title>/)[1]);for(const [,tag] of html.matchAll(/(<img\b[^>]*>)/g))assert.match(tag,/alt="[^"]*"/);assert.doesNotMatch(html,/<script|onclick=|javascript:/i);}
 assert.equal(new Set(titles).size,titles.length);
});
test('no private-source links, fake downloads, trackers, or deployment data',async()=>{
 for(const file of htmlFiles){const html=await readFile(file,'utf8');assert.doesNotMatch(html,/matthewdowns|localhost|workspace\/|api[_-]?key|analytics|Download now|Play now|cosmik-labs\.github\.io/i);}
});
test('font assets and license notices are preserved',async()=>{
 for(const file of ['Inter-Regular.woff2','Inter-Medium.woff2','Inter-SemiBold.woff2','IBMPlexMono-Regular.ttf','Inter-OFL.txt','IBM-Plex-OFL.txt'])assert.ok((await stat(path.join(root,'assets/fonts',file))).size>0);
});
test('styling supports visible focus and reduced motion',async()=>{
 const css=await readFile(path.join(root,'assets/site.css'),'utf8');assert.match(css,/:focus-visible/);assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);assert.match(css,/@media\(max-width:680px\)/);assert.doesNotMatch(css,/@import|https?:\/\//);
});
test('data escape prevents HTML injection',()=>assert.equal(escape('<b title="x">&\'</b>'),'&lt;b title=&quot;x&quot;&gt;&amp;&#39;&lt;/b&gt;'));

test('standalone and multiple-child projects render without invented relationships',()=>{
 const standalone={id:'sample',name:'Sample',type:'Tool',status:'In development',parent:null,summary:'Sample tool.',lead:'A useful tool.',description:'Independent project.',art:'engine.svg',artLabel:'Abstract artwork',focus:'Tools',note:'In progress.',source:null};
 const html=projectPage(standalone,[standalone]);assert.doesNotMatch(html,/relationship-diagram|The Dark Descent|Built on HPLX/);assert.match(html,/<h1>Sample<\/h1>/);
 assert.doesNotMatch(card(standalone,'./',0,[standalone]),/Foundation for/);
 const children=['child-a','child-b'].map(id=>({...standalone,id,name:id,parent:'sample'}));
 const parentHtml=projectPage(standalone,[standalone,...children]);assert.equal((parentHtml.match(/class="diagram-connector"/g)||[]).length,1);for(const child of children)assert.ok(parentHtml.includes(`projects/${child.id}/`));
});

test('projects with both a parent and children expose both relationships',()=>{
 const middle={...projects[0],id:'middle',parent:'hplx'};
 const child={...projects[1],id:'child',parent:'middle'};
 const html=projectPage(middle,[projects[0],middle,child]);assert.ok(html.includes('projects/hplx/'));assert.ok(html.includes('projects/child/'));assert.equal((html.match(/class="diagram-connector"/g)||[]).length,2);
});

test('Redux titles, stable routes, and development states are accurate',async()=>{
 assert.equal(projects.length,4);
 assert.equal(projectById.get('tdd').name,'Amnesia: The Dark Descent Redux');
 assert.equal(projectById.get('tdd').status,'In development');
 assert.equal(projectById.get('amfp').name,'Amnesia: A Machine for Pigs Redux');
 assert.equal(projectById.get('amfp').status,'Not started');
 assert.equal(projectById.get('amfp').parent,'hplx');
 for(const id of ['tdd','amfp']){
  const html=await readFile(path.join(root,`projects/${id}/index.html`),'utf8');
  assert.ok(html.includes(`<h1>${projectById.get(id).name}</h1>`));
  assert.ok(html.includes(`<title>${projectById.get(id).name} — Cosmik</title>`));
  assert.ok(html.includes('has-long-title'));
 }
 const stub=await readFile(path.join(root,'projects/amfp/index.html'),'utf8');
 assert.match(stub,/work has not started/);assert.match(stub,/Not started/);assert.doesNotMatch(stub.slice(stub.indexOf('<header class="project-heading'),stub.indexOf('</header>',stub.indexOf('<header class="project-heading'))),/In development/);assert.doesNotMatch(stub,/class="project-art"|View source|assets\/art\/null/);
});

test('both Redux games are independently discoverable and HPLX siblings',async()=>{
 for(const route of ['index.html','projects/index.html','projects/hplx/index.html']){
  const html=await readFile(path.join(root,route),'utf8');
  for(const id of ['tdd','amfp']) {assert.ok(html.includes(`projects/${id}/`));assert.ok(html.includes(projectById.get(id).name));}
  assert.match(html,/Not started|not started/);
 }
 const engine=await readFile(path.join(root,'projects/hplx/index.html'),'utf8');
 const diagram=engine.slice(engine.indexOf('class="relationship-diagram"'));
 assert.equal((diagram.match(/class="diagram-connector"/g)||[]).length,1);
 assert.match(diagram,/class="diagram-children"/);
 assert.match(engine,/work on it has not started/);
});

test('long-title and stub styles retain responsive content without clipping',async()=>{
 const css=await readFile(path.join(root,'assets/site.css'),'utf8');
 assert.match(css,/\.project-heading\.has-long-title h1/);assert.match(css,/overflow-wrap:anywhere/);assert.match(css,/grid-template-columns:minmax\(0,1fr\) auto/);
 for(const htmlFile of htmlFiles){const html=await readFile(htmlFile,'utf8');assert.doesNotMatch(html,/<h[13]>The Dark Descent<\/h[13]>|two connected projects|Both in development/);}
});


test('HPLX Editor is a planned HPL2-scoped child with its own page',async()=>{
 const editor=projectById.get('hplx-editor');assert.equal(editor.name,'HPLX Editor');assert.equal(editor.type,'Editor');assert.equal(editor.status,'Planned');assert.equal(editor.parent,'hplx');assert.equal(editor.source,null);assert.equal(editor.art,null);
 const page=await readFile(path.join(root,'projects/hplx-editor/index.html'),'utf8');
 assert.match(page,/<h1>HPLX Editor<\/h1>/);assert.match(page,/<title>HPLX Editor — Cosmik<\/title>/);assert.match(page,/HPL2-compatible custom stories/);assert.match(page,/not an available release/);assert.match(page,/No editor build/);assert.match(page,/Part of/);assert.doesNotMatch(page,/class="project-art"|View source|HPL3|SOMA|Rebirth|Bunker/);
 for(const route of ['index.html','projects/index.html','projects/hplx/index.html']){
  const html=await readFile(path.join(root,route),'utf8');assert.ok(html.includes('projects/hplx-editor/'));assert.match(html,/HPLX Editor/);assert.match(html,/Planned|planned/);
 }
 const cardHtml=card(editor,'./',3);assert.match(cardHtml,/HPL2 custom stories \/ Planned/);assert.doesNotMatch(cardHtml,/REDUX|NOT STARTED/);
});

test('HPLX has three correctly typed sibling projects and clear current scope',async()=>{
 assert.deepEqual(projects.filter(p=>p.parent==='hplx').map(p=>p.id),['tdd','amfp','hplx-editor']);
 const engine=await readFile(path.join(root,'projects/hplx/index.html'),'utf8');assert.match(engine,/current focus on HPL2/);assert.match(engine,/HPLX Editor is planned/);
 const diagram=engine.slice(engine.indexOf('class="relationship-diagram"'));assert.equal((diagram.match(/class="diagram-connector"/g)||[]).length,1);assert.match(diagram,/>Editor<\/span>/);assert.match(diagram,/>Game reimplementation<\/span>/);assert.match(diagram,/>Planned<\/span>/);
});
