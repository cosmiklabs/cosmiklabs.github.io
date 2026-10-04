import { projects } from './projects.mjs';
import { groupProjects, typeKey } from '../assets/catalog-model.mjs';
export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<span aria-hidden="true">↗</span>';
const forward = '<span aria-hidden="true">↗</span>';
const label = text => `<p class="eyebrow">${text}</p>`;
const status = text => `<span class="status"><span aria-hidden="true" class="status-dot"></span>${escape(text)}</span>`;
export function shell({title, description, route, body, current = '', rootOverride = null, scripts = []}) {
  const depth = route.split('/').filter(Boolean).length;
  const root = rootOverride ?? (depth ? '../'.repeat(depth) : './');
  const url = path => root + path;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#000000"><meta name="color-scheme" content="dark light">
<link rel="icon" href="${url('assets/emblem.svg')}" type="image/svg+xml">
<link rel="preload" href="${url('assets/fonts/Inter-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url('assets/brand-tokens.css')}"><link rel="stylesheet" href="${url('assets/site.css')}">
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap"><a class="brand" href="${url('')}" aria-label="Cosmik home"><img src="${url('assets/emblem.svg')}" width="48" height="48" alt=""><span>COSMIK</span></a>
<nav aria-label="Main navigation"><a href="${url('projects/')}"${current==='projects'?' aria-current="page"':''}>Projects</a><a href="${url('about/')}"${current==='about'?' aria-current="page"':''}>About</a><a class="github-nav" href="https://github.com/cosmik-labs">GitHub ${arrow}</a></nav></header>
<main id="main" tabindex="-1">${body(root)}</main>
<footer class="site-footer wrap"><a class="brand footer-brand" href="${url('')}" aria-label="Cosmik home"><img src="${url('assets/emblem.svg')}" width="44" height="44" alt=""><span>COSMIK</span></a><p>Independent projects.<br>Shared possibilities.</p><div class="footer-links"><a href="https://github.com/cosmik-labs">GitHub ${arrow}</a><a href="https://github.com/cosmik-labs/brand">Brand ${arrow}</a></div><span class="footer-note">Built with curiosity.</span></footer>
${scripts.map(script=>`<script type="module" src="${url(script)}"></script>`).join('')}
</body></html>`;
}
export function featuredProject(project, root) {
  return `<article class="featured-project"><div class="featured-identity"><span class="eyebrow">${escape(project.type)}</span><h3><a href="${root}projects/${project.id}/">${escape(project.name)}</a></h3>${status(project.status)}</div><div class="featured-description"><p>${escape(project.summary)}</p><a class="text-link" href="${root}projects/${project.id}/">Explore ${escape(project.name)} ${forward}</a></div></article>`;
}
export function directoryRow(project, root, catalog = projects) {
  const parent=catalog.find(item=>item.id===project.parent);
  return `<tr role="row" class="directory-row${project.depth?' is-child':''}" data-project-row data-id="${escape(project.id)}" data-name="${escape(project.name)}" data-short-name="${escape(project.shortName || '')}" data-summary="${escape(project.summary)}" data-type="${escape(project.type)}" data-status="${escape(project.status)}" data-parent-name="${escape(parent?.name || '')}"><th scope="row" role="rowheader"><a class="directory-name" href="${root}projects/${project.id}/">${project.depth?'<span class="branch-mark" aria-hidden="true">↳</span>':''}${escape(project.name)} <span class="row-arrow" aria-hidden="true">↗</span></a></th><td role="cell"><span class="mobile-label" aria-hidden="true">Type</span>${escape(project.type)}</td><td role="cell"><span class="mobile-label" aria-hidden="true">Status</span>${status(project.status)}</td><td role="cell"><span class="mobile-label" aria-hidden="true">Part of</span>${parent?`<a class="directory-parent" href="${root}projects/${parent.id}/">${escape(parent.name)}</a>`:'<span class="directory-independent">Independent</span>'}</td></tr>`;
}
export function directory(root, catalog = projects) {
  const types=[...new Set(catalog.map(project=>project.type))];
  const statuses=[...new Set(catalog.map(project=>project.status))];
  return `<div class="directory" data-directory><form class="directory-controls" data-directory-form hidden role="search" aria-label="Search the project directory"><div class="search-field"><label for="project-query">Search projects</label><input id="project-query" name="query" type="search" placeholder="Name or description" autocomplete="off" aria-describedby="directory-help"></div><div><label for="project-type">Type</label><select id="project-type" name="type"><option value="">All types</option>${types.map(type=>`<option value="${escape(typeKey(type))}">${escape(type)}</option>`).join('')}</select></div><div><label for="project-status">Status</label><select id="project-status" name="status"><option value="">All statuses</option>${statuses.map(value=>`<option value="${escape(value)}">${escape(value)}</option>`).join('')}</select></div><button class="directory-reset" type="reset">Reset</button></form><div class="directory-summary"><p id="directory-help">Grouped by parent. Each project has its own page.</p><p data-result-count role="status" aria-live="polite" aria-atomic="true">${catalog.length} projects</p></div><table class="directory-table" role="table"><caption class="visually-hidden">Cosmik project directory</caption><colgroup><col class="col-name"><col class="col-type"><col class="col-status"><col class="col-parent"></colgroup><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Project</th><th scope="col" role="columnheader">Type</th><th scope="col" role="columnheader">Status</th><th scope="col" role="columnheader">Part of</th></tr></thead><tbody role="rowgroup">${groupProjects(catalog).map(project=>directoryRow(project,root,catalog)).join('')}</tbody></table><div class="directory-empty" data-empty hidden><h3>No matching projects.</h3><p>Try a different search or clear the filters.</p><button class="directory-reset" type="button" data-empty-reset>Reset filters</button></div><noscript><p class="directory-noscript">All projects are shown. Search and filters are available with JavaScript enabled.</p></noscript></div>`;
}
export function home() {
  return shell({title:'Cosmik — Independent games, engines & experiments', description:'An independent home for open-source engines, game reimplementations, mods, tools, and original games.', route:'', body: root => `
<section class="hero wrap"><div class="hero-copy">${label('Independent / Open source')}<h1>Made to<br>keep playing<span class="period">.</span></h1><p>New life for classic games.<br>New space for what comes next.</p><a class="button button-primary" href="#projects">Explore the projects <span aria-hidden="true">↓</span></a></div><div class="hero-emblem" aria-hidden="true"><div class="orbit-line orbit-one"></div><div class="orbit-line orbit-two"></div><img src="${root}assets/emblem.svg" width="520" height="520" alt=""><span class="coordinate coordinate-top">COSMIK / LABS</span><span class="coordinate coordinate-bottom">A WORK IN PROGRESS</span></div></section>
<div class="intro-strip wrap"><p>A small, independent home for engines,<br class="desktop-break"> games, and the things built around them.</p><span class="eyebrow">Explore. Rebuild. Create.</span></div>
<section class="catalog-section featured-section" data-theme="light" id="projects"><div class="wrap"><div class="section-heading"><div>${label('01 / Featured project')}<h2>A place to start.</h2></div><a class="text-link" href="${root}projects/">Browse all projects ${forward}</a></div><div class="featured-projects">${projects.filter(project=>project.featured).map(project=>featuredProject(project,root)).join('')}</div></div></section>
<section class="about-teaser wrap"><div>${label('02 / The idea')}<h2>Old favorites.<br>Open horizons.</h2></div><div><p>Cosmik is a home for independent open-source game projects. Reimplementing classic engines and games is part of it. Mods, tools, and original games belong here, too.</p><a class="text-link" href="${root}about/">A little about Cosmik ${forward}</a></div></section>`});
}
export function catalog() {
  return shell({title:'Projects — Cosmik',description:'Explore HPLX, its Redux game projects, and the planned HPLX Editor for HPL2-compatible custom stories.',route:'projects',current:'projects',scripts:['assets/catalog.mjs'],body:root=>`
<section class="page-heading wrap">${label('The project index')}<h1>Room to explore.</h1><p>Engines, games, and ideas at different stages.<br>Start with a project. Follow the connections.</p></section>
<section class="catalog-section catalog-index" data-theme="light"><div class="wrap"><h2 class="visually-hidden">Project directory</h2>${directory(root)}</div></section>
<section class="index-end wrap">${label('An open-ended catalog')}<p>Reimplementations are the starting point.<br>There is room here for mods, tools, and original games.</p><a class="text-link" href="${root}about/">About Cosmik ${forward}</a></section>`});
}
function diagramNode(item, current, root) {
  return `<a class="diagram-node ${item.id===current?'is-current':''}" href="${root}projects/${item.id}/"><span class="eyebrow">${escape(item.type)}</span><strong>${escape(item.name)}</strong><span aria-hidden="true">↗</span><span class="diagram-status">${escape(item.status)}</span></a>`;
}
function connections(project, parent, children, root) {
  if (!parent && !children.length) return '';
  const connector = '<div class="diagram-connector"><span>connected projects</span><span aria-hidden="true">↓</span></div>';
  const diagram = `${parent ? diagramNode(parent, project.id, root) + connector : ''}${diagramNode(project, project.id, root)}${children.length ? connector + `<div class="diagram-children">${children.map(child=>diagramNode(child, project.id, root)).join('')}</div>` : ''}`;
  return `<section class="connection-section" data-theme="light"><div class="wrap connection-layout"><div>${label('Part of the same story')}<h2>${escape(project.connectionHeading || 'Connected projects.')}</h2><p>${escape(project.connectionDescription || 'Explore the projects connected to this work.')}</p></div><div class="relationship-diagram" role="group" aria-label="Project relationships">${diagram}</div></div></section>`;
}
export function projectPage(project, catalog = projects) {
  const children = catalog.filter(item=>item.parent === project.id);
  const parent = catalog.find(item=>item.id === project.parent);
  return shell({title:`${project.name} — Cosmik`,description:project.summary,route:`projects/${project.id}`,current:'projects',body:root=>`
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}projects/">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${escape(project.name)}</span></nav>
<header class="project-heading${project.name.length>20?' has-long-title':''}"><div><div class="project-kicker">${label(escape(project.type))}${status(project.status)}</div><h1>${escape(project.name)}</h1><p>${escape(project.lead)}</p></div><div class="project-index-mark" aria-hidden="true">${project.shortName || project.name}</div></header>
${project.art?`<figure class="project-art"><img src="${root}assets/art/${project.art}" width="900" height="560" alt="${escape(project.artLabel)}"><figcaption>Original visual study. Not a gameplay or engine screenshot.</figcaption></figure>`:''}</div>
<section class="project-information wrap"><div>${label('Overview')}<h2>${escape(project.overviewHeading || project.lead)}</h2></div><div class="project-prose"><p class="lead">${escape(project.description)}</p><p>${escape(project.note)}</p><dl class="project-facts"><div><dt>Focus</dt><dd>${escape(project.focus)}</dd></div><div><dt>Status</dt><dd>${escape(project.status)}</dd></div>${[...(parent?[parent]:[]),...children].map(related=>`<div><dt>${related.id===parent?.id?escape(project.parentRelationship || 'Built on'):'Connected project'}</dt><dd><a href="${root}projects/${related.id}/">${escape(related.name)} ${forward}</a></dd></div>`).join('')}</dl>${project.source?`<a class="button button-primary" href="${escape(project.source)}">View source ${arrow}</a>`:''}</div></section>
${connections(project, parent, children, root)}
<div class="project-bottom wrap"><a class="text-link" href="${root}projects/"><span aria-hidden="true">←</span> Back to all projects</a>${project.legalNote?`<p class="legal-note">${escape(project.legalNote)}</p>`:''}</div>`});
}
export function about() {
  return shell({title:'About — Cosmik',description:'Cosmik is a small, independent home for open-source game projects: engines, reimplementations, mods, tools, and original games.',route:'about',current:'about',body:root=>`
<section class="page-heading wrap about-heading">${label('About Cosmik')}<h1>For the love<br>of the game.</h1><p>A small, independent home for open-source projects.<br>Built around games. Driven by curiosity.</p></section>
<section class="about-body" data-theme="light"><div class="wrap about-body-grid"><img class="about-emblem" src="${root}assets/emblem-ink.svg" width="380" height="380" alt="Cosmik eclipse emblem"><div><h2>A place to keep<br>building.</h2><p>Some projects begin with a question about how an old game works. Others begin with an idea for something new. Cosmik gives them a home.</p><p>The scope is deliberately open: modern reimplementations of classic engines and games, mods, tools, and original games. The catalog starts with HPLX and Amnesia: The Dark Descent Redux, both in development. Amnesia: A Machine for Pigs Redux has a place here too, with work not yet started. HPLX Editor is planned for modders creating HPL2-compatible custom stories.</p><a class="button button-primary" href="${root}projects/">Explore the projects ${forward}</a></div></div></section>
<section class="about-values wrap">${label('The approach')}<div><article><span class="eyebrow">01</span><h2>Build with curiosity.</h2><p>Explore the systems behind games and make room for new ideas.</p></article><article><span class="eyebrow">02</span><h2>Keep it independent.</h2><p>A personal collection of projects, with space for each to find its own direction.</p></article><article><span class="eyebrow">03</span><h2>Share what takes shape.</h2><p>Open-source work, presented with clear context and an honest development status.</p></article></div></section>
<section class="github-cta wrap"><h2>Find Cosmik on GitHub.</h2><a class="text-link" href="https://github.com/cosmik-labs">cosmik-labs ${arrow}</a></section>`});
}
export function notFound() {
  return shell({title:'Page not found — Cosmik',description:'This page could not be found.',route:'',rootOverride:'/',body:root=>`<section class="page-heading wrap not-found">${label('404 / Uncharted space')}<h1>Nothing here.<br>Plenty to explore.</h1><p>This page may have moved, or the address may be incomplete.</p><a class="button button-primary" href="${root}projects/">Explore the projects ${forward}</a></section>`});
}
