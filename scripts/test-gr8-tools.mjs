import assert from 'node:assert/strict';
import { calculateCmPer360, calculateEdpi, convertSensitivity, sensitivityPresets } from '../lib/toolMath.ts';
import { createChildToolChallenge, parseToolChallengeHash, serializeToolChallengeHash, toolChallengeUrl } from '../lib/toolChallenge.ts';

assert.equal(calculateEdpi(800, 2), 1600);
assert.equal(calculateEdpi(0, 2), null);
assert.equal(calculateEdpi(800, Number.NaN), null);

const cm360 = calculateCmPer360(800, 2, 0.022);
assert.ok(cm360 !== null);
assert.ok(Math.abs(cm360 - 25.9772727273) < 0.000001);
assert.equal(calculateCmPer360(-800, 2, 0.022), null);

assert.equal(convertSensitivity(2, 0.022, 0.022), 2);
assert.equal(convertSensitivity(2, 0.022, 0.011), 4);
assert.equal(convertSensitivity(2, 0.022, 0), null);

assert.deepEqual(sensitivityPresets.map((preset) => preset.degreesPerCount), [0.022, 0.022, 0.022]);
assert.equal(new Set(sensitivityPresets.map((preset) => preset.id)).size, sensitivityPresets.length);

const cps = parseToolChallengeHash('#challenge=cps&score=9.42&duration=10&sid=a1b2c3d4');
assert.deepEqual(cps, { kind: 'cps', score: 9.42, duration: 10, sid: 'a1b2c3d4' });
const spacebar = parseToolChallengeHash('#challenge=spacebar&score=8.7&duration=60&sid=deadbeef&parent=a1b2c3d4');
assert.deepEqual(spacebar, { kind: 'spacebar', score: 8.7, duration: 60, sid: 'deadbeef', parent: 'a1b2c3d4' });
for (const duration of [5, 10, 30, 60]) assert.equal(parseToolChallengeHash(`#challenge=cps&score=1&duration=${duration}&sid=a1b2c3d4`)?.duration, duration);
for (const invalid of [
  '#challenge=cps&score=1&duration=12&sid=a1b2c3d4',
  '#challenge=cps&score=NaN&duration=10&sid=a1b2c3d4',
  '#challenge=cps&score=Infinity&duration=10&sid=a1b2c3d4',
  '#challenge=cps&score=-1&duration=10&sid=a1b2c3d4',
  '#challenge=cps&score=101&duration=10&sid=a1b2c3d4',
  '#challenge=cps&score=1&duration=10&sid=bad!',
  '#challenge=cps&score=1&duration=10&sid=a1b2c3d4&parent=bad!',
  '#challenge=cps&score=1&duration=10&sid=a1b2c3d4&sid=deadbeef',
  '#challenge=cps&score=1&duration=10&sid=a1b2c3d4&extra=value',
  '#challenge=aim&score=1&duration=10&sid=a1b2c3d4',
  '#not-a-challenge',
]) assert.equal(parseToolChallengeHash(invalid), null);
assert.equal(parseToolChallengeHash('', 'cps'), null);

const child = createChildToolChallenge('cps', 10.18, 10, spacebar, '11223344');
assert.deepEqual(child, { kind: 'cps', score: 10.18, duration: 10, sid: '11223344', parent: 'deadbeef' });
assert.equal(serializeToolChallengeHash(child), '#challenge=cps&score=10.18&duration=10&sid=11223344&parent=deadbeef');
assert.equal(toolChallengeUrl('https://www.gr8gamz.com/tools/cps-test?ignored=yes#old', child), 'https://www.gr8gamz.com/tools/cps-test#challenge=cps&score=10.18&duration=10&sid=11223344&parent=deadbeef');

console.log('GR8 Tools focused maths tests passed.');
