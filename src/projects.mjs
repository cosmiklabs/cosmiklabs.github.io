/** Areas of work; family destinations remain independent of homepage emphasis. */
export const pillars = [
  {id:'stories', name:'Story creation', summary:'Tools for making playable stories.'},
];

/** Family destinations are stable. Featured work is an independent editorial choice. */
export const families = [
  {
    id: 'hplx', name: 'HPLX', pillar: 'stories', status: 'In development',
    summary: 'Make custom stories for The Dark Descent, and play them as you build.',
    scope: 'An editor for Amnesia: The Dark Descent’s custom stories',
    description: 'HPLX makes creating custom stories for Amnesia: The Dark Descent easier and better. Its editor plays your story right inside it, on a faithful reimplementation of the game that uses the files from your own copy.',
    groups: [
      { title: 'Build', items: 'Your story, in the editor' },
      { title: 'Play', items: 'Your story, without leaving the editor' },
      { title: 'Share', items: 'The game’s own files, for every player' },
    ],
    games: [
      {
        id: 'tdd', name: 'Amnesia: The Dark Descent', shortName: 'The Dark Descent', status: 'In development',
        description: 'The game underneath the editor: a reimplementation of The Dark Descent, as close to the original in look and behavior as we can make it, so a playtest shows what your players will see. It uses the files from your own copy of the game, which are never bundled with HPLX, and it runs on its own too.',
        progress: 'Menus, saves and custom-story launching are implemented. The opening campaign sections have been playtested; later campaign checks, menu validation and lighting comparisons are still in progress.',
      },
    ],
    tools: [
      { id: 'editor', name: 'HPLX Editor', status: 'In development', description: 'Place props, lights and script areas, then press one key to play your story from where you’re looking, and Esc to keep building. It saves the game’s own files, so your story runs in the original game for everyone who plays it.', progress: 'The editor is built and being tested: placing and editing, playing your story inside it, checks for scripts and text, assets from Frictional’s other games, and a view of where darkness drains sanity. It isn’t released yet.' },
      { id: 'engine', name: 'HPLX Engine', status: 'In development', description: 'The foundation under the game: The Dark Descent’s file formats and the systems it needs, rebuilt in Rust.' },
    ],
    future: [
      { id: 'amfp', name: 'Amnesia: A Machine for Pigs', detail: 'A reimplementation was started. It’s paused while HPLX focuses on The Dark Descent’s editor.' },
      { id: 'penumbra', name: 'Penumbra', detail: 'Early work on Penumbra: Overture is paused for the same reason.' },
    ],
  },
];

export const featuredWork = {
  familyId: 'hplx',
  heading: 'Build a story. Play it as you build.',
  description: 'An editor for Amnesia: The Dark Descent’s custom stories, with the game built in, so you can play your story without leaving it.',
  focusLabel: 'Current focus',
  focusTitle: 'The HPLX Editor',
  focusDescription: 'Testing the editor, and making the game underneath it faithful to the original.',
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
