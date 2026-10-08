import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// HTTP checks validate the local static server, not rendered browser behavior.
test('local server serves routes, normalizes trailing slashes and handles errors',async()=>{
 const port=19000+Math.floor(Math.random()*20000);
 const child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/serve.mjs',import.meta.url))],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
 try {
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('Preview server did not start.')),5000);
   child.stdout.once('data',()=>{clearTimeout(timer);resolve();});
   child.once('error',err=>{clearTimeout(timer);reject(err);});
   child.once('exit',code=>{clearTimeout(timer);reject(new Error(`Preview exited ${code}`));});
  });
  const base=`http://127.0.0.1:${port}`;
  for(const route of ['/','/projects/','/projects/hplx/','/about/','/projects/tdd/','/projects/amfp/','/projects/hplx-editor/']){
   const res=await fetch(base+route);assert.equal(res.status,200,route);assert.match(res.headers.get('content-type'),/text\/html/);assert.match(await res.text(),/<h1/);
  }
  const redirect=await fetch(base+'/projects',{redirect:'manual'});assert.equal(redirect.status,301);assert.equal(redirect.headers.get('location'),'/projects/');
  const missing=await fetch(base+'/unrecognized/deep/path');assert.equal(missing.status,404);assert.match(await missing.text(),/href="\/projects\/"/);
  const malformed=await fetch(base+'/%E0%A4%A');assert.equal(malformed.status,400);
  const css=await fetch(base+'/assets/site.css');assert.equal(css.status,200);assert.match(css.headers.get('content-type'),/text\/css/);
  const font=await fetch(base+'/assets/fonts/IBMPlexMono-Regular.woff2');assert.equal(font.status,200);assert.equal(font.headers.get('content-type'),'font/woff2');
  for(const [asset,type] of [['cosmik.ico','image/vnd.microsoft.icon'],['cosmik-apple-touch-180.png','image/png']]){
   const res=await fetch(base+'/assets/'+asset);assert.equal(res.status,200);assert.equal(res.headers.get('content-type'),type);assert.ok((await res.arrayBuffer()).byteLength>0);
  }
  assert.equal(css.headers.get('cache-control'),'no-store');
  const spectral=await fetch(base+'/assets/fonts/Spectral-SemiBold.woff2');assert.equal(spectral.status,200);assert.equal(spectral.headers.get('content-type'),'font/woff2');
  const theme=await fetch(base+'/assets/families/hplx/theme.css');assert.equal(theme.status,200);assert.match(await theme.text(),/--c-primitive-hplx-amber: #E0A53A/);
 } finally { child.kill(); }
});
