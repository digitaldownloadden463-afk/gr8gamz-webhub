# GR8 GAMZ Development Guide

## Local Setup

### Prerequisites
- Node.js 24.x ([download](https://nodejs.org))
- pnpm 11
- Git

### Quick Start

```bash
# Clone and install
git clone https://github.com/digitaldownloadden463-afk/gr8gamz-webhub.git
cd gr8gamz-webhub
pnpm install --frozen-lockfile

# Start dev server
pnpm dev

# Open http://localhost:3000
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Quality
pnpm lint             # Run ESLint
pnpm lint -- --fix    # Auto-fix lint issues

# Validation
pnpm validate:games   # Audit game data consistency
pnpm validate:active-routes # Audit active API, sitemap and IndexNow routes
pnpm test:security    # Run security regression tests
pnpm audit:releases  # Run all historical release audits
pnpm check            # Run the complete release gate
```

## Common Tasks

### Adding a New Game

1. **Add to `src/data/games.json`:**
   ```json
   {
     "id": "cool-game",
     "slug": "cool-game",
     "name": "Cool Game",
     "genre": "Puzzle",
     "category": "puzzle",
     "categorySlug": "puzzle",
     "emoji": "🧩",
     "iframeUrl": "/games/cool-game/index.html?v=gr8-v1",
     "thumbnail": "/games/cool-game/thumb.webp",
     "description": "A cool puzzle game",
     "rating": 4.7,
     "launchOrder": 21
   }
   ```

2. **Validate:**
   ```bash
   pnpm validate:games
   ```

3. **Test the page:**
   - Navigate to `http://localhost:3000/arcade/cool-game`
   - Verify the iframe loads
   - Check game card displays on homepage

### Modifying Game Metadata

1. Edit `src/data/games.json`
2. Dev server auto-reloads (hot reload enabled)
3. Verify changes in browser

### Creating a New Component

1. **Create file:** `components/MyComponent.tsx`
   ```typescript
   'use client';

   type MyComponentProps = {
     title?: string;
   };

   export function MyComponent({ title = 'Default' }: MyComponentProps) {
     return <div>{title}</div>;
   }

   export default MyComponent;
   ```

2. **Add to barrel export:** `components/index.ts`
   ```typescript
   export { MyComponent } from './MyComponent';
   ```

3. **Use anywhere:**
   ```typescript
   import { MyComponent } from '@/components';
   ```

### Adding a New Page

1. **Create file:** `app/my-page/page.tsx`
   ```typescript
   export const metadata = {
     title: 'My Page | GR8 GAMZ',
   };

   export default function MyPage() {
     return <main>Content</main>;
   }
   ```

2. **Accessible at:** `http://localhost:3000/my-page`

## Troubleshooting

### Build Errors

**Problem:** `pnpm build` fails with TypeScript errors

**Solution:**
```bash
# Check tsconfig.json has strict: true
# Fix all type errors (never use any)
# Run build again
pnpm build
```

### Dev Server Won't Start

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Start on different port
pnpm dev -- -p 3001

# Or kill process on 3000
lsof -i :3000
kill -9 <PID>
```

### Game Iframe Not Loading

**Problem:** Game embed shows blank or error

**Solution:**
1. Check `iframeUrl` in `src/data/games.json`
2. Verify the iframe URL is correct
3. Check file exists in `public/games/`
4. Check browser console for CORS errors

### Cache Issues

**Problem:** Changes not showing after edit

**Solution:**
```bash
# Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
# Or clear browser cache and restart dev server
pnpm dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Available variables:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_ENABLE_PASSPORT` - Feature flag for auth

## Deployment

### Production Build

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start

# Open http://localhost:3000
```

### Vercel (Recommended)

The app is configured for Vercel deployment:

1. Push to GitHub
2. Connect repo to Vercel
3. Deploy automatically on `main` push

## Performance Monitoring

### Lighthouse

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Review suggestions

### Build Analysis

```bash
# Analyze bundle size
NEXT_PUBLIC_ANALYZE=true pnpm build
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/my-feature

# Make changes
echo "code here"

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feat/my-feature

# Create Pull Request on GitHub
```

## Need Help?

- Check [CODE_STYLE.md](./CODE_STYLE.md) for architecture
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
- Open a Discussion or create an Issue on GitHub
