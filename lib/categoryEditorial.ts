import categoryEditorialData from '@/src/data/categoryEditorial.json';

export type CategorySelectionLabel =
  | 'gr8-original'
  | 'editors-pick'
  | 'quick-play'
  | 'mobile-friendly'
  | 'keyboard-friendly'
  | 'longer-session'
  | 'recently-added'
  | 'popular-on-gr8';

export type CategoryEditorialPick = {
  slug: string;
  labels: CategorySelectionLabel[];
  rationale: string;
};

export type CategoryEditorialRecord = {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  introduction: string;
  distinction: string;
  subgenres: Array<{ name: string; description: string }>;
  choosing: string[];
  deviceGuidance: string;
  controlsGuidance: string;
  sessionGuidance: string;
  editorialPicks: CategoryEditorialPick[];
  originalSlugs: string[];
  relatedCategorySlugs: string[];
  gearGuide?: { path: string; label: string; description: string };
  sourceState: 'reviewed-catalogue';
  localeReadiness: 'en-reviewed';
};

type CategoryEditorialData = {
  schemaVersion: number;
  reviewedAt: string;
  catalogueSnapshotCommit: string;
  selectionCriteria: Record<CategorySelectionLabel, string>;
  categories: CategoryEditorialRecord[];
};

const data = categoryEditorialData as CategoryEditorialData;
const records = new Map(data.categories.map((record) => [record.slug, record]));

export const categoryEditorialVersion = data.schemaVersion;
export const categoryEditorialReviewedAt = data.reviewedAt;
export const categoryEditorialSnapshotCommit = data.catalogueSnapshotCommit;
export const categorySelectionCriteria = data.selectionCriteria;
export const categorySelectionLabels: Record<CategorySelectionLabel, string> = {
  'gr8-original': 'GR8 Original',
  'editors-pick': "Editor's pick",
  'quick-play': 'Quick-play choice',
  'mobile-friendly': 'Mobile-friendly',
  'keyboard-friendly': 'Keyboard-friendly',
  'longer-session': 'Longer-session game',
  'recently-added': 'Recently added',
  'popular-on-gr8': 'Popular on GR8 GAMZ'
};

export function getCategoryEditorial(slug: string) {
  return records.get(slug);
}

export function getCategoryEditorialRecords() {
  return [...records.values()];
}

export function isEditorialCategory(slug: string) {
  return records.has(slug);
}
