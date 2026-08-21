function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}
/**
 * Convertit une heure choisie par le client (HH:mm)
 * en timestamp ISO correspondant à l'heure locale Europe/Paris.
 *
 * Exemple été :
 * 20:00 Europe/Paris
 * -> 18:00 UTC
 *
 * Exemple hiver :
 * 20:00 Europe/Paris
 * -> 19:00 UTC
 */
function parisTimeToIsoDate(time) {
  if (!time || !/^\d{2}:\d{2}$/.test(String(time))) {
    return null;
  }
  const [hours, minutes] = String(time)
    .split(':')
    .map(Number);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  // On construit une date "naïve" correspondant à l'heure
  // demandée à Paris, puis on détermine automatiquement
  // le décalage Europe/Paris.
  const utcGuess = new Date(
    Date.UTC(
      year,
      month,
      day,
      hours,
      minutes,
      0,
      0
    )
  );
  const parisFormatter = new Intl.DateTimeFormat(
    'en-US',
    {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }
  );
  const parisParts = parisFormatter.formatToParts(
    utcGuess
  );
  const parisHour = Number(
    parisParts.find(
      part => part.type === 'hour'
    )?.value ?? 0
  );
  const parisMinute = Number(
    parisParts.find(
      part => part.type === 'minute'
    )?.value ?? 0
  );
  const requestedMinutes =
    hours * 60 + minutes;
  const guessedParisMinutes =
    parisHour * 60 + parisMinute;
  const offsetMinutes =
    guessedParisMinutes -
    requestedMinutes;
  const utcDate = new Date(
    utcGuess.getTime() -
      offsetMinutes * 60 * 1000
  );
  return utcDate.toISOString();
}
export function createSupabaseOrderStore(client) {
  if (!client) {
    throw new Error(
      'Supabase client manquant.'
    );
  }
  return {
    /**
     * Crée une commande dans orders puis
     * ses articles dans order_items.
     */
    async createOrder(order) {
      const orderId =
        crypto.randomUUID();
      const orderNumber =
        `CF-${Date.now()
          .toString()
          .slice(-6)}`;
      const pickupTime =
        parisTimeToIsoDate(
          order.customer?.pickupTime
        );
      const { error: orderError } =
        await client
          .from('orders')
          .insert({
            id: orderId,
            order_number:
              orderNumber,
            customer_name:
              order.customer?.name ??
              '',
            customer_phone:
              order.customer?.phone ??
              '',
            pickup_time:
              pickupTime,
            status:
              'NEW',
            payment_status:
              'PAY_AT_STORE',
            fulfillment_type:
              'PICKUP',
            total_cents:
              Math.round(
                Number(
                  order.total ?? 0
                ) * 100
              )
          });
      if (orderError) {
        console.error(
          'Erreur création commande:',
          orderError
        );
        throw orderError;
      }
      const items =
        Array.isArray(order.items)
          ? order.items
          : [];
      if (items.length) {
        const {
          error: itemsError
        } = await client
          .from('order_items')
          .insert(
            items.map(item => ({
              order_id:
                orderId,
              product_id:
                isUuid(item.id)
                  ? item.id
                  : null,
              product_name:
                item.name ?? '',
              quantity:
                Number(
                  item.quantity ?? 1
                ),
              unit_price_cents:
                Math.round(
                  Number(
                    item.price ?? 0
                  ) * 100
                ),
              options:
                item.options ?? {},
              line_total_cents:
                Math.round(
                  Number(
                    item.price ?? 0
                  ) *
                  Number(
                    item.quantity ?? 1
                  ) *
                  100
                )
            }))
          );
        if (itemsError) {
          console.error(
            'Erreur création articles:',
            itemsError
          );
          // Rollback logique :
          // si les articles échouent,
          // on supprime la commande.
          await client
            .from('orders')
            .delete()
            .eq(
              'id',
              orderId
            );
          throw itemsError;
        }
      }
      return {
        ...order,
        id:
          orderId,
        number:
          orderNumber,
        orderNumber:
          orderNumber,
        status:
          'NEW'
      };
    },
    /**
     * Récupère toutes les commandes
     * avec leurs order_items.
     */
    async listOrders() {
      const {
        data,
        error
      } = await client
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
        .order(
          'created_at',
          {
            ascending: false
          }
        );
      if (error) {
        console.error(
          'Erreur récupération commandes:',
          error
        );
        throw error;
      }
      return (data ?? []).map(
        order => ({
          ...order,
          number:
            order.order_number,
          total:
            Number(
              order.total_cents ?? 0
            ) / 100,
          customer: {
            name:
              order.customer_name,
            phone:
              order.customer_phone,
            pickupTime:
              formatPickupTime(
                order.pickup_time
              )
          },
          items:
            (
              order.order_items ?? []
            ).map(item => ({
              id:
                item.id,
              productId:
                item.product_id,
              name:
                item.product_name,
              quantity:
                Number(
                  item.quantity ?? 1
                ),
              price:
                Number(
                  item.unit_price_cents ??
                    0
                ) / 100,
              options:
                item.options ?? {},
              lineTotal:
                Number(
                  item.line_total_cents ??
                    0
                ) / 100
            }))
        })
      );
    },
    /**
     * Change le statut d'une commande.
     */
    async updateStatus(
      orderId,
      status
    ) {
      const {
        data,
        error
      } = await client
        .from('orders')
        .update({
          status,
          updated_at:
            new Date().toISOString()
        })
        .eq(
          'id',
          orderId
        )
        .select()
        .single();
      if (error) {
        console.error(
          'Erreur changement statut:',
          error
        );
        throw error;
      }
      return data;
    }
  };
}
/**
 * Convertit un timestamp Supabase
 * en heure locale Europe/Paris.
 *
 * Exemple :
 * 2026-08-21T18:00:00+00
 * -> 20:00
 */
function formatPickupTime(value) {
  if (!value) {
    return '—';
  }
  const date =
    new Date(value);
  if (Number.isNaN(
    date.getTime()
  )) {
    return '—';
  }
  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      timeZone:
        'Europe/Paris',
      hour:
        '2-digit',
      minute:
        '2-digit',
      hourCycle:
        'h23'
    }
  ).format(date);
}
