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
    summary: 'Classic games, rebuilt with a shared engine and tools.',
    scope: 'Engine, game reimplementations, launcher and editor',
    description: 'HPLX brings a modern engine, game reimplementations, a launcher and a planned editor into one family. Work starts with HPL2 and Amnesia: The Dark Descent.',
    groups: [
      { title: 'Play', items: 'game reimplementations' },
      { title: 'Build', items: 'Engine & planned editor' },
      { title: 'Manage', items: 'Launcher' },
    ],
    games: [
      {
        id: 'tdd', name: 'Amnesia: The Dark Descent', shortName: 'The Dark Descent', status: 'In development',
        description: 'The first game reimplementation in the HPLX family. It uses your existing game content with a new runtime built on the HPLX engine.',
        progress: 'Menus, saves and custom-story launching are implemented. The opening campaign sections have been playtested; later campaign checks, menu validation and lighting comparisons are still in progress.',
      },
    ],
    tools: [
      { id: 'engine', name: 'HPLX Engine', status: 'In development', description: 'The shared foundation for game reimplementations. Current work focuses on HPL2 formats and the runtime systems needed by The Dark Descent.' },
      { id: 'launcher', name: 'HPLX Launcher', status: 'In development', description: 'A desktop home for HPLX games. Game-copy discovery, saves, installed custom stories and package management are implemented. End-to-end desktop validation is still in progress.' },
      { id: 'editor', name: 'HPLX Editor', status: 'Planned', description: 'Editing tools are planned within each HPLX game, with in-viewport playtesting. The editor is not built yet.' },
    ],
    future: [
      { id: 'amfp', name: 'Amnesia: A Machine for Pigs', detail: 'A future game reimplementation. Work has not started.' },
      { id: 'penumbra', name: 'Penumbra & HPL1', detail: 'A future direction for the family, beyond the current HPL2 work.' },
    ],
  },
];

export const featuredWork = {
  familyId: 'hplx',
  heading: 'Classic games. New foundations.',
  description: 'An engine, game reimplementations and the tools around them. Explore the HPLX family, starting with Amnesia: The Dark Descent.',
  focusLabel: 'Current focus',
  focusTitle: 'The Dark Descent',
  focusDescription: 'Bringing the first game and its engine forward together.',
};

/** Old individual-project URLs retain a route into their context in the family. */
const hplx = families.find(family => family.id === 'hplx');
export const legacyRoutes = [
  { id: 'tdd', familyId: 'hplx', fragment: 'tdd', name: hplx.games.find(game => game.id === 'tdd').shortName },
  { id: 'amfp', familyId: 'hplx', fragment: 'future', name: hplx.future.find(game => game.id === 'amfp').name },
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
