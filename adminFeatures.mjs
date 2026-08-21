export function subscribeToOrderChanges(client, callback) {
  if (!client) return null;

  const channelName = `caz-food-orders-${Date.now()}`;

  const channel = client
    .channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: '' }
      }
    })
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('[Realtime] Nouvelle commande reçue', payload);
        callback(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('[Realtime] Commande mise à jour', payload);
        callback(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('[Realtime] Commande supprimée', payload);
        callback(payload);
      }
    );

  channel.subscribe((status, error) => {
    console.log('[Realtime] Statut:', status);

    if (error) {
      console.error('[Realtime] Erreur:', error);
    }

    if (status === 'SUBSCRIBED') {
      console.log('[Realtime] Abonnement actif pour public.orders');
    }

    if (status === 'CHANNEL_ERROR') {
      console.error('[Realtime] CHANNEL_ERROR', error);
    }

    if (status === 'TIMED_OUT') {
      console.error('[Realtime] TIMED_OUT');
    }

    if (status === 'CLOSED') {
      console.warn('[Realtime] Canal fermé');
    }
  });

  return channel;
}

export function printOrder(
  order,
  openWindow = (url = '', target = '_blank') => window.open(url, target)
) {
  const win = openWindow('', '_blank');

  if (!win) return false;

  const items = order.order_items ?? order.items ?? [];

  const money = (cents) =>
    `${(Number(cents || 0) / 100).toFixed(2).replace('.', ',')} €`;

  const pickup = order.pickup_time
    ? new Date(order.pickup_time).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  const rows = items
    .map(
      (item) => `
        <div class="row">
          <div>
            <strong>
              ${item.quantity}× ${item.product_name ?? item.name}
            </strong>
            <small>
              ${
                item.options?.meat
                  ? `Viande : ${item.options.meat}`
                  : ''
              }
              ${
                item.options?.sauce
                  ? ` · Sauce : ${item.options.sauce}`
                  : ''
              }
              ${
                item.options?.drink
                  ? ` · Boisson : ${item.options.drink}`
                  : ''
              }
            </small>
          </div>
          <b>
            ${money(
              item.line_total_cents ??
                (item.price || 0) * item.quantity * 100
            )}
          </b>
        </div>
      `
    )
    .join('');

  win.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>${order.order_number ?? order.number ?? 'Commande'}</title>

        <style>
          body {
            font: 13px monospace;
            width: 72mm;
            margin: 0;
            padding: 10px;
            color: #111;
          }

          .center {
            text-align: center;
          }

          .line {
            border-top: 1px dashed #777;
            margin: 10px 0;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin: 8px 0;
          }

          .row small {
            display: block;
            color: #555;
            margin-top: 2px;
          }

          .total {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            margin-top: 12px;
          }
        </style>
      </head>

      <body>
        <div class="center">
          <strong>CAZ FOOD</strong>
          <br>
          CAZÈRES
          <br><br>
          ${order.order_number ?? order.number ?? '—'}
        </div>

        <div class="line"></div>

        ${rows || '<div>Détail des articles indisponible</div>'}

        <div class="line"></div>

        <div>
          CLIENT :
          ${order.customer_name ?? order.customer?.name ?? '—'}
        </div>

        <div>
          TÉLÉPHONE :
          ${order.customer_phone ?? order.customer?.phone ?? '—'}
        </div>

        <div>
          RETRAIT :
          ${pickup}
        </div>

        <div class="total">
          <span>TOTAL</span>
          <span>
            ${money(
              order.total_cents ??
                Number(order.total || 0) * 100
            )}
          </span>
        </div>

        <div class="center" style="margin-top:20px">
          MERCI
        </div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();

  return true;
}
