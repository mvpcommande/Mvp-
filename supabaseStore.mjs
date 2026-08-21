import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    'Supabase configuration missing: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required.'
  );
}

const client = createClient(url, key);

function isUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toCents(value) {
  return Math.round(Number(value || 0) * 100);
}

export const supabaseStore = {
  async getProducts() {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async createOrder(order) {
    const orderId = crypto.randomUUID();
    const orderNumber = `CF-${Date.now().toString().slice(-6)}`;

    const { error: orderError } = await client
      .from('orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_name: order.customer?.name || '',
        customer_phone: order.customer?.phone || '',
        pickup_time: order.customer?.pickupTime
          ? `${new Date().toISOString().slice(0, 10)}T${order.customer.pickupTime}:00`
          : null,
        status: 'NEW',
        payment_status: 'PAY_AT_STORE',
        fulfillment_type: 'PICKUP',
        total_cents: toCents(order.total),
        notes: order.notes || null
      });

    if (orderError) {
      console.error('[Caz Food] orders insert failed:', orderError);
      throw orderError;
    }

    const items = (order.items || []).map((item) => ({
      order_id: orderId,
      product_id: isUuid(item.id) ? item.id : null,
      product_name: item.name,
      quantity: Number(item.quantity || 1),
      unit_price_cents: toCents(item.price),
      options: item.options || {},
      line_total_cents: toCents(
        Number(item.price || 0) * Number(item.quantity || 1)
      )
    }));

    if (items.length > 0) {
      const { error: itemsError } = await client
        .from('order_items')
        .insert(items);

      if (itemsError) {
        console.error('[Caz Food] order_items insert failed:', itemsError);

        // Pas de DELETE ici :
        // le rôle anon n'a pas besoin d'une policy DELETE.
        // On remonte simplement l'erreur au frontend.
        throw itemsError;
      }
    }

    return {
      ...order,
      id: orderId,
      number: orderNumber,
      orderNumber,
      status: 'NEW'
    };
  },

  async getOrders() {
    const { data, error } = await client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },

  subscribeToOrders(callback) {
    return client
      .channel('caz-food-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  },

  async updateOrderStatus(orderId, status) {
    const allowedStatuses = [
      'NEW',
      'ACCEPTED',
      'PREPARING',
      'READY',
      'CANCELLED'
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    const { data, error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
};

export { client };
