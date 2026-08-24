import{a as e,i as t,n,t as r}from"./styles-CGUYwTdK.js";function i(e,t){return[...e,{...t,quantity:t.quantity??1}]}function a(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function o(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:a(e),createdAt:new Date().toISOString()}}var s=null,c=[],l=[],u=`Tous`,d=null,f=[`Kebab`,`Poulet`,`Steak`,`Merguez`],p=[`Algérienne`,`Biggy`,`Blanche`,`Barbecue`,`Curry`,`Ketchup`,`Mayonnaise`,`Samouraï`],m=[`Coca-Cola`,`Coca-Cola Zéro`,`Coca-Cola Cherry`,`Fanta Orange`,`Fanta Citron`,`Sprite`,`Oasis Tropical`,`Oasis Pomme Cassis`,`Ice Tea`,`Eau`],h=document.querySelector(`#root`),g=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,_=()=>l.reduce((e,t)=>e+Number(t.quantity??0),0);function v(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function y(){return s?.name||`FOODATOI`}function b(){return s?.phone||``}function x(){let e=s?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function S(){return s?.primary_color||`#111111`}async function C(){return s=await r(null),console.info(`[FOODATOI] Restaurant résolu:`,s),w(),d=t(null,s.id),s}function w(){s&&(document.documentElement.style.setProperty(`--restaurant-primary`,S()),document.title=`${y()} · FOODATOI`)}async function T(){throw Error(`Supabase n’est pas configuré.`)}function E(){return[`Tous`,...new Set(c.map(e=>e.category).filter(Boolean))]}function D(){h.innerHTML=`
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
  `}function O(e){console.error(`[FOODATOI] Erreur application:`,e),h.innerHTML=`
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
  `}function k(){let e=E(),t=y(),n=x(),r=b();h.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${s?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${v(s.logo_url)}"
                  alt="${v(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${v(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${v(t)}
            </strong>

            <span>
              ${v(s?.sector||`RESTAURANT`)}
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
            ${_()}
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
              ${v(t)}.
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
                ${v(t)}
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
                      ${v(n)}
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

        ${s?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${v(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${v(s.settings.delivery_redirect_url)}"
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

              ${c.length}

              ${c.length>1?`produits`:`produit`}

            </span>

          </div>

          ${e.length>1?`
                <nav
                  class="category-rail"
                  aria-label="Catégories"
                >

                  ${e.map(e=>`
                        <button
                          class="category ${e===u?`is-active`:``}"
                          data-category="${v(e)}"
                          type="button"
                        >
                          ${v(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          <div class="menu-grid">

            ${c.length?c.filter(e=>u===`Tous`||e.category===u).map(A).join(``):`
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
            ${v(t)}
          </strong>

          ${n?`
                <span>
                  ${v(n)}
                </span>
              `:``}

        </div>

        ${r?`
              <a
                href="tel:${v(r)}"
              >
                ${v(r)}
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
            ${v(t)}
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
  `,j(),B()}function A(e){return`
    <article class="menu-card">

      <div class="menu-card-top">

        <span class="menu-icon">
          ${v(e.emoji)}
        </span>

        <span class="category-tag">
          ${v(e.category)}
        </span>

      </div>

      <div class="menu-card-body">

        <h3>
          ${v(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${v(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${g(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${v(e.id)}"
          type="button"
          aria-label="Ajouter ${v(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function j(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{u=e.dataset.category,k()}}),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>M(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=R);let t=document.querySelector(`#close-cart`);t&&(t.onclick=z);let n=document.querySelector(`#backdrop`);n&&(n.onclick=z)}function M(e){let t=c.find(t=>t.id===e);if(!t)return;let n=P(t),r=F(t),a=I(t);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${v(t.emoji)}
    </div>

    <p class="eyebrow">
      ${v(t.category)}
    </p>

    <h2>
      ${v(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${v(t.description)}
          </p>
        `:``}

    <div class="form-grid">

      ${n}

      ${r}

      ${a}

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
      Ajouter · ${g(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,a=document.querySelector(`#meat-2`)?.value,o=document.querySelector(`#meat-3`)?.value,s=document.querySelector(`#sauce`)?.value,c=document.querySelector(`#drink`)?.value;r&&(n.meat=r),a&&(n.meat2=a),o&&(n.meat3=o),(a||o)&&(n.meats=[r,a,o].filter(Boolean)),s&&(n.sauce=s),c&&(n.drink=c),l=i(l,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),k(),R()}}function N(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function P(e){if(!e.meat)return``;let t=N(e.options,[`meats`,`meat`,`viandes`,`viande`],f);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${L(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${L(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${L(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${L(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${L(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${L(t)}
      </select>
    </label>
  `}function F(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${L(N(e.options,[`sauces`,`sauce`],p))}
      </select>
    </label>
  `:``}function I(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${L(N(e.options,[`drinks`,`drink`,`boissons`,`boisson`],m))}
      </select>
    </label>
  `:``}function L(e){return e.map(e=>`<option value="${v(e)}">${v(e)}</option>`).join(``)}function R(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),B()}function z(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function B(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!l.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=z;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${v(y())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${l.map((e,t)=>V(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${g(a(l))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${x()?`
              <span>
                ${v(x())}
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
        ${d?`Commande transmise directement à l’espace ${v(y())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{l.splice(Number(e.dataset.remove),1),B()}});let t=e.querySelector(`#order-form`);t&&(t.onsubmit=async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));await U(o(l,t))})}function V(e,t){let n=H(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${v(e.name)}
        </strong>

        ${n?`
              <span>
                ${v(n)}
              </span>
            `:``}

      </div>

      <b>
        ${g(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function H(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function U(t){try{let n,r={...t,restaurant_id:s?.id||null,restaurantId:s?.id||null};if(!r.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(d)n=await d.createOrder(r);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);n=e(t,r).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,n]))}l=[],W(n)}catch(e){console.error(`[FOODATOI] Erreur création commande:`,e),alert(`Impossible d’envoyer la commande pour le moment.`)}}function W(e){let t=n(e);z(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${v(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${v(y())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${v(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${v(e.name)}
                    </strong>

                    <span>
                      ${v(e.options||``)}
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
            ${v(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),k()}}async function G(){try{D(),await C(),await T(),k()}catch(e){O(e)}}G();