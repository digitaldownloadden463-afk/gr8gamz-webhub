import { spawnSync } from 'node:child_process';

const audits = [
  'scripts/audit-affiliate-engine.mjs',
  'scripts/audit-global-seo.mjs',
  'scripts/audit-launch-trust.mjs',
  'scripts/audit-partner-profiles.mjs',
  'scripts/audit-passport-platform.mjs',
  'scripts/audit-v26-network-routes.mjs',
  'scripts/audit-v32-live-action.mjs',
  'scripts/audit-v33-control-room.mjs',
  'scripts/audit-v34-backend-bridge.mjs',
  'scripts/audit-v34-database-core.mjs',
  'scripts/audit-v35-11-route-recovery.mjs',
  'scripts/audit-v35-8-stabilise.mjs',
  'scripts/audit-v35-9-security-upgrade.mjs',
  'scripts/audit-v35-auth.mjs'
];

for (const audit of audits) {
  const result = spawnSync(process.execPath, [audit], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`All ${audits.length} release audits passed.`);
