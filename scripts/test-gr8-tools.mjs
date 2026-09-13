import assert from 'node:assert/strict';
import { calculateCmPer360, calculateEdpi, convertSensitivity, sensitivityPresets } from '../lib/toolMath.ts';

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

console.log('GR8 Tools focused maths tests passed.');
