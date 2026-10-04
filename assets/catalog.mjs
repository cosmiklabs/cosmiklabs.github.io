import { filterProjects } from './catalog-model.mjs';
export function initDirectory(doc) {
const directory=doc.querySelector('[data-directory]');
if(directory){
 const form=directory.querySelector('[data-directory-form]');
 const rows=[...directory.querySelectorAll('[data-project-row]')];
 const projects=rows.map(row=>({id:row.dataset.id,name:row.dataset.name,shortName:row.dataset.shortName,summary:row.dataset.summary,type:row.dataset.type,status:row.dataset.status,parentName:row.dataset.parentName}));
 const query=form.elements.namedItem('query');const type=form.elements.namedItem('type');const status=form.elements.namedItem('status');
 const count=directory.querySelector('[data-result-count]');const empty=directory.querySelector('[data-empty]');const table=directory.querySelector('table');
 function update(){
  const filters={query:query.value,type:type.value,status:status.value};
  const visible=new Set(filterProjects(projects,filters).map(project=>project.id));
  for(const row of rows)row.hidden=!visible.has(row.dataset.id);
  const active=Boolean(filters.query.trim()||filters.type||filters.status);
  directory.classList.toggle('is-filtered',active);
  count.textContent=active?`${visible.size} of ${projects.length} projects`:`${projects.length} projects`;
  empty.hidden=visible.size!==0;table.hidden=visible.size===0;
  form.querySelector('[type="reset"]').disabled=!active;
 }
 form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('input',update);form.addEventListener('change',update);
 form.addEventListener('reset',()=>{query.value='';type.value='';status.value='';update();});
 directory.querySelector('[data-empty-reset]').addEventListener('click',()=>{form.reset();query.focus();});
 // Until this initialization succeeds, all content stays readable and controls stay hidden.
 update();form.hidden=false;
}

}
if(typeof document!=='undefined') initDirectory(document);
