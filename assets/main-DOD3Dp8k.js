import{n as e,t}from"./styles-BGoon_IL.js";import{a as n,c as r,d as i,i as a,n as o,r as s,s as c,t as l,u}from"./errorLog-BHuWwCYs.js";function d(e,t){return[...e,{...t,quantity:t.quantity??1}]}function f(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function p(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:f(e),createdAt:new Date().toISOString()}}function m(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}async function ee(e,t,{email:n,password:r,name:i,phone:a,marketingEmail:o,marketingSms:s}){let{data:c,error:l}=await e.auth.signUp({email:String(n).trim(),password:r});if(l)throw l;let u=c?.user?.id;if(!c?.session)return{pendingConfirmation:!0};let{data:d,error:f}=await e.from(`customers`).insert({restaurant_id:t,auth_user_id:u,name:String(i||``).trim()||null,phone:String(a||``).trim()||null,email:String(n).trim()}).select().single();if(f)throw f;let p=[{channel:`EMAIL`,granted:!!o},{channel:`SMS`,granted:!!s}].map(e=>({restaurant_id:t,customer_id:d.id,channel:e.channel,granted:e.granted,source:`signup`,granted_at:e.granted?new Date().toISOString():null})),{error:m}=await e.from(`marketing_consents`).insert(p);if(m)throw m;return{pendingConfirmation:!1,customer:d}}async function te(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function h(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function ne(e,t){let{data:{user:n}}=await e.auth.getUser();if(!n)return null;let{data:r,error:i}=await e.from(`customers`).select(`*`).eq(`auth_user_id`,n.id).eq(`restaurant_id`,t).maybeSingle();if(i)throw i;return r}async function re(e,t){let{data:n,error:r}=await e.from(`orders`).select(`id, order_number, status, total_cents, pickup_time, created_at, order_items(product_name, quantity, line_total_cents)`).eq(`customer_id`,t).order(`created_at`,{ascending:!1}).limit(50);if(r)throw r;return n??[]}async function g(e,t){let{data:n,error:r}=await e.from(`marketing_consents`).select(`channel, granted`).eq(`customer_id`,t);if(r)throw r;return n??[]}async function _(e,{restaurantId:t,customerId:n,channel:r,granted:i}){let{error:a}=await e.from(`marketing_consents`).upsert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`,granted_at:i?new Date().toISOString():null,withdrawn_at:i?null:new Date().toISOString()},{onConflict:`restaurant_id,customer_id,channel`});if(a)throw a;let{error:o}=await e.from(`marketing_consent_events`).insert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`});if(o)throw o}async function ie(e){let{error:t}=await e.rpc(`delete_customer_account`);if(t)throw t;await h(e)}var v=null,y=[],b=[],x=null,S=null,C=`login`,w=``,T=!1,E=null,D=[],O=[],k=!1,ae=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],oe=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],se=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],A=document.querySelector(`#root`),j=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,ce=()=>b.reduce((e,t)=>e+Number(t.quantity??0),0);function M(){return v?.name||`FOODATOI`}function le(){return v?.phone||``}function N(){let e=v?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function ue(){return v?.primary_color||`#111111`}async function P(){return v=await a(e),console.info(`[FOODATOI] Restaurant résolu:`,v),F(),S=c(e,v.id),v}function F(){v&&(document.documentElement.style.setProperty(`--restaurant-primary`,ue()),document.title=`${M()} · FOODATOI`)}function I(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function L(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:I(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function R(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!v?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,v.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return y=(t??[]).filter(e=>e.restaurant_id===v.id).map(L),console.info(`[FOODATOI] ${y.length} produit(s) chargé(s) pour ${M()}.`),y}function z(){return[`Tous`,...new Set(y.map(e=>e.category).filter(Boolean))]}function B(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function V(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:B(e),items:n.get(e)}))}function H(){A.innerHTML=`
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
  `}function U(t){console.error(`[FOODATOI] Erreur application:`,t),l(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),A.innerHTML=`
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
  `}function W(){let e=z(),n=M(),i=N(),a=le();A.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${v?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${t(v.logo_url)}"
                  alt="${t(n)}"
                >
              `:`
                <span class="brand-mark">
                  ${t(n.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${t(n)}
            </strong>

            <span>
              ${t(v?.sector||`RESTAURANT`)}
            </span>

          </div>

        </div>

        <div class="masthead-actions">

          <button
            class="account-pill"
            id="open-account"
            type="button"
          >
            Compte
          </button>

          <button
            class="order-pill"
            id="open-cart"
            type="button"
          >
            <span>
              Ma commande
            </span>

            <b>
              ${ce()}
            </b>
          </button>

        </div>

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
              ${t(n)}.
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
                ${t(n)}
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

              ${i?`
                    <span>
                      ${t(i)}
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

        ${v?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${t(n)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${t(v.settings.delivery_redirect_url)}"
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

              ${y.length}

              ${y.length>1?`produits`:`produit`}

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
                          data-category="${t(e)}"
                          data-target="${e===`Tous`?`top`:t(B(e))}"
                          type="button"
                        >
                          ${t(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          ${y.length?V(y).map(e=>`
                      <section
                        class="menu-category-section"
                        id="menu-cat-${e.slug}"
                      >

                        <h2 class="menu-category-heading">
                          ${t(e.category)}
                        </h2>

                        <div class="menu-grid">
                          ${e.items.map(de).join(``)}
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
            ${t(n)}
          </strong>

          ${i?`
                <span>
                  ${t(i)}
                </span>
              `:``}

        </div>

        ${r(v?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${r(v?.settings?.opening_hours).map(e=>`
                      <span>
                        ${t(e.label)}
                        <b>
                          ${t(e.hours)}
                        </b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>

          ${a?`
                <a
                  href="tel:${t(a)}"
                >
                  ${t(a)}
                </a>
              `:``}

          ${v?.settings?.facebook_url?`
                <a
                  href="${t(v.settings.facebook_url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              `:``}

          <a href="/legal.html">
            Mentions légales
          </a>

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
            ${t(n)}
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
  `,pe(),$()}function de(e){return`
    <article class="menu-card">

      <div class="menu-card-media">
        ${e.imageUrl?`
              <img
                src="${t(e.imageUrl)}"
                alt=""
                loading="lazy"
              >
            `:`
              <span class="menu-card-media-fallback">
                ${t(e.emoji)}
              </span>
            `}
      </div>

      <div class="menu-card-body">

        <p class="eyebrow">
          ${t(e.category)}
        </p>

        <h3>
          ${t(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${t(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${j(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${t(e.id)}"
          type="button"
          aria-label="Ajouter ${t(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function fe(){x&&x.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;x=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{e.classList.toggle(`is-active`,e.dataset.target===t)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>x.observe(e))}function pe(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),fe(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>me(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=q);let t=document.querySelector(`#open-account`);t&&(t.onclick=Y);let n=document.querySelector(`#close-cart`);n&&(n.onclick=J);let r=document.querySelector(`#backdrop`);r&&(r.onclick=J)}function me(e){let n=y.find(t=>t.id===e);if(!n)return;let r=he(n),i=ge(n),a=_e(n);document.querySelector(`#modal-content`).innerHTML=`

    <button
      class="modal-close"
      id="modal-close"
      type="button"
      aria-label="Fermer"
    >
      ×
    </button>

    ${n.imageUrl?`
          <img
            class="product-photo"
            src="${t(n.imageUrl)}"
            alt=""
          >
        `:`
          <div class="product-mark">
            ${t(n.emoji)}
          </div>
        `}

    <p class="eyebrow">
      ${t(n.category)}
    </p>

    <h2>
      ${t(n.name)}
    </h2>

    ${n.description?`
          <p>
            ${t(n.description)}
          </p>
        `:``}

    <div class="form-grid">

      ${r}

      ${i}

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
      Ajouter · ${j(n.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),t={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,o=document.querySelector(`#sauce`)?.value,s=document.querySelector(`#drink`)?.value;r&&(t.meat=r),i&&(t.meat2=i),a&&(t.meat3=a),(i||a)&&(t.meats=[r,i,a].filter(Boolean)),o&&(t.sauce=o),s&&(t.drink=s),b=d(b,{...n,quantity:e,options:t}),document.querySelector(`#product-modal`).classList.add(`hidden`),W(),q()}}function G(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function he(e){if(!e.meat)return``;let t=G(e.options,[`meats`,`meat`,`viandes`,`viande`],ae);return e.tripleMeat?`
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
  `}function ge(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${K(G(e.options,[`sauces`,`sauce`],oe))}
      </select>
    </label>
  `:``}function _e(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${K(G(e.options,[`drinks`,`drink`,`boissons`,`boisson`],se))}
      </select>
    </label>
  `:``}function K(e){return e.map(e=>`<option value="${t(e)}">${t(e)}</option>`).join(``)}function q(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),$()}function J(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}async function Y(){let t=document.querySelector(`#account-overlay`);t||(t=document.createElement(`div`),t.id=`account-overlay`,t.className=`modal`,t.innerHTML=`
      <div class="modal-card order-detail-card" id="account-content"></div>
    `,document.body.appendChild(t),t.onclick=e=>{e.target===t&&t.remove()}),w=``,T=!0,Q();try{let{data:{session:t}}=await e.auth.getSession();t?await X():C=`login`}catch(e){console.error(`[FOODATOI] Erreur ouverture compte:`,e),w=`Impossible de charger ton compte pour le moment.`}T=!1,Q()}async function X(){if(E=await ne(e,v.id),!E){C=`login`;return}let[t,n]=await Promise.all([re(e,E.id),g(e,E.id)]);D=t,O=n,C=`dashboard`}function Z(e){return!!O.find(t=>t.channel===e)?.granted}function Q(){let e=document.querySelector(`#account-content`);if(!e)return;let n=w?`<p class="account-error">${t(w)}</p>`:``;if(T){e.innerHTML=`
      <p class="eyebrow">Mon compte</p>
      <h2>Chargement…</h2>
    `;return}if(C===`dashboard`&&E){e.innerHTML=`
      <button class="modal-close" id="account-close">×</button>

      <p class="eyebrow">Mon compte</p>
      <h2>${t(E.name||`Bonjour`)}</h2>
      <p>${t(E.email||``)}</p>

      ${n}

      <div class="account-section">
        <h3>Mes commandes</h3>
        ${D.length?`<ul class="account-orders">
                ${D.map(e=>`
                      <li>
                        <div>
                          <strong>${t(e.order_number)}</strong>
                          <span>${new Date(e.created_at).toLocaleDateString(`fr-FR`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}</span>
                        </div>
                        <div>
                          ${(e.order_items||[]).map(e=>`${e.quantity}× ${t(e.product_name)}`).join(`, `)}
                        </div>
                        <strong>${j((e.total_cents||0)/100)}</strong>
                      </li>
                    `).join(``)}
              </ul>`:`<p class="muted">Aucune commande pour le moment.</p>`}
      </div>

      <div class="account-section">
        <h3>Communications</h3>
        <label class="account-toggle">
          <input type="checkbox" id="consent-email" ${Z(`EMAIL`)?`checked`:``}>
          Recevoir des offres par email
        </label>
        <label class="account-toggle">
          <input type="checkbox" id="consent-sms" ${Z(`SMS`)?`checked`:``}>
          Recevoir des offres par SMS
        </label>
      </div>

      <div class="account-section">
        <button class="secondary full" id="account-logout" type="button">
          Se déconnecter
        </button>

        ${k?`
              <p class="account-error">
                Cette action supprime définitivement ton compte, tes coordonnées et tes préférences. Elle ne peut pas être annulée.
              </p>
              <button class="danger full" id="account-delete-confirm" type="button">
                Confirmer la suppression définitive
              </button>
              <button class="secondary full" id="account-delete-cancel" type="button">
                Annuler
              </button>
            `:`
              <button class="danger full" id="account-delete" type="button">
                Supprimer mon compte et mes données
              </button>
            `}
      </div>
    `,ye();return}let r=C===`signup`;e.innerHTML=`
    <button class="modal-close" id="account-close">×</button>

    <p class="eyebrow">Mon compte</p>
    <h2>${r?`Créer un compte`:`Se connecter`}</h2>

    ${n}

    <form id="account-form" class="order-form">
      <label>
        EMAIL
        <input name="email" type="email" required autocomplete="email">
      </label>

      ${r?`
            <label>
              NOM
              <input name="name" required autocomplete="name">
            </label>
            <label>
              TÉLÉPHONE
              <input name="phone" inputmode="tel" autocomplete="tel">
            </label>
          `:``}

      <label>
        MOT DE PASSE
        <input name="password" type="password" required autocomplete="${r?`new-password`:`current-password`}" minlength="6">
      </label>

      ${r?`
            <label class="account-toggle">
              <input type="checkbox" name="marketingEmail">
              Je souhaite recevoir des offres par email
            </label>
            <label class="account-toggle">
              <input type="checkbox" name="marketingSms">
              Je souhaite recevoir des offres par SMS
            </label>
            <p class="account-legal">
              Tes données servent uniquement à gérer ton compte et tes commandes chez ${t(M())}. Tu peux les supprimer à tout moment depuis cet espace.
            </p>
          `:``}

      <button class="primary full" type="submit">
        ${r?`Créer mon compte →`:`Se connecter →`}
      </button>
    </form>

    <button class="secondary full" id="account-toggle-mode" type="button">
      ${r?`J’ai déjà un compte`:`Créer un compte`}
    </button>
  `,ve()}function ve(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let n=document.querySelector(`#account-toggle-mode`);n&&(n.onclick=()=>{C=C===`signup`?`login`:`signup`,w=``,Q()});let r=document.querySelector(`#account-form`);r&&(r.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));if(!m(n.email)){w=`Adresse email invalide.`,Q();return}T=!0,w=``,Q();try{if(C===`signup`){if((await ee(e,v.id,n)).pendingConfirmation){T=!1,w=`Compte créé ! Vérifie tes emails pour confirmer ton adresse avant de te connecter.`,C=`login`,Q();return}await X()}else await te(e,n),await X()}catch(t){console.error(`[FOODATOI] Erreur compte client:`,t),l(e,{restaurantId:v?.id,context:`main.customerAccount`,message:t?.message??String(t),page:`main`}),w=String(t?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(t?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`}T=!1,Q()})}function ye(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let n=document.querySelector(`#account-logout`);n&&(n.onclick=async()=>{await h(e),C=`login`,E=null,D=[],O=[],k=!1,Q()}),[`EMAIL`,`SMS`].forEach(t=>{let n=document.querySelector(`#consent-${t.toLowerCase()}`);n&&(n.onchange=async()=>{try{await _(e,{restaurantId:v.id,customerId:E.id,channel:t,granted:n.checked}),O=await g(e,E.id)}catch(e){console.error(`[FOODATOI] Erreur consentement:`,e),n.checked=!n.checked}})});let r=document.querySelector(`#account-delete`);r&&(r.onclick=()=>{k=!0,Q()});let i=document.querySelector(`#account-delete-cancel`);i&&(i.onclick=()=>{k=!1,Q()});let a=document.querySelector(`#account-delete-confirm`);a&&(a.onclick=async()=>{T=!0,Q();try{await ie(e),C=`login`,E=null,D=[],O=[],k=!1,w=`Ton compte et tes données ont été supprimés.`}catch(t){console.error(`[FOODATOI] Erreur suppression compte:`,t),l(e,{restaurantId:v?.id,context:`main.deleteAccount`,message:t?.message??String(t),page:`main`}),w=`Impossible de supprimer le compte pour le moment.`,k=!1}T=!1,Q()})}function $(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!b.length){e.innerHTML=`
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
          ${t(M())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${b.map((e,t)=>be(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${j(f(b))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${N()?`
              <span>
                ${t(N())}
              </span>
            `:``}

        <small>
          Paiement au restaurant
        </small>

      </div>

    </div>

    ${u(v?.settings?.opening_hours)?``:`
          <div class="closed-banner">
            <p class="eyebrow">
              FERMÉ ACTUELLEMENT
            </p>
            <p>
              ${t(M())}
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

      <label>
        DEMANDE SPÉCIALE (facultatif)

        <textarea
          name="specialInstructions"
          rows="2"
          maxlength="280"
          placeholder="Sans oignons, moins de sauce fromagère..."
        ></textarea>
      </label>

      <button
        class="primary full"
        type="submit"
        ${u(v?.settings?.opening_hours)?``:`disabled`}
      >
        Envoyer ma commande →
      </button>

      <small>
        ${S?`Commande transmise directement à l’espace ${t(M())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{b.splice(Number(e.dataset.remove),1),$()}});let n=e.querySelector(`#order-form`);n&&(n.onsubmit=async e=>{if(e.preventDefault(),!u(v?.settings?.opening_hours)){$();return}let t=Object.fromEntries(new FormData(e.currentTarget)),n=p(b,t);n.notes=String(t.specialInstructions||``).trim()||null,await Se(n)})}function be(e,n){let r=xe(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${t(e.name)}
        </strong>

        ${r?`
              <span>
                ${t(r)}
              </span>
            `:``}

      </div>

      <b>
        ${j(e.price*e.quantity)}
      </b>

      <button
        data-remove="${n}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function xe(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function Se(t){try{let e,n={...t,restaurant_id:v?.id||null,restaurantId:v?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(S)e=await S.createOrder(n);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=i(t,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}b=[],Ce(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),l(e,{restaurantId:v?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:`Impossible d’envoyer la commande pour le moment.`)}}function Ce(e){let r=n(e);J(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${t(r.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${t(M())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${t(r.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${r.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${t(e.name)}
                    </strong>

                    <span>
                      ${t(e.options||``)}
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
            ${t(r.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),W()}}async function we(){try{H(),await P(),await R(),W()}catch(e){if(!s()&&!o()){window.location.replace(`/pro.html`);return}U(e)}}we();