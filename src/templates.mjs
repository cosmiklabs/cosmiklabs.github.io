import { projects } from './projects.mjs';
export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<span aria-hidden="true">↗</span>';
const forward = '<span aria-hidden="true">↗</span>';
const label = text => `<p class="eyebrow">${text}</p>`;
const status = text => `<span class="status"><span aria-hidden="true" class="status-dot"></span>${escape(text)}</span>`;
export function shell({title, description, route, body, current = '', rootOverride = null}) {
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
</body></html>`;
}
export function card(project, root, index, catalog = projects) {
  const parent = catalog.find(item => item.id === project.parent);
  const children = catalog.filter(item => item.parent === project.id);
  return `<article class="project-card"><a class="card-image" href="${root}projects/${project.id}/" aria-label="Explore ${escape(project.name)}"><img src="${root}assets/art/${project.art}" width="900" height="560" alt="${escape(project.artLabel)}" loading="lazy"><span class="image-index" aria-hidden="true">0${index+1} / ${project.shortName || project.name}</span><span class="image-arrow" aria-hidden="true">↗</span></a><div class="card-meta"><span class="eyebrow">${escape(project.type)}</span>${status(project.status)}</div><h3><a href="${root}projects/${project.id}/">${escape(project.name)}</a></h3><p>${escape(project.summary)}</p>${parent ? `<a class="relationship" href="${root}projects/${parent.id}/"><span aria-hidden="true">↳</span> Built on ${escape(parent.name)}</a>` : children.map(child => `<a class="relationship" href="${root}projects/${child.id}/"><span aria-hidden="true">↳</span> Foundation for ${escape(child.name)}</a>`).join('')}</article>`;
}
export function home() {
  return shell({title:'Cosmik — Independent games, engines & experiments', description:'An independent home for open-source engines, game reimplementations, mods, tools, and original games.', route:'', body: root => `
<section class="hero wrap"><div class="hero-copy">${label('Independent / Open source')}<h1>Made to<br>keep playing<span class="period">.</span></h1><p>New life for classic games.<br>New space for what comes next.</p><a class="button button-primary" href="#projects">Explore the projects <span aria-hidden="true">↓</span></a></div><div class="hero-emblem" aria-hidden="true"><div class="orbit-line orbit-one"></div><div class="orbit-line orbit-two"></div><img src="${root}assets/emblem.svg" width="520" height="520" alt=""><span class="coordinate coordinate-top">COSMIK / LABS</span><span class="coordinate coordinate-bottom">A WORK IN PROGRESS</span></div></section>
<div class="intro-strip wrap"><p>A small, independent home for engines,<br class="desktop-break"> games, and the things built around them.</p><span class="eyebrow">Explore. Rebuild. Create.</span></div>
<section class="catalog-section" data-theme="light" id="projects"><div class="wrap"><div class="section-heading"><div>${label('01 / The projects')}<h2>Taking shape.</h2></div><a class="text-link" href="${root}projects/">Project index ${forward}</a></div><div class="project-grid">${projects.map((p,i)=>card(p,root,i)).join('')}</div><p class="catalog-note">Every project has its own place to grow.</p></div></section>
<section class="about-teaser wrap"><div>${label('02 / The idea')}<h2>Old favorites.<br>Open horizons.</h2></div><div><p>Cosmik is a home for independent open-source game projects. Reimplementing classic engines and games is part of it. Mods, tools, and original games belong here, too.</p><a class="text-link" href="${root}about/">A little about Cosmik ${forward}</a></div></section>`});
}
export function catalog() {
  return shell({title:'Projects — Cosmik',description:'Explore HPLX and The Dark Descent: two connected projects in the Cosmik catalog.',route:'projects',current:'projects',body:root=>`
<section class="page-heading wrap">${label('The project index')}<h1>Room to explore.</h1><p>Engines, games, and ideas in progress.<br>Start with a project. Follow the connections.</p></section>
<section class="catalog-section catalog-index" data-theme="light"><div class="wrap"><div class="index-heading"><h2>Current projects <span class="count">${String(projects.length).padStart(2,'0')}</span></h2><p>${projects.length} projects</p></div><div class="project-grid">${projects.map((p,i)=>card(p,root,i)).join('')}</div></div></section>
<section class="index-end wrap">${label('An open-ended catalog')}<p>Reimplementations are the starting point.<br>There is room here for mods, tools, and original games.</p><a class="text-link" href="${root}about/">About Cosmik ${forward}</a></section>`});
}
function diagramNode(item, current, root) {
  return `<a class="diagram-node ${item.id===current?'is-current':''}" href="${root}projects/${item.id}/"><span class="eyebrow">${escape(item.type)}</span><strong>${escape(item.name)}</strong><span aria-hidden="true">↗</span></a>`;
}
function connections(project, parent, children, root) {
  if (!parent && !children.length) return '';
  const connector = '<div class="diagram-connector"><span>foundation for</span><span aria-hidden="true">↓</span></div>';
  const diagram = `${parent ? diagramNode(parent, project.id, root) + connector : ''}${diagramNode(project, project.id, root)}${children.length ? connector + `<div class="diagram-children">${children.map(child=>diagramNode(child, project.id, root)).join('')}</div>` : ''}`;
  return `<section class="connection-section" data-theme="light"><div class="wrap connection-layout"><div>${label('Part of the same story')}<h2>${escape(project.connectionHeading || 'Connected projects.')}</h2><p>${escape(project.connectionDescription || 'Explore the projects connected to this work.')}</p></div><div class="relationship-diagram" role="group" aria-label="Project relationships">${diagram}</div></div></section>`;
}
export function projectPage(project, catalog = projects) {
  const children = catalog.filter(item=>item.parent === project.id);
  const parent = catalog.find(item=>item.id === project.parent);
  return shell({title:`${project.name} — Cosmik`,description:project.summary,route:`projects/${project.id}`,current:'projects',body:root=>`
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}projects/">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${escape(project.name)}</span></nav>
<header class="project-heading"><div><div class="project-kicker">${label(escape(project.type))}${status(project.status)}</div><h1>${escape(project.name)}</h1><p>${escape(project.lead)}</p></div><div class="project-index-mark" aria-hidden="true">${project.shortName || project.name}</div></header>
<figure class="project-art"><img src="${root}assets/art/${project.art}" width="900" height="560" alt="${escape(project.artLabel)}"><figcaption>Original visual study. Not a gameplay or engine screenshot.</figcaption></figure></div>
<section class="project-information wrap"><div>${label('Overview')}<h2>${escape(project.overviewHeading || project.lead)}</h2></div><div class="project-prose"><p class="lead">${escape(project.description)}</p><p>${escape(project.note)}</p><dl class="project-facts"><div><dt>Focus</dt><dd>${escape(project.focus)}</dd></div><div><dt>Status</dt><dd>${escape(project.status)}</dd></div>${[...(parent?[parent]:[]),...children].map(related=>`<div><dt>${related.id===parent?.id?'Built on':'Connected project'}</dt><dd><a href="${root}projects/${related.id}/">${escape(related.name)} ${forward}</a></dd></div>`).join('')}</dl>${project.source?`<a class="button button-primary" href="${escape(project.source)}">View source ${arrow}</a>`:''}</div></section>
${connections(project, parent, children, root)}
<div class="project-bottom wrap"><a class="text-link" href="${root}projects/"><span aria-hidden="true">←</span> Back to all projects</a>${project.legalNote?`<p class="legal-note">${escape(project.legalNote)}</p>`:''}</div>`});
}
export function about() {
  return shell({title:'About — Cosmik',description:'Cosmik is a small, independent home for open-source game projects: engines, reimplementations, mods, tools, and original games.',route:'about',current:'about',body:root=>`
<section class="page-heading wrap about-heading">${label('About Cosmik')}<h1>For the love<br>of the game.</h1><p>A small, independent home for open-source projects.<br>Built around games. Driven by curiosity.</p></section>
<section class="about-body" data-theme="light"><div class="wrap about-body-grid"><img class="about-emblem" src="${root}assets/emblem-ink.svg" width="380" height="380" alt="Cosmik eclipse emblem"><div><h2>A place to keep<br>building.</h2><p>Some projects begin with a question about how an old game works. Others begin with an idea for something new. Cosmik gives them a home.</p><p>The scope is deliberately open: modern reimplementations of classic engines and games, mods, tools, and original games. The catalog starts with HPLX and The Dark Descent, and can grow one real project at a time.</p><a class="button button-primary" href="${root}projects/">Explore the projects ${forward}</a></div></div></section>
<section class="about-values wrap">${label('The approach')}<div><article><span class="eyebrow">01</span><h2>Build with curiosity.</h2><p>Explore the systems behind games and make room for new ideas.</p></article><article><span class="eyebrow">02</span><h2>Keep it independent.</h2><p>A personal collection of projects, with space for each to find its own direction.</p></article><article><span class="eyebrow">03</span><h2>Share what takes shape.</h2><p>Open-source work, presented with clear context and an honest development status.</p></article></div></section>
<section class="github-cta wrap"><h2>Find Cosmik on GitHub.</h2><a class="text-link" href="https://github.com/cosmik-labs">cosmik-labs ${arrow}</a></section>`});
}
export function notFound() {
  return shell({title:'Page not found — Cosmik',description:'This page could not be found.',route:'',rootOverride:'/',body:root=>`<section class="page-heading wrap not-found">${label('404 / Uncharted space')}<h1>Nothing here.<br>Plenty to explore.</h1><p>This page may have moved, or the address may be incomplete.</p><a class="button button-primary" href="${root}projects/">Explore the projects ${forward}</a></section>`});
}
