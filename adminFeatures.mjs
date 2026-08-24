/**
 * Agrège les articles de plusieurs commandes par
 * combinaison produit + viande + sauce + boisson,
 * pour un usage gestion des stocks.
 *
 * Fonction pure, testable indépendamment du DOM.
 */
export function aggregateOrderItems(orders) {
  const groups = new Map();

  for (const order of orders ?? []) {
    const items = order.order_items ?? order.items ?? [];

    for (const item of items) {
      const name = item.product_name ?? item.name ?? 'Article';
      const meat = item.options?.meat ?? '';
      const sauce = item.options?.sauce ?? '';
      const drink = item.options?.drink ?? '';
      const key = [name, meat, sauce, drink].join('|');

      const quantity = Number(item.quantity ?? 0);

      const lineTotalCents = Math.round(
        item.line_total_cents ??
          (item.price ?? 0) * quantity * 100
      );

      const existing = groups.get(key);

      if (existing) {
        existing.quantity += quantity;
        existing.revenueCents += lineTotalCents;
      } else {
        groups.set(key, {
          name,
          meat,
          sauce,
          drink,
          quantity,
          revenueCents: lineTotalCents
        });
      }
    }
  }

  return [...groups.values()].sort(
    (a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name)
  );
}

/**
 * Construit un CSV (texte brut) à partir des lignes
 * agrégées. Séparateur point-virgule pour un import
 * direct dans Excel/LibreOffice en français.
 */
export function buildStockSummaryCsv(rows) {
  const escape = (value) => {
    const text = String(value ?? '');
    return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const header = ['Article', 'Viande', 'Sauce', 'Boisson', 'Quantité', 'Total (€)'];

  const lines = (rows ?? []).map((row) =>
    [
      row.name,
      row.meat,
      row.sauce,
      row.drink,
      row.quantity,
      (row.revenueCents / 100).toFixed(2).replace('.', ',')
    ]
      .map(escape)
      .join(';')
  );

  return [header.join(';'), ...lines].join('\n');
}

export function printStockSummary(
  rows,
  meta = {},
  openWindow = (url = '', target = '_blank') => window.open(url, target)
) {
  const win = openWindow('', '_blank');

  if (!win) return false;

  const money = (cents) =>
    `${(Number(cents || 0) / 100).toFixed(2).replace('.', ',')} €`;

  const totalQuantity = (rows ?? []).reduce((sum, row) => sum + row.quantity, 0);
  const totalRevenue = (rows ?? []).reduce((sum, row) => sum + row.revenueCents, 0);

  const body = (rows ?? [])
    .map(
      (row) => `
        <tr>
          <td>${row.name}</td>
          <td>${[row.meat, row.sauce, row.drink].filter(Boolean).join(' · ') || '—'}</td>
          <td class="num">${row.quantity}</td>
          <td class="num">${money(row.revenueCents)}</td>
        </tr>
      `
    )
    .join('');

  win.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Résumé stock — Caz Food</title>

        <style>
          body { font: 13px/1.4 sans-serif; margin: 0; padding: 24px; color: #111; }
          h1 { font-size: 18px; margin: 0 0 2px; }
          p.meta { color: #666; margin: 0 0 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 7px 6px; border-bottom: 1px solid #ddd; }
          th { font-size: 11px; text-transform: uppercase; letter-spacing: .03em; color: #666; }
          td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
          tfoot td { font-weight: bold; border-top: 2px solid #111; border-bottom: none; }
        </style>
      </head>

      <body>
        <h1>Résumé stock — Caz Food</h1>
        <p class="meta">
          ${meta.rangeLabel ?? 'Toutes les commandes affichées'} ·
          généré le ${new Date().toLocaleString('fr-FR')}
        </p>

        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Options</th>
              <th class="num">Qté</th>
              <th class="num">Total</th>
            </tr>
          </thead>
          <tbody>
            ${body || '<tr><td colspan="4">Aucun article</td></tr>'}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total</td>
              <td class="num">${totalQuantity}</td>
              <td class="num">${money(totalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();

  return true;
}

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
