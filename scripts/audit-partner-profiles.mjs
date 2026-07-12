import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const modulePath = pathToFileURL(path.join(root, 'src/data/partnerGameProfiles.js')).href;
const { getPartnerGameProfiles } = await import(modulePath);
const profiles = getPartnerGameProfiles();

const required = ['title', 'slug', 'provider', 'category', 'image', 'path', 'playPath', 'description', 'whyPicked'];
const problems = [];
const seenSlugs = new Set();
const seenTitles = new Set();

for (const profile of profiles) {
  for (const field of required) {
    if (!profile[field]) problems.push(`${profile.slug || profile.title || 'unknown'} missing ${field}`);
  }
  if (seenSlugs.has(profile.slug)) problems.push(`duplicate slug ${profile.slug}`);
  if (seenTitles.has(String(profile.title).toLowerCase())) problems.push(`duplicate title ${profile.title}`);
  seenSlugs.add(profile.slug);
  seenTitles.add(String(profile.title).toLowerCase());
  if (!String(profile.path || '').startsWith('/more-free-games/')) problems.push(`${profile.slug} path is not GR8 branded`);
  if (!String(profile.playPath || '').endsWith('/play')) problems.push(`${profile.slug} playPath must end with /play`);
  if (!Array.isArray(profile.keywords) || profile.keywords.length < 3) problems.push(`${profile.slug} needs at least 3 keywords`);
  if (!Array.isArray(profile.faqs) || profile.faqs.length < 3) problems.push(`${profile.slug} needs at least 3 FAQs`);
}

console.log(`Partner profiles checked: ${profiles.length}`);
if (problems.length) {
  console.error(`Problems found: ${problems.length}`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
console.log('Audit passed: all partner profiles have branded profile paths, direct play paths, keywords and FAQs.');
