import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { families } from '../src/projects.mjs';
import { familyPage, home, catalog, about, notFound } from '../src/templates.mjs';
import { resolveFamilyTheme } from '../src/themes.mjs';
const asset=new URL('../assets/families/hplx/hplx-glimmer-dark.svg',import.meta.url);

test('Glimmer SVG is the exact selected primary master, without recreation',async()=>{
 const bytes=await readFile(asset);
 const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
 assert.equal(sha,'2ce7d0590b6826f759952b1ffded6c71bb7b62ed');
 const svg=bytes.toString();assert.match(svg,/viewBox="0 0 64 64"/);assert.match(svg,/fill="#E0A53A"/);
 assert.equal((svg.match(/<path /g)||[]).length,2);
 assert.doesNotMatch(svg,/<image|<filter|transform=|<script|href=/);
});

test('HPLX header uses the symbol alongside a live, accessible product name',()=>{
 assert.equal(resolveFamilyTheme('hplx').logo,'assets/families/hplx/hplx-glimmer-dark.svg');
 const html=familyPage(families[0]);
 const header=html.match(/<header class="family-heading">[\s\S]*?<\/header>/)[0];
 assert.match(header,/<img class="family-logo" src="\.\.\/\.\.\/assets\/families\/hplx\/hplx-glimmer-dark.svg" width="64" height="64" alt="">/);
 assert.match(header,/<h1>HPLX<\/h1>/);assert.match(header,/A Cosmik project/);
 assert.doesNotMatch(header,/emblem.svg/);
 assert.equal((html.match(/hplx-glimmer-dark.svg/g)||[]).length,1);
});

test('Glimmer remains inside the family identity without changing Cosmik branding',()=>{
 const html=familyPage(families[0]);
 const main=html.match(/<main[\s\S]*?<\/main>/)[0];
 assert.match(main,/hplx-glimmer-dark.svg/);
 assert.doesNotMatch(html.replace(main,''),/hplx-glimmer-dark.svg/);
 for(const page of [home(),catalog(),about(),notFound()])assert.doesNotMatch(page,/hplx-glimmer-dark.svg/);
});

test('the logo preserves aspect ratio, responsive width and surrounding space',async()=>{
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 const style=css.match(/\.family-logo,\.tecton-logo\{([^}]+)\}/)[1];
 assert.match(style,/width:1.35em/);assert.match(style,/height:1.35em/);
 assert.doesNotMatch(style,/transform|filter|clip|object-fit:cover|max-height/);
 assert.equal(64/64,64/64);
});


test('Glimmer, the live title and endorsement share one shared horizontal identity layout',async()=>{
 const html=familyPage(families[0]);
 assert.match(html,/<p class="eyebrow">[^<]+<\/p><div class="family-identity"><img class="family-logo"[^>]+><h1>HPLX<\/h1><p class="endorsement">A Cosmik project<\/p><\/div>/);
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 const identity=css.match(/\.family-identity,\.tecton-identity\{([^}]+)\}/)[1];
 assert.match(identity,/display:grid/);assert.match(identity,/grid-template-columns:1.35em minmax\(0,1fr\)/);assert.match(identity,/align-items:center/);
 assert.match(css,/\.family-identity \.endorsement,\.tecton-identity \.endorsement\{grid-column:2/);
 for(const page of [home(),catalog(),about(),notFound()])assert.doesNotMatch(page,/class="family-identity"/);
});

test('active pages use Glimmer without any obsolete Ember references',()=>{
 for(const page of [familyPage(families[0]),home(),catalog(),about()]) assert.doesNotMatch(page,/hplx-ember/);
 for(const page of [home(),catalog()]) assert.match(page,/<img class="family-row-symbol family-row-symbol-hplx"[^>]*hplx-glimmer-white.svg" width="32" height="32" alt="">HPLX/);
});
