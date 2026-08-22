function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

/**
 * Convertit une heure HH:mm choisie par le client
 * en timestamp ISO correspondant à l'heure Europe/Paris.
 */
function parisTimeToIsoDate(time) {
  if (
    !time ||
    !/^\d{2}:\d{2}$/.test(String(time))
  ) {
    return null;
  }

  const [hours, minutes] = String(time)
    .split(':')
    .map(Number);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  /*
   * On part d'une approximation UTC puis on calcule
   * le décalage réel Europe/Paris à cette date.
   */
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

  const parisFormatter =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      }
    );

  const parisParts =
    parisFormatter.formatToParts(
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

/**
 * Convertit un timestamp Supabase
 * en heure locale Europe/Paris.
 */
function formatPickupTime(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

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

/**
 * Génère un numéro de commande FOODATOI.
 */
function generateOrderNumber() {
  return `FA-${Date.now()
    .toString()
    .slice(-8)}`;
}

/**
 * Crée un store Supabase isolé sur un restaurant.
 *
 * IMPORTANT :
 * restaurantId doit venir du contexte du tenant
 * résolu par l'application FOODATOI.
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
      'restaurantId FOODATOI invalide.'
    );
  }

  return {
    /**
     * Identifiant du restaurant courant.
     */
    restaurantId,

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
        data: createdOrder,
        error: orderError
      } = await client
        .from('orders')
        .insert({
          id:
            orderId,

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
        })
        .select()
        .single();

      if (orderError) {
        console.error(
          'Erreur création commande FOODATOI:',
          orderError
        );

        throw orderError;
      }

      const items =
        Array.isArray(
          order.items
        )
          ? order.items
          : [];

      if (items.length) {
        const payload =
          items.map(item => {
            const quantity =
              Math.max(
                1,
                Number(
                  item.quantity ?? 1
                )
              );

            const unitPriceCents =
              Math.round(
                Number(
                  item.price ?? 0
                ) * 100
              );

            return {
              order_id:
                orderId,

              product_id:
                isUuid(item.id)
                  ? item.id
                  : null,

              product_name:
                item.name ?? '',

              quantity,

              unit_price_cents:
                unitPriceCents,

              options:
                item.options &&
                typeof item.options ===
                  'object'
                  ? item.options
                  : {},

              line_total_cents:
                unitPriceCents *
                quantity
            };
          });

        const {
          error: itemsError
        } = await client
          .from('order_items')
          .insert(payload);

        if (itemsError) {
          console.error(
            'Erreur création articles FOODATOI:',
            itemsError
          );

          /*
           * Rollback logique.
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
          createdOrder?.id ??
          orderId,

        number:
          createdOrder?.order_number ??
          orderNumber,

        orderNumber:
          createdOrder?.order_number ??
          orderNumber,

        restaurantId,

        status:
          createdOrder?.status ??
          'NEW'
      };
    },

    /**
     * Récupère les commandes du restaurant courant uniquement.
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
            product_id,
            product_name,
            quantity,
            unit_price_cents,
            options,
            line_total_cents,
            created_at
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
          'Erreur récupération commandes FOODATOI:',
          error
        );

        throw error;
      }

      return (
        data ?? []
      ).map(order => ({
        ...order,

        restaurantId:
          order.restaurant_id,

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
            order.order_items ??
            []
          ).map(item => ({
            id:
              item.product_id ??
              item.id,

            orderItemId:
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
     * Le restaurant_id est toujours utilisé
     * dans le filtre afin d'éviter de modifier
     * une commande appartenant à un autre tenant.
     */
    async updateStatus(
      orderId,
      status
    ) {
      if (!isUuid(orderId)) {
        throw new Error(
          'orderId invalide.'
        );
      }

      if (
        typeof status !==
        'string' ||
        !status.trim()
      ) {
        throw new Error(
          'Statut de commande invalide.'
        );
      }

      const {
        data,
        error
      } = await client
        .from('orders')
        .update({
          status:
            status.trim(),

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
          'Erreur changement statut FOODATOI:',
          error
        );

        throw error;
      }

      return data;
    }
  };
}
