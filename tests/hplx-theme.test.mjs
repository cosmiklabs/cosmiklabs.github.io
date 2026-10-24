import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { text, blocks, resolve, modeValues, checkContrast } from './brand-helpers.mjs';
const tokens=text('assets/families/hplx/tokens.css');
const theme=text('assets/families/hplx/theme.css');
const vendored=readFileSync(new URL('../vendor/brand-hplx/tokens/hplx.css',import.meta.url),'utf8');

test('HPLX publishes its approved colour roles without the kit\'s Spectral headings',()=>{
 assert.match(vendored,/--c-type-display-font-family: "Spectral"/); // The kit's choice, recorded unchanged in vendor/.
 assert.doesNotMatch(tokens,/--c-type-|Spectral|@font-face/); // The website keeps shared Inter headings.
 assert.match(tokens,/Colour roles of vendor\/brand-hplx\/tokens\/hplx\.css \(cosmiklabs\/brand-hplx v0\.1\.0\)/);
 assert.match(theme,/Selected for this site on 7 October 2026/);
});

test('every HPLX styling selector is isolated to family content',()=>{
 for(const block of [...blocks(tokens),...blocks(theme)]){
  for(const selector of block.selectors.split(','))assert.match(selector.trim(),/^\[data-family="hplx"\]/,selector);
 }
 for(const block of blocks(tokens))for(const name of Object.keys(block.declarations))assert.doesNotMatch(name,/^--c-(space|layout|motion|radius|breakpoint|type)-/);
});

test('light and dark HPLX modes retain shared heading and interface type',()=>{
 for(const mode of ['dark','light']){
  const values=modeValues(tokens,mode);
  for(const role of ['display','display-small','section','card','body','control','identity-label'])assert.equal(resolve(`--c-type-${role}-font-family`,values,mode),'"Inter"');
  assert.equal(resolve('--c-type-label-font-family',values,mode),'"IBM Plex Mono"');
 }
 assert.equal(resolve('--c-accent',modeValues(tokens,'dark'),'dark'),'#E0A53A');
 assert.equal(resolve('--c-accent',modeValues(tokens,'light'),'light'),'#875709');
});

test('all applied text, accent, control and focus pairs meet contrast targets in both modes',()=>{
 assert.equal(checkContrast(tokens),52);
});

test('family styles make no external requests and load no fonts',()=>{
 for(const css of [tokens,theme]){assert.doesNotMatch(css,/https?:\/\/|@import|url\(/);assert.doesNotMatch(css,/@font-face|--c-type-/);}
});
