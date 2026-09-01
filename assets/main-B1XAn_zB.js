import{n as e,t}from"./styles-CA22tAoU.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{d as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./restaurantResolver-B1dJEPxX.js";import{t as d}from"./errorLog-DYeNOlWf.js";import{a as f,i as p,o as m,r as ee}from"./loyalty-Bi6_Ljfe.js";function te(e,t){return[...e,{...t,quantity:t.quantity??1}]}function h(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function ne(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:`PICKUP`,status:`NEW`,items:e,customer:t,total:h(e),createdAt:new Date().toISOString()}}function re(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}async function ie(e,t,{email:n,password:r,name:i,phone:a,marketingEmail:o,marketingSms:s}){let{data:c,error:l}=await e.auth.signUp({email:String(n).trim(),password:r});if(l)throw l;let u=c?.user?.id;if(!c?.session)return{pendingConfirmation:!0};let{data:d,error:f}=await e.from(`customers`).insert({restaurant_id:t,auth_user_id:u,name:String(i||``).trim()||null,phone:String(a||``).trim()||null,email:String(n).trim()}).select().single();if(f)throw f;let p=[{channel:`EMAIL`,granted:!!o},{channel:`SMS`,granted:!!s}].map(e=>({restaurant_id:t,customer_id:d.id,channel:e.channel,granted:e.granted,source:`signup`,granted_at:e.granted?new Date().toISOString():null})),{error:m}=await e.from(`marketing_consents`).insert(p);if(m)throw m;return{pendingConfirmation:!1,customer:d}}async function ae(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function g(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function oe(e,t){let{data:{user:n}}=await e.auth.getUser();if(!n)return null;let{data:r,error:i}=await e.from(`customers`).select(`*`).eq(`auth_user_id`,n.id).eq(`restaurant_id`,t).maybeSingle();if(i)throw i;return r}async function se(e,t){let{data:n,error:r}=await e.from(`orders`).select(`id, order_number, status, total_cents, pickup_time, created_at, order_items(product_name, quantity, line_total_cents)`).eq(`customer_id`,t).order(`created_at`,{ascending:!1}).limit(50);if(r)throw r;return n??[]}async function _(e,t){let{data:n,error:r}=await e.from(`marketing_consents`).select(`channel, granted`).eq(`customer_id`,t);if(r)throw r;return n??[]}async function v(e,{restaurantId:t,customerId:n,channel:r,granted:i}){let{error:a}=await e.from(`marketing_consents`).upsert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`,granted_at:i?new Date().toISOString():null,withdrawn_at:i?null:new Date().toISOString()},{onConflict:`restaurant_id,customer_id,channel`});if(a)throw a;let{error:o}=await e.from(`marketing_consent_events`).insert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`});if(o)throw o}async function y(e){let{error:t}=await e.rpc(`delete_customer_account`);if(t)throw t;await g(e)}var b=null,x=[],S=[],C=null,w=null,T=null,E=`login`,D=``,O=!1,k=null,A=[],j=[],M=null,N=[],P=!1,F=!1,ce=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],le=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],ue=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],I=document.querySelector(`#root`),L=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,de=()=>S.reduce((e,t)=>e+Number(t.quantity??0),0);function R(){return b?.name||`FOODATOI`}function z(){return b?.phone||``}function B(){let e=b?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function V(){return b?.primary_color||`#111111`}async function H(){return b=await s(e),console.info(`[FOODATOI] Restaurant résolu:`,b),fe(),w=o(e,b.id),b}function fe(){b&&(document.documentElement.style.setProperty(`--restaurant-primary`,V()),document.title=`${R()} · FOODATOI`)}function pe(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function me(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:pe(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function he(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!b?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,b.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return x=(t??[]).filter(e=>e.restaurant_id===b.id).map(me),console.info(`[FOODATOI] ${x.length} produit(s) chargé(s) pour ${R()}.`),x}function ge(){return[`Tous`,...new Set(x.map(e=>e.category).filter(Boolean))]}function U(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function _e(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:U(e),items:n.get(e)}))}function ve(){I.innerHTML=`
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
  `}function ye(t){console.error(`[FOODATOI] Erreur application:`,t),d(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),I.innerHTML=`
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
  `}function W(){let e=ge(),n=R(),r=B(),i=z();I.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${b?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${t(b.logo_url)}"
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
              ${t(b?.sector||`RESTAURANT`)}
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
              ${de()}
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

              ${r?`
                    <span>
                      ${t(r)}
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

        ${b?.settings?.delivery_redirect_url?`
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
                  href="${t(b.settings.delivery_redirect_url)}"
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

              ${x.length}

              ${x.length>1?`produits`:`produit`}

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
                          data-target="${e===`Tous`?`top`:t(U(e))}"
                          type="button"
                        >
                          ${t(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          ${x.length?_e(x).map(e=>`
                      <section
                        class="menu-category-section"
                        id="menu-cat-${e.slug}"
                      >

                        <h2 class="menu-category-heading">
                          ${t(e.category)}
                        </h2>

                        <div class="menu-grid">
                          ${e.items.map(be).join(``)}
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

          ${r?`
                <span>
                  ${t(r)}
                </span>
              `:``}

        </div>

        ${c(b?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${c(b?.settings?.opening_hours).map(e=>`
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

          ${i?`
                <a
                  href="tel:${t(i)}"
                >
                  ${t(i)}
                </a>
              `:``}

          ${b?.settings?.facebook_url?`
                <a
                  href="${t(b.settings.facebook_url)}"
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
  `,Se(),Q()}function be(e){return`
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
          ${L(e.price)}
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
  `}function xe(){C&&C.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;C=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{e.classList.toggle(`is-active`,e.dataset.target===t)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>C.observe(e))}function Se(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),xe(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>Ce(e.dataset.add)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=q);let t=document.querySelector(`#open-account`);t&&(t.onclick=De);let n=document.querySelector(`#close-cart`);n&&(n.onclick=J);let r=document.querySelector(`#backdrop`);r&&(r.onclick=J)}function Ce(e){let n=x.find(t=>t.id===e);if(!n)return;let r=we(n),i=Te(n),a=Ee(n);document.querySelector(`#modal-content`).innerHTML=`

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
      Ajouter · ${L(n.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),t={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,o=document.querySelector(`#sauce`)?.value,s=document.querySelector(`#drink`)?.value;r&&(t.meat=r),i&&(t.meat2=i),a&&(t.meat3=a),(i||a)&&(t.meats=[r,i,a].filter(Boolean)),o&&(t.sauce=o),s&&(t.drink=s),S=te(S,{...n,quantity:e,options:t}),document.querySelector(`#product-modal`).classList.add(`hidden`),W(),q()}}function G(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function we(e){if(!e.meat)return``;let t=G(e.options,[`meats`,`meat`,`viandes`,`viande`],ce);return e.tripleMeat?`
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
  `}function Te(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${K(G(e.options,[`sauces`,`sauce`],le))}
      </select>
    </label>
  `:``}function Ee(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${K(G(e.options,[`drinks`,`drink`,`boissons`,`boisson`],ue))}
      </select>
    </label>
  `:``}function K(e){return e.map(e=>`<option value="${t(e)}">${t(e)}</option>`).join(``)}function q(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),Q()}function J(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}async function De(){let t=document.querySelector(`#account-overlay`);t||(t=document.createElement(`div`),t.id=`account-overlay`,t.className=`modal`,t.innerHTML=`
      <div class="modal-card order-detail-card" id="account-content"></div>
    `,document.body.appendChild(t),t.onclick=e=>{e.target===t&&t.remove()}),D=``,O=!0,Z();try{let{data:{session:t}}=await e.auth.getSession();t?await Y():E=`login`}catch(e){console.error(`[FOODATOI] Erreur ouverture compte:`,e),D=`Impossible de charger ton compte pour le moment.`}O=!1,Z()}async function Y(){if(k=await oe(e,b.id),!k){E=`login`;return}let[t,n]=await Promise.all([se(e,k.id),_(e,k.id)]);A=t,j=n;try{if((await ee(e,b.id))?.is_active){let[t,n]=await Promise.all([f(e,b.id),p(e,b.id)]);M=t,N=n.filter(e=>e.is_active)}else M=null,N=[]}catch(e){console.error(`[FOODATOI] Erreur chargement fidélité:`,e),M=null,N=[]}E=`dashboard`}function X(e){return!!j.find(t=>t.channel===e)?.granted}function Z(){let e=document.querySelector(`#account-content`);if(!e)return;let n=D?`<p class="account-error">${t(D)}</p>`:``;if(O){e.innerHTML=`
      <p class="eyebrow">Mon compte</p>
      <h2>Chargement…</h2>
    `;return}if(E===`dashboard`&&k){e.innerHTML=`
      <button class="modal-close" id="account-close">×</button>

      <p class="eyebrow">Mon compte</p>
      <h2>${t(k.name||`Bonjour`)}</h2>
      <p>${t(k.email||``)}</p>

      ${n}

      <div class="account-section">
        <h3>Mes commandes</h3>
        ${A.length?`<ul class="account-orders">
                ${A.map(e=>`
                      <li>
                        <div>
                          <strong>${t(e.order_number)}</strong>
                          <span>${new Date(e.created_at).toLocaleDateString(`fr-FR`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}</span>
                        </div>
                        <div>
                          ${(e.order_items||[]).map(e=>`${e.quantity}× ${t(e.product_name)}`).join(`, `)}
                        </div>
                        <strong>${L((e.total_cents||0)/100)}</strong>
                      </li>
                    `).join(``)}
              </ul>`:`<p class="muted">Aucune commande pour le moment.</p>`}
      </div>

      ${M||N.length?`
            <div class="account-section">
              <h3>Ma fidélité</h3>
              <p class="loyalty-balance">${M?.balance_points??0} points</p>
              ${N.length?`<ul class="account-orders loyalty-rewards">
                      ${N.map(e=>`
                            <li>
                              <div>
                                <strong>${t(e.name)}</strong>
                                ${e.description?`<span>${t(e.description)}</span>`:``}
                              </div>
                              <button
                                class="secondary small"
                                data-redeem-reward="${e.id}"
                                type="button"
                                ${(M?.balance_points??0)<e.cost_points||P?`disabled`:``}
                              >
                                ${e.cost_points} pts
                              </button>
                            </li>
                          `).join(``)}
                    </ul>`:`<p class="muted">Aucune récompense disponible pour le moment.</p>`}
            </div>
          `:``}

      <div class="account-section">
        <h3>Communications</h3>
        <label class="account-toggle">
          <input type="checkbox" id="consent-email" ${X(`EMAIL`)?`checked`:``}>
          Recevoir des offres par email
        </label>
        <label class="account-toggle">
          <input type="checkbox" id="consent-sms" ${X(`SMS`)?`checked`:``}>
          Recevoir des offres par SMS
        </label>
      </div>

      <div class="account-section">
        <button class="secondary full" id="account-logout" type="button">
          Se déconnecter
        </button>

        ${F?`
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
    `,ke();return}let r=E===`signup`;e.innerHTML=`
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
              Tes données servent uniquement à gérer ton compte et tes commandes chez ${t(R())}. Tu peux les supprimer à tout moment depuis cet espace.
            </p>
          `:``}

      <button class="primary full" type="submit">
        ${r?`Créer mon compte →`:`Se connecter →`}
      </button>
    </form>

    <button class="secondary full" id="account-toggle-mode" type="button">
      ${r?`J’ai déjà un compte`:`Créer un compte`}
    </button>
  `,Oe()}function Oe(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let n=document.querySelector(`#account-toggle-mode`);n&&(n.onclick=()=>{E=E===`signup`?`login`:`signup`,D=``,Z()});let r=document.querySelector(`#account-form`);r&&(r.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));if(!re(n.email)){D=`Adresse email invalide.`,Z();return}O=!0,D=``,Z();try{if(E===`signup`){if((await ie(e,b.id,n)).pendingConfirmation){O=!1,D=`Compte créé ! Vérifie tes emails pour confirmer ton adresse avant de te connecter.`,E=`login`,Z();return}await Y()}else await ae(e,n),await Y()}catch(t){console.error(`[FOODATOI] Erreur compte client:`,t),d(e,{restaurantId:b?.id,context:`main.customerAccount`,message:t?.message??String(t),page:`main`}),D=String(t?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(t?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`}O=!1,Z()})}function ke(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let n=document.querySelector(`#account-logout`);n&&(n.onclick=async()=>{await g(e),E=`login`,k=null,A=[],j=[],F=!1,Z()}),document.querySelectorAll(`[data-redeem-reward]`).forEach(t=>{t.onclick=async()=>{if(!P){P=!0,Z();try{await m(e,t.dataset.redeemReward),M=await f(e,b.id),alert(`Récompense échangée ! Montre cet écran en caisse pour en profiter.`)}catch(e){console.error(`[FOODATOI] Erreur échange récompense:`,e),alert(`Impossible d’échanger cette récompense pour le moment.`)}finally{P=!1,Z()}}}}),[`EMAIL`,`SMS`].forEach(t=>{let n=document.querySelector(`#consent-${t.toLowerCase()}`);n&&(n.onchange=async()=>{try{await v(e,{restaurantId:b.id,customerId:k.id,channel:t,granted:n.checked}),j=await _(e,k.id)}catch(e){console.error(`[FOODATOI] Erreur consentement:`,e),n.checked=!n.checked}})});let r=document.querySelector(`#account-delete`);r&&(r.onclick=()=>{F=!0,Z()});let i=document.querySelector(`#account-delete-cancel`);i&&(i.onclick=()=>{F=!1,Z()});let a=document.querySelector(`#account-delete-confirm`);a&&(a.onclick=async()=>{O=!0,Z();try{await y(e),E=`login`,k=null,A=[],j=[],F=!1,D=`Ton compte et tes données ont été supprimés.`}catch(t){console.error(`[FOODATOI] Erreur suppression compte:`,t),d(e,{restaurantId:b?.id,context:`main.deleteAccount`,message:t?.message??String(t),page:`main`}),D=`Impossible de supprimer le compte pour le moment.`,F=!1}O=!1,Z()})}function Q(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!S.length){e.innerHTML=`
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
          ${t(R())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${S.map((e,t)=>Ae(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${L(h(S))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${B()?`
              <span>
                ${t(B())}
              </span>
            `:``}

        <small>
          Paiement au restaurant
        </small>

      </div>

    </div>

    <div id="hours-banner"></div>

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
        JOUR DE RETRAIT

        <input
          name="pickupDate"
          type="date"
          id="pickup-date"
          required
        >
      </label>

      <label>
        HEURE SOUHAITÉE

        <input
          name="pickupTime"
          type="time"
          id="pickup-time"
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
        id="submit-order"
      >
        Envoyer ma commande →
      </button>

      <small>
        ${w?`Commande transmise directement à l’espace ${t(R())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{S.splice(Number(e.dataset.remove),1),Q()}});let n=e.querySelector(`#order-form`);if(n){let r=n.querySelector(`#pickup-date`),a=n.querySelector(`#pickup-time`),o=e.querySelector(`#hours-banner`),s=n.querySelector(`#submit-order`),c=new Date().toLocaleDateString(`en-CA`),l=new Date(Date.now()+5184e6).toLocaleDateString(`en-CA`);r.min=c,r.max=l,r.value=c;function d(){let e=u(a.value,r.value);return e?new Date(e):null}function f(){let e=d(),n=e&&i(b?.settings?.opening_hours,e);s.disabled=!n,o.innerHTML=n?``:`
          <div class="closed-banner">
            <p class="eyebrow">FERMÉ À CE CRÉNEAU</p>
            <p>
              ${t(R())}
              n'accepte pas de commande à l'horaire choisi.
              Choisis un autre jour ou une autre heure.
            </p>
          </div>
        `}r.onchange=f,a.onchange=f,f(),n.onsubmit=async e=>{e.preventDefault();let t=d();if(!t||!i(b?.settings?.opening_hours,t)){f();return}let n=Object.fromEntries(new FormData(e.currentTarget)),r=ne(S,n);r.notes=String(n.specialInstructions||``).trim()||null,T||=crypto.randomUUID(),r.idempotencyKey=T,await je(r)}}}function Ae(e,n){let r=$(e.options);return`
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
        ${L(e.price*e.quantity)}
      </b>

      <button
        data-remove="${n}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function $(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function je(t){try{let e,r={...t,restaurant_id:b?.id||null,restaurantId:b?.id||null};if(!r.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(w)e=await w.createOrder(r);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=n(t,r).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}S=[],T=null,Me(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),d(e,{restaurantId:b?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:String(t?.message||``).includes(`RATE_LIMITED`)?`Trop de commandes envoyées récemment avec ce numéro. Réessaie dans quelques minutes.`:`Impossible d’envoyer la commande pour le moment.`)}}function Me(e){let n=r(e);J(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${t(n.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${t(R())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${t(n.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${n.items.map(e=>`
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
            ${t(n.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),W()}}async function Ne(){try{ve(),await H(),await he(),W()}catch(e){if(!a()&&!l()){window.location.replace(`/pro.html`);return}ye(e)}}Ne();