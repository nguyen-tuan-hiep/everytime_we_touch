import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getActiveLyricIndex, validateTimes } from '../lib/lyrics';
import { formatTime } from '../lib/time';
test('active line follows timestamp boundaries and backward seeking', () => { const lines = [{time: 8, text: 'a'}, {time: 12, text: 'b'}]; assert.equal(getActiveLyricIndex(lines, 7), -1); assert.equal(getActiveLyricIndex(lines, 12), 1); assert.equal(getActiveLyricIndex(lines, 9), 0); assert.equal(getActiveLyricIndex([], 20), -1); });
test('export requires complete, finite, ordered timestamps inside track', () => { assert.equal(validateTimes([0, 5, 10], 20), true); for (const times of [[null, 5], [5, 3], [0, 0], [-1, 3], [0, 21], [0, NaN]]) assert.equal(validateTimes(times, 20), false); });
test('time formatting handles invalid and negative input', () => { assert.equal(formatTime(68.9), '1:08'); assert.equal(formatTime(NaN), '0:00'); assert.equal(formatTime(-4), '0:00'); });
