import test from 'node:test';
import assert from 'node:assert/strict';
import { families } from '../src/projects.mjs';
import { familyThemes, resolveFamilyTheme } from '../src/themes.mjs';
import { home, catalog, about, familyPage, legacyPage } from '../src/templates.mjs';

test('pending HPLX identity inherits neutral baseline without proposed assets',()=>{
 assert.equal(familyThemes.hplx.state,'pending-identity');
 assert.deepEqual(resolveFamilyTheme('hplx'),{id:'hplx',state:'baseline',stylesheet:null,logo:null});
 assert.equal(resolveFamilyTheme('unknown').state,'baseline');
 const html=familyPage(families[0]);
 assert.match(html,/data-family="hplx" data-family-theme="baseline"/);
 assert.doesNotMatch(html,/hplx\.css|Spectral|lantern-amber/);
});

test('family theme is confined to content; global shell and other pages stay baseline',()=>{
 const html=familyPage(families[0]);
 const main=html.match(/<main[\s\S]*?<\/main>/)[0];
 assert.match(main,/data-family="hplx"/);
 assert.doesNotMatch(main,/emblem\.svg/);
 const shell=html.replace(main,'');
 assert.doesNotMatch(shell,/data-family=/);assert.match(shell,/emblem\.svg/);
 for(const page of [home(),catalog(),about()])assert.doesNotMatch(page,/data-family=/);
 assert.match(legacyPage({id:'tdd',familyId:'hplx',fragment:'tdd',name:'The Dark Descent Redux'}),/data-family="hplx"/);
});

test('only approved, isolated family asset paths are enabled',()=>{
 const proposed={hplx:{state:'proposed',stylesheet:'assets/families/hplx/theme.css',logo:'assets/families/hplx/logo.svg'}};
 assert.equal(resolveFamilyTheme('hplx',proposed).stylesheet,null);
 const approved={hplx:{...proposed.hplx,state:'approved'}};
 assert.equal(resolveFamilyTheme('hplx',approved).stylesheet,'assets/families/hplx/theme.css');
 assert.equal(resolveFamilyTheme('hplx',approved).logo,'assets/families/hplx/logo.svg');
 assert.throws(()=>resolveFamilyTheme('hplx',{hplx:{state:'approved',stylesheet:'assets/site.css'}}),/own asset directory/);
 assert.throws(()=>resolveFamilyTheme('hplx',{hplx:{state:'approved',logo:'assets/emblem.svg'}}),/own asset directory/);
});

test('approved assets cannot borrow another family identity',()=>{
 assert.throws(()=>resolveFamilyTheme('hplx',{hplx:{state:'approved',stylesheet:'assets/families/other/theme.css'}}),/own asset directory/);
 assert.throws(()=>resolveFamilyTheme('hplx',{hplx:{state:'approved',logo:'assets/families/other/logo.svg'}}),/own asset directory/);
 assert.throws(()=>resolveFamilyTheme('../hplx'),/URL-safe/);
});
