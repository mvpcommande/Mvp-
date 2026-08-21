import { addItem, calculateTotal, createOrder } from './orderLogic.mjs';
import { appendOrder } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { buildTicketModel } from './uiModel.mjs';
import './styles.css';

const menu = [
  { id: 'menu-tacos-simple', category: 'Tacos', name: 'Menu tacos simple', description: 'Sauce fromagère, frites et 1 viande au choix.', price: 12.90, emoji: '🌮', options: ['Kebab', 'Poulet', 'Steak', 'Merguez'] },
  { id: 'menu-tacos-double', category: 'Tacos', name: 'Menu tacos double', description: 'Sauce fromagère, frites et 2 viandes au choix.', price: 16.80, emoji: '🌮', options: ['Kebab', 'Poulet', 'Steak', 'Merguez'] },
  { id: 'menu-tacos-triple', category: 'Tacos', name: 'Menu tacos triple', description: 'Sauce fromagère, frites et 3 viandes au choix.', price: 18.10, emoji: '🌮', options: ['Kebab', 'Poulet', 'Steak', 'Merguez'] },
  { id: 'menu-sandwich', category: 'Sandwichs', name: 'Menu sandwich', description: 'Pain, viande au choix, sauce et frites + boisson.', price: 11.05, emoji: '🥙', options: ['Kebab', 'Poulet', 'Steak', 'Merguez'] },
  { id: 'menu-burger', category: 'Burgers', name: 'Menu burger', description: 'Burger, frites et boisson 33 cl.', price: 11.05, emoji: '🍔', options: [] },
  { id: 'menu-chicken-burger', category: 'Burgers', name: 'Menu chicken burger', description: 'Chicken burger, frites et boisson 33 cl.', price: 11.05, emoji: '🍔', options: [] },
  { id: 'menu-double-burger', category: 'Burgers', name: 'Menu double burger', description: 'Double burger, frites et boisson 33 cl.', price: 13.70, emoji: '🍔', options: [] },
  { id: 'menu-assiette', category: 'Assiettes', name: 'Menu assiette', description: '1 viande au choix, servi avec boisson 33 cl.', price: 16.80, emoji: '🍽️', options: ['Kebab', 'Poulet', 'Steak', 'Merguez'] },
  { id: 'tenders', category: 'Tex-Mex', name: 'Chicken tenders', description: 'Portion de tenders.', price: 5.90, emoji: '🍗', options: [] },
  { id: 'kids', category: 'Enfants', name: 'Kids box', description: 'Formule enfant.', price: 7.80, emoji: '🧒', options: [] }
];

let cart = [];
let activeCategory = 'Tous';
const remoteStore = supabase ? createSupabaseOrderStore(supabase) : null;
const categories = ['Tous', ...new Set(menu.map(item => item.category))];
const app = document.querySelector('#root');
const euro = value => `${Number(value).toFixed(2).replace('.', ',')} €`;
const itemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

function render() {
  app.innerHTML = `
    <div class="app-frame">
      <header class="masthead">
        <div class="brand-lockup"><span class="brand-mark">CF</span><div><strong>CAZ FOOD</strong><span>CAZÈRES · 31220</span></div></div>
        <button class="order-pill" id="open-cart"><span>Ma commande</span><b>${itemCount()}</b></button>
      </header>

      <main>
        <section class="order-intro">
          <div class="intro-copy">
            <p class="eyebrow">COMMANDE DIRECTE</p>
            <h1>Choisis.<br><em>On prépare.</em></h1>
            <p class="intro-lede">Ton repas, directement chez Caz Food. Pas de détour, pas de plateforme.</p>
            <div class="pickup-line"><span class="live-dot"></span><span>Retrait sur place</span><span class="slash">/</span><span>Paiement au restaurant</span></div>
          </div>
          <div class="receipt-hero" aria-label="Retrait sur place">
            <div class="receipt-top"><span>CAZ FOOD</span><span>AUJ.</span></div>
            <div class="receipt-hole"></div>
            <div class="receipt-main"><small>TON REPAS</small><strong>COMMENCE<br>ICI.</strong><span>17 AV. PASTEUR</span></div>
            <div class="receipt-barcode"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <div class="receipt-code">CF · CAZÈRES</div>
          </div>
        </section>

        <section class="menu-section">
          <div class="section-head"><div><p class="eyebrow">LA CARTE</p><h2>Tu prends quoi ?</h2></div><span class="menu-count">${menu.length} incontournables</span></div>
          <nav class="category-rail" aria-label="Catégories">${categories.map(c => `<button class="category ${c === activeCategory ? 'is-active' : ''}" data-category="${c}">${c}</button>`).join('')}</nav>
          <div class="menu-grid">${menu.filter(i => activeCategory === 'Tous' || i.category === activeCategory).map(card).join('')}</div>
        </section>
      </main>

      <footer class="site-footer"><div><strong>CAZ FOOD</strong><span>17 Av. Pasteur · Cazères</span></div><a href="tel:0562015990">05 62 01 59 90</a></footer>
    </div>
    <div class="drawer-backdrop hidden" id="backdrop"></div>
    <aside class="drawer" id="drawer" aria-label="Panier"><div class="drawer-head"><div><p class="eyebrow">CAZ FOOD</p><h2>Ton ticket</h2></div><button id="close-cart" class="icon-btn">×</button></div><div id="cart-content"></div></aside>
    <div class="modal hidden" id="product-modal"><div class="modal-card" id="modal-content"></div></div>
  `;
  bind();
  renderCart();
}

function card(item) {
  return `<article class="menu-card"><div class="menu-card-top"><span class="menu-icon">${item.emoji}</span><span class="category-tag">${item.category}</span></div><div class="menu-card-body"><h3>${item.name}</h3><p>${item.description}</p></div><div class="menu-card-bottom"><strong>${euro(item.price)}</strong><button class="add-button" data-add="${item.id}" aria-label="Ajouter ${item.name}"><span>+</span> Ajouter</button></div></article>`;
}

function bind() {
  document.querySelectorAll('[data-category]').forEach(btn => btn.onclick = () => { activeCategory = btn.dataset.category; render(); });
  document.querySelectorAll('[data-add]').forEach(btn => btn.onclick = () => openProduct(btn.dataset.add));
  document.querySelector('#open-cart').onclick = openCart;
  document.querySelector('#close-cart').onclick = closeCart;
  document.querySelector('#backdrop').onclick = closeCart;
}

function openProduct(id) {
  const item = menu.find(x => x.id === id);
  const optionField = item.options.length ? `<label>VIANDE<select id="meat">${item.options.map(o => `<option>${o}</option>`).join('')}</select></label>` : '';
  document.querySelector('#modal-content').innerHTML = `<button class="modal-close" id="modal-close">×</button><div class="product-mark">${item.emoji}</div><p class="eyebrow">${item.category}</p><h2>${item.name}</h2><p>${item.description}</p><div class="form-grid">${optionField}<label>QUANTITÉ<input id="qty" type="number" min="1" value="1"></label></div><button class="primary full" id="confirm-add">Ajouter · ${euro(item.price)}</button>`;
  document.querySelector('#product-modal').classList.remove('hidden');
  document.querySelector('#modal-close').onclick = () => document.querySelector('#product-modal').classList.add('hidden');
  document.querySelector('#confirm-add').onclick = () => {
    const qty = Math.max(1, Number(document.querySelector('#qty').value || 1));
    const options = item.options.length ? { meat: document.querySelector('#meat').value } : {};
    cart = addItem(cart, { ...item, quantity: qty, options });
    document.querySelector('#product-modal').classList.add('hidden');
    render();
    openCart();
  };
}

function openCart() { document.querySelector('#drawer').classList.add('open'); document.querySelector('#backdrop').classList.remove('hidden'); renderCart(); }
function closeCart() { document.querySelector('#drawer').classList.remove('open'); document.querySelector('#backdrop').classList.add('hidden'); }

function renderCart() {
  const el = document.querySelector('#cart-content');
  if (!el) return;
  if (!cart.length) { el.innerHTML = `<div class="empty-ticket"><div class="empty-ticket-mark">+</div><h3>Ton ticket est vide.</h3><p>Choisis quelque chose dans la carte. On s'occupe du reste.</p><button class="primary full" id="back-menu">Voir la carte</button></div>`; el.querySelector('#back-menu').onclick = closeCart; return; }
  el.innerHTML = `<div class="ticket-paper"><div class="ticket-header"><span>CAZ FOOD</span><span>COMMANDE</span></div><div class="ticket-items">${cart.map((item, idx) => `<div class="ticket-item"><div><strong>${item.quantity} × ${item.name}</strong><span>${item.options?.meat || ''}</span></div><b>${euro(item.price * item.quantity)}</b><button data-remove="${idx}" aria-label="Supprimer">×</button></div>`).join('')}</div><div class="ticket-total"><span>TOTAL</span><strong>${euro(calculateTotal(cart))}</strong></div><div class="ticket-note"><strong>RETRAIT SUR PLACE</strong><span>17 Av. Pasteur · Cazères</span><small>Paiement au restaurant</small></div></div><form id="order-form" class="order-form"><p class="eyebrow">DERNIÈRE ÉTAPE</p><label>TON NOM<input name="name" required placeholder="Prénom ou nom"></label><label>TON TÉLÉPHONE<input name="phone" required inputmode="tel" placeholder="06 00 00 00 00"></label><label>HEURE SOUHAITÉE<input name="pickupTime" type="time" required></label><button class="primary full">Envoyer ma commande →</button><small>${remoteStore ? 'Commande transmise directement à l’espace Caz Food.' : 'Mode démo : aucune commande réelle n’est envoyée.'}</small></form>`;
  el.querySelectorAll('[data-remove]').forEach(btn => btn.onclick = () => { cart.splice(Number(btn.dataset.remove), 1); renderCart(); });
  el.querySelector('#order-form').onsubmit = async e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); await submitOrder(createOrder(cart, data)); };
}

async function submitOrder(order) {
  try {
    let saved;
    if (remoteStore) saved = await remoteStore.createOrder(order);
    else {
      const existing = JSON.parse(localStorage.getItem('caz-food-orders') || '[]');
      saved = appendOrder(existing, order).at(-1);
      localStorage.setItem('caz-food-orders', JSON.stringify([...existing, saved]));
    }
    cart = [];
    showConfirmation(saved);
  } catch (error) {
    console.error(error);
    alert('Impossible d’envoyer la commande pour le moment.');
  }
}

function showConfirmation(order) {
  const ticket = buildTicketModel(order);
  closeCart();
  document.querySelector('#modal-content').innerHTML = `<div class="confirmation"><div class="confirmed-stamp">✓</div><p class="eyebrow">COMMANDE ENREGISTRÉE</p><h2>${ticket.number}</h2><p>Ton ticket est parti chez Caz Food. Retrait souhaité à <strong>${ticket.pickup}</strong>.</p><div class="ticket-paper compact"><div class="ticket-items">${ticket.items.map(item => `<div class="ticket-item"><div><strong>${item.quantity} × ${item.name}</strong><span>${item.options}</span></div></div>`).join('')}</div><div class="ticket-total"><span>TOTAL</span><strong>${ticket.totalLabel}</strong></div></div><button class="primary full" id="done">Terminé</button></div>`;
  document.querySelector('#product-modal').classList.remove('hidden');
  document.querySelector('#done').onclick = () => { document.querySelector('#product-modal').classList.add('hidden'); render(); };
}

render();
