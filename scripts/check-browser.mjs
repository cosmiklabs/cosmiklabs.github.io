// Review-only CI validation; never publishes the site.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright-core');
const servers=[];let browser;const results=[];
const port=Number(process.env.CHECK_PORT || 4173),origin=`http://127.0.0.1:${port}`;
async function serve(script,port){
 const child=spawn(process.execPath,[script],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','inherit']});servers.push(child);
 await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(new Error(`Server exited ${code}`)));});
}
try{
 await serve('scripts/serve.mjs',port);
 browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || '/usr/bin/google-chrome',headless:true});
 await mkdir('review-screenshots',{recursive:true});
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:960},reducedMotion:'reduce'});
  for(const [name,url] of [['org',origin+'/'],['org-tectra',origin+'/projects/tectra/'],['org-hplx',origin+'/projects/hplx/']]){
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.evaluate(()=>document.fonts.ready);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${name} ${width} horizontal overflow`);
   const nav=page.locator('nav[aria-label="Main navigation"] a');for(const link of await nav.all())assert.ok(await link.isVisible(),`${name} mobile nav link visible`);
   const pref=page.getByLabel('Motion preference');await pref.waitFor({state:'visible'});
   const duration=()=>page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--c-motion-duration').trim());
   assert.equal(await duration(),'0ms');await pref.selectOption('full');assert.equal(await duration(),'140ms');
   await pref.selectOption('reduce');assert.equal(await duration(),'0ms');await page.emulateMedia({reducedMotion:'no-preference'});assert.equal(await duration(),'0ms');
   await pref.selectOption('system');assert.equal(await duration(),'140ms');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await duration(),'0ms');
   // Native CSS nesting: an explicit System scope restores OS Reduce inside Full.
   await pref.selectOption('full');
   const scoped=await page.evaluate(()=>{const outer=document.createElement('div');outer.dataset.motion='full';const inner=document.createElement('div');inner.dataset.motion='system';outer.append(inner);document.body.append(outer);const values=[outer,inner].map(el=>getComputedStyle(el).getPropertyValue('--c-motion-duration').trim());outer.remove();return values;});
   assert.deepEqual(scoped,['140ms','0ms']);await pref.selectOption('reduce');
   for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.naturalWidth>0),`${name} image loaded`);}
   // Shared controls keep their own colours over the site's link states.
   if(name==='org'){const button=page.locator('a.c-button').first();await button.hover();
    const [fg,expected]=await button.evaluate(el=>[getComputedStyle(el).color,(()=>{const probe=document.createElement('span');probe.style.color='var(--c-action-primary-fg)';el.append(probe);const c=getComputedStyle(probe).color;probe.remove();return c;})()]);
    assert.equal(fg,expected,`${name} ${width} button text on hover`);
    assert.equal(await page.locator('.c-select > select').evaluate(el=>getComputedStyle(el).appearance),'none');}
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:`review-screenshots/${name}-${width}.png`,fullPage:true});
   assert.deepEqual(errors,[],`${name} JS errors`);results.push({name,width,overflow,errors,motion:'system/reduce/full and nested scope passed'});await page.close();
  }
  await context.close();
 }
 const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844},reducedMotion:'reduce'});
 for(const url of [origin+'/']){const page=await noJs.newPage();await page.goto(url);assert.ok(await page.locator('h1').isVisible());assert.equal(await page.getByLabel('Motion preference').isVisible(),false);for(const link of await page.locator('nav a').all())assert.ok(await link.isVisible());await page.close();}
 await noJs.close();await writeFile('review-screenshots/results.json',JSON.stringify(results,null,2));console.log(`Browser checks passed: ${results.length} desktop/mobile page cases plus no-JS checks.`);
}finally{await browser?.close();for(const server of servers)server.kill();}
