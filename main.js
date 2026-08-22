import { addItem, calculateTotal, createOrder } from './orderLogic.mjs';
import { appendOrder } from './orderStore.mjs';
import { createSupabaseOrderStore } from './supabaseStore.mjs';
import { supabase } from './supabaseClient.js';
import { buildTicketModel } from './uiModel.mjs';
import './styles.css';
/*
 * ============================================================
 * FOODATOI — FRONTEND MULTI-TENANT
 * ============================================================
 *
 * Le menu n'est plus stocké dans le code.
 *
 * Flux :
 *
 *   hostname
 *       ↓
 *   resolve_restaurant()
 *       ↓
 *   restaurant_id
 *       ↓
 *   configuration tenant
 *       ↓
 *   catalogue Supabase
 *       ↓
 *   interface
 *
 * Exemple :
 *
 *   caz-food.foodatoi.fr
 *   restaurant-x.foodatoi.fr
 *   www.restaurant-x.fr
 *
 * Chaque établissement possède ses propres données.
 */
/* ============================================================
 * ÉTAT APPLICATION
 * ========================================================== */
let restaurantContext = null;
let menu = [];
let cart = [];
let activeCategory = 'Tous';
let MEATS = [];
let SAUCES = [];
let DRINKS = [];
const app = document.querySelector('#root');
const remoteStore = supabase
  ? createSupabaseOrderStore(supabase)
  : null;
/* ============================================================
 * UTILITAIRES
 * ========================================================== */
const euro = value =>
  `${Number(value || 0).toFixed(2).replace('.', ',')} €`;
const itemCount = () =>
  cart.reduce(
    (sum, item) => sum + item.quantity,
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
function getRestaurantName() {
  return (
    restaurantContext?.name ||
    restaurantContext?.restaurant_name ||
    'FOODATOI'
  );
}
function getRestaurantAddress() {
  return (
    restaurantContext?.address ||
    restaurantContext?.settings?.address ||
    ''
  );
}
function getRestaurantPhone() {
  return (
    restaurantContext?.phone ||
    restaurantContext?.settings?.phone ||
    ''
  );
}
function getRestaurantSettings() {
  return (
    restaurantContext?.settings &&
    typeof restaurantContext.settings === 'object'
      ? restaurantContext.settings
      : {}
  );
}
/* ============================================================
 * RÉSOLUTION DU TENANT
 * ========================================================== */
async function loadRestaurant() {
  if (!supabase) {
    throw new Error(
      'Supabase n’est pas configuré.'
    );
  }
  const hostname =
    window.location.hostname
      .toLowerCase()
      .trim();
  console.info(
    '[FOODATOI] Résolution du domaine:',
    hostname
  );
  const { data, error } =
    await supabase.rpc(
      'resolve_restaurant',
      {
        p_hostname: hostname
      }
    );
  if (error) {
    console.error(
      '[FOODATOI] Erreur resolve_restaurant:',
      error
    );
    throw error;
  }
  /*
   * PostgreSQL peut retourner :
   *
   *   un objet
   *
   * ou :
   *
   *   [{ ... }]
   *
   * On supporte les deux.
   */
  const restaurant =
    Array.isArray(data)
      ? data[0]
      : data;
  if (!restaurant) {
    throw new Error(
      `Aucun établissement FOODATOI trouvé pour ${hostname}.`
    );
  }
  if (!restaurant.restaurant_id) {
    throw new Error(
      'Le tenant retourné par Supabase ne possède pas de restaurant_id.'
    );
  }
  /*
   * Protection supplémentaire :
   * le frontend travaille uniquement avec le restaurant
   * retourné par le resolver.
   */
  restaurantContext = restaurant;
  console.info(
    '[FOODATOI] Restaurant:',
    getRestaurantName()
  );
  console.info(
    '[FOODATOI] Restaurant ID:',
    restaurantContext.restaurant_id
  );
  console.info(
    '[FOODATOI] Secteur:',
    restaurantContext.sector || 'non défini'
  );
}
/* ============================================================
 * CONFIGURATION TENANT
 * ========================================================== */
function loadTenantConfiguration() {
  const settings =
    getRestaurantSettings();
  /*
   * Ces valeurs peuvent être alimentées par le template
   * sectoriel ou personnalisées par l'entreprise.
   */
  MEATS =
    settings.meats ||
    settings.options?.meats ||
    [];
  SAUCES =
    settings.sauces ||
    settings.sauces_list ||
    settings.options?.sauces ||
    [];
  DRINKS =
    settings.drinks ||
    settings.drinks_list ||
    settings.options?.drinks ||
    [];
}
/* ============================================================
 * CATALOGUE SUPABASE
 * ========================================================== */
async function loadMenu() {
  if (!restaurantContext?.restaurant_id) {
    throw new Error(
      'Impossible de charger le menu : restaurant_id absent.'
    );
  }
  /*
   * IMPORTANT :
   *
   * On filtre systématiquement par restaurant_id.
   *
   * Même si les politiques RLS constituent la protection
   * principale, ce filtre rend également le comportement
   * du frontend explicite.
   */
  const { data, error } =
    await supabase
      .from('products')
      .select('*')
      .eq(
        'restaurant_id',
        restaurantContext.restaurant_id
      )
      .eq('active', true)
      .order(
        'sort_order',
        {
          ascending: true,
          nullsFirst: false
        }
      );
  if (error) {
    console.error(
      '[FOODATOI] Erreur chargement catalogue:',
      error
    );
    throw error;
  }
  menu = (data || []).map(
    normalizeProduct
  );
  console.info(
    `[FOODATOI] ${menu.length} produit(s) chargé(s).`
  );
}
/* ============================================================
 * NORMALISATION PRODUIT
 * ========================================================== */
function normalizeProduct(product) {
  const options =
    product.options &&
    typeof product.options === 'object'
      ? product.options
      : {};
  /*
   * On accepte plusieurs noms afin de rester compatible
   * avec l'évolution du schéma.
   */
  return {
    ...product,
    category:
      product.category ||
      product.category_name ||
      options.category ||
      'Notre carte',
    name:
      product.name ||
      'Produit',
    description:
      product.description ||
      '',
    price:
      Number(product.price || 0),
    emoji:
      product.emoji ||
      options.emoji ||
      '🍽️',
    image_url:
      product.image_url ||
      options.image_url ||
      null,
    meat:
      Boolean(
        product.meat ??
        options.meat
      ),
    sauce:
      Boolean(
        product.sauce ??
        options.sauce
      ),
    drink:
      Boolean(
        product.drink ??
        options.drink
      ),
    multipleMeat:
      Boolean(
        product.multiple_meat ??
        options.multipleMeat
      ),
    tripleMeat:
      Boolean(
        product.triple_meat ??
        options.tripleMeat
      )
  };
}
/* ============================================================
 * BRANDING
 * ========================================================== */
function applyRestaurantBranding() {
  const settings =
    getRestaurantSettings();
  const name =
    getRestaurantName();
  const primaryColor =
    settings.primary_color ||
    settings.primaryColor ||
    '#111111';
  document.title =
    `${name} — FOODATOI`;
  document.documentElement.style.setProperty(
    '--restaurant-primary',
    primaryColor
  );
  /*
   * Favicon/logo si configuré.
   */
  if (
    settings.logo_url ||
    settings.logoUrl
  ) {
    const logo =
      settings.logo_url ||
      settings.logoUrl;
    let favicon =
      document.querySelector(
        'link[rel="icon"]'
      );
    if (!favicon) {
      favicon =
        document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(
        favicon
      );
    }
    favicon.href = logo;
  }
}
/* ============================================================
 * CATÉGORIES
 * ========================================================== */
function getCategories() {
  return [
    'Tous',
    ...new Set(
      menu
        .map(item =>
          item.category
        )
        .filter(Boolean)
    )
  ];
}
/* ============================================================
 * RENDER PRINCIPAL
 * ========================================================== */
function render() {
  const categories =
    getCategories();
  /*
   * Si la catégorie active n'existe plus après un changement
   * de menu, on revient à Tous.
   */
  if (
    activeCategory !== 'Tous' &&
    !categories.includes(activeCategory)
  ) {
    activeCategory = 'Tous';
  }
  const name =
    getRestaurantName();
  const address =
    getRestaurantAddress();
  const phone =
    getRestaurantPhone();
  const settings =
    getRestaurantSettings();
  const introText =
    settings.intro_text ||
    settings.introText ||
    `Ton repas, directement chez ${name}.`;
  const pickupLabel =
    settings.pickup_label ||
    settings.pickupLabel ||
    'Retrait sur place';
  const paymentLabel =
    settings.payment_label ||
    settings.paymentLabel ||
    'Paiement au restaurant';
  const filteredMenu =
    menu.filter(
      item =>
        activeCategory === 'Tous' ||
        item.category === activeCategory
    );
  app.innerHTML = `
    <div class="app-frame">
      <header class="masthead">
        <div class="brand-lockup">
          <span class="brand-mark">
            ${escapeHtml(
              name
                .slice(0, 2)
                .toUpperCase()
            )}
          </span>
          <div>
            <strong>
              ${escapeHtml(name)}
            </strong>
            <span>
              ${escapeHtml(address)}
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
              ${escapeHtml(introText)}
            </p>
            <div class="pickup-line">
              <span class="live-dot"></span>
              <span>
                ${escapeHtml(pickupLabel)}
              </span>
              <span class="slash">
                /
              </span>
              <span>
                ${escapeHtml(paymentLabel)}
              </span>
            </div>
          </div>
          <div
            class="receipt-hero"
            aria-label="${escapeHtml(
              pickupLabel
            )}"
          >
            <div class="receipt-top">
              <span>
                ${escapeHtml(name)}
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
                ${escapeHtml(address)}
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
              FOODATOI · ${escapeHtml(
                name.slice(0, 12)
              )}
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
              ${menu.length > 1
                ? 'produits'
                : 'produit'}
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
                  data-category="${escapeHtml(
                    category
                  )}"
                  type="button"
                >
                  ${escapeHtml(category)}
                </button>
              `)
              .join('')}
          </nav>
          <div class="menu-grid">
            ${
              filteredMenu.length
                ? filteredMenu
                    .map(card)
                    .join('')
                : `
                  <div class="empty-ticket">
                    <h3>
                      Menu en préparation
                    </h3>
                    <p>
                      Cet établissement n'a pas encore
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
            ${escapeHtml(name)}
          </strong>
          <span>
            ${escapeHtml(address)}
          </span>
        </div>
        ${
          phone
            ? `
              <a
                href="tel:${escapeHtml(phone)}"
              >
                ${escapeHtml(phone)}
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
            ${escapeHtml(name)}
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
/* ============================================================
 * CARTE PRODUIT
 * ========================================================== */
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
        item.image_url
          ? `
            <div class="menu-card-image">
              <img
                src="${escapeHtml(
                  item.image_url
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
          <span>
            +
          </span>
          Ajouter
        </button>
      </div>
    </article>
  `;
}
/* ============================================================
 * EVENTS
 * ========================================================== */
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
/* ============================================================
 * PRODUIT / OPTIONS
 * ========================================================== */
function openProduct(id) {
  const item =
    menu.find(
      product =>
        String(product.id) ===
        String(id)
    );
  if (!item) return;
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
    ${
      item.image_url
        ? `
          <div class="product-image">
            <img
              src="${escapeHtml(
                item.image_url
              )}"
              alt="${escapeHtml(
                item.name
              )}"
            >
          </div>
        `
        : `
          <div class="product-mark">
            ${escapeHtml(
              item.emoji
            )}
          </div>
        `
    }
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
    const quantity = Math.max(
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
/* ============================================================
 * OPTIONS VIANDE
 * ========================================================== */
function buildMeatField(item) {
  if (!item.meat) {
    return '';
  }
  if (item.tripleMeat) {
    return `
      <label>
        VIANDE 1
        <select id="meat-1">
          ${optionsHtml(
            MEATS
          )}
        </select>
      </label>
      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(
            MEATS
          )}
        </select>
      </label>
      <label>
        VIANDE 3
        <select id="meat-3">
          ${optionsHtml(
            MEATS
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
            MEATS
          )}
        </select>
      </label>
      <label>
        VIANDE 2
        <select id="meat-2">
          ${optionsHtml(
            MEATS
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
          MEATS
        )}
      </select>
    </label>
  `;
}
/* ============================================================
 * OPTIONS SAUCE
 * ========================================================== */
function buildSauceField(item) {
  if (!item.sauce) {
    return '';
  }
  return `
    <label>
      SAUCE
      <select id="sauce">
        ${optionsHtml(
          SAUCES
        )}
      </select>
    </label>
  `;
}
/* ============================================================
 * OPTIONS BOISSON
 * ========================================================== */
function buildDrinkField(item) {
  if (!item.drink) {
    return '';
  }
  return `
    <label>
      BOISSON
      <select id="drink">
        ${optionsHtml(
          DRINKS
        )}
      </select>
    </label>
  `;
}
function optionsHtml(options) {
  return (options || [])
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
/* ============================================================
 * PANIER
 * ========================================================== */
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
  const name =
    getRestaurantName();
  const address =
    getRestaurantAddress();
  const settings =
    getRestaurantSettings();
  const paymentLabel =
    settings.payment_label ||
    settings.paymentLabel ||
    'Paiement au restaurant';
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
          ${escapeHtml(name)}
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
            address
          )}
        </span>
        <small>
          ${escapeHtml(
            paymentLabel
          )}
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
                name
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
       * On ajoute explicitement le contexte tenant
       * à la commande.
       *
       * Le store Supabase devra également utiliser
       * restaurant_id côté serveur/RLS.
       */
      const order =
        createOrder(
          cart,
          {
            ...formData,
            restaurant_id:
              restaurantContext
                ?.restaurant_id,
            restaurantId:
              restaurantContext
                ?.restaurant_id
          }
        );
      await submitOrder(
        order
      );
    };
}
/* ============================================================
 * TICKET ITEM
 * ========================================================== */
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
/* ============================================================
 * FORMAT OPTIONS
 * ========================================================== */
function formatOptions(
  options = {}
) {
  if (
    !options ||
    typeof options !== 'object'
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
  if (
    options.sauce
  ) {
    parts.push(
      `Sauce : ${options.sauce}`
    );
  }
  if (
    options.drink
  ) {
    parts.push(
      `Boisson : ${options.drink}`
    );
  }
  return parts.join(
    ' · '
  );
}
/* ============================================================
 * ENVOI COMMANDE
 * ========================================================== */
async function submitOrder(
  order
) {
  try {
    let saved;
    if (remoteStore) {
      /*
       * Le store actuel reste utilisé.
       *
       * Il faudra ensuite le verrouiller côté Supabase
       * pour que restaurant_id soit imposé par le backend.
       */
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
      '[FOODATOI] Erreur création commande:',
      error
    );
    alert(
      'Impossible d’envoyer la commande pour le moment.'
    );
  }
}
/* ============================================================
 * CONFIRMATION
 * ========================================================== */
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
            getRestaurantName()
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
/* ============================================================
 * BOOTSTRAP
 * ========================================================== */
async function bootstrap() {
  try {
    /*
     * 1. Trouver le tenant.
     */
    await loadRestaurant();
    /*
     * 2. Charger sa configuration.
     */
    loadTenantConfiguration();
    /*
     * 3. Charger uniquement son catalogue.
     */
    await loadMenu();
    /*
     * 4. Appliquer son identité.
     */
    applyRestaurantBranding();
    /*
     * 5. Afficher l'application.
     */
    render();
  } catch (error) {
    console.error(
      '[FOODATOI] Bootstrap failed:',
      error
    );
    renderTenantError(
      error
    );
  }
}
/* ============================================================
 * ERREUR TENANT
 * ========================================================== */
function renderTenantError(
  error
) {
  const message =
    error?.message ||
    'Cet établissement n’est pas disponible.';
  app.innerHTML = `
    <div class="app-frame">
      <main class="tenant-error">
        <p class="eyebrow">
          FOODATOI
        </p>
        <h1>
          Établissement indisponible
        </h1>
        <p>
          ${escapeHtml(
            message
          )}
        </p>
      </main>
    </div>
  `;
}
/* ============================================================
 * DÉMARRAGE
 * ========================================================== */
document.addEventListener(
  'DOMContentLoaded',
  bootstrap
);
