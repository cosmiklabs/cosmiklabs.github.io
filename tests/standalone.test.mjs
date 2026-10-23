import test from 'node:test';
import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
const root=new URL('../',import.meta.url);
async function walk(url){let out=[];for(const e of await readdir(url,{withFileTypes:true})){const u=new URL(e.name+(e.isDirectory()?'/':''),url);out.push(...e.isDirectory()?await walk(u):[u.pathname]);}return out;}
test('standalone Tectra draft is excluded from public website build output',async()=>{
 const files=await walk(new URL('site/',root));assert.ok(!files.some(p=>p.includes('/site/tectra.app/')));
 assert.ok(!files.some(p=>p.endsWith('/motion.mjs')||p.endsWith('/structure-illustration.svg')));
 const html=await readFile(new URL('site/index.html',root),'utf8');assert.doesNotMatch(html,/tectra\.app\//);
});
