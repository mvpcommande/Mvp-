import{a as e,c as t,i as n,l as r,n as i,o as a,t as o}from"./styles-Bn_ONc4a.js";function s(e,t){return[...e,{...t,quantity:t.quantity??1}]}function c(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function l(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:c(e),createdAt:new Date().toISOString()}}var u=null,d=[],f=[],p=`Tous`,m=null,h=[`Kebab`,`Poulet`,`Steak`,`Merguez`],g=[`Algérienne`,`Biggy`,`Blanche`,`Barbecue`,`Curry`,`Ketchup`,`Mayonnaise`,`Samouraï`],_=[`Coca-Cola`,`Coca-Cola Zéro`,`Coca-Cola Cherry`,`Fanta Orange`,`Fanta Citron`,`Sprite`,`Oasis Tropical`,`Oasis Pomme Cassis`,`Ice Tea`,`Eau`],v=document.querySelector(`#root`),y=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,b=()=>f.reduce((e,t)=>e+Number(t.quantity??0),0);function x(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function S(){return u?.name||`FOODATOI`}function C(){return u?.phone||``}function w(){let e=u?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function T(){return u?.primary_color||`#111111`}async function E(){return u=await o(n),console.info(`[FOODATOI] Restaurant résolu:`,u),D(),m=e(n,u.id),u}function D(){u&&(document.documentElement.style.setProperty(`--restaurant-primary`,T()),document.title=`${S()} · FOODATOI`)}function O(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/Mvp-/${t.replace(/^\/+/,``)}`:null}function k(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:O(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function A(){if(!n)throw Error(`Supabase n’est pas configuré.`);if(!u?.id)throw Error(`Restaurant non résolu.`);let{data:e,error:t}=await n.from(`products`).select(`
      id,
      name,
      category,
      description,
      price_cents,
      options,
      is_active,
      sort_order,
      restaurant_id,
      created_at,
      product_images (
        public_url,
        is_primary,
        sort_order
      )
    `).eq(`restaurant_id`,u.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(t)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,t),t;return d=(e??[]).filter(e=>e.restaurant_id===u.id).map(k),p=`Tous`,console.info(`[FOODATOI] ${d.length} produit(s) chargé(s) pour ${S()}.`),d}function j(){return[`Tous`,...new Set(d.map(e=>e.category).filter(Boolean))]}function M(){v.innerHTML=`
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
  `}function N(e){console.error(`[FOODATOI] Erreur application:`,e),v.innerHTML=`
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
  `}function P(){let e=j(),t=S(),n=w(),r=C();v.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${u?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${x(u.logo_url)}"
                  alt="${x(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${x(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${x(t)}
            </strong>

            <span>
              ${x(u?.sector||`RESTAURANT`)}
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
            ${b()}
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
              ${x(t)}.
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
                ${x(t)}
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
                      ${x(n)}
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

        ${u?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${x(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${x(u.settings.delivery_redirect_url)}"
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

              ${d.length}

              ${d.length>1?`produits`:`produit`}

            </span>

          </div>

          ${e.length>1?`
                <nav
                  class="category-rail"
                  aria-label="Catégories"
                >

                  ${e.map(e=>`
                        <button
                          class="category ${e===p?`is-active`:``}"
                          data-category="${x(e)}"
                          type="button"
                        >
                          ${x(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          <div class="menu-grid">

            ${d.length?d.filter(e=>p===`Tous`||e.category===p).map(F).join(``):`
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
            ${x(t)}
          </strong>

          ${n?`
                <span>
                  ${x(n)}
                </span>
              `:``}

        </div>

        ${a(u?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${a(u?.settings?.opening_hours).map(e=>`
                      <span>
                        ${x(e.label)}
                        <b>
                          ${x(e.hours)}
                        </b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>

          ${r?`
                <a
                  href="tel:${x(r)}"
                >
                  ${x(r)}
                </a>
              `:``}

          ${u?.settings?.facebook_url?`
                <a
                  href="${x(u.settings.facebook_url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              `:``}

        </div>

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
            ${x(t)}
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
  `,I(),G()}function F(e){return`
    <article class="menu-card">

      <div class="menu-card-top">

        <span class="menu-icon">
          ${e.imageUrl?`
                <img
                  src="${x(e.imageUrl)}"
                  alt=""
                  loading="lazy"
                >
              `:x(e.emoji)}
        </span>

        <span class="category-tag">
          ${x(e.category)}
        </span>

      </div>

      <div class="menu-card-body">

        <h3>
          ${x(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${x(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${y(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${x(e.id)}"
          type="button"
          aria-label="Ajouter ${x(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function I(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{p=e.dataset.category,P()}}),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>L(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=U);let t=document.querySelector(`#close-cart`);t&&(t.onclick=W);let n=document.querySelector(`#backdrop`);n&&(n.onclick=W)}function L(e){let t=d.find(t=>t.id===e);if(!t)return;let n=z(t),r=B(t),i=V(t);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${x(t.emoji)}
    </div>

    <p class="eyebrow">
      ${x(t.category)}
    </p>

    <h2>
      ${x(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${x(t.description)}
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
      Ajouter · ${y(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,o=document.querySelector(`#sauce`)?.value,c=document.querySelector(`#drink`)?.value;r&&(n.meat=r),i&&(n.meat2=i),a&&(n.meat3=a),(i||a)&&(n.meats=[r,i,a].filter(Boolean)),o&&(n.sauce=o),c&&(n.drink=c),f=s(f,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),P(),U()}}function R(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function z(e){if(!e.meat)return``;let t=R(e.options,[`meats`,`meat`,`viandes`,`viande`],h);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${H(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${H(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${H(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${H(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${H(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${H(t)}
      </select>
    </label>
  `}function B(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${H(R(e.options,[`sauces`,`sauce`],g))}
      </select>
    </label>
  `:``}function V(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${H(R(e.options,[`drinks`,`drink`,`boissons`,`boisson`],_))}
      </select>
    </label>
  `:``}function H(e){return e.map(e=>`<option value="${x(e)}">${x(e)}</option>`).join(``)}function U(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),G()}function W(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function G(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!f.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=W;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${x(S())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${f.map((e,t)=>K(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${y(c(f))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${w()?`
              <span>
                ${x(w())}
              </span>
            `:``}

        <small>
          Paiement au restaurant
        </small>

      </div>

    </div>

    ${t(u?.settings?.opening_hours)?``:`
          <div class="closed-banner">
            <p class="eyebrow">
              FERMÉ ACTUELLEMENT
            </p>
            <p>
              ${x(S())}
              n'accepte pas de commande en dehors de ses horaires d'ouverture.
              Reviens plus tard pour commander.
            </p>
          </div>
        `}

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
        ${t(u?.settings?.opening_hours)?``:`disabled`}
      >
        Envoyer ma commande →
      </button>

      <small>
        ${m?`Commande transmise directement à l’espace ${x(S())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{f.splice(Number(e.dataset.remove),1),G()}});let n=e.querySelector(`#order-form`);n&&(n.onsubmit=async e=>{if(e.preventDefault(),!t(u?.settings?.opening_hours)){G();return}let n=Object.fromEntries(new FormData(e.currentTarget));await J(l(f,n))})}function K(e,t){let n=q(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${x(e.name)}
        </strong>

        ${n?`
              <span>
                ${x(n)}
              </span>
            `:``}

      </div>

      <b>
        ${y(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function q(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function J(e){try{let t,n={...e,restaurant_id:u?.id||null,restaurantId:u?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(m)t=await m.createOrder(n);else{let e=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);t=r(e,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...e,t]))}f=[],Y(t)}catch(e){console.error(`[FOODATOI] Erreur création commande:`,e),alert(String(e?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:`Impossible d’envoyer la commande pour le moment.`)}}function Y(e){let t=i(e);W(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${x(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${x(S())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${x(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${x(e.name)}
                    </strong>

                    <span>
                      ${x(e.options||``)}
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
            ${x(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),P()}}async function X(){try{M(),await E(),await A(),P()}catch(e){N(e)}}X();