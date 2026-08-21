const isUuid = value =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function createSupabaseOrderStore(client) {
  if (!client) {
    throw new Error('Client Supabase non disponible.');
  }

  async function createOrder(order) {
    const orderId = crypto.randomUUID();
    const orderNumber = `CF-${Date.now().toString().slice(-6)}`;

    const customer = order?.customer ?? {};
    const items = Array.isArray(order?.items) ? order.items : [];

    const total = Number(order?.total ?? 0);

    const pickupTime = customer.pickupTime
      ? `${new Date().toISOString().slice(0, 10)}T${customer.pickupTime}:00`
      : null;

    const orderPayload = {
      id: orderId,
      order_number: orderNumber,
      customer_name: customer.name ?? '',
      customer_phone: customer.phone ?? '',
      pickup_time: pickupTime,
      status: 'NEW',
      payment_status: 'PAY_AT_STORE',
      fulfillment_type: 'PICKUP',
      total_cents: Math.round(total * 100)
    };

    console.log('CAZ FOOD — INSERT ORDERS', orderPayload);

    const {
      data: insertedOrder,
      error: orderError
    } = await client
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) {
      console.error('CAZ FOOD — ERREUR ORDERS', orderError);
      throw new Error(
        `Supabase orders: ${orderError.message || 'erreur inconnue'}`
      );
    }

    const itemPayload = items.map(item => ({
      order_id: orderId,
      product_id: isUuid(item?.id) ? item.id : null,
      product_name: item?.name ?? '',
      quantity: Number(item?.quantity ?? 1),
      unit_price_cents: Math.round(Number(item?.price ?? 0) * 100),
      options: item?.options ?? {},
      line_total_cents: Math.round(
        Number(item?.price ?? 0) *
        Number(item?.quantity ?? 1) *
        100
      )
    }));

    if (itemPayload.length > 0) {
      console.log('CAZ FOOD — INSERT ORDER ITEMS', itemPayload);

      const { error: itemsError } = await client
        .from('order_items')
        .insert(itemPayload);

      if (itemsError) {
        console.error('CAZ FOOD — ERREUR ORDER ITEMS', itemsError);

        await client
          .from('orders')
          .delete()
          .eq('id', orderId);

        throw new Error(
          `Supabase order_items: ${itemsError.message || 'erreur inconnue'}`
        );
      }
    }

    return {
      ...order,
      id: insertedOrder?.id ?? orderId,
      number: insertedOrder?.order_number ?? orderNumber,
      orderNumber: insertedOrder?.order_number ?? orderNumber,
      status: insertedOrder?.status ?? 'NEW'
    };
  }

  async function getOrders() {
    const { data, error } = await client
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('CAZ FOOD — ERREUR GET ORDERS', error);
      throw error;
    }

    return data ?? [];
  }

  async function updateOrderStatus(orderId, status) {
    const { data, error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('CAZ FOOD — ERREUR STATUS', error);
      throw error;
    }

    return data;
  }

  return {
    createOrder,
    getOrders,
    updateOrderStatus
  };
}
