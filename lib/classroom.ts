import { getRegistryGamesBySlugs, type RegistryGame } from '@/lib/gameRegistry';

export const classroomReviewedAt = '2026-08-25';

export const classroomGameGroups = [
  {
    id: 'five-minute',
    title: 'Five-minute activities',
    description: 'Short, low-setup choices for a quick break or a finished-task window.',
    slugs: ['bubble-pop-blitz', 'crystal-match-quest', 'memory-match-lite', 'duck-math']
  },
  {
    id: 'ten-minute',
    title: 'Ten-minute activities',
    description: 'Puzzles with enough structure for a focused short session.',
    slugs: ['ice-slide-puzzle', 'astro-memory-grid', 'bloxorz', 'sudoku-master']
  },
  {
    id: 'maths-logic',
    title: 'Maths and logic games',
    description: 'Equation, number and spatial challenges. These are practice activities, not formal curriculum assessments.',
    slugs: ['duck-math', 'bloxorz', '2048', 'sudoku-master']
  },
  {
    id: 'puzzle-memory',
    title: 'Puzzle and memory games',
    description: 'Calm individual choices that reward matching, planning and recall.',
    slugs: ['astro-memory-grid', 'memory-match-lite', 'ice-slide-puzzle', 'bloxorz']
  }
] as const;

export type ClassroomGameGroup = Omit<(typeof classroomGameGroups)[number], 'slugs'> & { games: RegistryGame[] };

export function getClassroomGameGroups(): ClassroomGameGroup[] {
  return classroomGameGroups.map(({ slugs, ...group }) => ({
    ...group,
    games: getRegistryGamesBySlugs([...slugs])
  }));
}

export function getClassroomFeaturedGames() {
  const slugs = [...new Set(classroomGameGroups.flatMap((group) => [...group.slugs]))];
  return getRegistryGamesBySlugs(slugs);
}

export function classroomRoutePaths() {
  return ['/classroom', '/classroom/timer'] as const;
}
