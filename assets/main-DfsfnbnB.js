import{a as e,c as t,i as n,n as r,s as i,t as a}from"./styles-DagaTrij.js";function o(e,t){return[...e,{...t,quantity:t.quantity??1}]}function s(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function c(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:s(e),createdAt:new Date().toISOString()}}var l=null,u=[],d=[],f=`Tous`,p=null,m=[`Kebab`,`Poulet`,`Steak`,`Merguez`],h=[`Algérienne`,`Biggy`,`Blanche`,`Barbecue`,`Curry`,`Ketchup`,`Mayonnaise`,`Samouraï`],g=[`Coca-Cola`,`Coca-Cola Zéro`,`Coca-Cola Cherry`,`Fanta Orange`,`Fanta Citron`,`Sprite`,`Oasis Tropical`,`Oasis Pomme Cassis`,`Ice Tea`,`Eau`],_=document.querySelector(`#root`),v=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,y=()=>d.reduce((e,t)=>e+Number(t.quantity??0),0);function b(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function x(){return l?.name||`FOODATOI`}function S(){return l?.phone||``}function C(){let e=l?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function w(){return l?.primary_color||`#111111`}async function T(){return l=await a(n),console.info(`[FOODATOI] Restaurant résolu:`,l),E(),p=e(n,l.id),l}function E(){l&&(document.documentElement.style.setProperty(`--restaurant-primary`,w()),document.title=`${x()} · FOODATOI`)}function D(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function O(){if(!n)throw Error(`Supabase n’est pas configuré.`);if(!l?.id)throw Error(`Restaurant non résolu.`);let{data:e,error:t}=await n.from(`products`).select(`
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
    `).eq(`restaurant_id`,l.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(t)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,t),t;return u=(e??[]).filter(e=>e.restaurant_id===l.id).map(D),f=`Tous`,console.info(`[FOODATOI] ${u.length} produit(s) chargé(s) pour ${x()}.`),u}function k(){return[`Tous`,...new Set(u.map(e=>e.category).filter(Boolean))]}function A(){_.innerHTML=`
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
  `}function j(e){console.error(`[FOODATOI] Erreur application:`,e),_.innerHTML=`
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
  `}function M(){let e=k(),t=x(),n=C(),r=S();_.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${l?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${b(l.logo_url)}"
                  alt="${b(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${b(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${b(t)}
            </strong>

            <span>
              ${b(l?.sector||`RESTAURANT`)}
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
            ${y()}
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
              ${b(t)}.
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
                ${b(t)}
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
                      ${b(n)}
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

        ${l?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${b(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${b(l.settings.delivery_redirect_url)}"
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

              ${u.length}

              ${u.length>1?`produits`:`produit`}

            </span>

          </div>

          ${e.length>1?`
                <nav
                  class="category-rail"
                  aria-label="Catégories"
                >

                  ${e.map(e=>`
                        <button
                          class="category ${e===f?`is-active`:``}"
                          data-category="${b(e)}"
                          type="button"
                        >
                          ${b(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          <div class="menu-grid">

            ${u.length?u.filter(e=>f===`Tous`||e.category===f).map(N).join(``):`
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
            ${b(t)}
          </strong>

          ${n?`
                <span>
                  ${b(n)}
                </span>
              `:``}

        </div>

        ${r?`
              <a
                href="tel:${b(r)}"
              >
                ${b(r)}
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
            ${b(t)}
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
  `,P(),U()}function N(e){return`
    <article class="menu-card">

      <div class="menu-card-top">

        <span class="menu-icon">
          ${b(e.emoji)}
        </span>

        <span class="category-tag">
          ${b(e.category)}
        </span>

      </div>

      <div class="menu-card-body">

        <h3>
          ${b(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${b(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${v(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${b(e.id)}"
          type="button"
          aria-label="Ajouter ${b(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function P(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{f=e.dataset.category,M()}}),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>F(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=V);let t=document.querySelector(`#close-cart`);t&&(t.onclick=H);let n=document.querySelector(`#backdrop`);n&&(n.onclick=H)}function F(e){let t=u.find(t=>t.id===e);if(!t)return;let n=L(t),r=R(t),i=z(t);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    <div class="product-mark">
      ${b(t.emoji)}
    </div>

    <p class="eyebrow">
      ${b(t.category)}
    </p>

    <h2>
      ${b(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${b(t.description)}
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
      Ajouter · ${v(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,s=document.querySelector(`#sauce`)?.value,c=document.querySelector(`#drink`)?.value;r&&(n.meat=r),i&&(n.meat2=i),a&&(n.meat3=a),(i||a)&&(n.meats=[r,i,a].filter(Boolean)),s&&(n.sauce=s),c&&(n.drink=c),d=o(d,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),M(),V()}}function I(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function L(e){if(!e.meat)return``;let t=I(e.options,[`meats`,`meat`,`viandes`,`viande`],m);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${B(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${B(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${B(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${B(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${B(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${B(t)}
      </select>
    </label>
  `}function R(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${B(I(e.options,[`sauces`,`sauce`],h))}
      </select>
    </label>
  `:``}function z(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${B(I(e.options,[`drinks`,`drink`,`boissons`,`boisson`],g))}
      </select>
    </label>
  `:``}function B(e){return e.map(e=>`<option value="${b(e)}">${b(e)}</option>`).join(``)}function V(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),U()}function H(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function U(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!d.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=H;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${b(x())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${d.map((e,t)=>W(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${v(s(d))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${C()?`
              <span>
                ${b(C())}
              </span>
            `:``}

        <small>
          Paiement au restaurant
        </small>

      </div>

    </div>

    ${i(l?.settings?.opening_hours)?``:`
          <div class="closed-banner">
            <p class="eyebrow">
              FERMÉ ACTUELLEMENT
            </p>
            <p>
              ${b(x())}
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
        ${i(l?.settings?.opening_hours)?``:`disabled`}
      >
        Envoyer ma commande →
      </button>

      <small>
        ${p?`Commande transmise directement à l’espace ${b(x())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{d.splice(Number(e.dataset.remove),1),U()}});let t=e.querySelector(`#order-form`);t&&(t.onsubmit=async e=>{if(e.preventDefault(),!i(l?.settings?.opening_hours)){U();return}let t=Object.fromEntries(new FormData(e.currentTarget));await K(c(d,t))})}function W(e,t){let n=G(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${b(e.name)}
        </strong>

        ${n?`
              <span>
                ${b(n)}
              </span>
            `:``}

      </div>

      <b>
        ${v(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function G(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function K(e){try{let n,r={...e,restaurant_id:l?.id||null,restaurantId:l?.id||null};if(!r.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(p)n=await p.createOrder(r);else{let e=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);n=t(e,r).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...e,n]))}d=[],q(n)}catch(e){console.error(`[FOODATOI] Erreur création commande:`,e),alert(String(e?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:`Impossible d’envoyer la commande pour le moment.`)}}function q(e){let t=r(e);H(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${b(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${b(x())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${b(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${b(e.name)}
                    </strong>

                    <span>
                      ${b(e.options||``)}
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
            ${b(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),M()}}async function J(){try{A(),await T(),await O(),M()}catch(e){j(e)}}J();