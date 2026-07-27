import fs from 'fs';

const checks = [
  ['src/app/live/page.js', 'GR8 Arcade Pulse'],
  ['src/components/passport/ArcadePulsePanel.js', 'getPulseSnapshot'],
  ['src/components/passport/DailyMissionsPanel.js', 'claimMissionReward'],
  ['src/components/community/ClubhouseSubmitForm.js', 'submitClubhousePost'],
  ['src/app/community/[room]/page.js', 'generateStaticParams'],
  ['src/data/community.js', 'communityRooms'],
  ['src/lib/passportClient.js', 'CLUBHOUSE_KEY'],
  ['src/lib/passportClient.js', 'MISSION_CLAIMS_KEY'],
  ['src/app/page.js', 'ArcadePulsePanel'],
  ['src/components/Header.js', '/live'],
  ['src/data/content.js', 'v32-arcade-pulse-missions-clubhouse-action-layer'],
  ['src/lib/crawl.js', '/live']
];

const failures = [];
for (const [file, needle] of checks) {
  if (!fs.existsSync(file)) {
    failures.push(`${file} is missing`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes(needle)) failures.push(`${file} does not include ${needle}`);
}

if (failures.length) {
  console.error('V32 live-action audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('V32 live-action audit passed.');
