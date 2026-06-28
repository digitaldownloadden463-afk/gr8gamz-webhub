import { contentCollections, updatePosts } from '../data/content';
import { filterGames, getAllGames, getGameBySlug } from './games';

export function getAllUpdatePosts() {
  return [...updatePosts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getFeaturedUpdatePosts(limit = 3) {
  return getAllUpdatePosts().slice(0, limit);
}

export function getUpdatePostBySlug(slug) {
  return updatePosts.find((post) => post.slug === slug);
}

export function getAllContentCollections() {
  return contentCollections;
}

export function getContentCollectionBySlug(slug) {
  return contentCollections.find((collection) => collection.slug === slug);
}

export function getGamesForContentCollection(collection) {
  if (!collection) return [];
  if (collection.gameIds?.length) {
    return collection.gameIds.map((id) => getGameBySlug(id)).filter(Boolean);
  }
  if (collection.filter) {
    return filterGames(collection.filter);
  }
  return getAllGames();
}

export function getRelatedGamesForPost(post) {
  if (!post) return [];
  return (post.relatedGameIds || []).map((id) => getGameBySlug(id)).filter(Boolean);
}

export function getNewThisWeekItems() {
  const games = getAllGames().slice(0, 15);
  const posts = getFeaturedUpdatePosts(4);
  return { games, posts };
}
