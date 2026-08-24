import test from 'node:test';
import assert from 'node:assert/strict';
import { parisTimeToIsoDate, formatPickupTime, isRestaurantOpen } from './timeFormat.mjs';

test('parisTimeToIsoDate + formatPickupTime round-trip back to the same wall-clock time', () => {
  for (const time of ['00:15', '09:00', '12:30', '19:30', '21:30', '23:45']) {
    const iso = parisTimeToIsoDate(time);
    assert.equal(formatPickupTime(iso), time);
  }
});

test('formatPickupTime converts a raw Postgres UTC timestamp to Europe/Paris, not a naive substring', () => {
  // This is the exact regression the broken admin.js implementation had:
  // it returned '19:30' (the raw UTC digits) for a pickup that was
  // actually 21:30 Paris time (CEST, UTC+2 in August).
  assert.equal(formatPickupTime('2026-08-24 19:30:00+00'), '21:30');
  assert.equal(formatPickupTime('2026-08-24T19:30:00+00:00'), '21:30');
});

test('formatPickupTime handles missing/invalid values', () => {
  assert.equal(formatPickupTime(null), '—');
  assert.equal(formatPickupTime(''), '—');
  assert.equal(formatPickupTime('not-a-date'), '—');
});

test('parisTimeToIsoDate rejects malformed input', () => {
  assert.equal(parisTimeToIsoDate('25:00'), null);
  assert.equal(parisTimeToIsoDate('9:00'), null);
  assert.equal(parisTimeToIsoDate(''), null);
  assert.equal(parisTimeToIsoDate(null), null);
});

test('isRestaurantOpen returns true when no hours are configured (no restriction)', () => {
  assert.equal(isRestaurantOpen(null), true);
  assert.equal(isRestaurantOpen(undefined), true);
});

test('isRestaurantOpen respects per-day ranges in Europe/Paris time', () => {
  const hours = { mon: [['11:00', '14:30'], ['18:30', '22:00']] };
  // 2026-08-24 is a Monday. 19:33 UTC = 21:33 Paris (CEST) -> within the evening range.
  assert.equal(isRestaurantOpen(hours, new Date('2026-08-24T19:33:00Z')), true);
  // 15:00 UTC = 17:00 Paris -> between lunch and dinner, closed.
  assert.equal(isRestaurantOpen(hours, new Date('2026-08-24T15:00:00Z')), false);
});

test('isRestaurantOpen treats a missing/empty day as closed', () => {
  const hours = { mon: [['11:00', '22:00']] };
  // 2026-08-25 is a Tuesday, not in `hours` at all.
  assert.equal(isRestaurantOpen(hours, new Date('2026-08-25T12:00:00Z')), false);
});
