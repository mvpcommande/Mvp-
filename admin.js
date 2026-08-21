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
  return `${Number(value).toFixed(2).replace('.', ',')} €`;
}
/**
 * Retourne l'heure de retrait sans passer par Date().
 *
 * pickup_time peut être :
 * 2026-08-21T20:30:00
 * 2026-08-21T20:30:00+00:00
 * 2026-08-21 20:30:00+00
 * 20:30
 */
function formatPickupTime(value) {
  if (!value) return '—';
  const stringValue = String(value).trim();
  // Déjà au format HH:mm
  if (/^\d{2}:\d{2}$/.test(stringValue)) {
    return stringValue;
  }
  // ISO / timestamp PostgreSQL
  const match = stringValue.match(
    /T(\d{2}):(\d{2})|(\d{2}):(\d{2})/
  );
  if (match) {
    const hour = match[1] ?? match[3];
    const minute = match[2] ?? match[4];
    return `${hour}:${minute}`;
  }
  return '—';
}
async function init() {
  if (!supabase) {
    return renderSetup();
  }
  session = await getAdminSession(supabase);
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
  if (realtimeChannel && supabase) {
    supabase.removeChannel(realtimeChannel);
  }
  realtimeChannel = subscribeToOrderChanges(
    supabase,
    () => render()
  );
}
function renderSetup() {
  root.innerHTML = `
    <main class="admin-auth">
      <div class="auth-card">
        <p class="eyebrow">CAZ FOOD · CONFIGURATION</p>
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
        <div class="auth-mark">CF</div>
        <p class="eyebrow">
          CAZ FOOD · LE COMPTOIR
        </p>
        <h1>Bon retour.</h1>
        <p>
          Connexion réservée à l'équipe Caz Food.
        </p>
        ${
          error
            ? `<div class="auth-error">${error}</div>`
            : ''
        }
        <form id="login-form" class="auth-form">
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
  root
    .querySelector('#login-form')
    .onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(
        event.currentTarget
      );
      const button =
        event.currentTarget.querySelector('button');
      button.disabled = true;
      button.textContent = 'CONNEXION…';
      try {
        session = await signInAdmin(
          supabase,
          form.get('email'),
          form.get('password')
        );
        remote = createSupabaseOrderStore(
          supabase
        );
        mode = 'remote';
        subscribeRealtime();
        await render();
      } catch (error) {
        console.error(error);
        renderLogin(
          'Email ou mot de passe incorrect.'
        );
      }
    };
}
async function getOrders() {
  if (mode === 'remote') {
    try {
      return await remote.listOrders();
    } catch (error) {
      console.error(
        'Impossible de récupérer les commandes:',
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
}
async function render() {
  if (!session && mode === 'remote') {
    return renderLogin();
  }
  const data = (await getOrders())
    .slice()
    .sort(
      (a, b) =>
        new Date(
          b.created_at ?? b.createdAt
        ) -
        new Date(
          a.created_at ?? a.createdAt
        )
    );
  const total = data.reduce(
    (sum, order) =>
      sum +
      Number(
        order.total ??
        (order.total_cents ?? 0) / 100
      ),
    0
  );
  root.innerHTML = `
    <main class="admin-shell">
      <header class="admin-header">
        <div>
          <p class="eyebrow">
            CAZ FOOD · SERVICE
          </p>
          <h1>Le comptoir.</h1>
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
          <span>À prendre en charge</span>
          <strong>
            ${
              data.filter(
                order => order.status === 'NEW'
              ).length
            }
          </strong>
        </div>
        <div>
          <span>En préparation</span>
          <strong>
            ${
              data.filter(
                order =>
                  order.status === 'PREPARING'
              ).length
            }
          </strong>
        </div>
        <div>
          <span>Prêtes</span>
          <strong>
            ${
              data.filter(
                order =>
                  order.status === 'READY'
              ).length
            }
          </strong>
        </div>
        <div>
          <span>Commandé</span>
          <strong>${euro(total)}</strong>
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
                  La prochaine commande apparaîtra
                  ici dès qu'elle sera envoyée.
                </p>
              </div>
            `
        }
      </section>
      <p class="admin-note">
        ●
        ${
          mode === 'remote'
            ? 'Temps réel actif. Les nouvelles commandes apparaissent automatiquement.'
            : 'Mode démo local.'
        }
      </p>
    </main>
  `;
  root
    .querySelector('#logout')
    .onclick = async () => {
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
      session = null;
      remote = null;
      mode = 'local';
      realtimeChannel = null;
      renderLogin();
    };
  root
    .querySelectorAll('[data-next]')
    .forEach(button => {
      button.onclick = () => {
        const order =
          data.find(
            order =>
              String(order.id ?? '') ===
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
            order =>
              String(order.id ?? '') ===
              String(button.dataset.id)
          );
        if (order) {
          printOrder(order);
        }
      };
    });
}
function orderCard(order) {
  const status = order.status;
  const items =
    order.items ??
    order.order_items ??
    [];
  const pickupTime =
    order.customer?.pickupTime ??
    formatPickupTime(
      order.pickup_time
    );
  const customer = {
    name:
      order.customer?.name ??
      order.customer_name ??
      '—',
    phone:
      order.customer?.phone ??
      order.customer_phone ??
      '—',
    pickupTime
  };
  const number =
    order.number ??
    order.order_number ??
    '—';
  const total =
    order.total ??
    (order.total_cents ?? 0) / 100;
  const actionLabel =
    getNextStatusLabel(status);
  const action = actionLabel
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
            ${labels[status] ?? status}
          </span>
        </div>
        <strong>
          ${customer.pickupTime}
        </strong>
      </header>
      <div class="order-customer">
        <strong>
          ${customer.name}
        </strong>
        <span>
          ${customer.phone}
        </span>
      </div>
      <ul>
        ${
          items.length
            ? items
                .map(item => {
                  const options =
                    item.options ??
                    {};
                  const optionLabels = [
                    options.meat,
                    options.sauce,
                    options.drink,
                    options.boisson
                  ].filter(Boolean);
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
                      ${
                        optionLabels.length
                          ? `
                            <small>
                              ·
                              ${optionLabels.join(
                                ' · '
                              )}
                            </small>
                          `
                          : ''
                      }
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
