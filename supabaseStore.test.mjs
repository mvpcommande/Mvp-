import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabaseOrderStore } from './supabaseStore.mjs';

test('creates a Caz Food order and returns the database order number', async () => {
  const calls = [];
  const client = {
    from(table) {
      calls.push(['from', table]);
      return {
        insert(payload) {
          calls.push(['insert', payload]);
          return { select() { return { single: async () => ({ data: { id: 'order-1', order_number: 'CF-001' }, error: null }) }; } };
        }
      };
    }
  };
  const store = createSupabaseOrderStore(client);
  const result = await store.createOrder({
    customer: { name: 'Kevin', phone: '0600000000', pickupTime: '20:15' },
    items: [{ id: 'p1', name: 'Tacos double', price: 16.8, quantity: 1, options: { meat: 'Kebab' } }],
    total: 16.8
  });
  assert.equal(result.orderNumber, 'CF-001');
  assert.deepEqual(calls[0], ['from', 'orders']);
});
