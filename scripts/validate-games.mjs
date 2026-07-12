#!/usr/bin/env node
/**
 * Validates original and partner catalog integrity.
 * Checks metadata, route slugs, public assets, catalog mirrors, partner images,
 * partner category coverage, and GameMonetize category artwork.
 *
 * Usage: npm run validate:games
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const gamesPath = path.join(repoRoot, 'src/data/games.json');
const legacyGamesPath = path.join(repoRoot, 'games.json');
const publicRoot = path.join(repoRoot, 'public');
const publicGamesRoot = path.join(publicRoot, 'games');
const partnerProfilesPath = path.join(repoRoot, 'src/data/partnerGameProfiles.js');
const cmsCategoriesPaths = [
  path.join(repoRoot, 'src/data/gamemonetizeCmsCategories.json'),
  path.join(repoRoot, 'gamemonetizeCmsCategories.json')
];

const REQUIRED_FIELDS = ['id', 'name', 'genre', 'category', 'iframeUrl', 'thumbnail'];
const VALID_CATEGORIES = ['arcade', 'puzzle', 'racing', 'skill', 'casual', 'sports', 'action', 'shooter', 'adventure', 'strategy'];
const VALID_PLATFORMS = ['html5', 'mobile', 'desktop', 'originals', 'retro-inspired'];

let errorCount = 0;
let warningCount = 0;
let partnerProfileCount = 0;
let partnerClusterCount = 0;

function error(msg) {
  console.error('❌ ERROR:', msg);
  errorCount++;
}

function warn(msg) {
  console.warn('⚠️  WARNING:', msg);
  warningCount++;
}

function info(msg) {
  console.log('ℹ️  INFO:', msg);
}

function success(msg) {
  console.log('✅', msg);
}

function resolvePublicAsset(value) {
  const pathname = String(value || '').split(/[?#]/, 1)[0];
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return null;
  const filePath = path.resolve(publicRoot, `.${pathname}`);
  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) return null;
  return { pathname, filePath };
}

function readHeader(filePath, length = 512) {
  const size = Math.min(length, fs.statSync(filePath).size);
  const buffer = Buffer.alloc(size);
  const descriptor = fs.openSync(filePath, 'r');
  try {
    fs.readSync(descriptor, buffer, 0, size, 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return buffer;
}

function hasValidImageSignature(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const header = readHeader(filePath);
  if (extension === '.webp') {
    return header.length >= 12 && header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP';
  }
  if (extension === '.png') {
    return header.length >= 8 && header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (extension === '.jpg' || extension === '.jpeg') {
    return header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }
  if (extension === '.gif') {
    return header.toString('ascii', 0, 6) === 'GIF87a' || header.toString('ascii', 0, 6) === 'GIF89a';
  }
  if (extension === '.svg') {
    return /<svg(?:\s|>)/i.test(header.toString('utf8'));
  }
  return false;
}

function validatePublicAsset(label, value, { image = false } = {}) {
  const asset = resolvePublicAsset(value);
  if (!asset) {
    error(`${label}: expected a safe root-relative public path (got '${value}')`);
    return null;
  }
  if (!fs.existsSync(asset.filePath)) {
    error(`${label}: public file does not exist at '${asset.pathname}'`);
    return asset.pathname;
  }
  const stats = fs.statSync(asset.filePath);
  if (!stats.isFile()) {
    error(`${label}: public path is not a file at '${asset.pathname}'`);
    return asset.pathname;
  }
  if (stats.size === 0) {
    error(`${label}: public file is empty at '${asset.pathname}'`);
    return asset.pathname;
  }
  if (image && !hasValidImageSignature(asset.filePath)) {
    error(`${label}: public image has an invalid or unsupported signature at '${asset.pathname}'`);
  }
  return asset.pathname;
}

function extractArrayLiteral(source, declaration) {
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex < 0) throw new Error(`Missing declaration '${declaration}'`);
  const start = source.indexOf('[', declarationIndex + declaration.length);
  if (start < 0) throw new Error(`Missing array for '${declaration}'`);

  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '[') depth++;
    if (character === ']') {
      depth--;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`Unterminated array for '${declaration}'`);
}

function parsePartnerClusters(source) {
  const literal = extractArrayLiteral(source, 'export const partnerNetworkClusters =');
  const clusters = [];
  const clusterPattern = /\{\s*slug:\s*['"]([^'"]+)['"][\s\S]*?categories:\s*\[([^\]]*)\][\s\S]*?\}/g;
  for (const match of literal.matchAll(clusterPattern)) {
    const categories = [...match[2].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
    clusters.push({ slug: match[1], categories });
  }
  return clusters;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
  });
}

try {
  const gameData = JSON.parse(fs.readFileSync(gamesPath, 'utf-8'));

  if (!Array.isArray(gameData)) {
    error('games.json must be an array');
    process.exit(1);
  }

  info(`Validating ${gameData.length} games...\n`);

  const seenIds = new Set();
  const seenSlugs = new Set();

  gameData.forEach((game, index) => {
    const gameRef = `Game #${index} (${game.name || 'unnamed'})`;

    // Check required fields
    REQUIRED_FIELDS.forEach((field) => {
      if (!game[field]) {
        error(`${gameRef}: missing required field '${field}'`);
      }
    });

    // Check for duplicates
    if (seenIds.has(game.id)) {
      error(`${gameRef}: duplicate ID '${game.id}'`);
    }
    seenIds.add(game.id);

    const slug = game.slug || game.id;
    const categorySlug = game.categorySlug || String(game.category || '').toLowerCase();

    if (!slug) {
      error(`${gameRef}: missing playable slug/id`);
    } else if (seenSlugs.has(slug)) {
      error(`${gameRef}: duplicate slug '${slug}'`);
    }
    seenSlugs.add(slug);

    // Validate category
    if (categorySlug && !VALID_CATEGORIES.includes(categorySlug)) {
      warn(`${gameRef}: unknown category '${categorySlug}'`);
    }

    // Check iframe URL format
    if (game.iframeUrl && !game.iframeUrl.startsWith('/')) {
      warn(`${gameRef}: iframeUrl should start with '/' (got '${game.iframeUrl}')`);
    }
    if (game.iframeUrl) {
      const iframePath = validatePublicAsset(`${gameRef} iframeUrl`, game.iframeUrl);
      if (iframePath && slug && !iframePath.startsWith(`/games/${slug}/`)) {
        error(`${gameRef}: iframeUrl '${iframePath}' is outside the slug directory '/games/${slug}/'`);
      }
    }

    // Check thumbnail URL format
    if (game.thumbnail && !game.thumbnail.startsWith('/')) {
      warn(`${gameRef}: thumbnail should start with '/' (got '${game.thumbnail}')`);
    }
    if (game.thumbnail) validatePublicAsset(`${gameRef} thumbnail`, game.thumbnail, { image: true });

    // Check rating range
    if (game.rating && (game.rating < 0 || game.rating > 5)) {
      warn(`${gameRef}: rating out of range (expected 0-5, got ${game.rating})`);
    }

    // Check for missing translations
    if (game.translations) {
      Object.entries(game.translations).forEach(([lang, trans]) => {
        if (!trans.name && !trans.description) {
          warn(`${gameRef}: translation for '${lang}' is empty`);
        }
      });
    }

    // Check platforms if present
    if (game.platforms) {
      game.platforms.forEach((platform) => {
        if (!VALID_PLATFORMS.includes(platform)) {
          warn(`${gameRef}: unknown platform '${platform}'`);
        }
      });
    }

    // Warn if missing optional but useful fields
    if (!game.emoji) {
      warn(`${gameRef}: missing emoji (recommended)`);
    }
    if (!game.description) {
      warn(`${gameRef}: missing description (recommended)`);
    }
    if (!game.seoTitle) {
      warn(`${gameRef}: missing seoTitle (recommended for SEO)`);
    }
  });

  const catalogSlugs = new Set(gameData.map((game) => game.slug || game.id).filter(Boolean));
  const publicGameDirectories = new Set(
    fs.existsSync(publicGamesRoot)
      ? fs.readdirSync(publicGamesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      : []
  );
  for (const slug of catalogSlugs) {
    if (!publicGameDirectories.has(slug)) error(`Catalog slug '${slug}' has no matching public/games directory`);
  }
  for (const directory of publicGameDirectories) {
    if (!catalogSlugs.has(directory)) error(`public/games directory '${directory}' is missing from the canonical catalog`);
  }

  if (fs.existsSync(legacyGamesPath)) {
    const legacyGames = JSON.parse(fs.readFileSync(legacyGamesPath, 'utf8'));
    if (JSON.stringify(legacyGames) !== JSON.stringify(gameData)) {
      error('Root games.json mirror is out of sync with canonical src/data/games.json');
    }
  }

  const partnerSource = fs.readFileSync(partnerProfilesPath, 'utf8');
  const partnerProfiles = JSON.parse(extractArrayLiteral(partnerSource, 'export const partnerGameProfiles ='));
  const partnerClusters = parsePartnerClusters(partnerSource);
  partnerProfileCount = partnerProfiles.length;
  partnerClusterCount = partnerClusters.length;

  const seenPartnerSlugs = new Set();
  partnerProfiles.forEach((profile, index) => {
    const profileRef = `Partner profile #${index} (${profile.title || 'untitled'})`;
    if (!profile.slug) error(`${profileRef}: missing slug`);
    if (seenPartnerSlugs.has(profile.slug)) error(`${profileRef}: duplicate slug '${profile.slug}'`);
    seenPartnerSlugs.add(profile.slug);
    if (!profile.image) error(`${profileRef}: missing image`);
    else validatePublicAsset(`${profileRef} image`, profile.image, { image: true });
    if (profile.slug && profile.path !== `/more-free-games/${profile.slug}`) {
      error(`${profileRef}: path '${profile.path}' does not match slug '${profile.slug}'`);
    }
    if (profile.slug && profile.playPath !== `/more-free-games/${profile.slug}/play`) {
      error(`${profileRef}: playPath '${profile.playPath}' does not match slug '${profile.slug}'`);
    }
  });

  const seenClusterSlugs = new Set();
  partnerClusters.forEach((cluster) => {
    if (seenClusterSlugs.has(cluster.slug)) error(`Partner cluster has duplicate slug '${cluster.slug}'`);
    seenClusterSlugs.add(cluster.slug);
    const categories = new Set(cluster.categories.map((category) => category.toLowerCase()));
    const matches = partnerProfiles.filter((profile) => categories.has(String(profile.category || '').toLowerCase()));
    if (cluster.categories.length === 0) error(`Partner cluster '${cluster.slug}' has no category mappings`);
    if (matches.length === 0) error(`Partner cluster '${cluster.slug}' has no matching partner profiles`);
  });
  if (partnerClusters.length === 0) error('No partner network clusters could be parsed');

  const partnerAssetRoot = path.join(publicRoot, 'partner-games');
  for (const filePath of walkFiles(partnerAssetRoot)) {
    if (!/\.(?:gif|jpe?g|png|svg|webp)$/i.test(filePath)) continue;
    const publicPath = `/${path.relative(publicRoot, filePath).split(path.sep).join('/')}`;
    validatePublicAsset(`Partner asset '${publicPath}'`, publicPath, { image: true });
  }

  const cmsCategoriesPath = cmsCategoriesPaths.find((candidate) => fs.existsSync(candidate));
  if (cmsCategoriesPath) {
    const cmsCategories = JSON.parse(fs.readFileSync(cmsCategoriesPath, 'utf8'));
    cmsCategories.forEach((category, index) => {
      if (category.image) validatePublicAsset(`GameMonetize category #${index} (${category.slug || category.name}) image`, category.image, { image: true });
    });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Total games: ${gameData.length}`);
  console.log(`Partner profiles: ${partnerProfileCount}`);
  console.log(`Partner clusters: ${partnerClusterCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Warnings: ${warningCount}`);
  console.log('='.repeat(50));

  if (errorCount > 0) {
    console.error('❌ Validation FAILED - fix errors above');
    process.exit(1);
  }

  if (warningCount > 0) {
    success('Validation PASSED with warnings - review above');
    process.exit(0);
  }

  success('Validation PASSED - all checks passed!');
  process.exit(0);
} catch (err) {
  error(`Validation aborted: ${err.message}`);
  process.exit(1);
}
