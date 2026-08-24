import test from 'node:test';
import assert from 'node:assert/strict';
import {
  subscribeToOrderChanges,
  printOrder,
  aggregateOrderItems,
  buildStockSummaryCsv
} from './adminFeatures.mjs';

test('aggregateOrderItems groups identical product+options across orders and sums quantity/revenue', () => {
  const orders = [
    {
      order_items: [
        { product_name: 'Menu tacos simple', quantity: 2, line_total_cents: 2580, options: { meat: 'Kebab', sauce: 'Algérienne' } },
        { product_name: 'Menu burger', quantity: 1, line_total_cents: 1105, options: { drink: 'Sprite' } }
      ]
    },
    {
      order_items: [
        { product_name: 'Menu tacos simple', quantity: 1, line_total_cents: 1290, options: { meat: 'Kebab', sauce: 'Algérienne' } }
      ]
    }
  ];

  const rows = aggregateOrderItems(orders);

  const tacos = rows.find((row) => row.name === 'Menu tacos simple');
  assert.equal(tacos.quantity, 3);
  assert.equal(tacos.revenueCents, 3870);
  assert.equal(tacos.meat, 'Kebab');

  // Sorted by quantity desc, so the 3-unit tacos line comes before the 1-unit burger line.
  assert.equal(rows[0].name, 'Menu tacos simple');
});

test('aggregateOrderItems keeps different option combos of the same product separate', () => {
  const orders = [
    {
      order_items: [
        { product_name: 'Menu tacos simple', quantity: 1, line_total_cents: 1290, options: { meat: 'Kebab' } },
        { product_name: 'Menu tacos simple', quantity: 1, line_total_cents: 1290, options: { meat: 'Poulet' } }
      ]
    }
  ];

  const rows = aggregateOrderItems(orders);
  assert.equal(rows.length, 2);
});

test('buildStockSummaryCsv produces a semicolon-separated, French-formatted CSV', () => {
  const csv = buildStockSummaryCsv([
    { name: 'Menu tacos simple', meat: 'Kebab', sauce: 'Algérienne', drink: '', quantity: 3, revenueCents: 3870 }
  ]);

  const lines = csv.split('\n');
  assert.equal(lines[0], 'Article;Viande;Sauce;Boisson;Quantité;Total (€)');
  assert.equal(lines[1], 'Menu tacos simple;Kebab;Algérienne;;3;38,70');
});

test('buildStockSummaryCsv quotes values containing the separator', () => {
  const csv = buildStockSummaryCsv([
    { name: 'Menu; spécial', meat: '', sauce: '', drink: '', quantity: 1, revenueCents: 100 }
  ]);

  assert.match(csv, /"Menu; spécial"/);
});

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
