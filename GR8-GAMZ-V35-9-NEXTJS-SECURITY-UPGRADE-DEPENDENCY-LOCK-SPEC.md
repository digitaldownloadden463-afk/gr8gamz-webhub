# GR8 GAMZ V35.9 — Next.js Security Upgrade + Dependency Lock

> Historical release note: the active project has since moved to Next.js 16.2.10, ESLint 9, and the committed pnpm lockfile. See `README.md` and `package.json` for the current release process.

## Purpose

V35.9 is a controlled maintenance phase after the V35.8 stabilisation pack. It upgrades the project away from the vulnerable Next.js 14.2.3 release while keeping the successful repo alignment intact.

## What changed

- Next.js pinned to `14.2.35`.
- React pinned to `18.3.1`.
- React DOM pinned to `18.3.1`.
- lucide-react pinned to `0.468.0`.
- TypeScript and React/Node types pinned.
- `package-lock.json` regenerated to lock dependency resolution.
- Added `audit:v35-9-security-upgrade` script.
- Kept the temporary V35.8 TypeScript/ESLint build guard so the green deployment is not destabilised.

## Why Next.js 14.2.35

The current live build warns that `next@14.2.3` has a security vulnerability. The official Next.js security advisory for December 11, 2025 lists `14.2.35` as the fixed version for the 14.x line.

## Important

Do not run `npm audit fix --force` for this project. It can jump packages aggressively and risk breaking the deployment again.

## Next phase after this

Once V35.9 is green on Vercel, the next safe phase is:

- V36 — Real Leaderboards + Global Activity

A later cleanup phase can remove the temporary TypeScript build guard after the mixed repo structure is fully retired.
