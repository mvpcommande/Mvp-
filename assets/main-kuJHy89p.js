import{a as e,i as t,n,o as r,t as i}from"./styles-DdYE6VjH.js";function a(e,t){return[...e,{...t,quantity:t.quantity??1}]}function o(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function s(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:o(e),createdAt:new Date().toISOString()}}var c=null,l=[],u=[],d=`Tous`,f=null,p=[`Kebab`,`Poulet`,`Steak`,`Merguez`],m=[`Algérienne`,`Biggy`,`Blanche`,`Barbecue`,`Curry`,`Ketchup`,`Mayonnaise`,`Samouraï`],h=[`Coca-Cola`,`Coca-Cola Zéro`,`Coca-Cola Cherry`,`Fanta Orange`,`Fanta Citron`,`Sprite`,`Oasis Tropical`,`Oasis Pomme Cassis`,`Ice Tea`,`Eau`],g=document.querySelector(`#root`),_=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,v=()=>u.reduce((e,t)=>e+Number(t.quantity??0),0);function y(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function b(){return c?.name||`FOODATOI`}function x(){return c?.phone||``}function S(){let e=c?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function C(){return c?.primary_color||`#111111`}async function w(){return c=await i(t),console.info(`[FOODATOI] Restaurant résolu:`,c),T(),f=e(t,c.id),c}function T(){c&&(document.documentElement.style.setProperty(`--restaurant-primary`,C()),document.title=`${b()} · FOODATOI`)}function E(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function D(){if(!t)throw Error(`Supabase n’est pas configuré.`);if(!c?.id)throw Error(`Restaurant non résolu.`);let{data:e,error:n}=await t.from(`products`).select(`
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
    `).eq(`restaurant_id`,c.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return l=(e??[]).filter(e=>e.restaurant_id===c.id).map(E),d=`Tous`,console.info(`[FOODATOI] ${l.length} produit(s) chargé(s) pour ${b()}.`),l}function O(){return[`Tous`,...new Set(l.map(e=>e.category).filter(Boolean))]}function k(){g.innerHTML=`
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
  `}function A(e){console.error(`[FOODATOI] Erreur application:`,e),g.innerHTML=`
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
  `}function j(){let e=O(),t=b(),n=S(),r=x();g.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${c?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${y(c.logo_url)}"
                  alt="${y(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${y(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${y(t)}
            </strong>

            <span>
              ${y(c?.sector||`RESTAURANT`)}
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
            ${v()}
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
              ${y(t)}.
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
                ${y(t)}
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

              ${n?`
                    <span>
                      ${y(n)}
                    </span>
                  `:``}

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

        ${c?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${y(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${y(c.settings.delivery_redirect_url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Commander sur Uber Eats →
                </a>

              </section>
            `:``}

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

              ${l.length}

              ${l.length>1?`produits`:`produit`}

            </span>

          </div>

          ${e.length>1?`
                <nav
                  class="category-rail"
                  aria-label="Catégories"
                >

                  ${e.map(e=>`
                        <button
                          class="category ${e===d?`is-active`:``}"
                          data-category="${y(e)}"
                          type="button"
                        >
                          ${y(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          <div class="menu-grid">

            ${l.length?l.filter(e=>d===`Tous`||e.category===d).map(M).join(``):`
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
                `}

          </div>

        </section>

      </main>

      <footer class="site-footer">

        <div>

          <strong>
            ${y(t)}
          </strong>

          ${n?`
                <span>
                  ${y(n)}
                </span>
              `:``}

        </div>

        ${r?`
              <a
                href="tel:${y(r)}"
              >
                ${y(r)}
              </a>
            `:``}

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
            ${y(t)}
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
  `,N(),H()}function M(e){return`
    <article class="menu-card">

      <div class="menu-card-top">

        <span class="menu-icon">
          ${y(e.emoji)}
        </span>

        <span class="category-tag">
          ${y(e.category)}
        </span>

      </div>

      <div class="menu-card-body">

        <h3>
          ${y(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${y(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${_(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${y(e.id)}"
          type="button"
          aria-label="Ajouter ${y(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function N(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{d=e.dataset.category,j()}}),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>P(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=B);let t=document.querySelector(`#close-cart`);t&&(t.onclick=V);let n=document.querySelector(`#backdrop`);n&&(n.onclick=V)}function P(e){let t=l.find(t=>t.id===e);if(!t)return;let n=I(t),r=L(t),i=R(t);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${y(t.emoji)}
    </div>

    <p class="eyebrow">
      ${y(t.category)}
    </p>

    <h2>
      ${y(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${y(t.description)}
          </p>
        `:``}

    <div class="form-grid">

      ${n}

      ${r}

      ${i}

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
      Ajouter · ${_(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,o=document.querySelector(`#meat-3`)?.value,s=document.querySelector(`#sauce`)?.value,c=document.querySelector(`#drink`)?.value;r&&(n.meat=r),i&&(n.meat2=i),o&&(n.meat3=o),(i||o)&&(n.meats=[r,i,o].filter(Boolean)),s&&(n.sauce=s),c&&(n.drink=c),u=a(u,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),j(),B()}}function F(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function I(e){if(!e.meat)return``;let t=F(e.options,[`meats`,`meat`,`viandes`,`viande`],p);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${z(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${z(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${z(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${z(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${z(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${z(t)}
      </select>
    </label>
  `}function L(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${z(F(e.options,[`sauces`,`sauce`],m))}
      </select>
    </label>
  `:``}function R(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${z(F(e.options,[`drinks`,`drink`,`boissons`,`boisson`],h))}
      </select>
    </label>
  `:``}function z(e){return e.map(e=>`<option value="${y(e)}">${y(e)}</option>`).join(``)}function B(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),H()}function V(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function H(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!u.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=V;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${y(b())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${u.map((e,t)=>U(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${_(o(u))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${S()?`
              <span>
                ${y(S())}
              </span>
            `:``}

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
        ${f?`Commande transmise directement à l’espace ${y(b())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{u.splice(Number(e.dataset.remove),1),H()}});let t=e.querySelector(`#order-form`);t&&(t.onsubmit=async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));await G(s(u,t))})}function U(e,t){let n=W(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${y(e.name)}
        </strong>

        ${n?`
              <span>
                ${y(n)}
              </span>
            `:``}

      </div>

      <b>
        ${_(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function W(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function G(e){try{let t,n={...e,restaurant_id:c?.id||null,restaurantId:c?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(f)t=await f.createOrder(n);else{let e=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);t=r(e,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...e,t]))}u=[],K(t)}catch(e){console.error(`[FOODATOI] Erreur création commande:`,e),alert(`Impossible d’envoyer la commande pour le moment.`)}}function K(e){let t=n(e);V(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${y(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${y(b())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${y(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${y(e.name)}
                    </strong>

                    <span>
                      ${y(e.options||``)}
                    </span>

                  </div>

                </div>
              `).join(``)}

        </div>

        <div class="ticket-total">

          <span>
            TOTAL
          </span>

          <strong>
            ${y(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),j()}}async function q(){try{k(),await w(),await D(),j()}catch(e){A(e)}}q();