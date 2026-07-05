#!/usr/bin/env node
/**
 * Validates game data consistency in src/data/games.json
 * Checks for required fields, duplicate IDs, invalid URLs, and missing translations.
 *
 * Usage: npm run validate:games
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamesPath = path.join(__dirname, '../src/data/games.json');

const REQUIRED_FIELDS = ['id', 'name', 'genre', 'category', 'iframeUrl', 'thumbnail'];
const VALID_CATEGORIES = ['arcade', 'puzzle', 'racing', 'skill', 'casual', 'sports', 'action', 'shooter', 'adventure', 'strategy'];
const VALID_PLATFORMS = ['html5', 'mobile', 'desktop', 'originals', 'retro-inspired'];

let errorCount = 0;
let warningCount = 0;

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

    // Check thumbnail URL format
    if (game.thumbnail && !game.thumbnail.startsWith('/')) {
      warn(`${gameRef}: thumbnail should start with '/' (got '${game.thumbnail}')`);
    }

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

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Total games: ${gameData.length}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Warnings: ${warningCount}`);
  console.log('='.repeat(50));

  if (errorCount > 0) {
    error('Validation FAILED - fix errors above');
    process.exit(1);
  }

  if (warningCount > 0) {
    success('Validation PASSED with warnings - review above');
    process.exit(0);
  }

  success('Validation PASSED - all checks passed!');
  process.exit(0);
} catch (err) {
  error(`Failed to read games.json: ${err.message}`);
  process.exit(1);
}
