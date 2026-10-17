import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {families} from '../src/projects.mjs';
import {home,catalog,about,familyPage} from '../src/templates.mjs';
const html=familyPage(families.find(f=>f.id==='tecton'));
const css=await readFile(new URL('../assets/families/tecton/theme.css',import.meta.url),'utf8');
const base=await readFile(new URL('../assets/brand-tokens.css',import.meta.url),'utf8');
const lum=h=>h.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('Tecton leads with the authoring workflow without availability or pricing promises',()=>{
 assert.match(html,/isn’t available to sign up for yet/);
 assert.match(html,/planned workflow/);
 assert.doesNotMatch(html,/paid service|closed-source|open-source|free credits|free tier|construction library|construction foundation|internal|SaaS|repository/);
 assert.match(html,/keeping artistic direction in your hands/);
 assert.doesNotMatch(html,/href="[^"]*(?:signup|pricing|github.com\/cosmiklabs\/tecton)/);
 assert.match(html,/<h1>Tecton<\/h1>/);
 assert.match(html,/<img class="tecton-logo"[^>]+alt="">/);
 for(const id of ['workflow','your-design','development'])assert.match(html,new RegExp(`id="${id}"`));
});
test('umbrella copy has two families and no obsolete motto or open-source-only description',()=>{
 for(const page of [home(),catalog(),about()]){
  assert.match(page,/HPLX/); assert.match(page,/Tecton/);
  assert.doesNotMatch(page,/Reimagine|Extend|open-source gaming workshop|reimagine, extend, and create/);
 }
});
test('Tecton modes resolve all CSS references and stay scoped to family content',()=>{
 for(const [,key] of css.matchAll(/var\((--[\w-]+)\)/g))assert.ok((css+base).includes(key+':'),key);
 for(const part of css.replace(/\/\*[\s\S]*?\*\//g,'').split('}')){
  if(!part.trim())continue;
  const selectors=part.split('{')[0].split(',');
  for(const selector of selectors)assert.ok(selector.trim().startsWith('[data-family="tecton"]'),selector);
 }
 const main=html.match(/<main[\s\S]*?<\/main>/)[0];
 assert.match(main,/data-family="tecton"/);
 assert.doesNotMatch(html.replace(main,''),/data-family=/);
 assert.doesNotMatch(css,/font-family|font-size|font-weight/);
});
test('Tecton body, utility labels, focus and boundaries pass contrast in explicit light and dark modes',()=>{
 const primitives=Object.fromEntries([...(base+'\n'+css).matchAll(/(--[\w-]+): (#[\da-fA-F]{6});/g)].map(m=>[m[1],m[2]]));
 for(const block of css.matchAll(/\[data-family="tecton"\](?: \[data-theme="light"\])? \{([^}]+)\}/g)){
  const roles=Object.fromEntries([...block[1].matchAll(/(--c-[\w-]+): var\((--[\w-]+)\);/g)].map(m=>[m[1],primitives[m[2]]]));
  if(!roles['--c-text'])continue;
  for(const bg of ['--c-bg','--c-surface','--c-raised']){
   for(const fg of ['--c-text','--c-muted','--c-link','--c-link-hover','--c-accent'])assert.ok(ratio(roles[fg],roles[bg])>=4.5,`${fg} on ${bg}`);
   for(const fg of ['--c-focus','--c-border'])assert.ok(ratio(roles[fg],roles[bg])>=3,`${fg} on ${bg}`);
  }
 }
});

test('Latch uses exact approved angle-only geometry and decorative accessible placement',async()=>{
 for(const variant of ['dark','white']){
  const svg=await readFile(new URL(`../assets/families/tecton/tecton-latch-${variant}.svg`,import.meta.url),'utf8');
  assert.match(svg,/viewBox="0 0 64 64"/);
  assert.match(svg,/M8 12H36L24 24H20V40L8 52Z/);
  assert.match(svg,/M56 12L44 24V40H40L28 52H56Z/);
 }
 assert.match(html,/<div class="tecton-identity"><img[^>]+alt=""><h1>Tecton<\/h1>/);
 assert.match(home(),/tecton-latch-white.svg[^>]+alt="">Tecton/);
 assert.match(catalog(),/tecton-latch-white.svg[^>]+alt="">Tecton/);
});
