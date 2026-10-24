import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {provenance,lockFor,colourRoles} from '../src/brand.mjs';
import {assetBytes} from '../src/assets.mjs';
import {families} from '../src/projects.mjs';
import {home,catalog,about,notFound,familyPage} from '../src/templates.mjs';
const read=p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');
const vendorTool=p=>fileURLToPath(new URL(`../${p}/vendor/brand/scripts/vendor.mjs`,import.meta.url));
const cwd=fileURLToPath(new URL('..',import.meta.url));
const verify=(tool,dir)=>spawnSync(process.execPath,[tool,'verify',dir],{cwd,encoding:'utf8'});

test('all three vendored releases verify with their own vendored tool',()=>{
 for(const [dir,tool] of [['vendor/brand','vendor/brand/scripts/vendor.mjs'],['vendor/brand-tectra',vendorTool('vendor/brand-tectra')],['vendor/brand-hplx',vendorTool('vendor/brand-hplx')]]){
  const run=verify(tool,dir);
  assert.equal(run.status,0,`${dir}: ${run.stderr}${run.stdout}`);
  assert.match(run.stdout,new RegExp(`${dir} matches`));
 }
 const {locks}=provenance;
 assert.deepEqual(Object.keys(locks),['brand','brand-tectra','brand-hplx']);
 for(const [name,path] of Object.entries(locks))assert.equal(JSON.parse(readFileSync(new URL(`../${path}`,import.meta.url))).repository,`cosmiklabs/${name}`);
});

test('the three copies of the foundation are one release, byte for byte',()=>{
 const brand=JSON.parse(readFileSync(new URL('../vendor/brand/brand.lock.json',import.meta.url)));
 for(const product of ['brand-tectra','brand-hplx']){
  const nested=JSON.parse(readFileSync(new URL(`../vendor/${product}/vendor/brand/brand.lock.json`,import.meta.url)));
  assert.equal(nested.commit,brand.commit,product);assert.deepEqual(nested.files,brand.files,product);
 }
});

test('every published brand file comes from a lock, unchanged or reduced to colour roles',()=>{
 const sha=b=>createHash('sha256').update(b).digest('hex');
 for(const [target,{from,derive}] of Object.entries(provenance.published)){
  const {lock,file}=lockFor(from);
  const vendored=readFileSync(new URL(`../${from}`,import.meta.url));
  assert.equal(sha(vendored),lock.files[file],`${from} differs from ${lock.repository} ${lock.tag}`);
  const published=assetBytes(target);
  if(!derive){assert.ok(published.equals(vendored),target);continue;}
  // Derived: the published lines are the vendored lines minus non-colour roles, plus one provenance header.
  const kept=published.toString('utf8').split('\n').slice(1),source=vendored.toString('utf8').split('\n');
  const removed=source.filter(line=>!kept.includes(line));
  assert.deepEqual(kept,source.filter(line=>!removed.includes(line)),target);
  for(const line of removed)assert.match(line,/^\s*--c-(?:type-[a-z0-9-]+|elevation-\d+-shadow):/,`${target} dropped ${line}`);
 }
 assert.throws(()=>colourRoles('[data-family="x"] {\n  --c-space-4: 2rem;\n}','vendor/brand-hplx/tokens/hplx.css'),/neither a colour role/);
 for(const [target,{sha256}] of Object.entries(provenance.outsideDistribution.files))assert.equal(sha(readFileSync(new URL(`../${target}`,import.meta.url))),sha256,target);
});

test('pages load the baseline once, then family colours, controls and site CSS in order',async()=>{
 const pages=[home(),catalog(),about(),notFound(),...families.map(familyPage)];
 for(const html of pages){
  const sheets=[...html.matchAll(/<link rel="stylesheet" href="(?:\.\.\/|\.\/|\/)*([^"?]+)\?v=/g)].map(m=>m[1]);
  const family=html.match(/data-family="([a-z0-9-]+)"/)?.[1];
  assert.deepEqual(sheets,['assets/brand/cosmik.css',...(family?[`assets/families/${family}/tokens.css`]:[]),'assets/brand/controls.css','assets/site.css','assets/family-themes.css',...(family?[`assets/families/${family}/theme.css`]:[])]);
  assert.doesNotMatch(html,/vendor\//);
 }
});

test('effective motion preserves system, reduce and full scope policy without global overrides',async()=>{
 const tokens=assetBytes('assets/brand/cosmik.css').toString('utf8'),css=await read('assets/site.css'),controls=assetBytes('assets/brand/controls.css').toString('utf8');
 assert.match(tokens,/:root \{ --c-motion-system-duration: var\(--c-motion-reduced-duration\); \}/);
 for(const [mode,token] of [['system','system'],['reduce','reduced'],['full','normal']])assert.ok(tokens.includes(`[data-motion="${mode}"] { --c-motion-duration: var(--c-motion-${token}-duration); }`));
 assert.doesNotMatch(css,/transition-duration:.*!important|animation-duration:.*!important/);
 assert.match(controls,/transition-duration: var\(--c-motion-duration\);/); // Buttons and links animate through the shared controls.
 assert.doesNotMatch(css,/transition:background-color/);
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
