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
          total_cents: Math.round(Number(order.total ?? 0) * 100)
        });
      if (orderError) {
        throw orderError;
      }
      const items = Array.isArray(order.items) ? order.items : [];
      if (items.length) {
        const { error: itemsError } = await client
          .from('order_items')
          .insert(
            items.map(item => ({
              order_id: orderId,
              product_id: isUuid(item.id) ? item.id : null,
              product_name: item.name ?? '',
              quantity: Number(item.quantity ?? 1),
              unit_price_cents: Math.round(Number(item.price ?? 0) * 100),
              options: item.options ?? {},
              line_total_cents: Math.round(
                Number(item.price ?? 0) *
                Number(item.quantity ?? 1) *
                100
              )
            }))
          );
        if (itemsError) {
          await client
            .from('orders')
            .delete()
            .eq('id', orderId);
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
    async listOrders() {
      const { data, error } = await client
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_phone,
          pickup_time,
          status,
          payment_status,
          fulfillment_type,
          total_cents,
          notes,
          created_at,
          updated_at,
          order_items (
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price_cents,
            options,
            line_total_cents
          )
        `)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase listOrders error:', error);
        throw error;
      }
      return (data ?? []).map(order => ({
        ...order,
        number: order.order_number,
        total: Number(order.total_cents ?? 0) / 100,
        customer: {
          name: order.customer_name,
          phone: order.customer_phone,
          pickupTime: order.pickup_time
            ? new Date(order.pickup_time).toLocaleTimeString(
                'fr-FR',
                {
                  hour: '2-digit',
                  minute: '2-digit'
                }
              )
            : '—'
        },
        items: (order.order_items ?? []).map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          quantity: Number(item.quantity ?? 1),
          price: Number(item.unit_price_cents ?? 0) / 100,
          options: item.options ?? {},
          lineTotal:
            Number(item.line_total_cents ?? 0) / 100
        }))
      }));
    },
    async updateStatus(orderId, status) {
      const { data, error } = await client
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateStatus error:', error);
        throw error;
      }
      return data;
    }
  };
}
function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}
