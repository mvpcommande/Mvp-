import{i as e,n as t,r as n,t as r}from"./styles-BeptKHnq.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{d as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d,u as f}from"./restaurantResolver-9IOtyM5e.js";import{t as p}from"./analytics-1YGI5PQu.js";import{a as m,i as h,o as g,r as ee}from"./loyalty-Bi6_Ljfe.js";function te(e,t){return[...e,{...t,quantity:t.quantity??1}]}function _(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function ne(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:t?.fulfillmentType===`DELIVERY`?`DELIVERY`:`PICKUP`,status:`NEW`,items:e,customer:t,total:_(e),createdAt:new Date().toISOString()}}function re(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}async function ie(e,t,{email:n,password:r,name:i,phone:a,marketingEmail:o,marketingSms:s}){let{data:c,error:l}=await e.auth.signUp({email:String(n).trim(),password:r});if(l)throw l;let u=c?.user?.id;if(!c?.session)return{pendingConfirmation:!0};let{data:d,error:f}=await e.from(`customers`).insert({restaurant_id:t,auth_user_id:u,name:String(i||``).trim()||null,phone:String(a||``).trim()||null,email:String(n).trim()}).select().single();if(f)throw f;let p=[{channel:`EMAIL`,granted:!!o},{channel:`SMS`,granted:!!s}].map(e=>({restaurant_id:t,customer_id:d.id,channel:e.channel,granted:e.granted,source:`signup`,granted_at:e.granted?new Date().toISOString():null})),{error:m}=await e.from(`marketing_consents`).insert(p);if(m)throw m;return{pendingConfirmation:!1,customer:d}}async function ae(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function v(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function oe(e,t){let{data:{user:n}}=await e.auth.getUser();if(!n)return null;let{data:r,error:i}=await e.from(`customers`).select(`*`).eq(`auth_user_id`,n.id).eq(`restaurant_id`,t).maybeSingle();if(i)throw i;return r}async function se(e,t){let{data:n,error:r}=await e.from(`orders`).select(`id, order_number, status, total_cents, pickup_time, created_at, order_items(product_name, quantity, line_total_cents)`).eq(`customer_id`,t).order(`created_at`,{ascending:!1}).limit(50);if(r)throw r;return n??[]}async function y(e,t){let{data:n,error:r}=await e.from(`marketing_consents`).select(`channel, granted`).eq(`customer_id`,t);if(r)throw r;return n??[]}async function ce(e,{restaurantId:t,customerId:n,channel:r,granted:i}){let{error:a}=await e.from(`marketing_consents`).upsert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`,granted_at:i?new Date().toISOString():null,withdrawn_at:i?null:new Date().toISOString()},{onConflict:`restaurant_id,customer_id,channel`});if(a)throw a;let{error:o}=await e.from(`marketing_consent_events`).insert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`});if(o)throw o}async function le(e){let{error:t}=await e.rpc(`delete_customer_account`);if(t)throw t;await v(e)}var b=null;t(e,{page:`client`,getRestaurantId:()=>b?.id??null});var x=[],S=[],C=null,w=null,T=null,E=`login`,D=``,O=!1,k=null,A=[],j=[],M=null,N=[],P=!1,F=!1,ue=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],de=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],I=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],L=document.querySelector(`#root`),R=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,fe=()=>S.reduce((e,t)=>e+Number(t.quantity??0),0);function z(){return b?.name||`FOODATOI`}function B(){return b?.phone||``}function V(){let e=b?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function pe(){return b?.primary_color||`#111111`}async function me(){return b=await l(e),console.info(`[FOODATOI] Restaurant résolu:`,b),he(),w=c(e,b.id),b}function he(){b&&(document.documentElement.style.setProperty(`--restaurant-primary`,pe()),document.title=`${z()} · FOODATOI`)}function ge(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function _e(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:ge(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat)}}async function ve(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!b?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,b.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return x=(t??[]).filter(e=>e.restaurant_id===b.id).map(_e),console.info(`[FOODATOI] ${x.length} produit(s) chargé(s) pour ${z()}.`),x}function ye(){return[`Tous`,...new Set(x.map(e=>e.category).filter(Boolean))]}function H(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function be(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:H(e),items:n.get(e)}))}function xe(){L.innerHTML=`
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
  `}function U(t){console.error(`[FOODATOI] Erreur application:`,t),n(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),L.innerHTML=`
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
  `}function W(){let e=ye(),t=z(),n=V(),i=B();L.innerHTML=`
    <div class="app-frame">

      <header class="masthead">

        <div class="brand-lockup">

          ${b?.logo_url?`
                <img
                  class="brand-mark-image"
                  src="${r(b.logo_url)}"
                  alt="${r(t)}"
                >
              `:`
                <span class="brand-mark">
                  ${r(t.slice(0,2).toUpperCase())}
                </span>
              `}

          <div>

            <strong>
              ${r(t)}
            </strong>

            <span>
              ${r(b?.sector||`RESTAURANT`)}
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
              ${fe()}
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
              ${r(t)}.
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
                ${r(t)}
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
                      ${r(n)}
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

        ${b?.settings?.delivery_mode===`redirect`&&b?.settings?.delivery_redirect_url?`
              <section class="delivery-banner">

                <div>

                  <p class="eyebrow">
                    LIVRAISON À DOMICILE
                  </p>

                  <p>
                    ${r(t)}
                    livre aussi à domicile via Uber Eats.
                  </p>

                </div>

                <a
                  class="secondary"
                  href="${r(b.settings.delivery_redirect_url)}"
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
                          data-category="${r(e)}"
                          data-target="${e===`Tous`?`top`:r(H(e))}"
                          type="button"
                        >
                          ${r(e)}
                        </button>
                      `).join(``)}

                </nav>
              `:``}

          ${x.length?be(x).map(e=>`
                      <section
                        class="menu-category-section"
                        id="menu-cat-${e.slug}"
                      >

                        <h2 class="menu-category-heading">
                          ${r(e.category)}
                        </h2>

                        <div class="menu-grid">
                          ${e.items.map(Se).join(``)}
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
            ${r(t)}
          </strong>

          ${n?`
                <span>
                  ${r(n)}
                </span>
              `:``}

        </div>

        ${u(b?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${u(b?.settings?.opening_hours).map(e=>`
                      <span>
                        ${r(e.label)}
                        <b>
                          ${r(e.hours)}
                        </b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>

          ${i?`
                <a
                  href="tel:${r(i)}"
                >
                  ${r(i)}
                </a>
              `:``}

          ${b?.settings?.facebook_url?`
                <a
                  href="${r(b.settings.facebook_url)}"
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
            ${r(t)}
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
  `,we(),$()}function Se(e){return`
    <article class="menu-card${e.imageUrl?``:` menu-card--no-photo`}">

      ${e.imageUrl?`
            <div
              class="menu-card-media"
              data-zoom="${r(e.id)}"
              role="button"
              aria-label="Agrandir la photo de ${r(e.name)}"
            >
              <img
                src="${r(e.imageUrl)}"
                alt=""
                loading="lazy"
              >
            </div>
          `:``}

      <div class="menu-card-body">

        <h3>
          ${r(e.name)}
        </h3>

        ${e.description?`
              <p>
                ${r(e.description)}
              </p>
            `:``}

      </div>

      <div class="menu-card-bottom">

        <strong>
          ${R(e.price)}
        </strong>

        <button
          class="add-button"
          data-add="${r(e.id)}"
          type="button"
          aria-label="Ajouter ${r(e.name)}"
        >

          <span>
            +
          </span>

          Ajouter

        </button>

      </div>

    </article>
  `}function Ce(){C&&C.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;C=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{e.classList.toggle(`is-active`,e.dataset.target===t)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>C.observe(e))}function we(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),Ce(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>G(e.dataset.add)}),document.querySelectorAll(`.menu-card-media[data-zoom]`).forEach(e=>{e.onclick=()=>G(e.dataset.zoom)});let e=document.querySelector(`#open-cart`);e&&(e.onclick=J);let t=document.querySelector(`#open-account`);t&&(t.onclick=Oe);let n=document.querySelector(`#close-cart`);n&&(n.onclick=Y);let r=document.querySelector(`#backdrop`);r&&(r.onclick=Y)}function G(e){let t=x.find(t=>t.id===e);if(!t)return;let n=Te(t),i=Ee(t),a=De(t);document.querySelector(`#modal-content`).innerHTML=`

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
            src="${r(t.imageUrl)}"
            alt=""
          >
        `:`
          <div class="product-mark">
            ${r(t.emoji)}
          </div>
        `}

    <p class="eyebrow">
      ${r(t.category)}
    </p>

    <h2>
      ${r(t.name)}
    </h2>

    ${t.description?`
          <p>
            ${r(t.description)}
          </p>
        `:``}

    <div class="form-grid">

      ${n}

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
      Ajouter · ${R(t.price)}
    </button>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`)},document.querySelector(`#confirm-add`).onclick=()=>{let e=Math.max(1,Math.min(20,Number(document.querySelector(`#qty`).value||1))),n={},r=document.querySelector(`#meat-1`)?.value,i=document.querySelector(`#meat-2`)?.value,a=document.querySelector(`#meat-3`)?.value,o=document.querySelector(`#sauce`)?.value,s=document.querySelector(`#drink`)?.value;r&&(n.meat=r),i&&(n.meat2=i),a&&(n.meat3=a),(i||a)&&(n.meats=[r,i,a].filter(Boolean)),o&&(n.sauce=o),s&&(n.drink=s),S=te(S,{...t,quantity:e,options:n}),document.querySelector(`#product-modal`).classList.add(`hidden`),W(),J()}}function K(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function Te(e){if(!e.meat)return``;let t=K(e.options,[`meats`,`meat`,`viandes`,`viande`],ue);return e.tripleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${q(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${q(t)}
        </select>
      </label>

      <label>
        VIANDE 3

        <select id="meat-3">
          ${q(t)}
        </select>
      </label>
    `:e.multipleMeat?`
      <label>
        VIANDE 1

        <select id="meat-1">
          ${q(t)}
        </select>
      </label>

      <label>
        VIANDE 2

        <select id="meat-2">
          ${q(t)}
        </select>
      </label>
    `:`
    <label>
      VIANDE

      <select id="meat-1">
        ${q(t)}
      </select>
    </label>
  `}function Ee(e){return e.sauce?`
    <label>
      SAUCE

      <select id="sauce">
        ${q(K(e.options,[`sauces`,`sauce`],de))}
      </select>
    </label>
  `:``}function De(e){return e.drink?`
    <label>
      BOISSON

      <select id="drink">
        ${q(K(e.options,[`drinks`,`drink`,`boissons`,`boisson`],I))}
      </select>
    </label>
  `:``}function q(e){return e.map(e=>`<option value="${r(e)}">${r(e)}</option>`).join(``)}function J(){document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),$()}function Y(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}async function Oe(){let t=document.querySelector(`#account-overlay`);t||(t=document.createElement(`div`),t.id=`account-overlay`,t.className=`modal`,t.innerHTML=`
      <div class="modal-card order-detail-card" id="account-content"></div>
    `,document.body.appendChild(t),t.onclick=e=>{e.target===t&&t.remove()}),D=``,O=!0,Q();try{let{data:{session:t}}=await e.auth.getSession();t?await X():E=`login`}catch(e){console.error(`[FOODATOI] Erreur ouverture compte:`,e),D=`Impossible de charger ton compte pour le moment.`}O=!1,Q()}async function X(){if(k=await oe(e,b.id),!k){E=`login`;return}let[t,n]=await Promise.all([se(e,k.id),y(e,k.id)]);A=t,j=n;try{if((await ee(e,b.id))?.is_active){let[t,n]=await Promise.all([m(e,b.id),h(e,b.id)]);M=t,N=n.filter(e=>e.is_active)}else M=null,N=[]}catch(e){console.error(`[FOODATOI] Erreur chargement fidélité:`,e),M=null,N=[]}E=`dashboard`}function Z(e){return!!j.find(t=>t.channel===e)?.granted}function Q(){let e=document.querySelector(`#account-content`);if(!e)return;let t=D?`<p class="account-error">${r(D)}</p>`:``;if(O){e.innerHTML=`
      <p class="eyebrow">Mon compte</p>
      <h2>Chargement…</h2>
    `;return}if(E===`dashboard`&&k){e.innerHTML=`
      <button class="modal-close" id="account-close">×</button>

      <p class="eyebrow">Mon compte</p>
      <h2>${r(k.name||`Bonjour`)}</h2>
      <p>${r(k.email||``)}</p>

      ${t}

      <div class="account-section">
        <h3>Mes commandes</h3>
        ${A.length?`<ul class="account-orders">
                ${A.map(e=>`
                      <li>
                        <div>
                          <strong>${r(e.order_number)}</strong>
                          <span>${new Date(e.created_at).toLocaleDateString(`fr-FR`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}</span>
                        </div>
                        <div>
                          ${(e.order_items||[]).map(e=>`${e.quantity}× ${r(e.product_name)}`).join(`, `)}
                        </div>
                        <strong>${R((e.total_cents||0)/100)}</strong>
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
                                <strong>${r(e.name)}</strong>
                                ${e.description?`<span>${r(e.description)}</span>`:``}
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
    `,Ae();return}let n=E===`signup`;e.innerHTML=`
    <button class="modal-close" id="account-close">×</button>

    <p class="eyebrow">Mon compte</p>
    <h2>${n?`Créer un compte`:`Se connecter`}</h2>

    ${t}

    <form id="account-form" class="order-form">
      <label>
        EMAIL
        <input name="email" type="email" required autocomplete="email">
      </label>

      ${n?`
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
        <input name="password" type="password" required autocomplete="${n?`new-password`:`current-password`}" minlength="6">
      </label>

      ${n?`
            <label class="account-toggle">
              <input type="checkbox" name="marketingEmail">
              Je souhaite recevoir des offres par email
            </label>
            <label class="account-toggle">
              <input type="checkbox" name="marketingSms">
              Je souhaite recevoir des offres par SMS
            </label>
            <p class="account-legal">
              Tes données servent uniquement à gérer ton compte et tes commandes chez ${r(z())}. Tu peux les supprimer à tout moment depuis cet espace.
            </p>
          `:``}

      <button class="primary full" type="submit">
        ${n?`Créer mon compte →`:`Se connecter →`}
      </button>
    </form>

    <button class="secondary full" id="account-toggle-mode" type="button">
      ${n?`J’ai déjà un compte`:`Créer un compte`}
    </button>
  `,ke()}function ke(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-toggle-mode`);r&&(r.onclick=()=>{E=E===`signup`?`login`:`signup`,D=``,Q()});let i=document.querySelector(`#account-form`);i&&(i.onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!re(r.email)){D=`Adresse email invalide.`,Q();return}O=!0,D=``,Q();try{if(E===`signup`){if((await ie(e,b.id,r)).pendingConfirmation){O=!1,D=`Compte créé ! Vérifie tes emails pour confirmer ton adresse avant de te connecter.`,E=`login`,Q();return}await X()}else await ae(e,r),await X()}catch(t){console.error(`[FOODATOI] Erreur compte client:`,t),n(e,{restaurantId:b?.id,context:`main.customerAccount`,message:t?.message??String(t),page:`main`}),D=String(t?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(t?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`}O=!1,Q()})}function Ae(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-logout`);r&&(r.onclick=async()=>{await v(e),E=`login`,k=null,A=[],j=[],F=!1,Q()}),document.querySelectorAll(`[data-redeem-reward]`).forEach(t=>{t.onclick=async()=>{if(!P){P=!0,Q();try{await g(e,t.dataset.redeemReward),M=await m(e,b.id),alert(`Récompense échangée ! Montre cet écran en caisse pour en profiter.`)}catch(e){console.error(`[FOODATOI] Erreur échange récompense:`,e),alert(`Impossible d’échanger cette récompense pour le moment.`)}finally{P=!1,Q()}}}}),[`EMAIL`,`SMS`].forEach(t=>{let n=document.querySelector(`#consent-${t.toLowerCase()}`);n&&(n.onchange=async()=>{try{await ce(e,{restaurantId:b.id,customerId:k.id,channel:t,granted:n.checked}),j=await y(e,k.id)}catch(e){console.error(`[FOODATOI] Erreur consentement:`,e),n.checked=!n.checked}})});let i=document.querySelector(`#account-delete`);i&&(i.onclick=()=>{F=!0,Q()});let a=document.querySelector(`#account-delete-cancel`);a&&(a.onclick=()=>{F=!1,Q()});let o=document.querySelector(`#account-delete-confirm`);o&&(o.onclick=async()=>{O=!0,Q();try{await le(e),E=`login`,k=null,A=[],j=[],F=!1,D=`Ton compte et tes données ont été supprimés.`}catch(t){console.error(`[FOODATOI] Erreur suppression compte:`,t),n(e,{restaurantId:b?.id,context:`main.deleteAccount`,message:t?.message??String(t),page:`main`}),D=`Impossible de supprimer le compte pour le moment.`,F=!1}O=!1,Q()})}function $(){let e=document.querySelector(`#cart-content`);if(!e)return;if(!S.length){e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=Y;return}e.innerHTML=`
    <div class="ticket-paper">

      <div class="ticket-header">

        <span>
          ${r(z())}
        </span>

        <span>
          COMMANDE
        </span>

      </div>

      <div class="ticket-items">

        ${S.map((e,t)=>je(e,t)).join(``)}

      </div>

      <div class="ticket-total">

        <span>
          TOTAL
        </span>

        <strong>
          ${R(_(S))}
        </strong>

      </div>

      <div class="ticket-note">

        <strong>
          RETRAIT SUR PLACE
        </strong>

        ${V()?`
              <span>
                ${r(V())}
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

      ${b?.settings?.delivery_mode===`internal`?`
            <div class="fulfillment-toggle">

              <label>
                <input
                  type="radio"
                  name="fulfillmentType"
                  value="PICKUP"
                  checked
                >
                Retrait sur place
              </label>

              <label>
                <input
                  type="radio"
                  name="fulfillmentType"
                  value="DELIVERY"
                >
                Livraison
              </label>

            </div>

            <div
              id="delivery-address-fields"
              class="delivery-address-fields"
              hidden
            >

              <label>
                ADRESSE

                <input
                  name="deliveryStreet"
                  placeholder="12 rue des Fleurs"
                  autocomplete="street-address"
                >
              </label>

              <label>
                CODE POSTAL

                <input
                  name="deliveryPostalCode"
                  placeholder="31000"
                  inputmode="numeric"
                  autocomplete="postal-code"
                >
              </label>

              <label>
                VILLE

                <input
                  name="deliveryCity"
                  placeholder="Toulouse"
                  autocomplete="address-level2"
                >
              </label>

              <label>
                COMPLÉMENT (bâtiment, étage, code portail...)

                <input
                  name="deliveryComplement"
                  placeholder="Facultatif"
                >
              </label>

            </div>
          `:``}

      <label id="pickup-date-label">
        <span>JOUR DE RETRAIT</span>

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
        ${w?`Commande transmise directement à l’espace ${r(z())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
      </small>

    </form>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{S.splice(Number(e.dataset.remove),1),$()}});let t=e.querySelector(`#order-form`);if(t){let n=t.querySelector(`#pickup-date`),i=t.querySelector(`#pickup-time`),a=e.querySelector(`#hours-banner`),s=t.querySelector(`#submit-order`),c=t.querySelectorAll(`input[name="fulfillmentType"]`),l=e.querySelector(`#delivery-address-fields`),u=t.querySelector(`#pickup-date-label span`);function d(){if(!c.length)return;let e=t.querySelector(`input[name="fulfillmentType"]:checked`)?.value===`DELIVERY`;l&&(l.hidden=!e,l.querySelectorAll(`input`).forEach(t=>{t.required=e&&t.name!==`deliveryComplement`})),u&&(u.textContent=e?`JOUR DE LIVRAISON`:`JOUR DE RETRAIT`)}c.forEach(e=>{e.onchange=d}),d();let p=new Date().toLocaleDateString(`en-CA`),m=new Date(Date.now()+5184e6).toLocaleDateString(`en-CA`);n.min=p,n.max=m,n.value=p;function h(){let e=f(i.value,n.value);return e?new Date(e):null}function g(){let e=h(),t=e&&o(b?.settings?.opening_hours,e);s.disabled=!t,a.innerHTML=t?``:`
          <div class="closed-banner">
            <p class="eyebrow">FERMÉ À CE CRÉNEAU</p>
            <p>
              ${r(z())}
              n'accepte pas de commande à l'horaire choisi.
              Choisis un autre jour ou une autre heure.
            </p>
          </div>
        `}n.onchange=g,i.onchange=g,g(),t.onsubmit=async e=>{e.preventDefault();let t=h();if(!t||!o(b?.settings?.opening_hours,t)){g();return}let n=Object.fromEntries(new FormData(e.currentTarget)),r=ne(S,n);r.notes=String(n.specialInstructions||``).trim()||null,T||=crypto.randomUUID(),r.idempotencyKey=T,await Ne(r)}}}function je(e,t){let n=Me(e.options);return`
    <div class="ticket-item">

      <div>

        <strong>
          ${e.quantity} ×
          ${r(e.name)}
        </strong>

        ${n?`
              <span>
                ${r(n)}
              </span>
            `:``}

      </div>

      <b>
        ${R(e.price*e.quantity)}
      </b>

      <button
        data-remove="${t}"
        type="button"
        aria-label="Supprimer"
      >
        ×
      </button>

    </div>
  `}function Me(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),t.join(` · `)}async function Ne(t){try{let e,n={...t,restaurant_id:b?.id||null,restaurantId:b?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(w)e=await w.createOrder(n);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=i(t,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}S=[],T=null,Pe(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),n(e,{restaurantId:b?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:String(t?.message||``).includes(`RATE_LIMITED`)?`Trop de commandes envoyées récemment avec ce numéro. Réessaie dans quelques minutes.`:`Impossible d’envoyer la commande pour le moment.`)}}function Pe(e){let t=a(e);Y(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        COMMANDE ENREGISTRÉE
      </p>

      <h2>
        ${r(t.number)}
      </h2>

      <p>
        Ton ticket est parti chez
        <strong>
          ${r(z())}
        </strong>.

        Retrait souhaité à
        <strong>
          ${r(t.pickup)}
        </strong>.
      </p>

      <div class="ticket-paper compact">

        <div class="ticket-items">

          ${t.items.map(e=>`
                <div class="ticket-item">

                  <div>

                    <strong>
                      ${e.quantity} ×
                      ${r(e.name)}
                    </strong>

                    <span>
                      ${r(e.options||``)}
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
            ${r(t.totalLabel)}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),W()}}async function Fe(){try{p(),xe(),await me(),await ve(),W()}catch(e){if(!s()&&!d()){window.location.replace(`/pro.html`);return}U(e)}}Fe();