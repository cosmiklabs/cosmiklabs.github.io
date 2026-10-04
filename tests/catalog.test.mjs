import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../src/projects.mjs';
import {filterProjects,groupProjects,typeKey} from '../assets/catalog-model.mjs';
import {initDirectory} from '../assets/catalog.mjs';
const catalog=projects.map(project=>({...project,parentName:projects.find(p=>p.id===project.parent)?.name || ''}));
test('directory matching handles names, aliases, description, case, whitespace and combined filters',()=>{
 assert.deepEqual(filterProjects(catalog,{query:'  AMNESIA   redux '}).map(p=>p.id),['tdd','amfp']);
 assert.deepEqual(filterProjects(catalog,{query:'amfp'}).map(p=>p.id),['amfp']);
 assert.deepEqual(filterProjects(catalog,{query:'custom stories',type:'editor',status:'Planned'}).map(p=>p.id),['hplx-editor']);
 assert.equal(filterProjects(catalog,{type:'game',status:'In development'}).length,1);
 assert.equal(filterProjects(catalog,{query:'no such project'}).length,0);
 assert.equal(filterProjects(catalog,{query:'  '}).length,4);
 assert.equal(typeKey('Game reimplementation'),'game');
});
test('children match independently while preserving parent context',()=>{
 const match=filterProjects(catalog,{type:'game',status:'Not started'});
 assert.deepEqual(match.map(p=>p.id),['amfp']);assert.equal(match[0].parentName,'HPLX');
 assert.equal(filterProjects(catalog,{query:'hplx',type:'editor'}).length,1);
});
test('grouping is stable, supports standalone entries, nested relationships and parent-after-child input',()=>{
 const standalone={id:'other',parent:null};const grandchild={id:'nested',parent:'tdd'};
 const ordered=groupProjects([catalog[2],catalog[3],catalog[1],catalog[0],standalone,grandchild]);
 assert.deepEqual(ordered.map(p=>p.id),['hplx','amfp','hplx-editor','tdd','nested','other']);
 assert.equal(ordered.find(p=>p.id==='nested').depth,2);assert.equal(ordered.find(p=>p.id==='other').depth,0);
 assert.equal(new Set(ordered.map(p=>p.id)).size,ordered.length);
 assert.equal(groupProjects([{id:'orphan',parent:'missing'}])[0].depth,0);
});
function harness(){
 const handlers={};const query={value:'',focus(){this.focused=true;}};const type={value:''};const status={value:''};const reset={disabled:false};const count={};const empty={hidden:true};const table={hidden:false};const emptyReset={addEventListener(name,fn){handlers['empty-'+name]=fn;}};
 const rows=catalog.map(p=>({hidden:false,dataset:{id:p.id,name:p.name,shortName:p.shortName||'',summary:p.summary,type:p.type,status:p.status,parentName:p.parentName}}));
 const form={hidden:true,elements:{namedItem:name=>({query,type,status}[name])},querySelector:()=>reset,addEventListener(name,fn){handlers[name]=fn;},reset(){handlers.reset();}};
 const elements={'[data-directory-form]':form,'[data-result-count]':count,'[data-empty]':empty,'table':table,'[data-empty-reset]':emptyReset};
 const directory={querySelector:selector=>elements[selector],querySelectorAll:()=>rows,classList:{toggle(name,value){this[name]=value;}}};
 initDirectory({querySelector:()=>directory});return {handlers,query,type,status,reset,count,empty,table,rows,form,directory};
}
test('enhancement initializes full directory and type/status filtering does not hide matching children',()=>{
 const h=harness();assert.equal(h.form.hidden,false);assert.equal(h.count.textContent,'4 projects');assert.ok(h.reset.disabled);
 h.type.value='game';h.status.value='Not started';h.handlers.change();assert.equal(h.count.textContent,'1 of 4 projects');assert.deepEqual(h.rows.filter(r=>!r.hidden).map(r=>r.dataset.id),['amfp']);assert.ok(!h.reset.disabled);
});
test('empty state and repeated reset restore results and clear controls',()=>{
 const h=harness();h.query.value='unmatched';h.handlers.input();assert.equal(h.count.textContent,'0 of 4 projects');assert.equal(h.empty.hidden,false);assert.equal(h.table.hidden,true);
 h.handlers['empty-click']();assert.equal(h.query.focused,true);assert.equal(h.query.value,'');assert.equal(h.empty.hidden,true);assert.equal(h.table.hidden,false);assert.equal(h.rows.filter(r=>!r.hidden).length,4);
 h.type.value='editor';h.handlers.change();h.form.reset();h.form.reset();assert.equal(h.type.value,'');assert.equal(h.status.value,'');assert.equal(h.count.textContent,'4 projects');assert.ok(h.reset.disabled);
 let prevented=false;h.handlers.submit({preventDefault(){prevented=true;}});assert.ok(prevented);
});
