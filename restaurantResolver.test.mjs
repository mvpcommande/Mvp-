import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isUuid,
  getRestaurantSlugFromPath,
  getRestaurantResolverHost,
  resolveRestaurant
} from './restaurantResolver.mjs';

const VALID_UUID = 'a1b2c3d4-e5f6-4a1b-8c2d-1234567890ab';

test('isUuid accepts a valid UUID and rejects garbage', () => {
  assert.equal(isUuid(VALID_UUID), true);
  assert.equal(isUuid('not-a-uuid'), false);
  assert.equal(isUuid(undefined), false);
});

test('getRestaurantSlugFromPath reads the first path segment as the slug', () => {
  assert.equal(
    getRestaurantSlugFromPath({ pathname: '/caz-food' }),
    'caz-food'
  );
  assert.equal(
    getRestaurantSlugFromPath({ pathname: '/caz-food/admin' }),
    'caz-food'
  );
  assert.equal(getRestaurantSlugFromPath({ pathname: '/' }), null);
});

test('getRestaurantSlugFromPath never treats "admin" as a restaurant slug', () => {
  assert.equal(getRestaurantSlugFromPath({ pathname: '/admin' }), null);
});

test('getRestaurantResolverHost falls back to the real hostname when there is no slug', () => {
  const location = { pathname: '/admin', hostname: 'cazfood31.netlify.app' };
  assert.equal(getRestaurantResolverHost(location), 'cazfood31.netlify.app');
});

test('getRestaurantResolverHost builds a virtual *.foodatoi.fr host from a slug', () => {
  const location = { pathname: '/caz-food', hostname: 'www.foodatoi.fr' };
  assert.equal(getRestaurantResolverHost(location), 'caz-food.foodatoi.fr');
});

test('resolveRestaurant calls resolve_restaurant with the resolved host and returns the restaurant', async () => {
  const calls = [];
  const client = {
    rpc: (fn, args) => {
      calls.push([fn, args]);
      return { data: { id: VALID_UUID, name: 'Caz Food' }, error: null };
    }
  };
  const location = { pathname: '/admin', hostname: 'cazfood31.netlify.app' };

  const restaurant = await resolveRestaurant(client, location);

  assert.deepEqual(calls[0], [
    'resolve_restaurant',
    { hostname: 'cazfood31.netlify.app' }
  ]);
  assert.equal(restaurant.id, VALID_UUID);
});

test('resolveRestaurant throws a clear error when no restaurant matches', async () => {
  const client = { rpc: () => ({ data: null, error: null }) };
  const location = { pathname: '/', hostname: 'unknown.netlify.app' };

  await assert.rejects(
    () => resolveRestaurant(client, location),
    /Aucun restaurant FOODATOI configuré/
  );
});

test('resolveRestaurant propagates Supabase errors', async () => {
  const client = {
    rpc: () => ({ data: null, error: new Error('rpc down') })
  };

  await assert.rejects(
    () => resolveRestaurant(client, { pathname: '/', hostname: 'x' }),
    /rpc down/
  );
});
