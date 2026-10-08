import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { families } from '../src/projects.mjs';
import { familyPage, home, catalog, about, notFound } from '../src/templates.mjs';
import { resolveFamilyTheme } from '../src/themes.mjs';
const asset=new URL('../assets/families/hplx/hplx-ember-amber.svg',import.meta.url);

test('Ember SVG is the exact selected primary master, without recreation',async()=>{
 const bytes=await readFile(asset);
 const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
 assert.equal(sha,'333a045f7aba9c1c4ad65c7b009cb269a1baf46f');
 const svg=bytes.toString();assert.match(svg,/viewBox="135 289 400 150"/);assert.match(svg,/fill="#F7B041"/);
 assert.equal((svg.match(/<path /g)||[]).length,3);
 assert.doesNotMatch(svg,/<image|<filter|transform=|<script|href=/);
});

test('HPLX header uses the symbol alongside a live, accessible product name',()=>{
 assert.equal(resolveFamilyTheme('hplx').logo,'assets/families/hplx/hplx-ember-amber.svg');
 const html=familyPage(families[0]);
 const header=html.match(/<header class="family-heading">[\s\S]*?<\/header>/)[0];
 assert.match(header,/<img class="family-logo" src="\.\.\/\.\.\/assets\/families\/hplx\/hplx-ember-amber.svg" width="240" height="90" alt="">/);
 assert.match(header,/<h1>HPLX<\/h1>/);assert.match(header,/A Cosmik project/);
 assert.doesNotMatch(header,/emblem.svg/);
 assert.equal((html.match(/hplx-ember-amber.svg/g)||[]).length,1);
});

test('Ember remains inside the family identity without changing Cosmik branding',()=>{
 const html=familyPage(families[0]);
 const main=html.match(/<main[\s\S]*?<\/main>/)[0];
 assert.match(main,/hplx-ember-amber.svg/);
 assert.doesNotMatch(html.replace(main,''),/hplx-ember-amber.svg/);
 for(const page of [home(),catalog(),about(),notFound()])assert.doesNotMatch(page,/hplx-ember-amber.svg/);
});

test('the logo preserves aspect ratio, responsive width and surrounding space',async()=>{
 const css=await readFile(new URL('../assets/site.css',import.meta.url),'utf8');
 const style=css.match(/\.family-logo\{([^}]+)\}/)[1];
 assert.match(style,/width:15rem/);assert.match(style,/max-width:100%/);assert.match(style,/height:auto/);assert.match(style,/margin-top:var\(--c-space-6\)/);
 assert.doesNotMatch(style,/transform|filter|clip|object-fit:cover|max-height/);
 assert.equal(240/90,400/150);
});
