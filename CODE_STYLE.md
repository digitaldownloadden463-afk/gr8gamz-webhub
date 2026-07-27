# GR8 GAMZ Code Style Guide

## Architecture Overview

### Directory Structure

```
app/                 Next.js App Router pages & layouts
├── page.tsx         Homepage
├── layout.tsx       Root layout with metadata
├── globals.css      Global styles & design system
├── error.tsx        Error boundary (auto-called on error)
└── arcade/          Game detail pages
    └── [slug]/      Dynamic game route
        └── page.tsx

components/          React components (client & server)
├── index.ts         Barrel export for clean imports
├── GameCard.tsx     Reusable game display component
├── TopNav.tsx       Navigation header
├── ErrorBoundary.tsx Error handling wrapper
└── ...

lib/                 Utilities and business logic
├── games.ts         Game data & filtering functions
└── ...

src/data/           Static data files
├── games.json       Master game catalog (single source of truth)
└── ...

scripts/            Build & maintenance scripts
├── validate-games.mjs Data validation & auditing
└── ...

public/             Static assets
├── games/          Embedded HTML5 game iframes
└── art/            Hero artwork & backgrounds
```

## Component Patterns

### Function Component with Props Interface

```typescript
import type { ReactNode } from 'react';

type GameCardProps = {
  game: Gr8Game;
  compact?: boolean;
  className?: string;
};

export function GameCard({ game, compact = false, className = '' }: GameCardProps) {
  return (
    <article className={className}>
      {/* Component JSX */}
    </article>
  );
}

export default GameCard;
```

**Rules:**
1. Use `type` for props interfaces (not `interface`)
2. Default props in function signature
3. Always export named function AND default export
4. Mark client components with `'use client'` at top

### Server vs Client Components

**Server Components (default):**
- No `'use client'` directive
- Can access databases, APIs, secrets
- Cannot use hooks (useState, useEffect, etc.)
- Examples: layouts, data-fetching pages

**Client Components:**
- Must have `'use client'` at top
- Can use React hooks
- Cannot access secrets
- Examples: interactive widgets, forms

## Type Safety

### Game Data Types

All game-related code uses types from `lib/games.ts`:

```typescript
import type { Game, Category } from '@/lib/games';

// ✅ Good: explicit types
function displayGame(game: Game): void { }

// ❌ Bad: avoid any
function displayGame(game: any): void { }
```

### Strict Mode

TypeScript strict mode is enabled (`tsconfig.json`). Fix all errors before committing:

```bash
npm run build  # Will fail if there are type errors
```

## Naming Conventions

- **Files**: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- **Variables**: `camelCase`
- **Types**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Booleans**: prefix with `is`, `has`, `can`, `should` (e.g., `isLoading`, `hasError`)

## Documentation

### JSDoc Comments

All public functions and components should have JSDoc comments:

```typescript
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
export function getGamesByCategory(category: string | string[] | undefined): Game[] {
  // Implementation
}
```

## Styling

### CSS Classes

Use BEM (Block Element Modifier) for CSS classes:

```css
.game-card { }
.game-card__title { }
.game-card--featured { }
.game-card:hover { }
```

### Inline Styles

Prefer CSS classes, but inline styles are acceptable for:
- Dynamic values
- Component-scoped styles
- Quick prototypes

```typescript
// ✅ Acceptable: dynamic styling
<div style={{ opacity: isLoaded ? 1 : 0 }}>

// ❌ Avoid: better as CSS class
<div style={{ color: '#fff', fontSize: '1rem' }}>
```

## Game Data

All game metadata comes from `src/data/games.json` (single source of truth).

### Required Fields

```json
{
  "id": "my-game",
  "slug": "my-game",
  "name": "My Game",
  "genre": "Arcade",
  "category": "arcade",
  "categorySlug": "arcade",
  "iframeUrl": "/games/my-game/index.html",
  "thumbnail": "/games/my-game/thumb.webp"
}
```

### Optional Fields

- `emoji`: Game icon (1 character)
- `description`: Short description for cards
- `rating`: Number 0-5 (e.g., 4.8)
- `featured`, `isFeatured`: Boolean for homepage
- `launchOrder`: Number for sorting
- `controls[]`: Array of control descriptions
- `engagementHooks[]`: Feature highlights
- `translations`: Multi-language support

### Cache Busting

Use query params to bust cache on updates:

```json
{
  "iframeUrl": "/games/neon-snake-rush/index.html?v=gr8-v8-selection-labs-20260628",
  "thumbnail": "/games/neon-snake-rush/thumb.webp?v=thumbs-v1"
}
```

## Performance

### Image Optimization

- Use WebP format for images
- Provide fallbacks (e.g., `.webp` and `.png`)
- Minimize file sizes
- Use `?v=` query params for cache control

### Code Splitting

Next.js automatically code-splits by route. Additional optimization:

```typescript
// ✅ Dynamic imports for large components
const GamePlayer = dynamic(() => import('@/components/GamePlayerFrame'), {
  loading: () => <LoadingSpinner />,
});
```

## SEO

### Metadata

All pages should have proper metadata:

```typescript
export const metadata: Metadata = {
  title: 'Game Name | GR8 GAMZ',
  description: 'Play this free browser game...',
  openGraph: {
    title: 'Game Name | GR8 GAMZ',
    description: 'Play this free browser game...',
    images: ['/games/my-game/thumb.webp'],
  },
};
```

### Structured Data

Use schema.org markup for rich snippets:

```typescript
// In component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Game',
      name: game.name,
      description: game.description,
      url: `https://gr8gamz.com/arcade/${game.slug}`,
    }),
  }}
/>
```

## Accessibility

- Always include `alt` text for images
- Use semantic HTML (`<button>`, `<header>`, `<main>`)
- Ensure keyboard navigation works
- Test with screen readers

```typescript
// ✅ Good
<button aria-label="Save game to favorites">❤️</button>

// ❌ Bad
<div onClick={handleSave}>❤️</div>
```
