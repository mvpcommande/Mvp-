const isUuid = value =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function createSupabaseOrderStore(client) {
  if (!client) {
    throw new Error('Supabase client manquant.');
  }

  return {
    async createOrder(order) {
      const orderId = crypto.randomUUID();
      const orderNumber = `CF-${Date.now().toString().slice(-6)}`;

      const { error: orderError } = await client
        .from('orders')
        .insert({
          id: orderId,
          order_number: orderNumber,
          customer_name: order.customer?.name ?? '',
          customer_phone: order.customer?.phone ?? '',
          pickup_time: order.customer?.pickupTime
            ? `${new Date().toISOString().slice(0, 10)}T${order.customer.pickupTime}:00`
            : null,
          status: 'NEW',
          payment_status: 'PAY_AT_STORE',
          fulfillment_type: 'PICKUP',
          total_cents: Math.round(Number(order.total || 0) * 100)
        });

      if (orderError) {
        console.error('Erreur création commande:', orderError);
        throw orderError;
      }

      const items = Array.isArray(order.items) ? order.items : [];

      const { error: itemsError } = await client
        .from('order_items')
        .insert(
          items.map(item => ({
            order_id: orderId,
            product_id: isUuid(item.id) ? item.id : null,
            product_name: item.name ?? '',
            quantity: Number(item.quantity || 1),
            unit_price_cents: Math.round(Number(item.price || 0) * 100),
            options: item.options ?? {},
            line_total_cents: Math.round(
              Number(item.price || 0) *
              Number(item.quantity || 1) *
              100
            )
          }))
        );

      if (itemsError) {
        console.error('Erreur création articles:', itemsError);

        await client
          .from('orders')
          .delete()
          .eq('id', orderId);

        throw itemsError;
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

      if (error) {
        console.error('Erreur récupération commandes:', error);
        throw error;
      }

      return data ?? [];
    },

    async updateOrderStatus(orderId, status) {
      const { data, error } = await client
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour statut:', error);
        throw error;
      }

      return data;
    }
  };
}
