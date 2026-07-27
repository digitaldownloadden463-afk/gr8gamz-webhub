# Contributing to GR8 GAMZ

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth development experience.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/digitaldownloadden463-afk/gr8gamz-webhub.git
   cd gr8gamz-webhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Code Quality

### Type Safety
- All new code must include TypeScript types
- Run `npm run build` to verify no type errors
- Never use `any` — use proper types or `unknown` with narrowing

### Linting & Formatting
```bash
# Check for linting issues
npm run lint

# Auto-fix formatting
npm run format
```

### Testing
```bash
# Run any available test suite
npm test
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow the [Code Style Guide](./CODE_STYLE.md)
   - Add JSDoc comments for functions and components
   - Update relevant documentation

3. **Validate your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new game feature"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feat/your-feature-name
   ```

## Adding a New Game

1. Add game metadata to `src/data/games.json`:
   ```json
   {
     "id": "my-game",
     "slug": "my-game",
     "name": "My Game",
     "genre": "Arcade",
     "category": "arcade",
     "categorySlug": "arcade",
     "emoji": "🎮",
     "iframeUrl": "/games/my-game/index.html?v=gr8-v1",
     "thumbnail": "/games/my-game/thumb.webp",
     "description": "A fun arcade game",
     "rating": 4.8,
     "launchOrder": 21
   }
   ```

2. Validate the data:
   ```bash
   npm run validate:games
   ```

3. Test the game page renders correctly

## Git Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `perf:` Performance improvements

Example: `feat: add game selection labs to Neon Snake Rush`

## Reporting Issues

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/device information

## Questions?

Feel free to open a Discussion or reach out in the Clubhouse.

Happy coding! 🚀
