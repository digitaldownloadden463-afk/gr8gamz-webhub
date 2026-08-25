import fs from 'node:fs';
import assert from 'node:assert/strict';
import { adjustRemainingMilliseconds, clampTimerSeconds, formatTimer, remainingMilliseconds, timerSecondsFromParts } from '../lib/classroomTimer.ts';

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const hub = read('app/classroom/page.tsx');
const tool = read('app/classroom/timer/page.tsx');
const timer = read('components/classroom/ClassroomTimer.tsx');
const viewTracker = read('components/classroom/ClassroomViewTracker.tsx');
const classroom = read('lib/classroom.ts');
const analytics = read('lib/analytics.ts');
const policy = read('lib/ads/adPolicy.ts');
const placements = read('lib/ads/placements.ts');
const sitemap = read('lib/sitemapXml.ts');
const imageSitemap = read('app/sitemap-images.xml/route.ts');
const footer = read('components/Footer.tsx');
const homepage = read('app/page.tsx');
const profile = read('app/more-free-games/[slug]/page.tsx');
const research = read('reports/classroom-e1-search-research.md');

for (const [path, source] of [['/classroom', hub], ['/classroom/timer', tool]]) {
  expect(source.includes(`canonical('${path}')`), `${path} is missing a self-referencing canonical.`);
  expect(source.includes("'@type': 'BreadcrumbList'"), `${path} is missing BreadcrumbList data.`);
  expect(source.includes(`item: canonical('${path}')`), `${path} final breadcrumb is not canonical.`);
  expect(source.includes('openGraph:'), `${path} is missing Open Graph metadata.`);
}

expect(tool.includes("'@type': 'WebApplication'"), 'Timer does not expose accurate WebApplication data.');
expect(!hub.includes("'@type': 'FAQPage'") && !tool.includes("'@type': 'FAQPage'"), 'Ineligible FAQ rich-result markup was added.');
expect(!hub.includes('AggregateRating') && !tool.includes('AggregateRating'), 'Fabricated rating markup was added.');
expect(classroom.includes("slugs: ['duck-math'"), 'Math Duck is not represented by the existing Duck Math canonical.');
expect(profile.includes("profile.slug === 'duck-math' ? 'Math Duck (Duck Math)'"), 'Duck Math profile does not explain the Math Duck display name.');

for (const event of [
  'classroom_hub_view', 'classroom_timer_view', 'timer_preset_selected', 'timer_custom_set',
  'timer_started', 'timer_paused', 'timer_resumed', 'timer_completed', 'timer_reset',
  'timer_fullscreen', 'timer_sound_enabled', 'classroom_game_selected', 'classroom_filter_used'
]) expect(analytics.includes(`'${event}'`), `Analytics event ${event} is missing.`);
expect(analytics.includes("getConsentChoice() !== 'accepted'"), 'Classroom analytics do not inherit the consent gate.');
expect(viewTracker.includes("consent !== 'accepted'"), 'Classroom view events do not wait for analytics consent.');
expect(timer.includes("const preferencesKey = 'gr8:classroom-timer:prefs:v1'"), 'Timer preference key is not stable.');
expect(timer.includes('JSON.stringify({ soundEnabled, mode })'), 'Timer persists more than the documented harmless preferences.');
expect(!timer.includes('setInterval(() => setRemaining'), 'Timer uses unreliable interval decrementing.');
expect(timer.includes('Date.now() + next'), 'Timer is not based on an absolute end timestamp.');
expect(timer.includes("document.addEventListener('visibilitychange'"), 'Background-tab correction is missing.');
expect(timer.includes('completionHandled.current'), 'Timer does not prevent duplicate completion.');
expect(timer.includes('aria-live="polite"'), 'Timer lacks restrained screen-reader status.');
expect(timer.includes('role="alertdialog"') && timer.includes('Reset the running timer?'), 'Running reset confirmation is missing.');
expect(timer.includes('requestFullscreen') && timer.includes('fullscreenFallback'), 'Fullscreen fallback is missing.');
expect(timer.includes('const [soundEnabled, setSoundEnabled] = useState(false)'), 'Completion sound is not muted by default.');

assert.equal(timerSecondsFromParts(1, 2, 3), 3723);
assert.equal(timerSecondsFromParts(0, 0, -2), 0);
assert.equal(clampTimerSeconds(Number.NaN), 0);
assert.equal(remainingMilliseconds(10_000, 4_000), 6_000);
assert.equal(remainingMilliseconds(4_000, 10_000), 0);
assert.equal(adjustRemainingMilliseconds(30_000, -60), 0);
assert.equal(adjustRemainingMilliseconds(30_000, 60), 90_000);
assert.equal(formatTimer(3_723_000), '01:02:03');
assert.equal(formatTimer(65_000), '01:05');

expect(policy.includes("if (route === '/classroom') return policies['classroom-hub']"), 'Classroom hub ad policy is not explicit.');
expect(policy.includes("if (route === '/classroom/timer') return policies['classroom-tool']"), 'Classroom timer ad policy is not explicit.');
expect(!policy.includes('autoAdsAllowed: true'), 'Auto ads were enabled.');
expect(['upper', 'mid', 'lower'].every((part) => hub.includes(`placement="classroom-${part}-content"`)), 'Classroom hub does not expose three separated opportunities.');
expect(tool.includes('placement="classroom-tool-lower-content"'), 'Timer page lacks its single separated lower opportunity.');
expect((tool.match(/<AdSensePlacement /g) || []).length === 1, 'Timer page exposes more than one manual ad component.');
expect(!timer.includes('AdSensePlacement'), 'An ad was inserted inside the active timer component.');
expect(placements.includes("'classroom-tool-lower-content'"), 'Timer ad placement is not centrally registered.');

expect(sitemap.includes('classroomRoutePaths()'), 'Classroom routes are absent from the regular sitemap.');
expect(imageSitemap.includes("'/classroom/gr8-classroom-share.png'"), 'Classroom image is absent from the image sitemap.');
expect(imageSitemap.includes("'/classroom/gr8-classroom-timer-share.png'"), 'Timer image is absent from the image sitemap.');
expect(footer.includes("['/classroom', 'GR8 Classroom'"), 'GR8 Classroom is absent from the footer.');
expect(homepage.includes('href="/classroom"'), 'GR8 Classroom is absent from the homepage.');
expect(research.includes('**Free Classroom Timer / Online Classroom Timer, 88/100.**'), 'Research does not record the scored winner.');
expect(!research.match(/monthly searches|CPC £|keyword difficulty \d/i), 'Research contains unsupported paid-tool metrics.');

for (const image of ['public/classroom/gr8-classroom-share.png', 'public/classroom/gr8-classroom-timer-share.png']) {
  expect(fs.existsSync(image), `${image} is missing.`);
  if (fs.existsSync(image)) {
    const data = fs.readFileSync(image);
    expect(data.readUInt32BE(16) === 1200 && data.readUInt32BE(20) === 630, `${image} is not 1200x630.`);
  }
}

const registry = JSON.parse(read('src/data/partnerCatalog.generated.json'));
for (const slug of ['duck-math', 'bloxorz', 'memory-match-lite', 'sudoku-master']) {
  const record = registry.games.find((game) => game.slug === slug);
  expect(record?.indexable === true && record?.status === 'verified-indexable', `Classroom partner game ${slug} is not currently verified and indexable.`);
}

if (failures.filter(Boolean).length) {
  console.error(failures.filter(Boolean).join('\n'));
  process.exit(1);
}

console.log('GR8 Classroom E1 validation passed: research, timer mechanics, privacy, analytics, ad separation, canonicals, sitemaps and verified game records.');
