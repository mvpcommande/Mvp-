import { updateOrderStatus } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { getNextStatusLabel } from './uiModel.mjs';
import { getAdminSession, signInAdmin, signOutAdmin } from './adminAuth.mjs';
import { printOrder, subscribeToOrderChanges } from './adminFeatures.mjs';
import './styles.css';
const root = document.querySelector('#admin-root');
const labels = {
  NEW: 'Nouvelle',
  ACCEPTED: 'Acceptée',
  PREPARING: 'En préparation',
  READY: 'Prête',
  CANCELLED: 'Annulée'
};
let remote = null;
let mode = 'local';
let realtimeChannel = null;
let session = null;
function localOrders() {
  return JSON.parse(
    localStorage.getItem('caz-food-orders') || '[]'
  );
}
function saveLocal(value) {
  localStorage.setItem(
    'caz-food-orders',
    JSON.stringify(value)
  );
}
function euro(value) {
  return `${Number(value || 0).toFixed(2).replace('.', ',')} €`;
}
/**
 * Lecture directe de Supabase.
 *
 * On ne passe volontairement pas par remote.listOrders()
 * pour éviter qu'une implémentation incorrecte du store
 * masque les commandes existantes.
 */
async function getRemoteOrders() {
  if (!supabase) return [];
  const { data, error } = await supabase
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
    .order('created_at', {
      ascending: false
    });
  if (error) {
    console.error(
      '[CAZ FOOD ADMIN] Erreur lecture orders:',
      error
    );
    throw error;
  }
  return (data || []).map(order => ({
    ...order,
    number: order.order_number,
    total: Number(order.total_cents || 0) / 100,
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
    items: (order.order_items || []).map(item => ({
      id: item.id,
      product_id: item.product_id,
      name: item.product_name,
      product_name: item.product_name,
      quantity: item.quantity,
      price: Number(item.unit_price_cents || 0) / 100,
      options: item.options || {},
      line_total: Number(item.line_total_cents || 0) / 100
    }))
  }));
}
async function init() {
  if (!supabase) {
    renderSetup();
    return;
  }
  try {
    session = await getAdminSession(supabase);
  } catch (error) {
    console.error(
      '[CAZ FOOD ADMIN] Impossible de récupérer la session:',
      error
    );
    session = null;
  }
  if (session) {
    remote = createSupabaseOrderStore(supabase);
    mode = 'remote';
    subscribeRealtime();
    await render();
    return;
  }
  renderLogin();
}
function subscribeRealtime() {
  if (!supabase) return;
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  realtimeChannel = subscribeToOrderChanges(
    supabase,
    async () => {
      console.log(
        '[CAZ FOOD ADMIN] Changement détecté, actualisation…'
      );
      await render();
    }
  );
}
function renderSetup() {
  root.innerHTML = `
    <main class="admin-auth">
      <div class="auth-card">
        <p class="eyebrow">
          CAZ FOOD · CONFIGURATION
        </p>
        <h1>
          Le comptoir<br>
          <em>arrive bientôt.</em>
        </h1>
        <p>
          Ajoute
          <code>VITE_SUPABASE_URL</code>
          et
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
          dans Netlify pour activer le compte commerçant.
        </p>
      </div>
    </main>
  `;
}
function renderLogin(error = '') {
  root.innerHTML = `
    <main class="admin-auth">
      <div class="auth-card">
        <div class="auth-mark">
          CF
        </div>
        <p class="eyebrow">
          CAZ FOOD · LE COMPTOIR
        </p>
        <h1>
          Bon retour.
        </h1>
        <p>
          Connexion réservée à l'équipe Caz Food.
        </p>
        ${
          error
            ? `<div class="auth-error">${error}</div>`
            : ''
        }
        <form
          id="login-form"
          class="auth-form"
        >
          <label>
            EMAIL
            <input
              name="email"
              type="email"
              autocomplete="username"
              required
              placeholder="vous@cazfood.fr"
            >
          </label>
          <label>
            MOT DE PASSE
            <input
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
            >
          </label>
          <button
            class="primary full"
            type="submit"
          >
            OUVRIR LE COMPTOIR →
          </button>
        </form>
        <a
          class="secondary auth-back"
          href="/"
        >
          ← Retour à la commande
        </a>
      </div>
    </main>
  `;
  const form = root.querySelector('#login-form');
  form.onsubmit = async event => {
    event.preventDefault();
    const formData = new FormData(
      event.currentTarget
    );
    const email = formData.get('email');
    const password = formData.get('password');
    const button =
      event.currentTarget.querySelector('button');
    button.disabled = true;
    button.textContent = 'CONNEXION…';
    try {
      session = await signInAdmin(
        supabase,
        email,
        password
      );
      remote = createSupabaseOrderStore(
        supabase
      );
      mode = 'remote';
      subscribeRealtime();
      await render();
    } catch (error) {
      console.error(
        '[CAZ FOOD ADMIN] Connexion:',
        error
      );
      renderLogin(
        'Email ou mot de passe incorrect.'
      );
    }
  };
}
async function getOrders() {
  if (mode === 'remote') {
    try {
      return await getRemoteOrders();
    } catch (error) {
      console.error(
        '[CAZ FOOD ADMIN] Impossible de charger les commandes:',
        error
      );
      return [];
    }
  }
  return localOrders();
}
async function advance(order) {
  const next = {
    NEW: 'ACCEPTED',
    ACCEPTED: 'PREPARING',
    PREPARING: 'READY'
  }[order.status];
  if (!next) return;
  try {
    if (mode === 'remote') {
      await remote.updateStatus(
        order.id,
        next
      );
    } else {
      saveLocal(
        updateOrderStatus(
          localOrders(),
          order.id,
          next
        )
      );
    }
    await render();
  } catch (error) {
    console.error(
      '[CAZ FOOD ADMIN] Mise à jour statut:',
      error
    );
    alert(
      'Impossible de mettre à jour la commande.'
    );
  }
}
async function render() {
  if (
    !session &&
    mode === 'remote'
  ) {
    renderLogin();
    return;
  }
  const data = (
    await getOrders()
  )
    .slice()
    .sort(
      (a, b) =>
        new Date(
          b.created_at ??
          b.createdAt
        ) -
        new Date(
          a.created_at ??
          a.createdAt
        )
    );
  const total = data.reduce(
    (sum, order) =>
      sum +
      Number(
        order.total ??
        (
          Number(
            order.total_cents || 0
          ) / 100
        )
      ),
    0
  );
  const newCount = data.filter(
    order =>
      order.status === 'NEW'
  ).length;
  const preparingCount = data.filter(
    order =>
      order.status === 'PREPARING'
  ).length;
  const readyCount = data.filter(
    order =>
      order.status === 'READY'
  ).length;
  root.innerHTML = `
    <main class="admin-shell">
      <header class="admin-header">
        <div>
          <p class="eyebrow">
            CAZ FOOD · SERVICE
          </p>
          <h1>
            Le comptoir.
          </h1>
          <p>
            ${
              mode === 'remote'
                ? 'Commandes en direct · Supabase Realtime'
                : 'Mode démo local'
            }
          </p>
        </div>
        <div class="admin-actions">
          <button
            class="secondary"
            id="logout"
          >
            Quitter
          </button>
          <a
            class="secondary"
            href="/"
          >
            ← Voir la commande
          </a>
        </div>
      </header>
      <section class="admin-stats">
        <div>
          <span>
            À prendre en charge
          </span>
          <strong>
            ${newCount}
          </strong>
        </div>
        <div>
          <span>
            En préparation
          </span>
          <strong>
            ${preparingCount}
          </strong>
        </div>
        <div>
          <span>
            Prêtes
          </span>
          <strong>
            ${readyCount}
          </strong>
        </div>
        <div>
          <span>
            Commandé
          </span>
          <strong>
            ${euro(total)}
          </strong>
        </div>
      </section>
      <section class="orders-grid">
        ${
          data.length
            ? data
                .map(orderCard)
                .join('')
            : `
              <div class="empty-ticket admin-empty">
                <div class="empty-ticket-mark">
                  +
                </div>
                <h2>
                  Le comptoir est calme.
                </h2>
                <p>
                  La prochaine commande apparaîtra ici
                  dès qu'elle sera envoyée.
                </p>
              </div>
            `
        }
      </section>
      <p class="admin-note">
        ● ${
          mode === 'remote'
            ? 'Temps réel actif. Les nouvelles commandes apparaissent automatiquement.'
            : 'Mode démo local.'
        }
      </p>
    </main>
  `;
  const logout =
    root.querySelector('#logout');
  if (logout) {
    logout.onclick = async () => {
      try {
        if (
          realtimeChannel &&
          supabase
        ) {
          await supabase.removeChannel(
            realtimeChannel
          );
        }
        await signOutAdmin(
          supabase
        );
      } catch (error) {
        console.error(
          '[CAZ FOOD ADMIN] Déconnexion:',
          error
        );
      }
      session = null;
      remote = null;
      mode = 'local';
      realtimeChannel = null;
      renderLogin();
    };
  }
  root
    .querySelectorAll('[data-next]')
    .forEach(button => {
      button.onclick = () => {
        const order =
          data.find(
            item =>
              String(item.id) ===
              String(button.dataset.id)
          );
        if (order) {
          advance(order);
        }
      };
    });
  root
    .querySelectorAll('[data-print]')
    .forEach(button => {
      button.onclick = () => {
        const order =
          data.find(
            item =>
              String(item.id) ===
              String(button.dataset.id)
          );
        if (order) {
          printOrder(order);
        }
      };
    });
}
function orderCard(order) {
  const status =
    order.status || 'NEW';
  const items =
    order.items ??
    order.order_items ??
    [];
  const customer =
    order.customer ??
    {
      name:
        order.customer_name ||
        'Client',
      phone:
        order.customer_phone ||
        '—',
      pickupTime:
        order.pickup_time
          ? new Date(
              order.pickup_time
            ).toLocaleTimeString(
              'fr-FR',
              {
                hour: '2-digit',
                minute: '2-digit'
              }
            )
          : '—'
    };
  const number =
    order.number ??
    order.order_number ??
    '—';
  const total =
    order.total ??
    (
      Number(
        order.total_cents || 0
      ) / 100
    );
  const actionLabel =
    getNextStatusLabel(
      status
    );
  const action =
    actionLabel
      ? `
        <button
          class="primary"
          data-next
          data-id="${order.id}"
        >
          ${actionLabel} →
        </button>
      `
      : `
        <span class="ready-badge">
          ✓ Prête pour retrait
        </span>
      `;
  return `
    <article
      class="order-card status-${String(
        status
      ).toLowerCase()}"
      data-order="${order.id}"
    >
      <header>
        <div>
          <span class="order-number">
            ${number}
          </span>
          <span class="status">
            ${
              labels[status] ??
              status
            }
          </span>
        </div>
        <strong>
          ${
            customer.pickupTime ||
            '—'
          }
        </strong>
      </header>
      <div class="order-customer">
        <strong>
          ${
            customer.name ||
            'Client'
          }
        </strong>
        <span>
          ${
            customer.phone ||
            '—'
          }
        </span>
      </div>
      <ul>
        ${
          items.length
            ? items
                .map(item => {
                  const options =
                    item.options ||
                    {};
                  const optionText =
                    options.meat ||
                    options.sauce ||
                    options.drink
                      ? `
                        <small>
                          · ${
                            [
                              options.meat,
                              options.sauce,
                              options.drink
                            ]
                              .filter(Boolean)
                              .join(' · ')
                          }
                        </small>
                      `
                      : '';
                  return `
                    <li>
                      <strong>
                        ${item.quantity}×
                      </strong>
                      ${
                        item.name ??
                        item.product_name ??
                        'Article'
                      }
                      ${optionText}
                    </li>
                  `;
                })
                .join('')
            : `
              <li>
                <span>
                  Détail des articles indisponible
                </span>
              </li>
            `
        }
      </ul>
      <footer>
        <strong>
          ${euro(total)}
        </strong>
        <div class="order-actions">
          ${action}
          <button
            class="print-button"
            data-print
            data-id="${order.id}"
            title="Imprimer le ticket"
          >
            ⌁ TICKET
          </button>
        </div>
      </footer>
    </article>
  `;
}
init();
