GR8 GAMZ - Vercel Install Fix

This package fixes the Vercel npm install failure caused by a bad package-lock.json pointing to an internal registry URL.

FILES INCLUDED:
1. package.json
2. .npmrc

WHAT TO DO IN GITHUB:
1. Open your GitHub repository: gr8gamz-webhub
2. Delete package-lock.json from the repository if it exists.
3. Upload/replace package.json with the package.json in this fix folder.
4. Upload .npmrc to the root of the repository.
5. Commit the changes.

IMPORTANT:
Do not upload package-lock.json from the old package.

WHAT TO DO IN VERCEL:
1. Open the GR8 GAMZ project in Vercel.
2. Go to Deployments.
3. Click the failed deployment or trigger a new one.
4. Choose Redeploy.
5. Select Redeploy without build cache if Vercel gives the option.

WHY THIS FIX WORKS:
The previous lockfile included dependency download links pointing to an internal OpenAI package registry. Vercel cannot access that registry, so npm install timed out. The .npmrc file forces npm to use the public npm registry instead.
