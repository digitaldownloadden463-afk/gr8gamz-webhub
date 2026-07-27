/**
 * Game data management and filtering utilities for GR8 GAMZ.
 * This module provides type-safe access to the game catalog with helper functions
 * for filtering, searching, and retrieving game/category data.
 *
 * Data is loaded from `src/data/games.json` (single source of truth).
 * @see src/data/games.json
 */

import gamesData from '@/src/data/games.json';

/**
 * Represents a game category in the GR8 GAMZ catalog.
 * Categories are used for browsing, filtering, and navigation.
 */
export type Gr8Category = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  emoji?: string;
  description?: string;
};

/** Alias for backward compatibility */
export type Category = Gr8Category;

/**
 * Represents a playable game in the GR8 GAMZ catalog.
 * Contains all metadata needed for display, embedding, and tracking.
 */
export type Gr8Game = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  genre?: string;
  category?: string;
  categorySlug?: string;
  description?: string;
  iframeUrl?: string;
  embedUrl?: string;
  url?: string;
  href?: string;
  thumbnail?: string;
  image?: string;
  emoji?: string;
  featured?: boolean;
  isFeatured?: boolean;
  plays?: number;
  rating?: number;
  difficulty?: string;
  isPopular?: boolean;
  isNew?: boolean;
  playsLabel?: string;
  shortControls?: string;
  thumbnailAlt?: string;
  // Extended metadata from games.json
  playStyle?: string;
  seoTitle?: string;
  seoDescription?: string;
  baseTrivia?: string;
  longDescription?: string;
  controls?: string[];
  engagementHooks?: string[];
  tags?: string[];
  platforms?: string[];
  status?: string;
  dateAdded?: string;
  launchOrder?: number;
  translations?: Record<string, { name?: string; description?: string }>;
};

/** Alias for backward compatibility */
export type Game = Gr8Game;

/**
 * Category definitions for the GR8 GAMZ arcade.
 * These are the primary browse categories used in navigation and filtering.
 */
export const categoryObjects: Gr8Category[] = [
  {
    id: 'arcade',
    slug: 'arcade',
    name: 'Arcade',
    title: 'Arcade Games',
    emoji: '🕹️',
    description: 'Fast browser games built for instant play.'
  },
  {
    id: 'puzzle',
    slug: 'puzzle',
    name: 'Puzzle',
    title: 'Puzzle Games',
    emoji: '🧩',
    description: 'Quick thinking, matching and block games.'
  },
  {
    id: 'racing',
    slug: 'racing',
    name: 'Racing',
    title: 'Racing Games',
    emoji: '🏎️',
    description: 'Speed, drift and reflex games for mobile and desktop.'
  },
  {
    id: 'skill',
    slug: 'skill',
    name: 'Skill',
    title: 'Skill Games',
    emoji: '🎯',
    description: 'Tap, time and precision challenges.'
  },
  {
    id: 'casual',
    slug: 'casual',
    name: 'Casual',
    title: 'Casual Games',
    emoji: '⚡',
    description: 'Easy games for short repeat sessions.'
  }
];

/**
 * Array of category names for simple iteration.
 * Used in navigation and category strip rendering.
 * @see app/page.tsx
 */
export const categories: string[] = categoryObjects.map((category) => category.name);

/**
 * Complete game catalog, loaded from src/data/games.json.
 * This is the single source of truth for all games.
 * Games are cast to Gr8Game type and sorted by launch order.
 */
export const games: Gr8Game[] = (gamesData as unknown as Gr8Game[])
  .map((game) => ({
    ...game,
    slug: game.slug || game.id,
    categorySlug: game.categorySlug || String(game.category || '').toLowerCase()
  }))
  .sort((a, b) => (a.launchOrder ?? 999) - (b.launchOrder ?? 999));

/**
 * Normalize a slug by removing common suffixes and lowercasing.
 * Handles both string and array inputs (from Next.js dynamic params).
 *
 * @param value - The slug to normalize (string, array, or nullish)
 * @returns Normalized slug string
 * @example
 * normaliseSlug('neon-snake-rush') // 'neon-snake-rush'
 * normaliseSlug(['neon-snake-rush']) // 'neon-snake-rush'
 * normaliseSlug(null) // ''
 */
export function normaliseSlug(value: string | string[] | undefined | null): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '').replace(/-unblocked$/i, '').trim().toLowerCase();
}

/**
 * Get all games in the catalog.
 * @returns Array of all Gr8Game objects, sorted by launch order
 */
export function getAllGames(): Gr8Game[] {
  return games;
}

/**
 * Get featured games, optionally limited to a count.
 * Featured games are marked with `featured: true` or `isFeatured: true`.
 *
 * @param limit - Maximum number of games to return
 * @returns Array of featured games
 */
export function getFeaturedGames(limit?: number): Gr8Game[] {
  const featured = games.filter((game) => Boolean(game.featured || game.isFeatured || game.isPopular || game.isNew));
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

/**
 * Get top-ranked games, optionally limited to a count.
 * Games are sorted by featured status first, then by play count.
 *
 * @param limit - Maximum number of games to return
 * @returns Array of top-ranked games
 */
export function getTopGames(limit?: number): Gr8Game[] {
  const ordered = [...games].sort(
    (a, b) =>
      Number(Boolean(b.isFeatured || b.featured || b.isPopular)) -
        Number(Boolean(a.isFeatured || a.featured || a.isPopular)) ||
      Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
      Number(b.plays || 0) - Number(a.plays || 0)
  );
  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered;
}

/**
 * Get games filtered by category.
 * Matches against categorySlug, category, or genre fields.
 *
 * @param category - Category slug or name
 * @returns Array of games in the specified category
 * @example
 * getGamesByCategory('arcade')
 * getGamesByCategory(['puzzle'])
 */
export function getGamesByCategory(
  category: string | string[] | undefined
): Gr8Game[] {
  const clean = normaliseSlug(category);
  return games.filter(
    (game) =>
      game.categorySlug === clean ||
      String(game.category || '').toLowerCase() === clean ||
      String(game.genre || '').toLowerCase() === clean
  );
}

/**
 * Get a category by slug or name.
 *
 * @param slug - Category slug or name
 * @returns Gr8Category object or null if not found
 */
export function getCategoryBySlug(
  slug: string | string[] | undefined
): Gr8Category | null {
  const clean = normaliseSlug(slug);
  return (
    categoryObjects.find(
      (category) =>
        category.slug === clean ||
        category.id === clean ||
        category.name.toLowerCase() === clean
    ) || null
  );
}

/**
 * Get a game by slug or ID.
 * Handles both direct slugs and URL-safe parameters.
 *
 * @param slug - Game slug or ID
 * @returns Gr8Game object or null if not found
 * @example
 * getGameBySlug('neon-snake-rush')
 * getGameBySlug(['neon-snake-rush'])
 */
export function getGameBySlug(
  slug: string | string[] | undefined
): Gr8Game | null {
  const clean = normaliseSlug(slug);
  return (
    games.find(
      (game) => game.slug === clean || game.id === clean
    ) || null
  );
}

/**
 * Get a game by ID.
 * @param id - Game ID
 * @returns Gr8Game object or null if not found
 * @deprecated Use getGameBySlug() instead
 */
export function getGameById(id: string | string[] | undefined): Gr8Game | null {
  return getGameBySlug(id);
}

/**
 * Find a game by slug.
 * @param slug - Game slug
 * @returns Gr8Game object or null if not found
 * @deprecated Use getGameBySlug() instead
 */
export function findGameBySlug(
  slug: string | string[] | undefined
): Gr8Game | null {
  return getGameBySlug(slug);
}

/** Precomputed featured games for quick access */
export const featuredGames = getFeaturedGames();

/** Precomputed top games for quick access */
export const topGames = getTopGames();

export default games;
