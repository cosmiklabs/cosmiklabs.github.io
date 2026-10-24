import test from 'node:test';
import assert from 'node:assert/strict';
import { families } from '../src/projects.mjs';
import { familyPage, home, catalog, about } from '../src/templates.mjs';
import { text, blocks, resolve, modeValues, checkContrast } from './brand-helpers.mjs';
const tokens=text('assets/families/tectra/tokens.css');
const theme=text('assets/families/tectra/theme.css');

test('all applied text, accent, control and focus pairs meet contrast targets in both modes',()=>{
 assert.equal(checkContrast(tokens),52);
});

test('Tectra theme is loaded only inside its family content boundary', () => {
 const html=familyPage(families.find(f=>f.id==='tectra'));
 assert.match(html,/assets\/families\/tectra\/tokens\.css/);
 assert.match(html,/assets\/families\/tectra\/theme\.css/);
 assert.match(html,/data-family="tectra" data-family-theme="approved-for-website"/);
 const shell=html.replace(/<main[\s\S]*?<\/main>/,'');
 assert.doesNotMatch(shell,/data-family=/);
 for(const html of [home(),catalog(),about(),familyPage(families[0])])assert.doesNotMatch(html,/tectra\/(?:theme|tokens)\.css/);
 for(const block of [...blocks(tokens),...blocks(theme)])for(const selector of block.selectors.split(','))assert.match(selector.trim(),/^\[data-family="tectra"\]/);
 for(const block of blocks(tokens))for(const name of Object.keys(block.declarations))assert.doesNotMatch(name,/^--c-(space|layout|motion|radius|breakpoint|type)-/);
});

test('Tectra retains the approved mineral palette and complete state roles in both modes', () => {
 const dark=modeValues(tokens,'dark'),light=modeValues(tokens,'light');
 assert.equal(resolve('--c-bg',dark,'dark'),'#0F1719');
 assert.equal(resolve('--c-accent',dark,'dark'),'#71D6C3');
 assert.equal(resolve('--c-bg',light,'light'),'#F2F6F5');
 assert.equal(resolve('--c-accent',light,'light'),'#126B5E');
 assert.equal(resolve('--c-surface',light,'light'),'#FFFFFF');
 const roles=blocks(tokens)[1];
 assert.equal(roles.selectors,'[data-family="tectra"], [data-family="tectra"] [data-theme]');
 assert.equal(Object.keys(roles.declarations).length,37);
 for(const [mode,values] of [['dark',dark],['light',light]])for(const key of Object.keys(roles.declarations))resolve(key,values,mode);
});
