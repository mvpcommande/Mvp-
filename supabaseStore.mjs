function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}
/**
 * Convertit une heure HH:mm choisie en Europe/Paris
 * vers un timestamp ISO UTC.
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
  const parisParts =
    parisFormatter.formatToParts(utcGuess);
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
/**
 * Génère un numéro de commande FOODATOI.
 *
 * Exemple :
 * FA-260822-483921
 */
function generateOrderNumber() {
  const now = new Date();
  const datePart =
    `${String(now.getFullYear()).slice(-2)}` +
    `${String(now.getMonth() + 1).padStart(2, '0')}` +
    `${String(now.getDate()).padStart(2, '0')}`;
  const randomPart =
    Math.floor(
      100000 +
      Math.random() * 900000
    );
  return `FA-${datePart}-${randomPart}`;
}
/**
 * Crée un store Supabase FOODATOI.
 *
 * restaurantId est obligatoire.
 *
 * Architecture :
 *
 * FOODATOI
 *   ↓
 * restaurantId
 *   ↓
 * orders.restaurant_id
 *   ↓
 * order_items.restaurant_id
 */
export function createSupabaseOrderStore(
  client,
  restaurantId
) {
  if (!client) {
    throw new Error(
      'Supabase client manquant.'
    );
  }
  if (!isUuid(restaurantId)) {
    throw new Error(
      'restaurantId FOODATOI invalide ou manquant.'
    );
  }
  return {
    /**
     * Crée une commande pour le restaurant courant.
     */
    async createOrder(order) {
      const orderId =
        crypto.randomUUID();
      const orderNumber =
        generateOrderNumber();
      const pickupTime =
        parisTimeToIsoDate(
          order.customer?.pickupTime
        );
      const totalCents =
        Math.round(
          Number(
            order.total ?? 0
          ) * 100
        );
      const {
        error: orderError
      } = await client
        .from('orders')
        .insert({
          id: orderId,
          restaurant_id:
            restaurantId,
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
            totalCents
        });
      if (orderError) {
        console.error(
          'FOODATOI — erreur création commande:',
          orderError
        );
        throw orderError;
      }
      const items =
        Array.isArray(order.items)
          ? order.items
          : [];
      if (items.length) {
        const rows =
          items.map(item => ({
            order_id:
              orderId,
            restaurant_id:
              restaurantId,
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
          }));
        const {
          error: itemsError
        } = await client
          .from('order_items')
          .insert(rows);
        if (itemsError) {
          console.error(
            'FOODATOI — erreur création articles:',
            itemsError
          );
          /*
           * Rollback logique.
           *
           * La suppression est limitée
           * au restaurant courant.
           */
          await client
            .from('orders')
            .delete()
            .eq(
              'id',
              orderId
            )
            .eq(
              'restaurant_id',
              restaurantId
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
        restaurantId:
          restaurantId,
        status:
          'NEW'
      };
    },
    /**
     * Récupère les commandes du restaurant courant.
     *
     * IMPORTANT :
     * Le filtre restaurant_id est volontairement
     * systématique pour éviter les fuites cross-tenant.
     */
    async listOrders() {
      const {
        data,
        error
      } = await client
        .from('orders')
        .select(`
          id,
          restaurant_id,
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
            restaurant_id,
            product_id,
            product_name,
            quantity,
            unit_price_cents,
            options,
            line_total_cents
          )
        `)
        .eq(
          'restaurant_id',
          restaurantId
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        );
      if (error) {
        console.error(
          'FOODATOI — erreur récupération commandes:',
          error
        );
        throw error;
      }
      return (
        data ?? []
      ).map(order => ({
        ...order,
        number:
          order.order_number,
        restaurantId:
          order.restaurant_id,
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
      }));
    },
    /**
     * Change le statut d'une commande.
     *
     * Le restaurant_id est toujours vérifié.
     */
    async updateStatus(
      orderId,
      status
    ) {
      if (!isUuid(orderId)) {
        throw new Error(
          'Identifiant de commande invalide.'
        );
      }
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
        .eq(
          'restaurant_id',
          restaurantId
        )
        .select()
        .single();
      if (error) {
        console.error(
          'FOODATOI — erreur changement statut:',
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
 */
function formatPickupTime(value) {
  if (!value) {
    return '—';
  }
  const date =
    new Date(value);
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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
