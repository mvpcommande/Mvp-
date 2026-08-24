import test from 'node:test';
import assert from 'node:assert/strict';
import { subscribeToOrderChanges, printOrder } from './adminFeatures.mjs';

test('realtime subscription listens to order changes', () => {
  const calls = [];
  const channel = {
    on: (...args) => { calls.push(['on', ...args]); return channel; },
    subscribe: (...args) => { calls.push(['subscribe', ...args]); return channel; }
  };
  const client = { channel: (name) => { calls.push(['channel', name]); return channel; } };
  const callback = () => {};
  const result = subscribeToOrderChanges(client, callback);
  assert.equal(result, channel);
  assert.match(calls[0][1], /^caz-food-orders-\d+$/);
  const onCalls = calls.filter((call) => call[0] === 'on');
  assert.deepEqual(
    onCalls.map((call) => call[2].event).sort(),
    ['DELETE', 'INSERT', 'UPDATE']
  );
  for (const call of onCalls) {
    assert.equal(call[1], 'postgres_changes');
    assert.equal(call[2].schema, 'public');
    assert.equal(call[2].table, 'orders');
  }
  assert.equal(calls.at(-1)[0], 'subscribe');
});

test('printOrder opens a print window with ticket markup', () => {
  let opened = null;
  const win = { document: { write: (html) => { opened = html; }, close: () => {}, title: '' }, focus: () => {}, print: () => {} };
  const order = { order_number: 'CF-123', customer_name: 'Kevin', pickup_time: '2026-08-21T20:15:00', total_cents: 1680, order_items: [{ product_name: 'Tacos double', quantity: 1, options: { meat: 'Poulet' }, line_total_cents: 1680 }] };
  printOrder(order, () => win);
  assert.match(opened, /CF-123/);
  assert.match(opened, /Tacos double/);
});
