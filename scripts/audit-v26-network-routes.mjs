import { partnerGameProfiles, getPartnerNetworkClusterRoutes } from '../src/data/partnerGameProfiles.js';

const requiredRoutes = [
  '/more-free-games/trending',
  '/more-free-games/popular',
  '/more-free-games/new',
  '/play-next',
  ...getPartnerNetworkClusterRoutes()
];

const failures = [];
for (const profile of partnerGameProfiles) {
  if (!profile.path?.startsWith('/more-free-games/')) failures.push(`${profile.title}: bad profile path`);
  if (!profile.playPath?.endsWith('/play')) failures.push(`${profile.title}: missing play route`);
  if (!profile.image?.startsWith('/partner-games/')) failures.push(`${profile.title}: missing GR8 hosted cover image`);
  if (!Array.isArray(profile.keywords) || profile.keywords.length < 3) failures.push(`${profile.title}: needs keyword set`);
  if (!Array.isArray(profile.faqs) || profile.faqs.length < 3) failures.push(`${profile.title}: needs FAQ set`);
}

if (requiredRoutes.length < 8) failures.push('Network route set is too small');

if (failures.length) {
  console.error('V26 network route audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`V26 audit passed: ${partnerGameProfiles.length} profiles and ${requiredRoutes.length} network routes checked.`);
