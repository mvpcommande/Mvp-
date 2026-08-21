async createOrder(order) {
  const orderId = crypto.randomUUID();
  const orderNumber = `CF-${Date.now().toString().slice(-6)}`;

  const { error: orderError } = await client.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    pickup_time: order.customer.pickupTime
      ? `${new Date().toISOString().slice(0, 10)}T${order.customer.pickupTime}:00`
      : null,
    status: 'NEW',
    payment_status: 'PAY_AT_STORE',
    fulfillment_type: 'PICKUP',
    total_cents: Math.round(order.total * 100)
  });

  if (orderError) throw orderError;

  const { error: itemsError } = await client.from('order_items').insert(
    order.items.map(item => ({
      order_id: orderId,
      product_id: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id)
        ? item.id
        : null,
      product_name: item.name,
      quantity: item.quantity,
      unit_price_cents: Math.round(item.price * 100),
      options: item.options ?? {},
      line_total_cents: Math.round(item.price * item.quantity * 100)
    }))
  );

  if (itemsError) {
    await client.from('orders').delete().eq('id', orderId);
    throw itemsError;
  }

  return {
    ...order,
    id: orderId,
    number: orderNumber,
    orderNumber,
    status: 'NEW'
  };
}
