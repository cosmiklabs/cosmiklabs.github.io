/** Pure helpers shared by the static build and the progressively enhanced directory. */
export const typeKey = type => ({Engine:'engine',Editor:'editor','Game reimplementation':'game'}[type] || type.toLowerCase().replace(/\s+/g,'-'));
export const normalize = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function matchesProject(project, {query='',type='',status=''}={}) {
  if(type && typeKey(project.type)!==type) return false;
  if(status && project.status!==status) return false;
  const haystack=normalize([project.name,project.shortName,project.summary,project.parentName].join(' '));
  return normalize(query).split(/\s+/).filter(Boolean).every(term=>haystack.includes(term));
}
export function filterProjects(projects, filters={}) {return projects.filter(project=>matchesProject(project,filters));}
/** Stable depth-first order groups children under parents without duplicating entries. */
export function groupProjects(projects) {
  const ids=new Set(projects.map(project=>project.id));const seen=new Set();const result=[];
  function visit(project,depth){if(seen.has(project.id))return;seen.add(project.id);result.push({...project,depth});for(const child of projects.filter(item=>item.parent===project.id))visit(child,depth+1);}
  for(const project of projects.filter(item=>!item.parent || !ids.has(item.parent)))visit(project,0);
  for(const project of projects)visit(project,0);
  return result;
}
