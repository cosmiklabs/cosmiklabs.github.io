/** Catalog entries are independent pages. parent identifies a relationship, not a route. */
export const projects = [
  {
    id: 'hplx', name: 'HPLX', type: 'Engine', status: 'In development', parent: null,
    summary: 'A modern reimplementation of a classic game engine. A foundation for bringing familiar worlds forward.',
    lead: 'Rebuilding the foundation.',
    overviewHeading: 'The engine behind the world.', connectionHeading: 'One foundation. A world to build.',
    connectionDescription: 'HPLX and The Dark Descent are developed together. Explore the game project to see where the engine work leads.',
    description: 'HPLX is an independent engine reimplementation project, starting with the foundations needed for The Dark Descent.',
    art: 'engine.svg', artLabel: 'Original wireframe engine illustration',
    focus: 'Engine reimplementation',
    note: 'Work is in progress. There is no public release or download available here yet.',
    source: null,
  },
  {
    id: 'tdd', name: 'The Dark Descent', shortName: 'TDD', type: 'Game reimplementation', status: 'In development', parent: 'hplx',
    summary: 'An independent reimplementation of The Dark Descent, built on HPLX.',
    lead: 'A familiar world. A new foundation.',
    overviewHeading: 'The world above the engine.', connectionHeading: 'Built on HPLX.',
    connectionDescription: 'The game and the engine are connected, with separate project pages so each can develop in its own direction.',
    legalNote: 'Independent reimplementation. Not an official release and not affiliated with or endorsed by the original game’s creators. Original names and assets belong to their respective owners.',
    description: 'The Dark Descent is the first game reimplementation being developed alongside HPLX. It has its own project identity, with the engine underneath.',
    art: 'descent.svg', artLabel: 'Original abstract doorway illustration',
    focus: 'Game reimplementation',
    note: 'This project is in development. It is not a playable release, and no game assets or downloads are distributed here.',
    source: null,
  },
];
export const projectById = new Map(projects.map(project => [project.id, project]));
