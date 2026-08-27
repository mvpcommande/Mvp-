import{a as e,l as t,n,o as r,r as i,s as a,t as o,u as s}from"./styles-TqDs7rv2.js";function c(e,t){return[...e,{...t,quantity:t.quantity??1}]}function l(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function u(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:l(e),createdAt:new Date().toISOString()}}var d=null,f=[],p=[],m=null,h=null,g=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],_=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],v=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],y=document.querySelector(`#root`),b=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,x=()=>p.reduce((e,t)=>e+Number(t.quantity??0),0);function S(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function C(){return d?.name||`FOODATOI`}function w(){return d?.phone||``}function T(){let e=d?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function E(){return d?.primary_color||`#111111`}async function D(){return d=await n(e),console.info(`[FOODATOI] Restaurant résolu:`,d),O(),h=r(e,d.id),d}function O(){d&&(document.documentElement.style.setProperty(`--restaurant-primary`,E()),document.title=`${C()} · FOODATOI`)}function k(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function A(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:k(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function j(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!d?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,d.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return f=(t??[]).filter(e=>e.restaurant_id===d.id).map(A),console.info(`[FOODATOI] ${f.length} produit(s) chargé(s) pour ${C()}.`),f}function M(){return[`Tous`,...new Set(f.map(e=>e.category).filter(Boolean))]}function N(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function P(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:N(e),items:n.get(e)}))}function F(){y.innerHTML=`
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
  `}function I(t){console.error(`[FOODATOI] Erreur application:`,t),o(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),y.innerHTML=`
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
  `}function L(){let e=M(),t=C(),n=T(),r=w();y.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${d?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${S(d.logo_url)}"
                  alt="${S(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${S(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${S(t)}
            </strong>

            <span>
              ${S(d?.sector||`RESTAURANT`)}
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
            ${x()}
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
              ${S(t)}.
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
                ${S(t)}
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
                      ${S(n)}
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

        ${d?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${S(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${S(d.settings.delivery_redirect_url)}"
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

              ${f.length}

              ${f.length>1?`produits`:`produit`}

            </span>

          </div>

          ${e.length>1?`
                <nav
                  class="category-rail"
                  aria-label="Catégories"
                >

                  ${e.map(e=>`
                        <button
                          class="category"
                          data-category="${S(e)}"
                          data-target="${e===`Tous`?`top`:S(N(e))}"
                          type="button"
                        >
                          ${S(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          ${f.length?P(f).map(e=>`
                      <section
                        class="menu-category-section"
                        id="menu-cat-${e.slug}"
                      >

                        <h2 class="menu-category-heading">
                          ${S(e.category)}
                        </h2>

                        <div class="menu-grid">
                          ${e.items.map(R).join(``)}
                        </div>

                      </section>
                    `).join(``):`
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

        </section>

      </main>

      <footer class="site-footer">

        <div>

          <strong>
            ${S(t)}
          </strong>

          ${n?`
                <span>
                  ${S(n)}
                </span>
              `:``}

        </div>

        ${a(d?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${a(d?.settings?.opening_hours).map(e=>`
                      <span>
                        ${S(e.label)}
                        <b>
                          ${S(e.hours)}
                        </b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>

          ${r?`
                <a
                  href="tel:${S(r)}"
                >
                  ${S(r)}
                </a>
              `:``}

          ${d?.settings?.facebook_url?`
                <a
                  href="${S(d.settings.facebook_url)}"
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
            ${S(t)}
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
  `,B(),Y()}function R(e){return`
    <article class="menu-card">

      <div class="menu-card-media">
        ${e.imageUrl?`
              <img
                src="${S(e.imageUrl)}"
                alt=""
                loading="lazy"
              >
            `:`
              <span class="menu-card-media-fallback">
                ${S(e.emoji)}
              </span>
            `}
      </div>

      <div class="menu-card-body">

        <p class="eyebrow">
          ${S(e.category)}
        </p>

        <h3>
          ${S(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${S(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${b(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${S(e.id)}"
          type="button"
          aria-label="Ajouter ${S(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function z(){m&&m.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;m=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{e.classList.toggle(`is-active`,e.dataset.target===t)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>m.observe(e))}function B(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),z(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>V(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=q);let t=document.querySelector(`#close-cart`);t&&(t.onclick=J);let n=document.querySelector(`#backdrop`);n&&(n.onclick=J)}function V(e){let t=f.find(t=>t.id===e);if(!t)return;let n=U(t),r=W(t),i=G(t);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    ${t.imageUrl?`
          <img
            class="product-photo"
            src="${S(t.imageUrl)}"
            alt=""
          >
        `:`
          <div class="product-mark">
            ${S(t.emoji)}
          </div>
        `}

    <p class="eyebrow">
      ${S(t.category)}
    </p>

    <h2>
      ${S(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${S(t.description)}
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
      Ajouter · ${b(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,o=document.querySelector(`#sauce`)?.value,s=document.querySelector(`#drink`)?.value;r&&(n.meat=r),i&&(n.meat2=i),a&&(n.meat3=a),(i||a)&&(n.meats=[r,i,a].filter(Boolean)),o&&(n.sauce=o),s&&(n.drink=s),p=c(p,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),L(),q()}}function H(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function U(e){if(!e.meat)return``;let t=H(e.options,[`meats`,`meat`,`viandes`,`viande`],g);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${K(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${K(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${K(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${K(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${K(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${K(t)}
      </select>
    </label>
  `}function W(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${K(H(e.options,[`sauces`,`sauce`],_))}
      </select>
    </label>
  `:``}function G(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${K(H(e.options,[`drinks`,`drink`,`boissons`,`boisson`],v))}
      </select>
    </label>
  `:``}function K(e){return e.map(e=>`<option value="${S(e)}">${S(e)}</option>`).join(``)}function q(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),Y()}function J(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function Y(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!p.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=J;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${S(C())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${p.map((e,t)=>X(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${b(l(p))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${T()?`
              <span>
                ${S(T())}
              </span>
            `:``}

        <small>
          Paiement au restaurant
        </small>

      </div>

    </div>

    ${t(d?.settings?.opening_hours)?``:`
          <div class="closed-banner">
            <p class="eyebrow">
              FERMÉ ACTUELLEMENT
            </p>
            <p>
              ${S(C())}
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
        ${t(d?.settings?.opening_hours)?``:`disabled`}
      >
        Envoyer ma commande →
      </button>

      <small>
        ${h?`Commande transmise directement à l’espace ${S(C())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{p.splice(Number(e.dataset.remove),1),Y()}});let n=e.querySelector(`#order-form`);n&&(n.onsubmit=async e=>{if(e.preventDefault(),!t(d?.settings?.opening_hours)){Y();return}let n=Object.fromEntries(new FormData(e.currentTarget));await Q(u(p,n))})}function X(e,t){let n=Z(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${S(e.name)}
        </strong>

        ${n?`
              <span>
                ${S(n)}
              </span>
            `:``}

      </div>

      <b>
        ${b(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function Z(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function Q(t){try{let e,n={...t,restaurant_id:d?.id||null,restaurantId:d?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(h)e=await h.createOrder(n);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=s(t,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}p=[],$(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),o(e,{restaurantId:d?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:`Impossible d’envoyer la commande pour le moment.`)}}function $(e){let t=i(e);J(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${S(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${S(C())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${S(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${S(e.name)}
                    </strong>

                    <span>
                      ${S(e.options||``)}
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
            ${S(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),L()}}async function ee(){try{F(),await D(),await j(),L()}catch(e){I(e)}}ee();