import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { families } from '../src/projects.mjs';
import { familyPage, home, catalog, about } from '../src/templates.mjs';
const theme=await readFile(new URL('../assets/families/volsyn/theme.css', import.meta.url),'utf8');
const baseline=await readFile(new URL('../assets/brand-tokens.css', import.meta.url),'utf8');
const blocks=css=>[...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([,selectors,body])=>({selectors:selectors.trim(),declarations:Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([,name,value])=>[name,value.trim()]))}));
const familyBlocks=blocks(theme);
const baseBlocks=blocks(baseline);
const resolve=(key,values)=>{let value=values[key];const seen=new Set();while(value?.startsWith('var(')){assert.ok(!seen.has(value),'Token cycle');seen.add(value);value=values[value.slice(4,-1)];}assert.ok(value,`Missing ${key}`);return value;};
const luminance=hex=>{assert.match(hex,/^#[\da-f]{6}$/i);const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
function modeValues(mode){return {...baseBlocks[0].declarations,...baseBlocks.find(b=>mode==='dark'?b.selectors.startsWith(':root,'):b.selectors==='[data-theme="light"]').declarations,...familyBlocks[0].declarations,...familyBlocks[mode==='dark'?1:2].declarations};}

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


test('Volsyn theme is loaded only inside its family content boundary', () => {
 const html=familyPage(families.find(f=>f.id==='volsyn'));
 assert.match(html,/assets\/families\/volsyn\/theme\.css/);
 assert.match(html,/data-family="volsyn" data-family-theme="approved-for-website"/);
 const shell=html.replace(/<main[\s\S]*?<\/main>/,'');
 assert.doesNotMatch(shell,/data-family=/);
 for(const html of [home(),catalog(),about(),familyPage(families[0])])assert.doesNotMatch(html,/volsyn\/theme\.css/);
 for(const block of blocks(theme))for(const selector of block.selectors.split(','))assert.match(selector.trim(),/^\[data-family="volsyn"\]/);
 for(const block of familyBlocks)for(const name of Object.keys(block.declarations))assert.doesNotMatch(name,/^--c-(space|layout|motion|radius|breakpoint|type)-/);
});

test('Volsyn retains the approved mineral palette and complete explicit state roles', () => {
 const dark=modeValues('dark'),light=modeValues('light');
 assert.equal(resolve('--c-bg',dark),'#0F1719');
 assert.equal(resolve('--c-accent',dark),'#71D6C3');
 assert.equal(resolve('--c-bg',light),'#F2F6F5');
 assert.equal(resolve('--c-accent',light),'#126B5E');
 assert.equal(Object.keys(familyBlocks[1].declarations).length,37);
 assert.equal(Object.keys(familyBlocks[2].declarations).length,37);
 for(const mode of [dark,light])for(const block of familyBlocks.slice(1,3))for(const key of Object.keys(block.declarations))resolve(key,mode);
});
