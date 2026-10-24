import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const read=p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');
test('merged brand provenance pins exact baseline and adapted palettes',async()=>{
 const manifest=JSON.parse(await read('brand-provenance.json'));
 assert.equal(manifest.commit,'6bf3c8608a42b7859c9022d3adbc8ebc6edb8fd7');
 for(const f of manifest.files){const bytes=await read(f.target);assert.equal(createHash('sha256').update(bytes).digest('hex'),f.vendoredSha256);if(f.mode==='exact')assert.equal(f.sourceSha256,f.vendoredSha256);}
});
test('effective motion preserves system, reduce and full scope policy without global overrides',async()=>{
 const tokens=await read('assets/brand-tokens.css'),css=await read('assets/site.css');
 assert.match(tokens,/:root \{ --c-motion-system-duration: var\(--c-motion-reduced-duration\); \}/);
 for(const [mode,token] of [['system','system'],['reduce','reduced'],['full','normal']])assert.ok(tokens.includes(`[data-motion="${mode}"] { --c-motion-duration: var(--c-motion-${token}-duration); }`));
 assert.doesNotMatch(css,/transition-duration:.*!important|animation-duration:.*!important/);
 assert.match(css,/transition:background-color var\(--c-motion-duration\) var\(--c-motion-easing\)/);
 assert.match(css,/scroll-behavior:auto/);
});
test('optional preference control handles repeated choices, defaults safely and makes no storage writes',async()=>{
 const script=await read('assets/preferences.mjs');let handler;const selected=[];
 const select={value:'system',addEventListener:(event,fn)=>{assert.equal(event,'change');handler=fn;}};
 const control={hidden:true,querySelector:()=>select};
 vm.runInNewContext(script,{document:{querySelector:()=>control,documentElement:{setAttribute:(k,v)=>{assert.equal(k,'data-motion');selected.push(v);}}}});
 assert.equal(control.hidden,false);
 for(const value of ['reduce','full','system','full','invalid']){select.value=value;handler();}
 assert.deepEqual(selected,['reduce','full','system','full','system']);
 assert.doesNotMatch(script,/localStorage|sessionStorage|fetch\(|cookie/);
 vm.runInNewContext(script,{document:{querySelector:()=>null}});
});
