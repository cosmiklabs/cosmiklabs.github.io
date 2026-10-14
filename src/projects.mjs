/** Areas of work; family destinations remain independent of homepage emphasis. */
export const pillars = [
  {id:'reimagine', name:'Reimagine', summary:'Modern reimplementations of games and engines with released source code.'},
  {id:'extend', name:'Extend', summary:'Mods and tools that build on existing games.'},
  {id:'create', name:'Create', summary:'Original games and experiments.'},
];

/** Family destinations are stable. Featured work is an independent editorial choice. */
export const families = [
  {
    id: 'hplx', name: 'HPLX', pillar: 'reimagine', status: 'In development',
    summary: 'Amnesia and Penumbra, rebuilt with a shared engine and tools.',
    scope: 'Engine, game reimplementations, app and editor',
    description: 'HPLX is an independent, modern reimplementation of the HPL engine family, designed to run the original games using assets from the player’s retail installation. The Dark Descent, A Machine for Pigs and the Penumbra series belong to one family, alongside the shared engine, desktop app and planned editor.',
    groups: [
      { title: 'Play', items: 'game reimplementations' },
      { title: 'Build', items: 'Engine & planned editor' },
      { title: 'Manage', items: 'Desktop app' },
    ],
    games: [
      {
        id: 'tdd', name: 'Amnesia: The Dark Descent', shortName: 'The Dark Descent', status: 'In development',
        description: 'The first game reimplementation in the HPLX family. It requires a legitimately obtained local retail installation of the original game and uses its assets with the HPLX engine. Original game assets are never bundled with HPLX.',
        progress: 'Menus, saves and custom-story launching are implemented. Full campaign playthroughs, menu validation and visual comparisons with the original game are still in progress.',
      },
      {
        id: 'amfp', name: 'Amnesia: A Machine for Pigs', shortName: 'A Machine for Pigs', status: 'In development',
        description: 'The second Amnesia reimplementation in HPLX, sharing the engine and common systems with The Dark Descent while preserving its own gameplay and atmosphere.',
        progress: 'The campaign’s maps and scripts run in development tests. A full campaign playthrough and visual checks are still ahead.',
      },
      {
        id: 'penumbra', name: 'Penumbra series', shortName: 'Penumbra', status: 'Early development',
        description: 'Work has begun on bringing Penumbra to HPLX, starting with Overture and HPL1 compatibility. Black Plague and Requiem are planned to follow.',
        progress: 'The first goal is loading Overture’s original maps and assets. Playable support and campaign validation are later milestones.',
      },
    ],
    tools: [
      { id: 'engine', name: 'HPLX Engine', status: 'In development', description: 'The shared foundation for game reimplementations. HPL2 work supports both Amnesia projects; early HPL1 work is extending the family toward Penumbra.' },
      { id: 'app', name: 'HPLX App', status: 'In development', description: 'A desktop home for HPLX games: your library, saves, custom stories and downloads in one place. Game-copy discovery, saves, installed custom stories and package management are implemented. End-to-end desktop validation is still in progress.' },
      { id: 'editor', name: 'HPLX Editor', status: 'Planned', description: 'Editing tools are planned within each HPLX game, with in-viewport playtesting. The editor is not built yet.' },
    ],
    future: [
      { id: 'hpl3', name: 'HPL3 games', detail: 'A possible longer-term direction, not a commitment or a claim of current support.' },
    ],
  },
];

export const featuredWork = {
  familyId: 'hplx',
  heading: 'Classic games. New foundations.',
  description: 'An engine, game reimplementations and the tools around them. Explore the HPLX family: Amnesia: The Dark Descent, Amnesia: A Machine for Pigs and the Penumbra series.',
  focusLabel: 'A growing family',
  focusTitle: 'Amnesia & Penumbra',
  focusDescription: 'Both Amnesia games are in development. Penumbra work has begun, starting with Overture.',
};

/** Old individual-project URLs retain a route into their context in the family. */
const hplx = families.find(family => family.id === 'hplx');
export const legacyRoutes = [
  { id: 'tdd', familyId: 'hplx', fragment: 'tdd', name: hplx.games.find(game => game.id === 'tdd').shortName },
  { id: 'amfp', familyId: 'hplx', fragment: 'amfp', name: hplx.games.find(game => game.id === 'amfp').name },
  { id: 'hplx-editor', familyId: 'hplx', fragment: 'editor', name: hplx.tools.find(tool => tool.id === 'editor').name },
];

export function validateContent(catalog = families, feature = featuredWork) {
  const ids = new Set();
  for (const family of catalog) {
    if (!/^[a-z0-9-]+$/.test(family.id) || ids.has(family.id)) throw new Error('Family IDs must be unique URL-safe names.');
    if (!family.name || !family.summary || !family.status) throw new Error('Each family needs a name, summary and status.');
    if (!pillars.some(p => p.id === family.pillar)) throw new Error('Each family needs a known pillar.');
    ids.add(family.id);
  }
  if (!ids.has(feature.familyId)) throw new Error('Featured work must belong to an existing family.');
}
