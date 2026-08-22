import { addItem, calculateTotal, createOrder } from './orderLogic.mjs';
import { appendOrder } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { buildTicketModel } from './uiModel.mjs';
import './styles.css';

/**
 * FOODATOI — application client multi-tenant
 *
 * Flux :
 *
 * domaine
 *   ↓
 * restaurant
 *   ↓
 * produits Supabase
 *   ↓
 * menu
 *   ↓
 * panier
 *   ↓
 * commande
 *
 * Aucun menu Caz Food n'est codé en dur ici.
 */

let restaurant = null;
let menu = [];
let categories = [];

let cart = [];
let activeCategory = 'Tous';

let app = document.querySelector('#root');

const euro = value =>
  `${Number(value ?? 0)
    .toFixed(2)
    .replace('.', ',')} €`;

/* =========================================================
   UTILITAIRES
========================================================= */

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function itemCount() {
  return cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0),
    0
  );
}

/* =========================================================
   CONTEXTE RESTAURANT
========================================================= */

/**
 * Résout le restaurant depuis :
 *
 * 1. window.location.hostname
 * 2. domain
 * 3. slug
 *
 * Exemple :
 *
 * foodatoi.fr
 * restaurant.foodatoi.fr
 * monrestaurant.fr
 */
async function resolveRestaurant() {
  if (!supabase) {
    throw new Error(
      'Supabase n’est pas configuré.'
    );
  }

  const hostname =
    window.location.hostname
      .toLowerCase()
      .replace(/^www\./, '');

  /*
   * 1. Recherche exacte par domaine
   */
  const {
    data: byDomain,
    error: domainError
  } = await supabase
    .from('restaurants')
    .select(`
      id,
      slug,
      name,
      logo_url,
      primary_color,
      is_active,
      sector,
      onboarding_status,
      settings,
      domain,
      phone,
      address
    `)
    .eq('domain', hostname)
    .eq('is_active', true)
    .maybeSingle();

  if (domainError) {
    console.error(
      'Erreur résolution domaine :',
      domainError
    );

    throw domainError;
  }

  if (byDomain) {
    return byDomain;
  }

  /*
   * 2. Si on est sur foodatoi.fr,
   * on ne doit PAS inventer un restaurant.
   *
   * Le domaine principal sert uniquement
   * à l’application / onboarding.
   */

  const foodatoiHostnames = [
    'foodatoi.fr',
    'www.foodatoi.fr'
  ];

  if (foodatoiHostnames.includes(hostname)) {
    return null;
  }

  /*
   * 3. Sous-domaine :
   *
   * kebab-toulouse.foodatoi.fr
   *
   * devient :
   *
   * kebab-toulouse
   */
  const foodatoiSuffix =
    '.foodatoi.fr';

  if (hostname.endsWith(foodatoiSuffix)) {
    const slug =
      hostname.slice(
        0,
        -foodatoiSuffix.length
      );

    if (slug) {
      const {
        data: bySlug,
        error: slugError
      } = await supabase
        .from('restaurants')
        .select(`
          id,
          slug,
          name,
          logo_url,
          primary_color,
          is_active,
          sector,
          onboarding_status,
          settings,
          domain,
          phone,
          address
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (slugError) {
        console.error(
          'Erreur résolution slug :',
          slugError
        );

        throw slugError;
      }

      if (bySlug) {
        return bySlug;
      }
    }
  }

  return null;
}

/* =========================================================
   CATALOGUE
========================================================= */

async function loadMenu(restaurantId) {
  if (!restaurantId) {
    return [];
  }

  const {
    data,
    error
  } = await supabase
    .from('products')
    .select(`
      id,
      name,
      category,
      description,
      price_cents,
      options,
      is_active,
      sort_order,
      restaurant_id
    `)
    .eq(
      'restaurant_id',
      restaurantId
    )
    .eq(
      'is_active',
      true
    )
    .order(
      'sort_order',
      {
        ascending: true
      }
    )
    .order(
      'created_at',
      {
        ascending: true
      }
    );

  if (error) {
    console.error(
      'Erreur chargement catalogue :',
      error
    );

    throw error;
  }

  return (data ?? []).map(
    product => ({
      id: product.id,

      restaurantId:
        product.restaurant_id,

      category:
        product.category ||
        'Autre',

      name:
        product.name ||
        'Produit',

      description:
        product.description ||
        '',

      price:
        Number(
          product.price_cents ?? 0
        ) / 100,

      /*
       * options peut contenir :
       *
       * {
       *   emoji: "🍕",
       *   meat: true,
       *   sauce: true,
       *   drink: true,
       *   multipleMeat: true,
       *   tripleMeat: true,
       *   fields: [...]
       * }
       */
      options:
        product.options &&
        typeof product.options === 'object'
          ? product.options
          : {},

      emoji:
        product.options?.emoji ||
        '🍽️',

      image:
        product.options?.image ||
        product.options?.image_url ||
        null,

      meat:
        Boolean(
          product.options?.meat
        ),

      sauce:
        Boolean(
          product.options?.sauce
        ),

      drink:
        Boolean(
          product.options?.drink
        ),

      multipleMeat:
        Boolean(
          product.options?.multipleMeat
        ),

      tripleMeat:
        Boolean(
          product.options?.tripleMeat
        )
    })
  );
}

function buildCategories() {
  const unique =
    new Set(
      menu
        .map(
          item =>
            item.category
        )
        .filter(Boolean)
    );

  categories = [
    'Tous',
    ...unique
  ];

  if (
    !categories.includes(
      activeCategory
    )
  ) {
    activeCategory = 'Tous';
  }
}

/* =========================================================
   OPTIONS PRODUITS
========================================================= */

function getOptionList(
  item,
  key,
  fallback = []
) {
  const value =
    item.options?.[key];

  if (Array.isArray(value)) {
    return value;
  }

  return fallback;
}

const DEFAULT_MEATS = [
  'Kebab',
  'Poulet',
  'Steak',
  'Merguez'
];

const DEFAULT_SAUCES = [
  'Algérienne',
  'Biggy',
  'Blanche',
  'Barbecue',
  'Curry',
  'Ketchup',
  'Mayonnaise',
  'Samouraï'
];

const DEFAULT_DRINKS = [
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

function optionsHtml(options) {
  return options
    .map(
      option =>
        `<option value="${escapeHtml(
          option
        )}">${escapeHtml(
          option
        )}</option>`
    )
    .join('');
}

function buildMeatField(item) {
  if (!item.meat) {
    return '';
  }

  const meats =
    getOptionList(
      item,
      'meats',
      DEFAULT_MEATS
    );

  if (item.tripleMeat) {
    return `
      <label>
        VIANDE 1
        <select id="meat-1">
          ${optionsHtml(meats)}
        </select>
      </label>

      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(meats)}
        </select>
      </label>

      <label>
        VIANDE 3
        <select id="meat-3">
          ${optionsHtml(meats)}
        </select>
      </label>
    `;
  }

  if (item.multipleMeat) {
    return `
      <label>
        VIANDE 1
        <select id="meat-1">
          ${optionsHtml(meats)}
        </select>
      </label>

      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(meats)}
        </select>
      </label>
    `;
  }

  return `
    <label>
      VIANDE
      <select id="meat-1">
        ${optionsHtml(meats)}
      </select>
    </label>
  `;
}

function buildSauceField(item) {
  if (!item.sauce) {
    return '';
  }

  const sauces =
    getOptionList(
      item,
      'sauces',
      DEFAULT_SAUCES
    );

  return `
    <label>
      SAUCE
      <select id="sauce">
        ${optionsHtml(sauces)}
      </select>
    </label>
  `;
}

function buildDrinkField(item) {
  if (!item.drink) {
    return '';
  }

  const drinks =
    getOptionList(
      item,
      'drinks',
      DEFAULT_DRINKS
    );

  return `
    <label>
      BOISSON
      <select id="drink">
        ${optionsHtml(drinks)}
      </select>
    </label>
  `;
}

/* =========================================================
   BRANDING
========================================================= */

function restaurantName() {
  return (
    restaurant?.name ||
    'FOODATOI'
  );
}

function restaurantAddress() {
  const address =
    restaurant?.address;

  if (!address) {
    return '';
  }

  if (typeof address === 'string') {
    return address;
  }

  return [
    address.street,
    address.postal_code ||
      address.postalCode,
    address.city
  ]
    .filter(Boolean)
    .join(' ');
}

function restaurantPhone() {
  return (
    restaurant?.phone ||
    ''
  );
}

function restaurantColor() {
  return (
    restaurant?.primary_color ||
    restaurant?.settings?.primary_color ||
    '#111111'
  );
}

function applyBranding() {
  const color =
    restaurantColor();

  document.documentElement.style.setProperty(
    '--brand-primary',
    color
  );

  document.title =
    restaurantName();
}

/* =========================================================
   RENDU PRINCIPAL
========================================================= */

function render() {
  if (!app) {
    app =
      document.querySelector(
        '#root'
      );
  }

  if (!restaurant) {
    renderNoRestaurant();
    return;
  }

  if (!menu.length) {
    renderEmptyMenu();
    return;
  }

  app.innerHTML = `
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${
            restaurant.logo_url
              ? `
                <img
                  class="brand-logo"
                  src="${escapeHtml(
                    restaurant.logo_url
                  )}"
                  alt="${escapeHtml(
                    restaurantName()
                  )}"
                >
              `
              : `
                <span class="brand-mark">
                  ${escapeHtml(
                    restaurantName()
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </span>
              `
          }

          <div>
            <strong>
              ${escapeHtml(
                restaurantName()
              )}
            </strong>

            <span>
              ${escapeHtml(
                restaurantAddress()
              )}
            </span>
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
              Commande directement
              chez
              ${escapeHtml(
                restaurantName()
              )}.
            </p>

            <div class="pickup-line">

              <span class="live-dot"></span>

              <span>
                Retrait sur place
              </span>

              <span class="slash">
                /
              </span>

              <span>
                Paiement au restaurant
              </span>

            </div>

          </div>

          <div
            class="receipt-hero"
            aria-label="Retrait sur place"
          >

            <div class="receipt-top">

              <span>
                ${escapeHtml(
                  restaurantName()
                )}
              </span>

              <span>
                AUJ.
              </span>

            </div>

            <div class="receipt-hole"></div>

            <div class="receipt-main">

              <small>
                TON REPAS
              </small>

              <strong>
                COMMENCE<br>
                ICI.
              </strong>

              <span>
                ${escapeHtml(
                  restaurantAddress()
                )}
              </span>

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
              FOODATOI
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
              ${menu.length}
              ${
                menu.length > 1
                  ? 'produits'
                  : 'produit'
              }
            </span>

          </div>

          <nav
            class="category-rail"
            aria-label="Catégories"
          >

            ${categories
              .map(
                category => `
                  <button
                    class="category ${
                      category ===
                      activeCategory
                        ? 'is-active'
                        : ''
                    }"
                    data-category="${escapeHtml(
                      category
                    )}"
                    type="button"
                  >
                    ${escapeHtml(
                      category
                    )}
                  </button>
                `
              )
              .join('')}

          </nav>

          <div class="menu-grid">

            ${menu
              .filter(
                item =>
                  activeCategory ===
                    'Tous' ||
                  item.category ===
                    activeCategory
              )
              .map(card)
              .join('')}

          </div>

        </section>

      </main>

      <footer class="site-footer">

        <div>

          <strong>
            ${escapeHtml(
              restaurantName()
            )}
          </strong>

          <span>
            ${escapeHtml(
              restaurantAddress()
            )}
          </span>

        </div>

        ${
          restaurantPhone()
            ? `
              <a href="tel:${escapeHtml(
                restaurantPhone()
              )}">
                ${escapeHtml(
                  restaurantPhone()
                )}
              </a>
            `
            : ''
        }

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
            ${escapeHtml(
              restaurantName()
            )}
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

/* =========================================================
   ÉTATS SANS RESTAURANT
========================================================= */

function renderNoRestaurant() {
  app.innerHTML = `
    <div class="app-frame">

      <main
        style="
          min-height:100vh;
          display:grid;
          place-items:center;
          padding:32px;
        "
      >

        <section
          style="
            max-width:600px;
            text-align:center;
          "
        >

          <p class="eyebrow">
            FOODATOI
          </p>

          <h1>
            Aucun restaurant
            associé à ce domaine.
          </h1>

          <p>
            Ce domaine n’est pas encore
            configuré sur FOODATOI.
          </p>

        </section>

      </main>

    </div>
  `;
}

function renderEmptyMenu() {
  app.innerHTML = `
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          <span class="brand-mark">
            ${escapeHtml(
              restaurantName()
                .slice(0, 2)
                .toUpperCase()
            )}
          </span>

          <div>
            <strong>
              ${escapeHtml(
                restaurantName()
              )}
            </strong>

            <span>
              ${escapeHtml(
                restaurantAddress()
              )}
            </span>
          </div>

        </div>

      </header>

      <main>

        <section
          class="order-intro"
        >

          <div class="intro-copy">

            <p class="eyebrow">
              FOODATOI
            </p>

            <h1>
              La carte arrive
              bientôt.
            </h1>

            <p class="intro-lede">
              Ce restaurant est bien
              configuré, mais son
              catalogue n’est pas
              encore publié.
            </p>

          </div>

        </section>

      </main>

    </div>
  `;
}

/* =========================================================
   CARTE PRODUIT
========================================================= */

function card(item) {
  return `
    <article class="menu-card">

      <div class="menu-card-top">

        <span class="menu-icon">
          ${escapeHtml(
            item.emoji
          )}
        </span>

        <span class="category-tag">
          ${escapeHtml(
            item.category
          )}
        </span>

      </div>

      ${
        item.image
          ? `
            <div class="menu-card-image">
              <img
                src="${escapeHtml(
                  item.image
                )}"
                alt="${escapeHtml(
                  item.name
                )}"
                loading="lazy"
              >
            </div>
          `
          : ''
      }

      <div class="menu-card-body">

        <h3>
          ${escapeHtml(
            item.name
          )}
        </h3>

        <p>
          ${escapeHtml(
            item.description
          )}
        </p>

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${euro(item.price)}
        </strong>

        <button
          class="add-button"
          data-add="${escapeHtml(
            item.id
          )}"
          type="button"
          aria-label="Ajouter ${escapeHtml(
            item.name
          )}"
        >
          <span>+</span>
          Ajouter
        </button>

      </div>

    </article>
  `;
}

/* =========================================================
   EVENTS
========================================================= */

function bind() {
  document
    .querySelectorAll(
      '[data-category]'
    )
    .forEach(button => {
      button.onclick = () => {
        activeCategory =
          button.dataset.category;

        render();
      };
    });

  document
    .querySelectorAll(
      '[data-add]'
    )
    .forEach(button => {
      button.onclick = () =>
        openProduct(
          button.dataset.add
        );
    });

  document.querySelector(
    '#open-cart'
  ).onclick = openCart;

  document.querySelector(
    '#close-cart'
  ).onclick = closeCart;

  document.querySelector(
    '#backdrop'
  ).onclick = closeCart;
}

/* =========================================================
   PRODUIT
========================================================= */

function openProduct(id) {
  const item =
    menu.find(
      product =>
        product.id === id
    );

  if (!item) {
    return;
  }

  const meatField =
    buildMeatField(item);

  const sauceField =
    buildSauceField(item);

  const drinkField =
    buildDrinkField(item);

  document.querySelector(
    '#modal-content'
  ).innerHTML = `

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${escapeHtml(
        item.emoji
      )}
    </div>

    <p class="eyebrow">
      ${escapeHtml(
        item.category
      )}
    </p>

    <h2>
      ${escapeHtml(
        item.name
      )}
    </h2>

    <p>
      ${escapeHtml(
        item.description
      )}
    </p>

    ${
      item.image
        ? `
          <img
            src="${escapeHtml(
              item.image
            )}"
            alt="${escapeHtml(
              item.name
            )}"
            style="
              width:100%;
              max-height:280px;
              object-fit:cover;
              border-radius:16px;
              margin:16px 0;
            "
          >
        `
        : ''
    }

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
      Ajouter · ${euro(
        item.price
      )}
    </button>

  `;

  document
    .querySelector(
      '#product-modal'
    )
    .classList.remove(
      'hidden'
    );

  document.querySelector(
    '#modal-close'
  ).onclick = () => {
    document
      .querySelector(
        '#product-modal'
      )
      .classList.add(
        'hidden'
      );
  };

  document.querySelector(
    '#confirm-add'
  ).onclick = () => {
    const quantity =
      Math.max(
        1,
        Math.min(
          20,
          Number(
            document.querySelector(
              '#qty'
            ).value || 1
          )
        )
      );

    const options = {};

    const meat1 =
      document.querySelector(
        '#meat-1'
      )?.value;

    const meat2 =
      document.querySelector(
        '#meat-2'
      )?.value;

    const meat3 =
      document.querySelector(
        '#meat-3'
      )?.value;

    const sauce =
      document.querySelector(
        '#sauce'
      )?.value;

    const drink =
      document.querySelector(
        '#drink'
      )?.value;

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

    cart = addItem(
      cart,
      {
        ...item,
        quantity,
        options
      }
    );

    document
      .querySelector(
        '#product-modal'
      )
      .classList.add(
        'hidden'
      );

    render();

    openCart();
  };
}

/* =========================================================
   PANIER
========================================================= */

function openCart() {
  document
    .querySelector(
      '#drawer'
    )
    ?.classList.add(
      'open'
    );

  document
    .querySelector(
      '#backdrop'
    )
    ?.classList.remove(
      'hidden'
    );

  renderCart();
}

function closeCart() {
  document
    .querySelector(
      '#drawer'
    )
    ?.classList.remove(
      'open'
    );

  document
    .querySelector(
      '#backdrop'
    )
    ?.classList.add(
      'hidden'
    );
}

function renderCart() {
  const element =
    document.querySelector(
      '#cart-content'
    );

  if (!element) {
    return;
  }

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
          Choisis quelque chose
          dans la carte.
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

    element.querySelector(
      '#back-menu'
    ).onclick =
      closeCart;

    return;
  }

  element.innerHTML = `

    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${escapeHtml(
            restaurantName()
          )}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${cart
          .map(
            (item, index) =>
              ticketItem(
                item,
                index
              )
          )
          .join('')}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${euro(
            calculateTotal(
              cart
            )
          )}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        <span>
          ${escapeHtml(
            restaurantAddress()
          )}
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
            ? `Commande transmise directement à ${escapeHtml(
                restaurantName()
              )}.`
            : 'Mode démo : aucune commande réelle n’est envoyée.'
        }
      </small>

    </form>
  `;

  element
    .querySelectorAll(
      '[data-remove]'
    )
    .forEach(button => {
      button.onclick = () => {
        cart.splice(
          Number(
            button.dataset.remove
          ),
          1
        );

        renderCart();
      };
    });

  element.querySelector(
    '#order-form'
  ).onsubmit =
    async event => {
      event.preventDefault();

      const formData =
        Object.fromEntries(
          new FormData(
            event.currentTarget
          )
        );

      /*
       * Le contexte restaurant est
       * explicitement ajouté à la commande.
       */
      const order =
        createOrder(
          cart,
          formData
        );

      const tenantOrder = {
        ...order,

        restaurant_id:
          restaurant.id,

        restaurantId:
          restaurant.id
      };

      await submitOrder(
        tenantOrder
      );
    };
}

function ticketItem(
  item,
  index
) {
  const options =
    formatOptions(
      item.options
    );

  return `
    <div class="ticket-item">

      <div>

        <strong>
          ${item.quantity} ×
          ${escapeHtml(
            item.name
          )}
        </strong>

        ${
          options
            ? `
              <span>
                ${escapeHtml(
                  options
                )}
              </span>
            `
            : ''
        }

      </div>

      <b>
        ${euro(
          item.price *
          item.quantity
        )}
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

function formatOptions(
  options = {}
) {
  if (
    !options ||
    typeof options !==
      'object'
  ) {
    return '';
  }

  const parts = [];

  if (
    Array.isArray(
      options.meats
    )
  ) {
    parts.push(
      `Viandes : ${options.meats.join(
        ', '
      )}`
    );
  } else if (
    options.meat
  ) {
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

  return parts.join(
    ' · '
  );
}

/* =========================================================
   COMMANDES
========================================================= */

const remoteStore =
  supabase
    ? createSupabaseOrderStore(
        supabase
      )
    : null;

async function submitOrder(
  order
) {
  try {
    let saved;

    if (remoteStore) {
      saved =
        await remoteStore.createOrder(
          order
        );
    } else {
      const existing =
        JSON.parse(
          localStorage.getItem(
            'foodatoi-orders'
          ) || '[]'
        );

      saved =
        appendOrder(
          existing,
          order
        ).at(-1);

      localStorage.setItem(
        'foodatoi-orders',
        JSON.stringify([
          ...existing,
          saved
        ])
      );
    }

    cart = [];

    showConfirmation(
      saved
    );
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

/* =========================================================
   CONFIRMATION
========================================================= */

function showConfirmation(
  order
) {
  const ticket =
    buildTicketModel(
      order
    );

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
        ${escapeHtml(
          ticket.number
        )}
      </h2>

      <p>
        Ton ticket est parti chez
        ${escapeHtml(
          restaurantName()
        )}.

        Retrait souhaité à
        <strong>
          ${escapeHtml(
            ticket.pickup
          )}
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
                      ${escapeHtml(
                        item.name
                      )}
                    </strong>

                    <span>
                      ${escapeHtml(
                        item.options ||
                          ''
                      )}
                    </span>

                  </div>

                </div>
              `
            )
            .join('')}

        </div>

        <div class="ticket-total">

          <span>
            TOTAL
          </span>

          <strong>
            ${escapeHtml(
              ticket.totalLabel
            )}
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
    .querySelector(
      '#product-modal'
    )
    .classList.remove(
      'hidden'
    );

  document.querySelector(
    '#done'
  ).onclick = () => {
    document
      .querySelector(
        '#product-modal'
      )
      .classList.add(
        'hidden'
      );

    render();
  };
}

/* =========================================================
   INITIALISATION
========================================================= */

async function bootstrap() {
  try {
    app.innerHTML = `
      <div class="app-frame">
        <main
          style="
            min-height:100vh;
            display:grid;
            place-items:center;
            padding:32px;
          "
        >
          <p class="eyebrow">
            FOODATOI · CHARGEMENT…
          </p>
        </main>
      </div>
    `;

    restaurant =
      await resolveRestaurant();

    if (!restaurant) {
      renderNoRestaurant();
      return;
    }

    applyBranding();

    menu =
      await loadMenu(
        restaurant.id
      );

    buildCategories();

    render();
  } catch (error) {
    console.error(
      'Erreur initialisation FOODATOI :',
      error
    );

    app.innerHTML = `
      <div class="app-frame">

        <main
          style="
            min-height:100vh;
            display:grid;
            place-items:center;
            padding:32px;
          "
        >

          <section
            style="
              max-width:600px;
              text-align:center;
            "
          >

            <p class="eyebrow">
              FOODATOI
            </p>

            <h1>
              Une erreur est survenue.
            </h1>

            <p>
              Impossible de charger
              cet établissement pour
              le moment.
            </p>

          </section>

        </main>

      </div>
    `;
  }
}

bootstrap();
