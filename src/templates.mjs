import { assetUrl } from './assets.mjs';
import { retailGames } from './retail-links.mjs';
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
<html lang="en" data-theme="dark" data-motion="system">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
${shareMetadata({title, description, route, redirect, canonical})}
${process.env.SITE_URL ? '' : '<meta name="robots" content="noindex, nofollow">'}<meta name="color-scheme" content="dark">
${redirect ? `<meta http-equiv="refresh" content="0; url=${escape(url(redirect))}">` : ''}
<link rel="icon" href="${url('assets/cosmik.ico')}" sizes="any">
<link rel="apple-touch-icon" href="${url('assets/cosmik-apple-touch-180.png')}">
<link rel="preload" href="${url('assets/fonts/Inter-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assetUrl(root, 'assets/brand-tokens.css')}"><link rel="stylesheet" href="${assetUrl(root, 'assets/site.css')}">
<link rel="stylesheet" href="${assetUrl(root, 'assets/family-themes.css')}">
${theme?.stylesheet ? `<link rel="stylesheet" href="${assetUrl(root, theme.stylesheet)}">` : ''}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header wrap">
<a class="brand" href="${url('')}" aria-label="Cosmik home"><img src="${url('assets/emblem.svg')}" width="48" height="48" alt=""><span>Cosmik</span></a>
<nav aria-label="Main navigation"><a href="${url('projects/')}"${current === 'projects' ? ' aria-current="page"' : current === 'family' ? ' aria-current="location"' : ''}>Projects</a><a href="${url('about/')}"${current === 'about' ? ' aria-current="page"' : ''}>About</a><a href="https://github.com/cosmiklabs">GitHub ${external}</a></nav>
</header>
<main id="main" tabindex="-1">${theme ? `<div class="family-content" data-family="${escape(theme.id)}" data-family-theme="${theme.state}">${body(root)}</div>` : body(root)}</main>
<footer class="site-footer wrap"><label class="motion-preference" hidden>Motion <select aria-label="Motion preference"><option value="system">System</option><option value="reduce">Reduce</option><option value="full">Full</option></select></label><p>Cosmik<span class="footer-separator" aria-hidden="true"> / </span><span>Independent software studio</span></p><div><a href="${url('privacy/')}">Privacy</a><a href="${url('legal/')}">Legal &amp; Licenses</a><a href="https://github.com/cosmiklabs">GitHub ${external}</a><a href="https://github.com/cosmiklabs/brand">Brand ${external}</a></div></footer>
<script type="module" src="${assetUrl(root, 'assets/preferences.mjs')}"></script>
</body></html>`;
}

export function familyList(root, catalog = families) {
  return `<ul class="family-list">${catalog.map(family => `<li><a class="family-row" href="${familyUrl(root, family)}"><span class="family-row-name">${family.id === 'hplx' ? `<img class="family-row-symbol family-row-symbol-hplx" src="${root}assets/families/hplx/hplx-glimmer-white.svg" width="32" height="32" alt="">` : family.id === 'tectra' ? `<img class="family-row-symbol" src="${root}assets/families/tectra/tectra-latch-white.svg" width="32" height="32" alt="">` : ''}${escape(family.name)}</span><span class="family-row-summary">${escape(family.scope)}<span>${escape(family.summary)}</span></span><span class="family-row-end"><span class="eyebrow">${escape(pillarName(family.pillar))}</span>${status(family.status)}${arrow}</span></a></li>`).join('')}</ul>`;
}

export function home(catalog = families, feature = featuredWork) {
  const family = catalog.find(item => item.id === feature.familyId);
  if (!family) throw new Error('Featured family not found.');
  return shell({ title: 'Cosmik — Independent software studio', description: 'Cosmik is an independent software studio. Explore Tectra for creating 3D structures and HPLX for creating custom stories.', route: '', body: root => `
<section class="home-intro wrap">${label('Independent software studio')}<div><h1>Independent projects.<br>Room to create.</h1><p>Cosmik is an independent software studio, home to projects with their own purpose and direction. Explore Tectra for creating structures and HPLX for creating custom stories.</p></div></section>
<section class="featured-work" data-theme="light" aria-labelledby="featured-title" data-featured-family="${escape(family.id)}"><div class="wrap feature-layout">
<div class="feature-main">${label(`Featured work · ${pillarName(family.pillar)}`)}<h2 id="featured-title">${escape(family.name)}</h2><p class="feature-heading">${escape(feature.heading)}</p><p class="feature-description">${escape(feature.description)}</p><a class="button" href="${familyUrl(root, family)}">Explore ${escape(family.name)} ${arrow}</a></div>
<div class="feature-context"><div class="feature-status">${status(family.status)}<span class="eyebrow">A Cosmik project</span></div><div class="family-outline" role="group" aria-label="${escape(family.name)} project overview">${(family.groups ?? []).map(group => `<div><span class="outline-label">${escape(group.title)}</span><span>${escape(group.items)}</span></div>`).join('')}</div><div class="current-focus">${label(feature.focusLabel)}<h3>${escape(feature.focusTitle)}</h3><p>${escape(feature.focusDescription)}</p></div></div>
</div></section>
<section class="family-section wrap" id="projects" aria-labelledby="families-title"><div class="section-heading"><h2 id="families-title">Projects</h2><a class="text-link" href="${root}projects/">View all projects ${arrow}</a></div>${familyList(root, [family, ...catalog.filter(item => item.id !== family.id)])}</section>
<section class="home-about wrap"><p>An independent studio.<br>Different tools, each with a purpose.</p><a class="text-link" href="${root}about/">About Cosmik ${arrow}</a></section>` });
}

export function catalog(catalog = families) {
  return shell({ title: 'Projects — Cosmik', description: 'Explore Tectra for creating 3D structures and HPLX for creating custom stories for the original Amnesia: The Dark Descent.', route: 'projects', current: 'projects', body: root => `
<section class="page-heading wrap">${label('Projects')}<h1>Find your way in.</h1><p>Each project has its own purpose, tools and direction.</p></section>
<section class="family-section directory-section wrap" aria-labelledby="families-title"><h2 class="section-label" id="families-title">Projects</h2>${familyList(root, catalog)}</section>
<section class="directory-note wrap"><p>Tectra and HPLX are in development. Their project pages explain the direction of each project and where it stands.</p></section>` });
}

export function retailLinks(id) {
  const game = retailGames[id];
  if (!game) return '';
  return `<p class="retail-links"><strong>${escape(game.label)}:</strong> ${game.stores.map(store => `<a href="${escape(store.url)}" aria-label="${escape(game.name)} on ${escape(store.name)}">${escape(store.name)}</a>`).join(' · ')}</p>`;
}

/** Every family uses this shell; only its content sections are optional. */
export function familyPage(family) {
  const theme = resolveFamilyTheme(family.id);
  return shell({ title: `${family.name} — Cosmik`, description: family.description, route: `projects/${family.id}`, current: 'family', familyId: family.id, body: root => `
<div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${root}projects/">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${escape(family.name)}</span></nav>
${familyHeading(family, theme, root)}</div>
${family.id === 'hplx' ? hplxSections(family, root) : ''}
<div class="family-bottom wrap"><a class="text-link" href="${root}projects/">${arrow} All projects</a>${family.legalNote ? `<p class="legal-note">${escape(family.legalNote)}</p>` : ''}</div>` });
}

export function familyHeading(family, theme, root) {
  return `<header class="family-heading"><div>${label(`${pillarName(family.pillar)} · The ${family.name} project`)}<div class="family-identity">${theme.logo ? `<img class="family-logo" src="${root}${theme.logo}" width="64" height="64" alt="">` : '<span class="family-logo" aria-hidden="true"></span>'}<h1>${escape(family.name)}</h1><p class="endorsement">A Cosmik project</p></div></div><div class="family-introduction"><h2>${family.heading.map(escape).join('<br>')}</h2><p>${escape(family.description)}</p>${family.slogan ? `<p>${escape(family.slogan)}</p>` : ''}${status(family.status)}</div></header>`;
}

function hplxSections(family, root) {
 return `<div class="wrap">
<section class="family-tools section-grid" aria-labelledby="requirements-title"><div>${label('Before you start')}<h2 id="requirements-title">Your game.<br>Your story.</h2></div><div class="legal-copy"><p>HPLX requires a legitimately obtained local retail installation of the original game. Original game assets are never bundled or distributed with HPLX.</p><p>Cosmik Labs does not, and never will, require payment to use HPLX. The original retail game is separate and may cost money.</p><p>The storefront links below are for the original PC game. HPLX needs local PC game files; a console copy does not provide them. Individual store builds have not all been tested with HPLX.</p><p>Cosmik Labs and HPLX are independent and unofficial. They are not affiliated with, sponsored by, or endorsed by <a href="https://frictionalgames.com/">Frictional Games</a>. The original engines, games, source code and assets remain the property of Frictional Games and their respective rights holders. <a href="${root}legal/">Read Legal &amp; Licenses</a>.</p></div></section>
<nav class="family-nav" aria-label="On this page"><a href="#make">The editor</a><a href="#game">Built-in playtesting</a><a href="#development">Development</a></nav></div>
<section class="family-games" data-theme="light" id="make" aria-labelledby="make-title"><div class="wrap section-grid"><div>${label('01 / The editor')}<h2 id="make-title">Build it.<br>Playtest it.<br>Keep creating.</h2></div><div>${family.tools.filter(tool => tool.progress).map(tool => `<article class="game-detail" id="${escape(tool.id)}">${status(tool.status)}<h3>${escape(tool.name)}</h3><p>${escape(tool.description)}</p><details><summary>Where it stands ${arrow}</summary><div class="disclosure-body"><p>${escape(tool.progress)}</p></div></details></article>`).join('')}</div></div></section>
<section class="family-tools wrap section-grid" id="game" aria-labelledby="game-title"><div>${label('02 / Built-in playtesting')}<h2 id="game-title">The Dark Descent,<br>underneath.</h2></div><div>${family.games.map(game => `<article class="game-detail" id="${escape(game.id)}">${status(game.status)}<h3>${escape(game.name)}</h3><p>${escape(game.description)}</p>${retailLinks(game.id)}</article>`).join('')}<div class="tool-list">${family.tools.filter(tool => !tool.progress).map(tool => `<article class="tool-row" id="${escape(tool.id)}"><div class="tool-title"><h3>${escape(tool.name)}</h3>${status(tool.status)}</div><p>${escape(tool.description)}</p></article>`).join('')}</div></section>
<section class="family-development" data-theme="light" id="development" aria-labelledby="development-title"><div class="wrap section-grid"><div>${label('03 / Development')}<h2 id="development-title">Where things stand.</h2></div><div class="development-copy"><p class="development-lead">HPLX is in active development. There’s no public release or download yet.</p><p>The editor and its reimplementation are being developed together, entirely around creating custom stories for the original Amnesia: The Dark Descent. The focus is making that process easier and better.</p><p>HPLX is intended to be open source. Its product repositories are not public yet.</p><p>No release date has been announced.</p></div></div></section>
`;
}


export function about() {
  return shell({ title: 'About — Cosmik', description: 'Cosmik is an independent software studio making creative tools.', route: 'about', current: 'about', body: root => `
<section class="page-heading wrap">${label('About Cosmik')}<h1>An independent<br>software studio.</h1><p>Creative tools, with room for different approaches.</p></section>
<section class="about-content" data-theme="light"><div class="wrap section-grid"><h2>Each project has a purpose.</h2><div><p class="about-lead">Cosmik develops creative software that helps people make things.</p><p>Tectra helps people develop 3D structures with AI assistance. HPLX is an editor for Amnesia: The Dark Descent’s custom stories, intended to be open source.</p><p>Both projects are in development. Their project pages explain the direction of the work and where it stands.</p><a class="text-link" href="${root}projects/">Explore the projects ${arrow}</a></div></div></section>
<section class="about-links wrap"><p>Public work and brand resources.</p><a class="text-link" href="https://github.com/cosmiklabs">Cosmik on GitHub ${external}</a></section>` });
}

export function legacyPage(legacy) {
  if (legacy.renamed) {
    const target = `projects/${legacy.familyId}/`;
    return shell({title: `Continue to ${legacy.name} — Cosmik`, description: `Continue to ${legacy.name}.`, route:`projects/${legacy.id}`, redirect: target, current:'family', familyId:legacy.familyId, body: root => `<section class="page-heading wrap"><h1>Continue to ${escape(legacy.name)}.</h1><p>This project has a new name and address.</p><a class="button" href="${root}${target}">Visit ${escape(legacy.name)} ${arrow}</a></section>`});
  }
  const target = `projects/${legacy.familyId}/#${legacy.fragment}`;
  return shell({title: `${legacy.name} — HPLX — Cosmik`, description: `${legacy.name} is part of the HPLX project.`, route:`projects/${legacy.id}`, redirect: target, current: 'family', familyId: legacy.familyId, body: root => `<section class="page-heading wrap"><h1>Part of HPLX.</h1><p>${escape(legacy.name)} now lives on the HPLX project page.</p><a class="button" href="${root}${target}">Continue to ${escape(legacy.name)} ${arrow}</a></section>`});
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
