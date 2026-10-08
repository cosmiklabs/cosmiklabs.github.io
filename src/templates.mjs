import { legalCopy } from './legal-copy.mjs';
import { families, featuredWork, pillars } from './projects.mjs';
import { resolveFamilyTheme } from './themes.mjs';
export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const arrow = '<svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const external = '<svg class="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const label = text => `<p class="eyebrow">${escape(text)}</p>`;
const status = text => `<span class="status">${escape(text)}</span>`;
const pillarName = id => pillars.find(p => p.id === id)?.name ?? '';
const familyUrl = (root, family) => `${root}projects/${family.id}/`;

/** Public URL is explicit at build time; private previews retain noindex. */
export function shareMetadata({title, description, route, redirect, canonical = true}, siteUrl = process.env.SITE_URL) {
  let urls = '';
  if (siteUrl) {
    const base = new URL(siteUrl);
    if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash)
      throw new Error('SITE_URL must be an HTTPS base URL without credentials, query or fragment.');
    if (!base.pathname.endsWith('/')) base.pathname += '/';
    const page = new URL(redirect ? redirect.split('#')[0] : route ? `${route}/` : '', base);
    if (canonical) urls += `<link rel="canonical" href="${escape(page.href)}"><meta property="og:url" content="${escape(page.href)}">`;
    urls += `<meta property="og:image" content="${escape(new URL('assets/cosmik-512.png', base).href)}"><meta property="og:image:width" content="512"><meta property="og:image:height" content="512"><meta property="og:image:alt" content="Cosmik emblem">`;
  }
  return `<meta property="og:type" content="website"><meta property="og:site_name" content="Cosmik"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#000000">${urls}`;
}

export function shell({ title, description, route, body, current = '', rootOverride = null, redirect = null, familyId = null, canonical = true }) {
  const depth = route.split('/').filter(Boolean).length;
  const root = rootOverride ?? (depth ? '../'.repeat(depth) : './');
  const url = path => root + path;
  const theme = familyId ? resolveFamilyTheme(familyId) : null;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
${shareMetadata({title, description, route, redirect, canonical})}
${process.env.SITE_URL ? '' : '<meta name="robots" content="noindex, nofollow">'}<meta name="color-scheme" content="dark">
${redirect ? `<meta http-equiv="refresh" content="0; url=${escape(url(redirect))}">` : ''}
<link rel="icon" href="${url('assets/cosmik.ico')}" sizes="any">
<link rel="apple-touch-icon" href="${url('assets/cosmik-apple-touch-180.png')}">
<link rel="preload" href="${url('assets/fonts/Inter-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${url('assets/brand-tokens.css')}"><link rel="stylesheet" href="${url('assets/site.css?v=20261008-legal')}">
<link rel="stylesheet" href="${url('assets/family-themes.css')}">
${theme?.stylesheet ? `<link rel="stylesheet" href="${url(theme.stylesheet)}">` : ''}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap">
<a class="brand" href="${url('')}" aria-label="Cosmik home"><img src="${url('assets/emblem.svg')}" width="48" height="48" alt=""><span>Cosmik</span></a>
<nav aria-label="Main navigation"><a href="${url('projects/')}"${current === 'projects' ? ' aria-current="page"' : current === 'family' ? ' aria-current="location"' : ''}>Projects</a><a href="${url('about/')}"${current === 'about' ? ' aria-current="page"' : ''}>About</a><a href="https://github.com/cosmiklabs">GitHub ${external}</a></nav>
</header>
<main id="main" tabindex="-1">${theme ? `<div class="family-content" data-family="${escape(theme.id)}" data-family-theme="${theme.state}">${body(root)}</div>` : body(root)}</main>
<footer class="site-footer wrap"><p>Cosmik<span class="footer-separator" aria-hidden="true"> / </span><span>Independent gaming workshop</span></p><div><a href="${url('privacy/')}">Privacy</a><a href="${url('legal/')}">Legal &amp; Licenses</a><a href="https://github.com/cosmiklabs">GitHub ${external}</a><a href="https://github.com/cosmiklabs/brand">Brand ${external}</a></div></footer>
</body></html>`;
}

export function familyList(root, catalog = families) {
  return `<ul class="family-list">${catalog.map(family => `<li><a class="family-row" href="${familyUrl(root, family)}"><span class="family-row-name">${escape(family.name)}</span><span class="family-row-summary">${escape(family.scope)}<span>${escape(family.summary)}</span></span><span class="family-row-end"><span class="eyebrow">${escape(pillarName(family.pillar))}</span>${status(family.status)}${arrow}</span></a></li>`).join('')}</ul>`;
}

export function home(catalog = families, feature = featuredWork) {
  const family = catalog.find(item => item.id === feature.familyId);
  if (!family) throw new Error('Featured family not found.');
  return shell({ title: 'Cosmik — Independent gaming workshop', description: 'Independent games, mods, tools, and modern reimplementations of classic game technology.', route: '', body: root => `
<section class="home-intro wrap">${label('Independent gaming workshop')}<div><h1>Games, tools,<br>and a little curiosity.</h1><p>Cosmik builds games, mods, tools, and modern reimplementations of classic game technology.</p></div></section>
<section class="pillars wrap" aria-labelledby="pillars-title"><h2 class="section-label" id="pillars-title">What Cosmik does</h2><ul class="pillar-list">${pillars.map(pillar => { const members = catalog.filter(item => item.pillar === pillar.id); return `<li><h3>${escape(pillar.name)}</h3><p>${escape(pillar.summary)}</p>${members.length ? `<p class="pillar-families">${members.map(item => `<a href="${familyUrl(root, item)}">${escape(item.name)}</a>`).join(', ')}</p>` : ''}</li>`; }).join('')}</ul></section>
<section class="featured-work" data-theme="light" aria-labelledby="featured-title" data-featured-family="${escape(family.id)}"><div class="wrap feature-layout">
<div class="feature-main">${label(`Featured work · ${pillarName(family.pillar)}`)}<h2 id="featured-title">${escape(family.name)}</h2><p class="feature-heading">${escape(feature.heading)}</p><p class="feature-description">${escape(feature.description)}</p><a class="button" href="${familyUrl(root, family)}">Explore ${escape(family.name)} ${arrow}</a></div>
<div class="feature-context"><div class="feature-status">${status(family.status)}<span class="eyebrow">A Cosmik project</span></div><div class="family-outline" role="group" aria-label="${escape(family.name)} family overview">${family.groups.map(group => `<div><span class="outline-label">${escape(group.title)}</span><span>${escape(group.items)}</span></div>`).join('')}</div><div class="current-focus">${label(feature.focusLabel)}<h3>${escape(feature.focusTitle)}</h3><p>${escape(feature.focusDescription)}</p></div></div>
</div></section>
<section class="family-section wrap" id="projects" aria-labelledby="families-title"><div class="section-heading"><h2 id="families-title">Project families</h2><a class="text-link" href="${root}projects/">View all projects ${arrow}</a></div>${familyList(root, catalog)}</section>
<section class="home-about wrap"><p>A personal workshop by Matthew Downs.<br>Space to reimagine, extend, and create.</p><a class="text-link" href="${root}about/">About Cosmik ${arrow}</a></section>` });
}

export function catalog(catalog = families) {
  return shell({ title: 'Projects — Cosmik', description: 'Explore Cosmik’s project families. Start with HPLX: its engine, game reimplementations, launcher and planned editor.', route: 'projects', current: 'projects', body: root => `
<section class="page-heading wrap">${label('Projects')}<h1>Find your way in.</h1><p>Related games and tools, together in one place.</p></section>
<section class="family-section directory-section wrap" aria-labelledby="families-title"><h2 class="section-label" id="families-title">Project families</h2>${familyList(root, catalog)}</section>
<section class="directory-note wrap"><p>Cosmik’s work starts with HPLX. There’s room for other games, mods and tools as they take shape.</p></section>` });
}

export function familyPage(family) {
  const theme = resolveFamilyTheme(family.id);
  return shell({ title: `${family.name} — Cosmik`, description: family.description, route: `projects/${family.id}`, current: 'family', familyId: family.id, body: root => `
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}projects/">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${escape(family.name)}</span></nav>
<header class="family-heading"><div>${label(`${pillarName(family.pillar)} · The ${family.name} family`)}${theme.logo ? `<img class="family-logo" src="${root}${theme.logo}" width="240" height="90" alt="">` : ''}<h1>${escape(family.name)}</h1><p class="endorsement">A Cosmik project</p></div><div><h2>Classic games.<br>One connected family.</h2><p>${escape(family.description)}</p>${status(family.status)}</div></header>
<nav class="family-nav" aria-label="On this page"><a href="#games">Games</a><a href="#tools">Engine & tools</a><a href="#development">Development</a></nav></div>
<section class="family-games" data-theme="light" id="games" aria-labelledby="games-title"><div class="wrap section-grid"><div>${label('01 / Games')}<h2 id="games-title">Start with<br>The Dark Descent.</h2></div><div>${family.games.map(game => `<article class="game-detail" id="${escape(game.id)}">${status(game.status)}<h3>${escape(game.name)}</h3><p>${escape(game.description)}</p><details><summary>What works so far ${arrow}</summary><div class="disclosure-body"><p>${escape(game.progress)}</p><p>Windows is the only platform verified so far. This is development progress, not a public release.</p></div></details></article>`).join('')}</div></div></section>
<section class="family-tools wrap section-grid" id="tools" aria-labelledby="tools-title"><div>${label('02 / Engine & tools')}<h2 id="tools-title">The rest<br>of the family.</h2></div><div class="tool-list">${family.tools.map(tool => `<article class="tool-row" id="${escape(tool.id)}"><div class="tool-title"><h3>${escape(tool.name)}</h3>${status(tool.status)}</div><p>${escape(tool.description)}</p></article>`).join('')}</div></section>
<section class="family-development" data-theme="light" id="development" aria-labelledby="development-title"><div class="wrap section-grid"><div>${label('03 / Development')}<h2 id="development-title">Where things stand.</h2></div><div class="development-copy"><p class="development-lead">HPLX is in active development. There’s no public release or download yet.</p><p>The engine, The Dark Descent and the launcher are being developed together. The current focus is HPL2; broader compatibility is future work.</p><details class="future-plans" id="future"><summary>Further ahead ${arrow}</summary><div class="disclosure-body">${family.future.map(item => `<article id="${escape(item.id)}"><h3>${escape(item.name)}</h3><p>${escape(item.detail)}</p></article>`).join('')}<p>No release dates are announced for these projects.</p></div></details></div></div></section>
<div class="family-bottom wrap"><a class="text-link" href="${root}projects/">${arrow} All project families</a><p class="legal-note">Independent reimplementations, unaffiliated with the original creators. Original game content is not distributed here. Game names, assets and credits belong to their respective owners; code and assets retain their own licenses.</p></div>` });
}

export function about() {
  return shell({ title: 'About — Cosmik', description: 'Cosmik is Matthew Downs’s independent open-source gaming workshop.', route: 'about', current: 'about', body: root => `
<section class="page-heading wrap">${label('About Cosmik')}<h1>An independent<br>gaming workshop.</h1><p>A personal project by Matthew Downs.</p></section>
<section class="about-content" data-theme="light"><div class="wrap section-grid"><h2>A place to make things.</h2><div><p class="about-lead">Cosmik is an independent open-source gaming workshop, building games, mods, tools, and modern reimplementations of classic game technology.</p><p>It’s a home for related work, with room for each project to have its own purpose. HPLX is the first family: the engine, game reimplementations, launcher and planned editing tools.</p><a class="text-link" href="${root}projects/">Explore the projects ${arrow}</a></div></div></section>
<section class="about-approach wrap" aria-label="Areas of work">${pillars.map((pillar, i) => `<article>${label(`0${i+1}`)}<h2>${escape(pillar.name)}</h2><p>${escape(pillar.summary)}</p></article>`).join('')}</section>
<section class="about-links wrap"><p>Follow what takes shape.</p><a class="text-link" href="https://github.com/cosmiklabs">Cosmik on GitHub ${external}</a></section>` });
}

export function legacyPage(legacy) {
  const target = `projects/${legacy.familyId}/#${legacy.fragment}`;
  return shell({title: `${legacy.name} — HPLX — Cosmik`, description: `${legacy.name} is part of the HPLX family.`, route:`projects/${legacy.id}`, redirect: target, current: 'family', familyId: legacy.familyId, body: root => `<section class="page-heading wrap"><h1>Part of HPLX.</h1><p>${escape(legacy.name)} now lives with the rest of the family.</p><a class="button" href="${root}${target}">Continue to ${escape(legacy.name)} ${arrow}</a></section>`});
}

export function notFound() {
  return shell({title:'Page not found — Cosmik', description:'This page could not be found.', route:'', rootOverride:'/', canonical:false, body: root => `<section class="page-heading wrap not-found">${label('404')}<h1>Page not found.</h1><p>The address may have changed. You can find the current work in Projects.</p><a class="button" href="${root}projects/">Explore projects ${arrow}</a></section>`});
}


export function legalPage(kind) {
  const privacy = kind === 'privacy';
  const title = privacy ? 'Privacy' : 'Legal & Licenses';
  const entries = legalCopy[privacy ? 'Privacy' : 'Legal and Licenses'];
  const description = privacy ? 'How information is handled when you visit cosmiklabs.org or contact Cosmik.' : 'Project independence, software licenses, original game assets and Cosmik branding.';
  const renderEntry = entry => {
    if (entry.style === 'Heading 2') return `<h2>${escape(entry.text)}</h2>`;
    let text = escape(entry.text);
    for (const link of entry.links) text = text.replace(escape(link.text), `<a href="${escape(link.url)}">${escape(link.text)}</a>`);
    text = text.replaceAll('legal@cosmiklabs.org', '<a href="mailto:legal@cosmiklabs.org">legal@cosmiklabs.org</a>');
    return `<p>${text}</p>`;
  };
  return shell({ title: `${title} — Cosmik`, description, route: kind, body: () => `
<article class="legal-page wrap"><header class="page-heading">${label('Cosmik')}<h1>${escape(title)}</h1><p>${escape(entries[0].text)}</p></header>
<div class="legal-copy">${entries.slice(1).map(renderEntry).join('\n')}${privacy ? '' : '<p><a href="https://github.com/cosmiklabs/brand/blob/main/LICENSE.md">Brand licensing and usage terms</a></p>'}</div></article>` });
}
