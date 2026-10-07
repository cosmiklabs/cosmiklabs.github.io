import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const theme=await readFile(path.join(root,'assets/families/hplx/theme.css'),'utf8');
const baseline=await readFile(path.join(root,'assets/brand-tokens.css'),'utf8');
const source=theme.split('\n/* Website application:')[0];
const gitHash=bytes=>createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const blocks=css=>[...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([,selectors,body])=>({selectors:selectors.trim(),declarations:Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([,name,value])=>[name,value.trim()]))}));
const familyBlocks=blocks(source);
const baseBlocks=blocks(baseline);
const resolve=(key,values)=>{let value=values[key];const seen=new Set();while(value?.startsWith('var(')){assert.ok(!seen.has(value),'Token cycle');seen.add(value);value=values[value.slice(4,-1)];}assert.ok(value,`Missing ${key}`);return value;};
const luminance=hex=>{assert.match(hex,/^#[\da-f]{6}$/i);const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
function modeValues(mode){return {...baseBlocks[0].declarations,...baseBlocks.find(b=>mode==='dark'?b.selectors.startsWith(':root,'):b.selectors==='[data-theme="light"]').declarations,...familyBlocks[0].declarations,...familyBlocks[mode==='dark'?1:2].declarations};}

test('HPLX token source and Spectral font are exact pinned brand assets',async()=>{
 assert.equal(gitHash(Buffer.from(source)),'9aacb02511cf645951bd840d81330c6b20938bc4');
 assert.equal(gitHash(await readFile(path.join(root,'assets/fonts/Spectral-SemiBold.woff2'))),'0cac894251e09cd624c0a891de11c673162a22c3');
 const license=await readFile(path.join(root,'assets/fonts/Spectral-OFL.txt'));assert.equal(gitHash(license),'163d3a50c1666a69aac8b9f78dfc7142fb319a27');assert.match(license.toString(),/SIL OPEN FONT LICENSE/);
 assert.match(source,/PROPOSED/);assert.match(theme,/selected for this private site/);
});

test('every HPLX styling selector is isolated to family content',()=>{
 for(const block of blocks(theme)){
  if(block.selectors==='@font-face')continue;
  for(const selector of block.selectors.split(','))assert.match(selector.trim(),/^(?:\[data-theme="light"\] )?\[data-family="hplx"\]/,selector);
 }
 assert.doesNotMatch(theme,/var\(--c-type-(body|control|label|identity-label)-font-family/);
 for(const block of familyBlocks)for(const name of Object.keys(block.declarations))assert.doesNotMatch(name,/^--c-(space|layout|motion|radius|breakpoint)-|^--c-type-(body|control|label|identity-label)-/);
});

test('light and dark HPLX modes retain interface type and change heading type',()=>{
 for(const mode of ['dark','light']){
  const values=modeValues(mode);
  for(const role of ['display','display-small','section','card'])assert.equal(resolve(`--c-type-${role}-font-family`,values),'"Spectral"');
  for(const role of ['body','control','identity-label'])assert.equal(resolve(`--c-type-${role}-font-family`,values),'"Inter"');
  assert.equal(resolve('--c-type-label-font-family',values),'"IBM Plex Mono"');
 }
 assert.equal(resolve('--c-accent',modeValues('dark')),'#E0A53A');
 assert.equal(resolve('--c-accent',modeValues('light')),'#875709');
});

test('all applied text, accent, control and focus pairs meet contrast targets in both modes',()=>{
 let count=0;
 for(const mode of ['dark','light']){
  const v=modeValues(mode);
  const pairs=[];
  for(const surface of ['bg','surface','raised']){
   for(const fg of ['text','muted','link','link-hover','accent'])pairs.push([fg,surface,4.5]);
   for(const fg of ['focus','border'])pairs.push([fg,surface,3]);
  }
  pairs.push(['status-fg','status-bg',4.5],['status-border','status-bg',3]);
  for(const action of ['action-primary','action-primary-hover','action-primary-active'])pairs.push(['action-primary-fg',action,4.5]);
  for(const [fg,bg,min] of pairs){const ratio=contrast(resolve(`--c-${fg}`,v),resolve(`--c-${bg}`,v));assert.ok(ratio>=min,`${mode} ${fg}/${bg}: ${ratio.toFixed(2)} < ${min}`);count++;}
 }
 assert.equal(count,52);
});

test('family fonts resolve locally without external requests',async()=>{
 for(const [,url] of theme.matchAll(/url\('([^']+)'\)/g))assert.ok((await stat(path.resolve(root,'assets/families/hplx',url))).size>0);
 assert.doesNotMatch(theme,/https?:\/\/|@import/);
 assert.match(theme,/font-family: 'Spectral'/);assert.match(theme,/font-weight: 600/);assert.match(theme,/font-display: swap/);
});
