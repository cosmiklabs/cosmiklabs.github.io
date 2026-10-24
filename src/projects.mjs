/** Areas of work; family destinations remain independent of homepage emphasis. */
export const pillars = [
  {id:'structures', name:'3D tools', summary:'Tools for creating 3D structures.'},
  {id:'stories', name:'Story creation', summary:'Tools for making playable stories.'},
];

/** Family destinations are stable. Featured work is an independent editorial choice. */
export const families = [
  {
    heading: ['Build a story.', 'Play it as you build.'],
    legalNote: 'An independent editor and reimplementation, unaffiliated with the original creators. Original game content is not distributed here. Game names, assets and credits belong to their respective owners; code and assets retain their own licenses.',
    id: 'hplx', name: 'HPLX', pillar: 'stories', status: 'In development',
    summary: 'An easier way to create custom stories for the original Amnesia: The Dark Descent.',
    scope: 'An editor for Amnesia: The Dark Descent’s custom stories',
    description: 'HPLX makes creating custom stories for Amnesia: The Dark Descent easier and better. The editor and its built-in reimplementation are being developed around one goal: a better way to make and playtest your own stories for the original game.',
    groups: [
      { title: 'Build', items: 'Your story, in the editor' },
      { title: 'Play', items: 'Your story, without leaving the editor' },
      { title: 'Create', items: 'Custom stories for the original game' },
    ],
    games: [
      {
        id: 'tdd', name: 'Amnesia: The Dark Descent', shortName: 'The Dark Descent', status: 'In development',
        description: 'The reimplementation powers custom-story playtesting inside the editor. It is being developed to support creating stories for the original Amnesia: The Dark Descent, using the files from your own retail copy. Those files are never bundled with HPLX.',
      },
    ],
    tools: [
      { id: 'editor', name: 'HPLX Editor', status: 'In development', description: 'Place props, lights and script areas, then press one key to play your story from where you’re looking, and Esc to keep building. The goal is a smoother workflow for making custom stories for the original game.', progress: 'The editor is built and being tested: placing and editing, playing your story inside it, checks for scripts and text, and a view of where darkness drains sanity. It isn’t released yet.' },
      { id: 'engine', name: 'HPLX Engine', status: 'In development', description: 'The foundation for the editor’s playtesting: The Dark Descent’s file formats and systems, rebuilt in Rust.' },
    ],
  },
  {
    heading: ['Create structures for', 'worlds real or imagined.'],
    slogan: 'Describe the space. Shape what comes next.',
    id: 'tectra', name: 'Tectra', pillar: 'structures', status: 'In development',
    scope: '3D structures',
    summary: 'Design and refine 3D structures with AI assistance.',
    description: 'Bring an idea and develop it with Tectra’s AI. Shape a structure through connected parts, relationships and rules it can check as the design evolves.',
    groups: [
      { title: 'Describe', items: 'Begin with an idea for a space' },
      { title: 'Shape', items: 'Develop connected parts and relationships' },
      { title: 'Refine', items: 'Check rules as the design evolves' },
    ],
  },
];

export const featuredWork = {
  familyId: 'tectra',
  heading: 'Create structures for worlds real or imagined.',
  description: 'Bring an idea and develop it with Tectra’s AI. Shape a structure through connected parts, relationships and rules it can check as the design evolves.',
  focusLabel: 'The idea',
  focusTitle: 'Describe the space. Shape what comes next.',
  focusDescription: 'A tool for developing 3D structures, from the first idea through each revision.',
};

/** Old individual-project URLs retain a route into their context in the family. */
const hplx = families.find(family => family.id === 'hplx');
export const legacyRoutes = [
  { id: 'volsyn', familyId: 'tectra', name: 'Tectra', renamed: true },
  { id: 'tdd', familyId: 'hplx', fragment: 'tdd', name: hplx.games.find(game => game.id === 'tdd').shortName },
  { id: 'amfp', familyId: 'hplx', fragment: 'editor', name: 'HPLX story creation' },
  { id: 'hplx-editor', familyId: 'hplx', fragment: 'editor', name: hplx.tools.find(tool => tool.id === 'editor').name },
];

export function validateContent(catalog = families, feature = featuredWork) {
  const ids = new Set();
  for (const family of catalog) {
    if (!/^[a-z0-9-]+$/.test(family.id) || ids.has(family.id)) throw new Error('Family IDs must be unique URL-safe names.');
    if (!family.description || !Array.isArray(family.heading) || !family.heading.length || family.heading.some(line => typeof line !== 'string' || !line.trim())) throw new Error('Each family needs a description and heading lines for the shared template.');
    if (!family.name || !family.summary || !family.status) throw new Error('Each family needs a name, summary and status.');
    if (!pillars.some(p => p.id === family.pillar)) throw new Error('Each family needs a known pillar.');
    ids.add(family.id);
  }
  if (!ids.has(feature.familyId)) throw new Error('Featured work must belong to an existing family.');
}
