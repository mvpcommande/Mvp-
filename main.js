import { addItem, calculateTotal, createOrder } from './orderLogic.mjs';
import { appendOrder } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { buildTicketModel } from './uiModel.mjs';
import './styles.css';

const menu = [
  {
    id: 'menu-tacos-simple',
    category: 'Tacos',
    name: 'Menu tacos simple',
    description: 'Sauce fromagère, frites et 1 viande au choix.',
    price: 12.90,
    emoji: '🌮',
    meat: true,
    sauce: true,
    drink: true
  },
  {
    id: 'menu-tacos-double',
    category: 'Tacos',
    name: 'Menu tacos double',
    description: 'Sauce fromagère, frites et 2 viandes au choix.',
    price: 16.80,
    emoji: '🌮',
    meat: true,
    sauce: true,
    drink: true,
    multipleMeat: true
  },
  {
    id: 'menu-tacos-triple',
    category: 'Tacos',
    name: 'Menu tacos triple',
    description: 'Sauce fromagère, frites et 3 viandes au choix.',
    price: 18.10,
    emoji: '🌮',
    meat: true,
    sauce: true,
    drink: true,
    multipleMeat: true,
    tripleMeat: true
  },
  {
    id: 'menu-sandwich',
    category: 'Sandwichs',
    name: 'Menu sandwich',
    description: 'Pain, viande au choix, sauce et frites + boisson.',
    price: 11.05,
    emoji: '🥙',
    meat: true,
    sauce: true,
    drink: true
  },
  {
    id: 'menu-burger',
    category: 'Burgers',
    name: 'Menu burger',
    description: 'Burger, frites et boisson 33 cl.',
    price: 11.05,
    emoji: '🍔',
    sauce: false,
    drink: true
  },
  {
    id: 'menu-chicken-burger',
    category: 'Burgers',
    name: 'Menu chicken burger',
    description: 'Chicken burger, frites et boisson 33 cl.',
    price: 11.05,
    emoji: '🍔',
    sauce: false,
    drink: true
  },
  {
    id: 'menu-double-burger',
    category: 'Burgers',
    name: 'Menu double burger',
    description: 'Double burger, frites et boisson 33 cl.',
    price: 13.70,
    emoji: '🍔',
    sauce: false,
    drink: true
  },
  {
    id: 'menu-assiette',
    category: 'Assiettes',
    name: 'Menu assiette',
    description: '1 viande au choix, servi avec boisson 33 cl.',
    price: 16.80,
    emoji: '🍽️',
    meat: true,
    sauce: true,
    drink: true
  },
  {
    id: 'tenders',
    category: 'Tex-Mex',
    name: 'Chicken tenders',
    description: 'Portion de tenders.',
    price: 5.90,
    emoji: '🍗',
    sauce: true,
    drink: false
  },
  {
    id: 'kids',
    category: 'Enfants',
    name: 'Kids box',
    description: 'Formule enfant.',
    price: 7.80,
    emoji: '🧒',
    sauce: false,
    drink: true
  }
];

const MEATS = [
  'Kebab',
  'Poulet',
  'Steak',
  'Merguez'
];

const SAUCES = [
  'Algérienne',
  'Biggy',
  'Blanche',
  'Barbecue',
  'Curry',
  'Ketchup',
  'Mayonnaise',
  'Samouraï'
];

const DRINKS = [
  'Coca-Cola',
  'Coca-Cola Zéro',
  'Coca-Cola Cherry',
  'Fanta Orange',
  'Fanta Citron',
  'Sprite',
  'Oasis Tropical',
  'Oasis Pomme Cassis',
  'Ice Tea',
  'Eau'
];

let cart = [];
let activeCategory = 'Tous';

const remoteStore = supabase
  ? createSupabaseOrderStore(supabase)
  : null;

const categories = [
  'Tous',
  ...new Set(menu.map(item => item.category))
];

const app = document.querySelector('#root');

const euro = value =>
  `${Number(value).toFixed(2).replace('.', ',')} €`;

const itemCount = () =>
  cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

function render() {
  app.innerHTML = `
    <div class="app-frame">

      <header class="masthead">
        <div class="brand-lockup">
          <span class="brand-mark">CF</span>

          <div>
            <strong>CAZ FOOD</strong>
            <span>CAZÈRES · 31220</span>
          </div>
        </div>

        <button
          class="order-pill"
          id="open-cart"
          type="button"
        >
          <span>Ma commande</span>
          <b>${itemCount()}</b>
        </button>
      </header>

      <main>

        <section class="order-intro">

          <div class="intro-copy">
            <p class="eyebrow">
              COMMANDE DIRECTE
            </p>

            <h1>
              Choisis.<br>
              <em>On prépare.</em>
            </h1>

            <p class="intro-lede">
              Ton repas, directement chez Caz Food.
              Pas de détour, pas de plateforme.
            </p>

            <div class="pickup-line">
              <span class="live-dot"></span>
              <span>Retrait sur place</span>
              <span class="slash">/</span>
              <span>Paiement au restaurant</span>
            </div>
          </div>

          <div
            class="receipt-hero"
            aria-label="Retrait sur place"
          >
            <div class="receipt-top">
              <span>CAZ FOOD</span>
              <span>AUJ.</span>
            </div>

            <div class="receipt-hole"></div>

            <div class="receipt-main">
              <small>TON REPAS</small>
              <strong>
                COMMENCE<br>
                ICI.
              </strong>
              <span>17 AV. PASTEUR</span>
            </div>

            <div class="receipt-barcode">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div class="receipt-code">
              CF · CAZÈRES
            </div>
          </div>

        </section>

        <section class="menu-section">

          <div class="section-head">

            <div>
              <p class="eyebrow">
                LA CARTE
              </p>

              <h2>
                Tu prends quoi ?
              </h2>
            </div>

            <span class="menu-count">
              ${menu.length} incontournables
            </span>

          </div>

          <nav
            class="category-rail"
            aria-label="Catégories"
          >
            ${categories
              .map(category => `
                <button
                  class="category ${
                    category === activeCategory
                      ? 'is-active'
                      : ''
                  }"
                  data-category="${escapeHtml(category)}"
                  type="button"
                >
                  ${escapeHtml(category)}
                </button>
              `)
              .join('')}
          </nav>

          <div class="menu-grid">
            ${menu
              .filter(
                item =>
                  activeCategory === 'Tous' ||
                  item.category === activeCategory
              )
              .map(card)
              .join('')}
          </div>

        </section>

      </main>

      <footer class="site-footer">
        <div>
          <strong>CAZ FOOD</strong>
          <span>
            17 Av. Pasteur · Cazères
          </span>
        </div>

        <a href="tel:0562015990">
          05 62 01 59 90
        </a>
      </footer>

    </div>

    <div
      class="drawer-backdrop hidden"
      id="backdrop"
    ></div>

    <aside
      class="drawer"
      id="drawer"
      aria-label="Panier"
    >
      <div class="drawer-head">

        <div>
          <p class="eyebrow">
            CAZ FOOD
          </p>

          <h2>
            Ton ticket
          </h2>
        </div>

        <button
          id="close-cart"
          class="icon-btn"
          type="button"
          aria-label="Fermer"
        >
          ×
        </button>

      </div>

      <div id="cart-content"></div>
    </aside>

    <div
      class="modal hidden"
      id="product-modal"
    >
      <div
        class="modal-card"
        id="modal-content"
      ></div>
    </div>
  `;

  bind();
  renderCart();
}

function card(item) {
  return `
    <article class="menu-card">

      <div class="menu-card-top">
        <span class="menu-icon">
          ${item.emoji}
        </span>

        <span class="category-tag">
          ${escapeHtml(item.category)}
        </span>
      </div>

      <div class="menu-card-body">
        <h3>
          ${escapeHtml(item.name)}
        </h3>

        <p>
          ${escapeHtml(item.description)}
        </p>
      </div>

      <div class="menu-card-bottom">

        <strong>
          ${euro(item.price)}
        </strong>

        <button
          class="add-button"
          data-add="${escapeHtml(item.id)}"
          type="button"
          aria-label="Ajouter ${escapeHtml(item.name)}"
        >
          <span>+</span>
          Ajouter
        </button>

      </div>

    </article>
  `;
}

function bind() {
  document
    .querySelectorAll('[data-category]')
    .forEach(button => {
      button.onclick = () => {
        activeCategory = button.dataset.category;
        render();
      };
    });

  document
    .querySelectorAll('[data-add]')
    .forEach(button => {
      button.onclick = () =>
        openProduct(button.dataset.add);
    });

  document.querySelector('#open-cart').onclick =
    openCart;

  document.querySelector('#close-cart').onclick =
    closeCart;

  document.querySelector('#backdrop').onclick =
    closeCart;
}

function openProduct(id) {
  const item = menu.find(
    product => product.id === id
  );

  if (!item) return;

  const meatField = buildMeatField(item);
  const sauceField = buildSauceField(item);
  const drinkField = buildDrinkField(item);

  document.querySelector('#modal-content').innerHTML = `
    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${item.emoji}
    </div>

    <p class="eyebrow">
      ${escapeHtml(item.category)}
    </p>

    <h2>
      ${escapeHtml(item.name)}
    </h2>

    <p>
      ${escapeHtml(item.description)}
    </p>

    <div class="form-grid">

      ${meatField}

      ${sauceField}

      ${drinkField}

      <label>
        QUANTITÉ
        <input
          id="qty"
          type="number"
          min="1"
          max="20"
          value="1"
          inputmode="numeric"
        >
      </label>

    </div>

    <button
      class="primary full"
      id="confirm-add"
      type="button"
    >
      Ajouter · ${euro(item.price)}
    </button>
  `;

  document
    .querySelector('#product-modal')
    .classList.remove('hidden');

  document.querySelector('#modal-close').onclick =
    () => {
      document
        .querySelector('#product-modal')
        .classList.add('hidden');
    };

  document.querySelector('#confirm-add').onclick =
    () => {
      const quantity = Math.max(
        1,
        Math.min(
          20,
          Number(
            document.querySelector('#qty').value || 1
          )
        )
      );

      const options = {};

      const meat1 =
        document.querySelector('#meat-1')?.value;

      const meat2 =
        document.querySelector('#meat-2')?.value;

      const meat3 =
        document.querySelector('#meat-3')?.value;

      const sauce =
        document.querySelector('#sauce')?.value;

      const drink =
        document.querySelector('#drink')?.value;

      if (meat1) {
        options.meat = meat1;
      }

      if (meat2) {
        options.meat2 = meat2;
      }

      if (meat3) {
        options.meat3 = meat3;
      }

      if (meat2 || meat3) {
        options.meats = [
          meat1,
          meat2,
          meat3
        ].filter(Boolean);
      }

      if (sauce) {
        options.sauce = sauce;
      }

      if (drink) {
        options.drink = drink;
      }

      cart = addItem(cart, {
        ...item,
        quantity,
        options
      });

      document
        .querySelector('#product-modal')
        .classList.add('hidden');

      render();
      openCart();
    };
}

function buildMeatField(item) {
  if (!item.meat) return '';

  if (item.tripleMeat) {
    return `
      <label>
        VIANDE 1
        <select id="meat-1">
          ${optionsHtml(MEATS)}
        </select>
      </label>

      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(MEATS)}
        </select>
      </label>

      <label>
        VIANDE 3
        <select id="meat-3">
          ${optionsHtml(MEATS)}
        </select>
      </label>
    `;
  }

  if (item.multipleMeat) {
    return `
      <label>
        VIANDE 1
        <select id="meat-1">
          ${optionsHtml(MEATS)}
        </select>
      </label>

      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(MEATS)}
        </select>
      </label>
    `;
  }

  return `
    <label>
      VIANDE
      <select id="meat-1">
        ${optionsHtml(MEATS)}
      </select>
    </label>
  `;
}

function buildSauceField(item) {
  if (!item.sauce) return '';

  return `
    <label>
      SAUCE
      <select id="sauce">
        ${optionsHtml(SAUCES)}
      </select>
    </label>
  `;
}

function buildDrinkField(item) {
  if (!item.drink) return '';

  return `
    <label>
      BOISSON
      <select id="drink">
        ${optionsHtml(DRINKS)}
      </select>
    </label>
  `;
}

function optionsHtml(options) {
  return options
    .map(
      option =>
        `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`
    )
    .join('');
}

function openCart() {
  document
    .querySelector('#drawer')
    .classList.add('open');

  document
    .querySelector('#backdrop')
    .classList.remove('hidden');

  renderCart();
}

function closeCart() {
  document
    .querySelector('#drawer')
    .classList.remove('open');

  document
    .querySelector('#backdrop')
    .classList.add('hidden');
}

function renderCart() {
  const element =
    document.querySelector('#cart-content');

  if (!element) return;

  if (!cart.length) {
    element.innerHTML = `
      <div class="empty-ticket">

        <div class="empty-ticket-mark">
          +
        </div>

        <h3>
          Ton ticket est vide.
        </h3>

        <p>
          Choisis quelque chose dans la carte.
          On s'occupe du reste.
        </p>

        <button
          class="primary full"
          id="back-menu"
          type="button"
        >
          Voir la carte
        </button>

      </div>
    `;

    element.querySelector('#back-menu').onclick =
      closeCart;

    return;
  }

  element.innerHTML = `
    <div class="ticket-paper">

      <div class="ticket-header">
        <span>CAZ FOOD</span>
        <span>COMMANDE</span>
      </div>

      <div class="ticket-items">
        ${cart
          .map(
            (item, index) =>
              ticketItem(item, index)
          )
          .join('')}
      </div>

      <div class="ticket-total">
        <span>TOTAL</span>
        <strong>
          ${euro(calculateTotal(cart))}
        </strong>
      </div>

      <div class="ticket-note">
        <strong>
          RETRAIT SUR PLACE
        </strong>

        <span>
          17 Av. Pasteur · Cazères
        </span>

        <small>
          Paiement au restaurant
        </small>
      </div>

    </div>

    <form
      id="order-form"
      class="order-form"
    >

      <p class="eyebrow">
        DERNIÈRE ÉTAPE
      </p>

      <label>
        TON NOM
        <input
          name="name"
          required
          placeholder="Prénom ou nom"
          autocomplete="name"
        >
      </label>

      <label>
        TON TÉLÉPHONE
        <input
          name="phone"
          required
          inputmode="tel"
          placeholder="06 00 00 00 00"
          autocomplete="tel"
        >
      </label>

      <label>
        HEURE SOUHAITÉE
        <input
          name="pickupTime"
          type="time"
          required
        >
      </label>

      <button
        class="primary full"
        type="submit"
      >
        Envoyer ma commande →
      </button>

      <small>
        ${
          remoteStore
            ? 'Commande transmise directement à l’espace Caz Food.'
            : 'Mode démo : aucune commande réelle n’est envoyée.'
        }
      </small>

    </form>
  `;

  element
    .querySelectorAll('[data-remove]')
    .forEach(button => {
      button.onclick = () => {
        cart.splice(
          Number(button.dataset.remove),
          1
        );

        renderCart();
      };
    });

  element.querySelector('#order-form').onsubmit =
    async event => {
      event.preventDefault();

      const formData =
        Object.fromEntries(
          new FormData(event.currentTarget)
        );

      const order = createOrder(
        cart,
        formData
      );

      await submitOrder(order);
    };
}

function ticketItem(item, index) {
  const options = formatOptions(item.options);

  return `
    <div class="ticket-item">

      <div>
        <strong>
          ${item.quantity} ×
          ${escapeHtml(item.name)}
        </strong>

        ${
          options
            ? `<span>${escapeHtml(options)}</span>`
            : ''
        }
      </div>

      <b>
        ${euro(item.price * item.quantity)}
      </b>

      <button
        data-remove="${index}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `;
}

function formatOptions(options = {}) {
  if (!options || typeof options !== 'object') {
    return '';
  }

  const parts = [];

  if (Array.isArray(options.meats)) {
    parts.push(
      `Viandes : ${options.meats.join(', ')}`
    );
  } else if (options.meat) {
    parts.push(
      `Viande : ${options.meat}`
    );
  }

  if (options.sauce) {
    parts.push(
      `Sauce : ${options.sauce}`
    );
  }

  if (options.drink) {
    parts.push(
      `Boisson : ${options.drink}`
    );
  }

  return parts.join(' · ');
}

async function submitOrder(order) {
  try {
    let saved;

    if (remoteStore) {
      saved =
        await remoteStore.createOrder(order);
    } else {
      const existing =
        JSON.parse(
          localStorage.getItem(
            'caz-food-orders'
          ) || '[]'
        );

      saved =
        appendOrder(
          existing,
          order
        ).at(-1);

      localStorage.setItem(
        'caz-food-orders',
        JSON.stringify([
          ...existing,
          saved
        ])
      );
    }

    cart = [];

    showConfirmation(saved);
  } catch (error) {
    console.error(
      'Erreur création commande :',
      error
    );

    alert(
      'Impossible d’envoyer la commande pour le moment.'
    );
  }
}

function showConfirmation(order) {
  const ticket =
    buildTicketModel(order);

  closeCart();

  document.querySelector(
    '#modal-content'
  ).innerHTML = `
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${escapeHtml(ticket.number)}
      </h2>

      <p>
        Ton ticket est parti chez Caz Food.
        Retrait souhaité à
        <strong>
          ${escapeHtml(ticket.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">
          ${ticket.items
            .map(
              item => `
                <div class="ticket-item">
                  <div>
                    <strong>
                      ${item.quantity} ×
                      ${escapeHtml(item.name)}
                    </strong>

                    <span>
                      ${escapeHtml(item.options || '')}
                    </span>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>

        <div class="ticket-total">
          <span>TOTAL</span>

          <strong>
            ${escapeHtml(ticket.totalLabel)}
          </strong>
        </div>

      </div>

      <button
        class="primary full"
        id="done"
        type="button"
      >
        Terminé
      </button>

    </div>
  `;

  document
    .querySelector('#product-modal')
    .classList.remove('hidden');

  document.querySelector('#done').onclick =
    () => {
      document
        .querySelector('#product-modal')
        .classList.add('hidden');

      render();
    };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();
