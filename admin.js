import { updateOrderStatus } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { getNextStatusLabel } from './uiModel.mjs';
import { getAdminSession, signInAdmin, signOutAdmin } from './adminAuth.mjs';
import { printOrder, subscribeToOrderChanges } from './adminFeatures.mjs';
import './styles.css';

const root = document.querySelector('#admin-root');
const labels = { NEW: 'Nouvelle', ACCEPTED: 'Acceptée', PREPARING: 'En préparation', READY: 'Prête', CANCELLED: 'Annulée' };
let remote = null;
let mode = 'local';
let realtimeChannel = null;
let session = null;

function localOrders() { return JSON.parse(localStorage.getItem('caz-food-orders') || '[]'); }
function saveLocal(value) { localStorage.setItem('caz-food-orders', JSON.stringify(value)); }
function euro(v) { return `${Number(v).toFixed(2).replace('.', ',')} €`; }

async function init() {
  if (!supabase) return renderSetup();
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
  realtimeChannel = subscribeToOrderChanges(supabase, () => render());
}

function renderSetup() {
  root.innerHTML = `<main class="admin-auth"><div class="auth-card"><p class="eyebrow">CAZ FOOD · CONFIGURATION</p><h1>Le comptoir<br><em>arrive bientôt.</em></h1><p>Ajoute <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> dans Netlify pour activer le compte commerçant.</p></div></main>`;
}

function renderLogin(error = '') {
  root.innerHTML = `<main class="admin-auth"><div class="auth-card"><div class="auth-mark">CF</div><p class="eyebrow">CAZ FOOD · LE COMPTOIR</p><h1>Bon retour.</h1><p>Connexion réservée à l'équipe Caz Food.</p>${error ? `<div class="auth-error">${error}</div>` : ''}<form id="login-form" class="auth-form"><label>EMAIL<input name="email" type="email" autocomplete="username" required placeholder="vous@cazfood.fr"></label><label>MOT DE PASSE<input name="password" type="password" autocomplete="current-password" required placeholder="••••••••"></label><button class="primary full" type="submit">OUVRIR LE COMPTOIR →</button></form><a class="secondary auth-back" href="/">← Retour à la commande</a></div></main>`;
  root.querySelector('#login-form').onsubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector('button');
    button.disabled = true;
    button.textContent = 'CONNEXION…';
    try {
      session = await signInAdmin(supabase, form.get('email'), form.get('password'));
      remote = createSupabaseOrderStore(supabase);
      mode = 'remote';
      subscribeRealtime();
      await render();
    } catch (err) {
      renderLogin('Email ou mot de passe incorrect.');
    }
  };
}

async function getOrders() {
  if (mode === 'remote') {
    try { return await remote.listOrders(); }
    catch (error) { console.error(error); return []; }
  }
  return localOrders();
}

async function advance(order) {
  const next = ({ NEW: 'ACCEPTED', ACCEPTED: 'PREPARING', PREPARING: 'READY' })[order.status];
  if (!next) return;
  if (mode === 'remote') await remote.updateStatus(order.id, next);
  else saveLocal(updateOrderStatus(localOrders(), order.id, next));
  await render();
}

async function render() {
  if (!session && mode === 'remote') return renderLogin();
  const data = (await getOrders()).slice().sort((a,b) => new Date(b.created_at ?? b.createdAt) - new Date(a.created_at ?? a.createdAt));
  const total = data.reduce((sum, o) => sum + Number(o.total ?? (o.total_cents ?? 0) / 100), 0);
  root.innerHTML = `
    <main class="admin-shell">
      <header class="admin-header">
        <div><p class="eyebrow">CAZ FOOD · SERVICE</p><h1>Le comptoir.</h1><p>${mode === 'remote' ? 'Commandes en direct · Supabase Realtime' : 'Mode démo local'}</p></div>
        <div class="admin-actions"><button class="secondary" id="logout">Quitter</button><a class="secondary" href="/">← Voir la commande</a></div>
      </header>
      <section class="admin-stats">
        <div><span>À prendre en charge</span><strong>${data.filter(o => o.status === 'NEW').length}</strong></div>
        <div><span>En préparation</span><strong>${data.filter(o => o.status === 'PREPARING').length}</strong></div>
        <div><span>Prêtes</span><strong>${data.filter(o => o.status === 'READY').length}</strong></div>
        <div><span>Commandé</span><strong>${euro(total)}</strong></div>
      </section>
      <section class="orders-grid">
        ${data.length ? data.map(orderCard).join('') : `<div class="empty-ticket admin-empty"><div class="empty-ticket-mark">+</div><h2>Le comptoir est calme.</h2><p>La prochaine commande apparaîtra ici dès qu'elle sera envoyée.</p></div>`}
      </section>
      <p class="admin-note">● ${mode === 'remote' ? 'Temps réel actif. Les nouvelles commandes apparaissent automatiquement.' : 'Mode démo local.'}</p>
    </main>`;
  root.querySelector('#logout').onclick = async () => { if (realtimeChannel && supabase) await supabase.removeChannel(realtimeChannel); await signOutAdmin(supabase); session = null; remote = null; mode = 'local'; realtimeChannel = null; renderLogin(); };
  root.querySelectorAll('[data-next]').forEach(btn => btn.onclick = () => advance(data.find(o => (o.id ?? '') === btn.dataset.id)));
  root.querySelectorAll('[data-print]').forEach(btn => btn.onclick = () => printOrder(data.find(o => (o.id ?? '') === btn.dataset.id)));
}

function orderCard(order) {
  const status = order.status;
  const items = order.items ?? order.order_items ?? [];
  const customer = order.customer ?? { name: order.customer_name, phone: order.customer_phone, pickupTime: order.pickup_time ? new Date(order.pickup_time).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '—' };
  const number = order.number ?? order.order_number;
  const total = order.total ?? (order.total_cents ?? 0) / 100;
  const actionLabel = getNextStatusLabel(status);
  const action = actionLabel ? `<button class="primary" data-next data-id="${order.id}">${actionLabel} →</button>` : `<span class="ready-badge">✓ Prête pour retrait</span>`;
  return `<article class="order-card status-${status.toLowerCase()}" data-order="${order.id}"><header><div><span class="order-number">${number}</span><span class="status">${labels[status]}</span></div><strong>${customer.pickupTime || '—'}</strong></header><div class="order-customer"><strong>${customer.name}</strong><span>${customer.phone}</span></div><ul>${items.map(i => `<li><strong>${i.quantity}×</strong> ${i.name ?? i.product_name}${i.options?.meat ? ` <small>· ${i.options.meat}</small>` : ''}</li>`).join('')}</ul><footer><strong>${euro(total)}</strong><div class="order-actions">${action}<button class="print-button" data-print data-id="${order.id}" title="Imprimer le ticket">⌁ TICKET</button></div></footer></article>`;
}

init();
