import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { partnerGameProfiles, getPartnerNetworkClusterRoutes } from '../src/data/partnerGameProfiles.js';

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));

function hasValidHostedImage(image) {
  if (typeof image !== 'string' || !image.startsWith('/') || image.startsWith('//')) return false;

  const pathname = image.split(/[?#]/, 1)[0];
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const assetPath = path.resolve(publicRoot, decodedPath.slice(1));
  if (!assetPath.startsWith(publicRoot)) return false;

  try {
    const asset = fs.statSync(assetPath);
    return asset.isFile() && asset.size > 0;
  } catch {
    return false;
  }
}

const requiredRoutes = [
  '/more-free-games',
  ...partnerGameProfiles.map((profile) => profile.path),
  ...getPartnerNetworkClusterRoutes()
];

const failures = [];
for (const profile of partnerGameProfiles) {
  if (!profile.path?.startsWith('/more-free-games/')) failures.push(`${profile.title}: bad profile path`);
  if (!profile.playPath?.endsWith('/play')) failures.push(`${profile.title}: missing play route`);
  if (!hasValidHostedImage(profile.image)) failures.push(`${profile.title}: missing GR8 hosted cover image`);
  if (!Array.isArray(profile.keywords) || profile.keywords.length < 3) failures.push(`${profile.title}: needs keyword set`);
  if (!Array.isArray(profile.faqs) || profile.faqs.length < 3) failures.push(`${profile.title}: needs FAQ set`);
}

if (requiredRoutes.length < 40) failures.push('Network route set is too small');

if (failures.length) {
  console.error('V26 network route audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`V26 audit passed: ${partnerGameProfiles.length} profiles and ${requiredRoutes.length} network routes checked.`);
