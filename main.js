import {
  addItem,
  calculateTotal,
  createOrder
} from './orderLogic.mjs';

import {
  appendOrder
} from './orderStore.mjs';

import {
  createSupabaseOrderStore
} from './supabaseStore.mjs';

import {
  supabase
} from './supabaseClient.js';

import {
  buildTicketModel
} from './uiModel.mjs';

import './styles.css';

/**
 * FOODATOI
 * Frontend multi-restaurant.
 *
 * Architecture :
 *
 * https://www.foodatoi.fr/caz-food
 *              ↓
 *        slug = "caz-food"
 *              ↓
 *      Supabase RPC
 * resolve_restaurant("caz-food.foodatoi.fr")
 *              ↓
 *          restaurant
 *              ↓
 * products.restaurant_id
 *              ↓
 *            menu
 *
 * Aucun domaine du restaurant n'est nécessaire.
 *
 * Le domaine principal FOODATOI reste :
 *
 * https://www.foodatoi.fr
 *
 * Chaque restaurant est accessible par :
 *
 * https://www.foodatoi.fr/<slug>
 */

let restaurant = null;
let menu = [];
let cart = [];
let activeCategory = 'Tous';

let remoteStore = null;

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

const app = document.querySelector('#root');

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const euro = value =>
  `${Number(value ?? 0)
    .toFixed(2)
    .replace('.', ',')} €`;

const itemCount = () =>
  cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0),
    0
  );

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

function getHostname() {
  return window.location.hostname
    .trim()
    .toLowerCase()
    .replace(/^www\./, '');
}

/**
 * Retourne le slug restaurant présent
 * dans l'URL FOODATOI.
 *
 * Exemple :
 *
 * /caz-food
 * → caz-food
 *
 * /caz-food/
 * → caz-food
 *
 * /
 * → null
 */
function getRestaurantSlugFromPath() {
  const pathname =
    window.location.pathname
      .trim()
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

  if (!pathname) {
    return null;
  }

  const segments =
    pathname
      .split('/')
      .filter(Boolean);

  if (!segments.length) {
    return null;
  }

  const slug =
    decodeURIComponent(
      segments[0]
    )
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  /**
   * Protection contre les chemins
   * qui ne doivent pas être considérés
   * comme des restaurants.
   */
  const reservedRoutes = [
    'favicon.ico',
    'robots.txt',
    'sitemap.xml',
    'assets'
  ];

  if (
    reservedRoutes.includes(slug)
  ) {
    return null;
  }

  return slug;
}

/**
 * Construit le hostname virtuel attendu
 * par la fonction Supabase.
 *
 * Exemple :
 *
 * slug = caz-food
 *
 * → caz-food.foodatoi.fr
 *
 * La fonction SQL existante de Supabase
 * sait déjà résoudre ce format à partir
 * du slug restaurant.
 */
function getRestaurantResolverHost() {
  const slug =
    getRestaurantSlugFromPath();

  if (slug) {
    return `${slug}.foodatoi.fr`;
  }

  return getHostname();
}

function getRestaurantDisplayName() {
  return (
    restaurant?.name ||
    'FOODATOI'
  );
}

function getRestaurantPhone() {
  return restaurant?.phone || '';
}

function getRestaurantAddress() {
  const address =
    restaurant?.address;

  if (!address) {
    return '';
  }

  if (typeof address === 'string') {
    return address;
  }

  if (typeof address === 'object') {
    return [
      address.street,
      address.postal_code ||
        address.postalCode,
      address.city
    ]
      .filter(Boolean)
      .join(' · ');
  }

  return '';
}

function getRestaurantColor() {
  return (
    restaurant?.primary_color ||
    '#111111'
  );
}

/* -------------------------------------------------------------------------- */
/* Restaurant resolution                                                      */
/* -------------------------------------------------------------------------- */

async function resolveRestaurant() {
  if (!supabase) {
    throw new Error(
      'Supabase n’est pas configuré.'
    );
  }

  const realHostname =
    getHostname();

  const resolverHost =
    getRestaurantResolverHost();

  const slug =
    getRestaurantSlugFromPath();

  console.info(
    '[FOODATOI] Hostname réel:',
    realHostname
  );

  console.info(
    '[FOODATOI] Slug URL:',
    slug
  );

  console.info(
    '[FOODATOI] Hostname utilisé pour résolution:',
    resolverHost
  );

  /**
   * La fonction Supabase existante :
   *
   * resolve_restaurant(hostname text)
   *
   * sait déjà résoudre :
   *
   * <slug>.foodatoi.fr
   *
   * On lui transmet donc :
   *
   * caz-food.foodatoi.fr
   *
   * même si l'utilisateur est réellement
   * sur :
   *
   * www.foodatoi.fr/caz-food
   */
  const {
    data,
    error
  } = await supabase.rpc(
    'resolve_restaurant',
    {
      hostname:
        resolverHost
    }
  );

  if (error) {
    console.error(
      '[FOODATOI] Erreur résolution restaurant:',
      error
    );

    throw error;
  }

  const resolved =
    Array.isArray(data)
      ? data[0]
      : data;

  if (!resolved?.id) {
    throw new Error(
      `Aucun restaurant FOODATOI configuré pour "${slug || realHostname}".`
    );
  }

  if (!isUuid(resolved.id)) {
    throw new Error(
      'Identifiant restaurant invalide.'
    );
  }

  restaurant = {
    ...resolved
  };

  console.info(
    '[FOODATOI] Restaurant résolu:',
    restaurant
  );

  applyRestaurantBranding();

  /**
   * Maintenant seulement que le tenant
   * est connu, on crée le store Supabase.
   *
   * Le restaurant_id sera transmis
   * dans chaque commande.
   */
  remoteStore =
    createSupabaseOrderStore(
      supabase,
      restaurant.id
    );

  return restaurant;
}

/* -------------------------------------------------------------------------- */
/* Branding                                                                   */
/* -------------------------------------------------------------------------- */

function applyRestaurantBranding() {
  if (!restaurant) {
    return;
  }

  document.documentElement.style.setProperty(
    '--restaurant-primary',
    getRestaurantColor()
  );

  document.title =
    `${getRestaurantDisplayName()} · FOODATOI`;
}

/* -------------------------------------------------------------------------- */
/* Product normalization                                                      */
/* -------------------------------------------------------------------------- */

function normalizeProduct(product) {
  const options =
    product.options &&
    typeof product.options === 'object'
      ? product.options
      : {};

  const price =
    Number(product.price_cents ?? 0) /
    100;

  return {
    id:
      product.id,

    category:
      product.category ||
      'Autres',

    name:
      product.name ||
      'Produit',

    description:
      product.description ||
      '',

    price,

    emoji:
      options.emoji ||
      options.icon ||
      '🍽️',

    options,

    meat:
      Boolean(
        options.meat ||
        options.meats ||
        options.viande ||
        options.viandes
      ),

    sauce:
      Boolean(
        options.sauce ||
        options.sauces
      ),

    drink:
      Boolean(
        options.drink ||
        options.drinks ||
        options.boisson ||
        options.boissons
      ),

    multipleMeat:
      Boolean(
        options.multipleMeat ||
        options.multiple_meat
      ),

    tripleMeat:
      Boolean(
        options.tripleMeat ||
        options.triple_meat
      )
  };
}

/* -------------------------------------------------------------------------- */
/* Catalog                                                                    */
/* -------------------------------------------------------------------------- */

async function loadMenu() {
  if (!supabase) {
    throw new Error(
      'Supabase n’est pas configuré.'
    );
  }

  if (!restaurant?.id) {
    throw new Error(
      'Restaurant non résolu.'
    );
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
      restaurant_id,
      created_at
    `)
    .eq(
      'restaurant_id',
      restaurant.id
    )
    .eq(
      'is_active',
      true
    )
    .order(
      'sort_order',
      {
        ascending: true,
        nullsFirst: false
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
      '[FOODATOI] Erreur chargement catalogue:',
      error
    );

    throw error;
  }

  menu =
    (data ?? [])
      .filter(
        product =>
          product.restaurant_id ===
          restaurant.id
      )
      .map(
        normalizeProduct
      );

  activeCategory =
    'Tous';

  console.info(
    `[FOODATOI] ${menu.length} produit(s) chargé(s) pour ${getRestaurantDisplayName()}.`
  );

  return menu;
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

function getCategories() {
  return [
    'Tous',
    ...new Set(
      menu
        .map(
          item => item.category
        )
        .filter(Boolean)
    )
  ];
}

/* -------------------------------------------------------------------------- */
/* Loading / error UI                                                         */
/* -------------------------------------------------------------------------- */

function renderLoading() {
  app.innerHTML = `
    <div class="app-frame">

      <main>

        <section class="order-intro">

          <div class="intro-copy">

            <p class="eyebrow">
              FOODATOI
            </p>

            <h1>
              Chargement<br>
              <em>du restaurant.</em>
            </h1>

            <p class="intro-lede">
              Nous préparons la carte.
            </p>

          </div>

        </section>

      </main>

    </div>
  `;
}

function renderError(error) {
  console.error(
    '[FOODATOI] Erreur application:',
    error
  );

  app.innerHTML = `
    <div class="app-frame">

      <main>

        <section class="order-intro">

          <div class="intro-copy">

            <p class="eyebrow">
              FOODATOI
            </p>

            <h1>
              Restaurant<br>
              <em>indisponible.</em>
            </h1>

            <p class="intro-lede">
              La configuration de ce restaurant
              n'est pas encore disponible.
            </p>

            <div class="pickup-line">

              <span>
                Vérifie l'URL ou réessaie plus tard.
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Main render                                                                */
/* -------------------------------------------------------------------------- */

function render() {
  const categories =
    getCategories();

  const displayName =
    getRestaurantDisplayName();

  const address =
    getRestaurantAddress();

  const phone =
    getRestaurantPhone();

  app.innerHTML = `
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${
            restaurant?.logo_url
              ? `
                <img
                  class="brand-mark-image"
                  src="${escapeHtml(
                    restaurant.logo_url
                  )}"
                  alt="${escapeHtml(
                    displayName
                  )}"
                >
              `
              : `
                <span class="brand-mark">
                  ${escapeHtml(
                    displayName
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </span>
              `
          }

          <div>

            <strong>
              ${escapeHtml(
                displayName
              )}
            </strong>

            <span>
              ${escapeHtml(
                restaurant?.sector ||
                'RESTAURANT'
              )}
            </span>

          </div>

        </div>

        <button
          class="order-pill"
          id="open-cart"
          type="button"
        >
          <span>
            Ma commande
          </span>

          <b>
            ${itemCount()}
          </b>
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
              Ton repas, directement chez
              ${escapeHtml(
                displayName
              )}.
              Pas de détour, pas de plateforme.
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
                  displayName
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

              ${
                address
                  ? `
                    <span>
                      ${escapeHtml(
                        address
                      )}
                    </span>
                  `
                  : ''
              }

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

          ${
            categories.length > 1
              ? `
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
              `
              : ''
          }

          <div class="menu-grid">

            ${
              menu.length
                ? menu
                    .filter(
                      item =>
                        activeCategory ===
                          'Tous' ||
                        item.category ===
                          activeCategory
                    )
                    .map(card)
                    .join('')
                : `
                  <div class="empty-ticket">

                    <div class="empty-ticket-mark">
                      +
                    </div>

                    <h3>
                      Carte en préparation.
                    </h3>

                    <p>
                      Ce restaurant n'a pas encore
                      publié de produits.
                    </p>

                  </div>
                `
            }

          </div>

        </section>

      </main>

      <footer class="site-footer">

        <div>

          <strong>
            ${escapeHtml(
              displayName
            )}
          </strong>

          ${
            address
              ? `
                <span>
                  ${escapeHtml(
                    address
                  )}
                </span>
              `
              : ''
          }

        </div>

        ${
          phone
            ? `
              <a
                href="tel:${escapeHtml(
                  phone
                )}"
              >
                ${escapeHtml(
                  phone
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
              displayName
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

/* -------------------------------------------------------------------------- */
/* Product card                                                               */
/* -------------------------------------------------------------------------- */

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

      <div class="menu-card-body">

        <h3>
          ${escapeHtml(
            item.name
          )}
        </h3>

        ${
          item.description
            ? `
              <p>
                ${escapeHtml(
                  item.description
                )}
              </p>
            `
            : ''
        }

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${euro(
            item.price
          )}
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

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `;
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

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

  const openCartButton =
    document.querySelector(
      '#open-cart'
    );

  if (openCartButton) {
    openCartButton.onclick =
      openCart;
  }

  const closeCartButton =
    document.querySelector(
      '#close-cart'
    );

  if (closeCartButton) {
    closeCartButton.onclick =
      closeCart;
  }

  const backdrop =
    document.querySelector(
      '#backdrop'
    );

  if (backdrop) {
    backdrop.onclick =
      closeCart;
  }
}

/* -------------------------------------------------------------------------- */
/* Product modal                                                              */
/* -------------------------------------------------------------------------- */

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

    ${
      item.description
        ? `
          <p>
            ${escapeHtml(
              item.description
            )}
          </p>
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
      options.meat =
        meat1;
    }

    if (meat2) {
      options.meat2 =
        meat2;
    }

    if (meat3) {
      options.meat3 =
        meat3;
    }

    if (meat2 || meat3) {
      options.meats = [
        meat1,
        meat2,
        meat3
      ].filter(Boolean);
    }

    if (sauce) {
      options.sauce =
        sauce;
    }

    if (drink) {
      options.drink =
        drink;
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

/* -------------------------------------------------------------------------- */
/* Product options                                                            */
/* -------------------------------------------------------------------------- */

function getOptionArray(
  options,
  keys,
  fallback
) {
  for (const key of keys) {
    if (
      Array.isArray(
        options?.[key]
      ) &&
      options[key].length
    ) {
      return options[key];
    }
  }

  return fallback;
}

function buildMeatField(item) {
  if (!item.meat) {
    return '';
  }

  const options =
    getOptionArray(
      item.options,
      [
        'meats',
        'meat',
        'viandes',
        'viande'
      ],
      MEATS
    );

  if (item.tripleMeat) {
    return `
      <label>
        VIANDE 1

        <select id="meat-1">
          ${optionsHtml(
            options
          )}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${optionsHtml(
            options
          )}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${optionsHtml(
            options
          )}
        </select>
      </label>
    `;
  }

  if (item.multipleMeat) {
    return `
      <label>
        VIANDE 1

        <select id="meat-1">
          ${optionsHtml(
            options
          )}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${optionsHtml(
            options
          )}
        </select>
      </label>
    `;
  }

  return `
    <label>
      VIANDE

      <select id="meat-1">
        ${optionsHtml(
          options
        )}
      </select>
    </label>
  `;
}

function buildSauceField(item) {
  if (!item.sauce) {
    return '';
  }

  const options =
    getOptionArray(
      item.options,
      [
        'sauces',
        'sauce'
      ],
      SAUCES
    );

  return `
    <label>
      SAUCE

      <select id="sauce">
        ${optionsHtml(
          options
        )}
      </select>
    </label>
  `;
}

function buildDrinkField(item) {
  if (!item.drink) {
    return '';
  }

  const options =
    getOptionArray(
      item.options,
      [
        'drinks',
        'drink',
        'boissons',
        'boisson'
      ],
      DRINKS
    );

  return `
    <label>
      BOISSON

      <select id="drink">
        ${optionsHtml(
          options
        )}
      </select>
    </label>
  `;
}

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

/* -------------------------------------------------------------------------- */
/* Cart                                                                       */
/* -------------------------------------------------------------------------- */

function openCart() {
  document
    .querySelector(
      '#drawer'
    )
    .classList.add(
      'open'
    );

  document
    .querySelector(
      '#backdrop'
    )
    .classList.remove(
      'hidden'
    );

  renderCart();
}

function closeCart() {
  document
    .querySelector(
      '#drawer'
    )
    .classList.remove(
      'open'
    );

  document
    .querySelector(
      '#backdrop'
    )
    .classList.add(
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
            getRestaurantDisplayName()
          )}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${cart
          .map(
            (
              item,
              index
            ) =>
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

        ${
          getRestaurantAddress()
            ? `
              <span>
                ${escapeHtml(
                  getRestaurantAddress()
                )}
              </span>
            `
            : ''
        }

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
            ? `Commande transmise directement à l’espace ${escapeHtml(
                getRestaurantDisplayName()
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

  const form =
    element.querySelector(
      '#order-form'
    );

  if (form) {
    form.onsubmit =
      async event => {
        event.preventDefault();

        const formData =
          Object.fromEntries(
            new FormData(
              event.currentTarget
            )
          );

        const order =
          createOrder(
            cart,
            formData
          );

        await submitOrder(
          order
        );
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Ticket                                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Order submission                                                           */
/* -------------------------------------------------------------------------- */

async function submitOrder(
  order
) {
  try {
    let saved;

    const tenantOrder = {
      ...order,

      restaurant_id:
        restaurant?.id ||
        null,

      restaurantId:
        restaurant?.id ||
        null
    };

    if (
      !tenantOrder.restaurant_id
    ) {
      throw new Error(
        'Restaurant FOODATOI introuvable pour cette commande.'
      );
    }

    if (remoteStore) {
      saved =
        await remoteStore.createOrder(
          tenantOrder
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
          tenantOrder
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
      '[FOODATOI] Erreur création commande:',
      error
    );

    alert(
      'Impossible d’envoyer la commande pour le moment.'
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Confirmation                                                               */
/* -------------------------------------------------------------------------- */

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
        <strong>
          ${escapeHtml(
            getRestaurantDisplayName()
          )}
        </strong>.

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

/* -------------------------------------------------------------------------- */
/* Application bootstrap                                                      */
/* -------------------------------------------------------------------------- */

async function bootstrap() {
  try {
    renderLoading();

    /**
     * 1. Résout /caz-food
     *    vers le restaurant Caz Food.
     */
    await resolveRestaurant();

    /**
     * 2. Charge uniquement les produits
     *    du restaurant résolu.
     */
    await loadMenu();

    /**
     * 3. Affiche la carte.
     */
    render();

  } catch (error) {
    renderError(
      error
    );
  }
}

bootstrap();
