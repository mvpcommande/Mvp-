import{i as e,n as t,r as n,t as r}from"./styles-B9gh7Y49.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{d as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d,u as f}from"./restaurantResolver-9IOtyM5e.js";import{t as p}from"./analytics-1YGI5PQu.js";import{a as m,i as h,o as g,r as _}from"./loyalty-Bi6_Ljfe.js";function ee(e,t){return[...e,{...t,quantity:t.quantity??1}]}function v(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function y(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:t?.fulfillmentType===`DELIVERY`?`DELIVERY`:`PICKUP`,status:`NEW`,items:e,customer:t,total:v(e),createdAt:new Date().toISOString()}}function te(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}async function ne(e,t,{email:n,password:r,name:i,phone:a,marketingEmail:o,marketingSms:s}){let{data:c,error:l}=await e.auth.signUp({email:String(n).trim(),password:r});if(l)throw l;let u=c?.user?.id;if(!c?.session)return{pendingConfirmation:!0};let{data:d,error:f}=await e.from(`customers`).insert({restaurant_id:t,auth_user_id:u,name:String(i||``).trim()||null,phone:String(a||``).trim()||null,email:String(n).trim()}).select().single();if(f)throw f;let p=[{channel:`EMAIL`,granted:!!o},{channel:`SMS`,granted:!!s}].map(e=>({restaurant_id:t,customer_id:d.id,channel:e.channel,granted:e.granted,source:`signup`,granted_at:e.granted?new Date().toISOString():null})),{error:m}=await e.from(`marketing_consents`).insert(p);if(m)throw m;return{pendingConfirmation:!1,customer:d}}async function re(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function ie(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function ae(e,t){let{data:{user:n}}=await e.auth.getUser();if(!n)return null;let{data:r,error:i}=await e.from(`customers`).select(`*`).eq(`auth_user_id`,n.id).eq(`restaurant_id`,t).maybeSingle();if(i)throw i;return r}async function oe(e,t){let{data:n,error:r}=await e.from(`orders`).select(`id, order_number, status, total_cents, pickup_time, created_at, order_items(product_name, quantity, line_total_cents)`).eq(`customer_id`,t).order(`created_at`,{ascending:!1}).limit(50);if(r)throw r;return n??[]}async function se(e,t){let{data:n,error:r}=await e.from(`marketing_consents`).select(`channel, granted`).eq(`customer_id`,t);if(r)throw r;return n??[]}async function ce(e,{restaurantId:t,customerId:n,channel:r,granted:i}){let{error:a}=await e.from(`marketing_consents`).upsert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`,granted_at:i?new Date().toISOString():null,withdrawn_at:i?null:new Date().toISOString()},{onConflict:`restaurant_id,customer_id,channel`});if(a)throw a;let{error:o}=await e.from(`marketing_consent_events`).insert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`});if(o)throw o}async function le(e){let{error:t}=await e.rpc(`delete_customer_account`);if(t)throw t;await ie(e)}var b=null;t(e,{page:`client`,getRestaurantId:()=>b?.id??null});var x=[],S=[],C=null,w=null,T=`foodatoi-checkout-idempotency-key`;function ue(){try{return sessionStorage.getItem(T)||null}catch{return null}}function de(e){try{e?sessionStorage.setItem(T,e):sessionStorage.removeItem(T)}catch{}}var E=ue(),D=!1,O=`takeaway`,k=`review`,A=`login`,j=``,M=!1,N=null,P=[],F=[],I=null,L=[],R=!1,z=!1,fe=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],pe=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],me=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],B=document.querySelector(`#root`),V={info:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/></svg>`,account:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>`,cart:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,arrow:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>`,chevronLeft:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="15 6 9 12 15 18"/></svg>`};function he(){return!!window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches}var H=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,ge=()=>S.reduce((e,t)=>e+Number(t.quantity??0),0);function _e(){return o(b?.settings?.opening_hours,new Date)}function ve(){let e=b?.settings||{},t=Number(e.pickup_eta_min),n=Number(e.pickup_eta_max);if(Number.isFinite(t)&&Number.isFinite(n)&&t>0&&n>=t)return{type:`range`,min:t,max:n};let r=Number(e.pickup_eta_minutes);return Number.isFinite(r)&&r>0?{type:`single`,minutes:r}:null}function ye(){let e=ve();return e?e.type===`range`?`Retrait ${e.min}–${e.max} min`:`Retrait ~${e.minutes} min`:null}function be(){let e=ve();if(!e)return null;if(e.type===`range`)return`Retrait estimé : ${e.min}–${e.max} min`;let t=new Date(Date.now()+e.minutes*60*1e3);return`Retrait estimé vers ${new Intl.DateTimeFormat(`fr-FR`,{timeZone:`Europe/Paris`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).format(t)}`}function xe(e){let t=e.options||{};return!!(t.popular||t.is_popular||t.bestseller||t.is_bestseller||t.badge===`populaire`||t.badge===`popular`)}function Se(e){let t=e.options||{};return!!(t.new||t.is_new||t.badge===`nouveau`||t.badge===`new`)}function Ce(e){return!!(e.meat||e.sauce||e.drink||Array.isArray(e.options?.groups)&&e.options.groups.length)}function we(){return x.filter(xe).slice(0,4)}function U(){return b?.name||`FOODATOI`}var Te=new Set([`le`,`la`,`les`,`l`,`un`,`une`,`des`,`du`,`de`,`d`,`et`]);function Ee(e){let t=String(e||``).trim().split(/\s+/).filter(Boolean);if(!t.length)return``;let n=t.filter(e=>!Te.has(e.toLowerCase().replace(/['’]/g,``)));return(n.length?n:t).slice(0,2).map(e=>e.charAt(0)).join(``).toUpperCase()}function De(){return b?.phone||``}function Oe(){let e=b?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function ke(){return b?.primary_color||`#111111`}async function Ae(){return b=await l(e),console.info(`[FOODATOI] Restaurant résolu:`,b),je(),w=c(e,b.id),b}function je(){b&&(document.documentElement.style.setProperty(`--restaurant-primary`,ke()),document.title=`${U()} · FOODATOI`)}function Me(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function Ne(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:Me(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat),createdAt:e.created_at||null}}async function Pe(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!b?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,b.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return x=(t??[]).filter(e=>e.restaurant_id===b.id).map(Ne),console.info(`[FOODATOI] ${x.length} produit(s) chargé(s) pour ${U()}.`),x}function Fe(){return[`Tous`,...new Set(x.map(e=>e.category).filter(Boolean))]}function Ie(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function Le(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:Ie(e),items:n.get(e)}))}function Re(){B.innerHTML=`
    <div class="app-frame client-app">

      <main>

        <section class="oi-state-screen">
          <div class="oi-state-spinner" aria-hidden="true"></div>
          <p class="eyebrow">FOODATOI</p>
          <h1>Chargement du restaurant…</h1>
          <p class="oi-state-lede">Nous préparons la carte.</p>
        </section>

      </main>

    </div>
  `}function ze(t){console.error(`[FOODATOI] Erreur application:`,t),n(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),B.innerHTML=`
    <div class="app-frame client-app">

      <main>

        <section class="oi-state-screen">
          <p class="eyebrow">FOODATOI</p>
          <h1>Restaurant indisponible</h1>
          <p class="oi-state-lede">La configuration de ce restaurant n'est pas encore disponible.</p>
          <p class="oi-state-hint">Vérifie l'URL ou réessaie plus tard.</p>
        </section>

      </main>

    </div>
  `}function W(){let e=Fe(),t=U(),n=Oe(),i=De(),a=_e(),o=we(),s=ge(),c=v(S),l=Ee(t),d=ye();B.innerHTML=`
    <div class="app-frame client-app">

      <header class="oi-header">

        <div class="oi-header-row">

          <div class="brand-lockup">

            ${b?.logo_url?`<img class="brand-mark-image" src="${r(b.logo_url)}" alt="${r(t)}">`:l?`<span class="brand-mark">${r(l)}</span>`:``}

            <div class="oi-brand-meta">
              <strong>${r(t)}</strong>
              <div class="oi-status-line">
                <span class="oi-status-badge ${a?`is-open`:`is-closed`}">
                  <span class="oi-status-dot"></span>
                  ${a?`Ouvert`:`Fermé`}
                </span>
                ${d?`<span class="oi-eta">${r(d)}</span>`:``}
              </div>
            </div>

          </div>

          <div class="masthead-actions">

            <button class="icon-btn" id="open-info" type="button" aria-label="Informations du restaurant">
              ${V.info}
            </button>

            <button class="icon-btn" id="open-account" type="button" aria-label="Mon compte">
              ${V.account}
            </button>

            <button class="icon-btn oi-cart-btn" id="open-cart" type="button" aria-label="Panier, ${s} article${s>1?`s`:``}">
              ${V.cart}
              <b class="oi-cart-badge${s?``:` hidden`}" id="cart-badge">${s}</b>
            </button>

          </div>

        </div>

        <h2 class="oi-tagline">Choisis. <em>On prépare.</em></h2>

      </header>

      <main>

        <section class="oi-mode-section" aria-label="Mode de commande">
          <p class="oi-mode-label">Comment souhaitez-vous commander ?</p>
          <div class="oi-segmented" role="group" aria-label="Mode de commande">
            <button type="button" class="oi-segmented-btn${O===`takeaway`?` is-active`:``}" data-order-mode="takeaway" aria-pressed="${O===`takeaway`}">
              À emporter
            </button>
            <button type="button" class="oi-segmented-btn${O===`onsite`?` is-active`:``}" data-order-mode="onsite" aria-pressed="${O===`onsite`}">
              Sur place
            </button>
          </div>
        </section>

        ${a?``:`
              <div class="closed-banner oi-closed-banner">
                <p class="eyebrow">Fermé actuellement</p>
                <p>
                  ${r(t)} n'accepte pas de commande immédiate en ce moment.
                  Tu peux composer ton panier et choisir un créneau ultérieur au moment de valider.
                </p>
              </div>
            `}

        ${b?.settings?.delivery_mode===`redirect`&&b?.settings?.delivery_redirect_url?`
              <section class="delivery-banner oi-delivery-banner">
                <div>
                  <p class="eyebrow">Livraison à domicile</p>
                  <p>${r(t)} livre aussi à domicile via Uber Eats.</p>
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

        ${e.length>1?`
              <nav class="category-rail oi-cat-rail" aria-label="Catégories">
                ${e.map(e=>`
                      <button
                        class="category oi-chip"
                        data-category="${r(e)}"
                        data-target="${e===`Tous`?`top`:r(Ie(e))}"
                        type="button"
                      >
                        ${r(e)}
                      </button>
                    `).join(``)}
              </nav>
            `:``}

        <section class="oi-menu">

          ${o.length?`
                <section class="oi-section" id="oi-bestsellers">
                  <div class="oi-section-head">
                    <h2>Les plus commandés</h2>
                  </div>
                  <div class="oi-card-list">
                    ${o.map(Be).join(``)}
                  </div>
                </section>
              `:``}

          ${x.length?Le(x).map(e=>`
                      <section class="menu-category-section oi-section" id="menu-cat-${e.slug}">
                        <div class="oi-section-head">
                          <h2>${r(e.category)}</h2>
                        </div>
                        <div class="oi-card-list">
                          ${e.items.map(Be).join(``)}
                        </div>
                      </section>
                    `).join(``):`
                <div class="empty-ticket">
                  <div class="empty-ticket-mark">+</div>
                  <h3>Carte en préparation.</h3>
                  <p>Ce restaurant n'a pas encore publié de produits.</p>
                </div>
              `}

        </section>

      </main>

      <footer class="site-footer">

        <div>
          <strong>${r(t)}</strong>
          ${n?`<span>${r(n)}</span>`:``}
        </div>

        ${u(b?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${u(b?.settings?.opening_hours).map(e=>`
                      <span>
                        ${r(e.label)}
                        <b>${r(e.hours)}</b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>
          ${i?`<a href="tel:${r(i)}">${r(i)}</a>`:``}
          ${b?.settings?.facebook_url?`
                <a href="${r(b.settings.facebook_url)}" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              `:``}
          <a href="/legal.html">Mentions légales</a>
        </div>

      </footer>

    </div>

    <div class="oi-sticky-cart${S.length?``:` hidden`}" id="sticky-cart-bar">
      <button type="button" id="sticky-cart-btn" class="oi-sticky-cart-btn">
        <span class="oi-sticky-cart-info">
          <span class="oi-sticky-cart-count">${s} article${s>1?`s`:``}</span>
          <span class="oi-sticky-cart-total">${H(c)}</span>
        </span>
        <span class="oi-sticky-cart-cta">Voir le panier ${V.arrow}</span>
      </button>
    </div>

    <div class="drawer-backdrop hidden" id="backdrop"></div>

    <aside class="drawer" id="drawer" aria-label="Panier">

      <div class="drawer-head">
        <div>
          <p class="eyebrow">${r(t)}</p>
          <h2 id="drawer-title">Votre commande</h2>
        </div>
        <button id="close-cart" class="icon-btn" type="button" aria-label="Fermer">×</button>
      </div>

      <div id="cart-steps"></div>

      <div id="cart-content"></div>

    </aside>

    <div class="modal hidden" id="product-modal">
      <div class="modal-card" id="modal-content"></div>
    </div>
  `,Ue(),$()}function Be(e){let t=[];return xe(e)&&t.push(`<span class="oi-badge oi-badge--acid">Populaire</span>`),Se(e)&&t.push(`<span class="oi-badge oi-badge--ink">Nouveau</span>`),`
    <article class="oi-card${e.imageUrl?``:` oi-card--no-photo`}">

      <button
        type="button"
        class="oi-card-main"
        data-open="${r(e.id)}"
        aria-label="Voir ${r(e.name)}"
      >

        <span class="oi-card-text">

          ${t.length?`<span class="oi-card-badges">${t.join(``)}</span>`:``}

          <span class="oi-card-name">${r(e.name)}</span>

          ${e.description?`<span class="oi-card-desc">${r(e.description)}</span>`:``}

          <span class="oi-card-price">${H(e.price)}</span>

        </span>

        ${e.imageUrl?`
              <span class="oi-card-media">
                <img src="${r(e.imageUrl)}" alt="" loading="lazy" width="84" height="84">
              </span>
            `:``}

      </button>

      <button
        class="oi-add-btn"
        data-add="${r(e.id)}"
        type="button"
        aria-label="Ajouter ${r(e.name)}"
      >
        <span aria-hidden="true">+</span>
      </button>

    </article>
  `}function Ve(){document.querySelectorAll(`.oi-card-media img, .product-photo`).forEach(e=>{e.onerror=()=>{let t=e.closest(`.oi-card-media`),n=e.closest(`.oi-card`);if(t){t.remove(),n?.classList.add(`oi-card--no-photo`);return}e.remove()}})}function He(){C&&C.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;C=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{let n=e.dataset.target===t;e.classList.toggle(`is-active`,n),n?(e.setAttribute(`aria-current`,`true`),e.scrollIntoView({behavior:he()?`auto`:`smooth`,inline:`center`,block:`nearest`})):e.removeAttribute(`aria-current`)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>C.observe(e))}function Ue(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),He(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>qe(e.dataset.add)}),document.querySelectorAll(`[data-open]`).forEach(e=>{e.onclick=()=>G(e.dataset.open)}),Ve(),document.querySelectorAll(`[data-order-mode]`).forEach(e=>{e.onclick=()=>{O=e.dataset.orderMode,document.querySelectorAll(`[data-order-mode]`).forEach(e=>{let t=e.dataset.orderMode===O;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-pressed`,String(t))})}});let e=document.querySelector(`#open-cart`);e&&(e.onclick=J);let t=document.querySelector(`#sticky-cart-btn`);t&&(t.onclick=J);let n=document.querySelector(`#open-account`);n&&(n.onclick=Ye);let r=document.querySelector(`#open-info`);r&&(r.onclick=Je);let i=document.querySelector(`#close-cart`);i&&(i.onclick=X);let a=document.querySelector(`#backdrop`);a&&(a.onclick=X)}function G(e,t=null){let n=x.find(t=>t.id===e);if(!n)return;let i=t===null?null:S[t],a=i?.options||{},o=We(n,a),s=Ge(n,a),c=Ke(n,a),l=Array.isArray(n.options?.groups)?n.options.groups:[],u=Array.isArray(a.groups)?a.groups:[],d=l.map((e,t)=>{let n=e.label||`Choix`,r=(e.min??1)>=1,i=u.find(e=>e.label===n)?.choice??null;return q({name:`grp-${t}`,label:n,options:(e.items||[]).map(String),selected:i,required:r,groupLabel:n})}).join(``),f=Math.max(1,Math.min(20,Number(i?.quantity??1))),p=()=>`${t===null?`Ajouter au panier`:`Enregistrer`} · ${H(n.price*f)}`;document.querySelector(`#modal-content`).innerHTML=`

    <button class="modal-close" id="modal-close" type="button" aria-label="Fermer">×</button>

    <div class="oi-sheet-scroll">

      ${n.imageUrl?`<img class="product-photo" src="${r(n.imageUrl)}" alt="">`:``}

      <p class="eyebrow">${r(n.category)}</p>

      <h2>${r(n.name)}</h2>

      ${n.description?`<p class="oi-sheet-desc">${r(n.description)}</p>`:``}

      <p class="oi-sheet-price">${H(n.price)}</p>

      <div class="oi-sheet-fields">

        ${d}

        ${o}

        ${s}

        ${c}

        <div class="oi-field">
          <p class="oi-field-label">Quantité</p>
          <div class="oi-stepper">
            <button type="button" class="oi-stepper-btn" id="qty-minus" aria-label="Diminuer la quantité">−</button>
            <span class="oi-stepper-value" id="qty-value" aria-live="polite">${f}</span>
            <button type="button" class="oi-stepper-btn" id="qty-plus" aria-label="Augmenter la quantité">+</button>
          </div>
        </div>

      </div>

    </div>

    <div class="oi-sheet-cta">
      <button class="primary full" id="confirm-add" type="button">
        ${p()}
      </button>
    </div>
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#product-modal`).classList.add(`oi-sheet`),Ve();let m=document.querySelector(`#confirm-add`);function h(){m.textContent=p()}document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`)};let g=document.querySelector(`#qty-value`),_=document.querySelector(`#qty-minus`),v=document.querySelector(`#qty-plus`);function y(){_.disabled=f<=1,v.disabled=f>=20}_.onclick=()=>{f=Math.max(1,f-1),g.textContent=String(f),y(),h()},v.onclick=()=>{f=Math.min(20,f+1),g.textContent=String(f),y(),h()},y(),document.querySelectorAll(`#product-modal input[type="radio"]`).forEach(e=>{e.onchange=h}),m.onclick=()=>{let e={},r=document.querySelector(`input[name="meat-1"]:checked`)?.value,i=document.querySelector(`input[name="meat-2"]:checked`)?.value,a=document.querySelector(`input[name="meat-3"]:checked`)?.value,o=document.querySelector(`input[name="sauce"]:checked`)?.value,s=document.querySelector(`input[name="drink"]:checked`)?.value;r&&(e.meat=r),i&&(e.meat2=i),a&&(e.meat3=a),(i||a)&&(e.meats=[r,i,a].filter(Boolean)),o&&(e.sauce=o),s&&(e.drink=s);let c=null,u=[];if(l.forEach((e,t)=>{let n=e.label||`Choix`,r=(e.min??1)>=1,i=document.querySelector(`input[name="grp-${t}"]:checked`)?.value;r&&!i&&!c&&(c=n),i&&u.push({label:n,choice:i})}),c){alert(`Merci de choisir : `+c);return}if(u.length&&(e.groups=u),t!==null){S=S.map((r,i)=>i===t?{...n,quantity:f,options:e}:r),document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`),$(),Y();return}S=ee(S,{...n,quantity:f,options:e}),document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`),W(),J()}}function K(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function q({name:e,label:t,options:n,selected:i=null,required:a=!1}){return n.length?`
    <div class="oi-field">
      <p class="oi-field-label">
        ${r(t)}
        ${a?`<span class="oi-field-required">Choix requis</span>`:``}
      </p>
      <div class="oi-pill-group" role="radiogroup" aria-label="${r(t)}">
        ${n.map((t,n)=>{let o=String(t),s=i==null?!a&&n===0:o===i;return`
              <label class="oi-pill">
                <input type="radio" name="${r(e)}" value="${r(o)}"${s?` checked`:``}>
                <span>${r(o)}</span>
              </label>
            `}).join(``)}
      </div>
    </div>
  `:``}function We(e,t={}){if(!e.meat)return``;let n=K(e.options,[`meats`,`meat`,`viandes`,`viande`],fe);return e.tripleMeat?[q({name:`meat-1`,label:`Viande 1`,options:n,selected:t.meat??null}),q({name:`meat-2`,label:`Viande 2`,options:n,selected:t.meat2??null}),q({name:`meat-3`,label:`Viande 3`,options:n,selected:t.meat3??null})].join(``):e.multipleMeat?[q({name:`meat-1`,label:`Viande 1`,options:n,selected:t.meat??null}),q({name:`meat-2`,label:`Viande 2`,options:n,selected:t.meat2??null})].join(``):q({name:`meat-1`,label:`Viande`,options:n,selected:t.meat??null})}function Ge(e,t={}){return e.sauce?q({name:`sauce`,label:`Sauce`,options:K(e.options,[`sauces`,`sauce`],pe),selected:t.sauce??null}):``}function Ke(e,t={}){return e.drink?q({name:`drink`,label:`Boisson`,options:K(e.options,[`drinks`,`drink`,`boissons`,`boisson`],me),selected:t.drink??null}):``}function J(){k=`review`,document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),$()}function qe(e){let t=x.find(t=>t.id===e);if(t){if(!Ce(t)){S=ee(S,{...t,quantity:1,options:{}}),W();return}G(e)}}function Y(){let e=ge(),t=document.querySelector(`#cart-badge`);t&&(t.textContent=String(e),t.classList.toggle(`hidden`,e===0));let n=document.querySelector(`#open-cart`);n&&n.setAttribute(`aria-label`,`Panier, ${e} article${e>1?`s`:``}`);let r=document.querySelector(`#sticky-cart-bar`);if(r){r.classList.toggle(`hidden`,S.length===0);let t=r.querySelector(`.oi-sticky-cart-count`),n=r.querySelector(`.oi-sticky-cart-total`);t&&(t.textContent=`${e} article${e>1?`s`:``}`),n&&(n.textContent=H(v(S)))}}function X(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function Je(){let e=U(),t=Oe(),n=De(),i=u(b?.settings?.opening_hours),a=_e(),o=document.querySelector(`#info-overlay`);o||(o=document.createElement(`div`),o.id=`info-overlay`,o.className=`modal`,document.body.appendChild(o),o.onclick=e=>{e.target===o&&o.remove()}),o.innerHTML=`
    <div class="modal-card" id="info-content">

      <button class="modal-close" id="info-close" type="button" aria-label="Fermer">×</button>

      <p class="eyebrow">Informations</p>
      <h2>${r(e)}</h2>

      <p class="oi-info-status">
        <span class="oi-status-badge ${a?`is-open`:`is-closed`}">
          <span class="oi-status-dot"></span>
          ${a?`Ouvert actuellement`:`Fermé actuellement`}
        </span>
      </p>

      ${t?`<p class="oi-info-row">${r(t)}</p>`:``}

      ${n?`<p class="oi-info-row"><a href="tel:${r(n)}">${r(n)}</a></p>`:``}

      ${i.length?`
            <div class="footer-hours oi-info-hours">
              ${i.map(e=>`
                    <span>
                      ${r(e.label)}
                      <b>${r(e.hours)}</b>
                    </span>
                  `).join(``)}
            </div>
          `:``}

      ${b?.settings?.delivery_mode===`redirect`&&b?.settings?.delivery_redirect_url?`
            <a
              class="secondary full oi-info-delivery"
              href="${r(b.settings.delivery_redirect_url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Livraison via Uber Eats →
            </a>
          `:``}

    </div>
  `,o.querySelector(`#info-close`).onclick=()=>{o.remove()}}async function Ye(){let t=document.querySelector(`#account-overlay`);t||(t=document.createElement(`div`),t.id=`account-overlay`,t.className=`modal`,t.innerHTML=`
      <div class="modal-card order-detail-card" id="account-content"></div>
    `,document.body.appendChild(t),t.onclick=e=>{e.target===t&&t.remove()}),j=``,M=!0,Q();try{let{data:{session:t}}=await e.auth.getSession();t?await Z():A=`login`}catch(e){console.error(`[FOODATOI] Erreur ouverture compte:`,e),j=`Impossible de charger ton compte pour le moment.`}M=!1,Q()}async function Z(){if(N=await ae(e,b.id),!N){A=`login`;return}let[t,n]=await Promise.all([oe(e,N.id),se(e,N.id)]);P=t,F=n;try{if((await _(e,b.id))?.is_active){let[t,n]=await Promise.all([m(e,b.id),h(e,b.id)]);I=t,L=n.filter(e=>e.is_active)}else I=null,L=[]}catch(e){console.error(`[FOODATOI] Erreur chargement fidélité:`,e),I=null,L=[]}A=`dashboard`}function Xe(e){return!!F.find(t=>t.channel===e)?.granted}function Q(){let e=document.querySelector(`#account-content`);if(!e)return;let t=j?`<p class="account-error">${r(j)}</p>`:``;if(M){e.innerHTML=`
      <p class="eyebrow">Mon compte</p>
      <h2>Chargement…</h2>
    `;return}if(A===`dashboard`&&N){e.innerHTML=`
      <button class="modal-close" id="account-close">×</button>

      <p class="eyebrow">Mon compte</p>
      <h2>${r(N.name||`Bonjour`)}</h2>
      <p>${r(N.email||``)}</p>

      ${t}

      <div class="account-section">
        <h3>Mes commandes</h3>
        ${P.length?`<ul class="account-orders">
                ${P.map(e=>`
                      <li>
                        <div>
                          <strong>${r(e.order_number)}</strong>
                          <span>${new Date(e.created_at).toLocaleDateString(`fr-FR`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}</span>
                        </div>
                        <div>
                          ${(e.order_items||[]).map(e=>`${e.quantity}× ${r(e.product_name)}`).join(`, `)}
                        </div>
                        <strong>${H((e.total_cents||0)/100)}</strong>
                      </li>
                    `).join(``)}
              </ul>`:`<p class="muted">Aucune commande pour le moment.</p>`}
      </div>

      ${I||L.length?`
            <div class="account-section">
              <h3>Ma fidélité</h3>
              <p class="loyalty-balance">${I?.balance_points??0} points</p>
              ${L.length?`<ul class="account-orders loyalty-rewards">
                      ${L.map(e=>`
                            <li>
                              <div>
                                <strong>${r(e.name)}</strong>
                                ${e.description?`<span>${r(e.description)}</span>`:``}
                              </div>
                              <button
                                class="secondary small"
                                data-redeem-reward="${e.id}"
                                type="button"
                                ${(I?.balance_points??0)<e.cost_points||R?`disabled`:``}
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
          <input type="checkbox" id="consent-email" ${Xe(`EMAIL`)?`checked`:``}>
          Recevoir des offres par email
        </label>
        <label class="account-toggle">
          <input type="checkbox" id="consent-sms" ${Xe(`SMS`)?`checked`:``}>
          Recevoir des offres par SMS
        </label>
      </div>

      <div class="account-section">
        <button class="secondary full" id="account-logout" type="button">
          Se déconnecter
        </button>

        ${z?`
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
    `,Qe();return}let n=A===`signup`;e.innerHTML=`
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
              Tes données servent uniquement à gérer ton compte et tes commandes chez ${r(U())}. Tu peux les supprimer à tout moment depuis cet espace.
            </p>
          `:``}

      <button class="primary full" type="submit">
        ${n?`Créer mon compte →`:`Se connecter →`}
      </button>
    </form>

    <button class="secondary full" id="account-toggle-mode" type="button">
      ${n?`J’ai déjà un compte`:`Créer un compte`}
    </button>
  `,Ze()}function Ze(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-toggle-mode`);r&&(r.onclick=()=>{A=A===`signup`?`login`:`signup`,j=``,Q()});let i=document.querySelector(`#account-form`);i&&(i.onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!te(r.email)){j=`Adresse email invalide.`,Q();return}M=!0,j=``,Q();try{if(A===`signup`){if((await ne(e,b.id,r)).pendingConfirmation){M=!1,j=`Compte créé ! Vérifie tes emails pour confirmer ton adresse avant de te connecter.`,A=`login`,Q();return}await Z()}else await re(e,r),await Z()}catch(t){console.error(`[FOODATOI] Erreur compte client:`,t),n(e,{restaurantId:b?.id,context:`main.customerAccount`,message:t?.message??String(t),page:`main`}),j=String(t?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(t?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`}M=!1,Q()})}function Qe(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-logout`);r&&(r.onclick=async()=>{await ie(e),A=`login`,N=null,P=[],F=[],z=!1,Q()}),document.querySelectorAll(`[data-redeem-reward]`).forEach(t=>{t.onclick=async()=>{if(!R){R=!0,Q();try{await g(e,t.dataset.redeemReward),I=await m(e,b.id),alert(`Récompense échangée ! Montre cet écran en caisse pour en profiter.`)}catch(e){console.error(`[FOODATOI] Erreur échange récompense:`,e),alert(`Impossible d’échanger cette récompense pour le moment.`)}finally{R=!1,Q()}}}}),[`EMAIL`,`SMS`].forEach(t=>{let n=document.querySelector(`#consent-${t.toLowerCase()}`);n&&(n.onchange=async()=>{try{await ce(e,{restaurantId:b.id,customerId:N.id,channel:t,granted:n.checked}),F=await se(e,N.id)}catch(e){console.error(`[FOODATOI] Erreur consentement:`,e),n.checked=!n.checked}})});let i=document.querySelector(`#account-delete`);i&&(i.onclick=()=>{z=!0,Q()});let a=document.querySelector(`#account-delete-cancel`);a&&(a.onclick=()=>{z=!1,Q()});let o=document.querySelector(`#account-delete-confirm`);o&&(o.onclick=async()=>{M=!0,Q();try{await le(e),A=`login`,N=null,P=[],F=[],z=!1,j=`Ton compte et tes données ont été supprimés.`}catch(t){console.error(`[FOODATOI] Erreur suppression compte:`,t),n(e,{restaurantId:b?.id,context:`main.deleteAccount`,message:t?.message??String(t),page:`main`}),j=`Impossible de supprimer le compte pour le moment.`,z=!1}M=!1,Q()})}function $e(){let e=document.querySelector(`#cart-steps`);if(!e)return;if(!S.length){e.innerHTML=``;return}let t=k===`details`;e.innerHTML=`
    <ol class="oi-steps" role="list">
      <li class="oi-step${t?` is-done`:` is-active`}"${t?``:` aria-current="step"`}>
        <span class="oi-step-num">${t?`✓`:`1`}</span>
        Panier
      </li>
      <li class="oi-step${t?` is-active`:``}"${t?` aria-current="step"`:``}>
        <span class="oi-step-num">2</span>
        Coordonnées
      </li>
    </ol>
  `}function $(){let e=document.querySelector(`#cart-content`);if(e){if($e(),!S.length){k=`review`,e.innerHTML=`
      <div class="empty-ticket">

        <div class="empty-ticket-mark">
          +
        </div>

        <h3>
          Ton panier est vide.
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
    `,e.querySelector(`#back-menu`).onclick=X;return}if(k===`details`){tt(e);return}et(e)}}function et(e){let t=v(S),n=be();e.innerHTML=`
    <p class="eyebrow oi-review-eyebrow">Ta commande</p>

    <div class="oi-cart-items">
      ${S.map((e,t)=>nt(e,t)).join(``)}
    </div>

    <div class="oi-cart-totals">
      <div class="oi-cart-total-row">
        <span>Sous-total</span>
        <span>${H(t)}</span>
      </div>
      <div class="oi-cart-total-row oi-cart-total-row--grand">
        <span>Total</span>
        <strong>${H(t)}</strong>
      </div>
    </div>

    ${n?`<p class="oi-cart-estimate">${r(n)}</p>`:``}

    <div class="oi-sheet-cta">
      <button class="primary full" id="cart-continue" type="button">
        Continuer · ${H(t)}
      </button>
    </div>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{S.splice(Number(e.dataset.remove),1),$(),Y()}}),e.querySelectorAll(`[data-edit]`).forEach(e=>{e.onclick=()=>{G(e.dataset.editId,Number(e.dataset.edit))}});let i=e.querySelector(`#cart-continue`);i&&(i.onclick=()=>{k=`details`,$()})}function tt(e){let t=v(S);e.innerHTML=`
    <button type="button" id="cart-back" class="oi-back-link">
      ${V.chevronLeft} Retour au panier
    </button>

    <div id="hours-banner"></div>

    <form
      id="order-form"
      class="order-form oi-checkout-form"
    >

      <p class="eyebrow">
        Vos coordonnées
      </p>

      <label>
        Ton nom

        <input
          name="name"
          required
          placeholder="Prénom ou nom"
          autocomplete="name"
        >
      </label>

      <label>
        Ton téléphone

        <input
          name="phone"
          required
          inputmode="tel"
          placeholder="06 00 00 00 00"
          autocomplete="tel"
        >
      </label>

      <label>
        Email (facultatif)

        <input
          name="email"
          type="email"
          id="email-field"
          placeholder="toi@exemple.fr"
          autocomplete="email"
        >
      </label>

      <p class="eyebrow oi-form-section">
        Mode de commande
      </p>

      <p class="oi-mode-readout">
        ${V.cart}
        <span><span class="oi-mode-readout-label">Mode</span> ${O===`onsite`?`Sur place`:`À emporter`}</span>
      </p>

      ${b?.settings?.delivery_mode===`internal`?`
            <div class="oi-segmented oi-segmented--radio fulfillment-toggle" role="radiogroup" aria-label="Mode de récupération">

              <label class="oi-segmented-radio">
                <input
                  type="radio"
                  name="fulfillmentType"
                  value="PICKUP"
                  checked
                >
                <span>Retrait sur place</span>
              </label>

              <label class="oi-segmented-radio">
                <input
                  type="radio"
                  name="fulfillmentType"
                  value="DELIVERY"
                >
                <span>Livraison</span>
              </label>

            </div>

            <div
              id="delivery-address-fields"
              class="delivery-address-fields"
              hidden
            >

              <label>
                Adresse

                <input
                  name="deliveryStreet"
                  placeholder="12 rue des Fleurs"
                  autocomplete="street-address"
                >
              </label>

              <label>
                Code postal

                <input
                  name="deliveryPostalCode"
                  placeholder="31000"
                  inputmode="numeric"
                  autocomplete="postal-code"
                >
              </label>

              <label>
                Ville

                <input
                  name="deliveryCity"
                  placeholder="Toulouse"
                  autocomplete="address-level2"
                >
              </label>

              <label>
                Complément (bâtiment, étage, code portail...)

                <input
                  name="deliveryComplement"
                  placeholder="Facultatif"
                >
              </label>

            </div>
          `:``}

      <p class="eyebrow oi-form-section">
        Créneau
      </p>

      <div class="oi-slot-grid">
        <label id="pickup-date-label">
          <span>Jour de retrait</span>

          <input
            name="pickupDate"
            type="date"
            id="pickup-date"
            required
          >
        </label>

        <label>
          <span>Heure souhaitée</span>

          <input
            name="pickupTime"
            type="time"
            id="pickup-time"
            required
          >
        </label>
      </div>

      <label>
        Demande spéciale (facultatif)

        <textarea
          name="specialInstructions"
          rows="2"
          maxlength="280"
          placeholder="Sans oignons, moins de sauce fromagère..."
        ></textarea>
      </label>

      <div class="oi-payment-note">
        <p class="oi-payment-note-title">Paiement au restaurant</p>
        <p class="oi-payment-note-sub">Aucun paiement en ligne pour le moment.</p>
      </div>

      <div class="oi-sheet-cta">
        <button
          class="primary full"
          type="submit"
          id="submit-order"
        >
          Commander · ${H(t)}
        </button>

        <p class="oi-sheet-cta-status" id="submit-status" aria-live="polite"></p>

        <small>
          ${w?`Commande transmise directement à l’espace ${r(U())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
        </small>
      </div>

    </form>
  `;let n=e.querySelector(`#cart-back`);n&&(n.onclick=()=>{k=`review`,$()});let i=e.querySelector(`#order-form`);if(i){let t=i.querySelector(`#pickup-date`),n=i.querySelector(`#pickup-time`),a=e.querySelector(`#hours-banner`),s=i.querySelector(`#submit-order`),c=i.querySelectorAll(`input[name="fulfillmentType"]`),l=e.querySelector(`#delivery-address-fields`),u=i.querySelector(`#pickup-date-label span`);function d(){if(!c.length)return;let e=i.querySelector(`input[name="fulfillmentType"]:checked`)?.value===`DELIVERY`;if(l){let t=l.hidden;l.hidden=!e,l.querySelectorAll(`input`).forEach(t=>{t.required=e&&t.name!==`deliveryComplement`}),e&&t&&(l.classList.remove(`oi-fade-in`),l.offsetWidth,l.classList.add(`oi-fade-in`))}u&&(u.textContent=e?`Jour de livraison`:`Jour de retrait`)}c.forEach(e=>{e.onchange=d}),d();let p=new Date().toLocaleDateString(`en-CA`),m=new Date(Date.now()+5184e6).toLocaleDateString(`en-CA`);t.min=p,t.max=m,t.value=p;function h(){let e=f(n.value,t.value);return e?new Date(e):null}function g(){let e=h(),t=e&&o(b?.settings?.opening_hours,e);s.disabled=!t,a.innerHTML=t?``:`
          <div class="closed-banner oi-closed-banner oi-closed-banner--compact">
            <p class="eyebrow">Fermé à ce créneau</p>
            <p>
              ${r(U())} n'accepte pas de
              commande à cet horaire. Choisis un autre jour ou une autre heure.
            </p>
          </div>
        `}t.onchange=g,n.onchange=g,g();let _=i.querySelector(`#email-field`);i.onsubmit=async e=>{e.preventDefault();let t=h();if(!t||!o(b?.settings?.opening_hours,t)){g();return}let n=Object.fromEntries(new FormData(e.currentTarget)),r=String(n.email||``).trim();if(r&&!te(r)){_?.setCustomValidity(`Adresse email invalide.`),_?.reportValidity();return}_?.setCustomValidity(``);let i=y(S,n),a=[];O===`onsite`&&a.push(`Sur place`),r&&a.push(`Email : ${r}`);let s=String(n.specialInstructions||``).trim();s&&a.push(s),i.notes=a.join(` — `).slice(0,500)||null,E||(E=crypto.randomUUID(),de(E)),i.idempotencyKey=E,await it(i)}}}function nt(e,t){let n=rt(e.options);return`
    <div class="oi-cart-item">

      <div class="oi-cart-item-main">

        <div class="oi-cart-item-title">
          <span class="oi-cart-item-qty">${e.quantity}×</span>
          <strong class="oi-cart-item-name">${r(e.name)}</strong>
        </div>

        ${n?`<span class="oi-cart-item-options">${r(n)}</span>`:``}

        <div class="oi-cart-item-actions">
          <button data-edit="${t}" data-edit-id="${r(e.id)}" type="button">
            Modifier
          </button>
          <button data-remove="${t}" type="button">
            Supprimer
          </button>
        </div>

      </div>

      <b>
        ${H(e.price*e.quantity)}
      </b>

    </div>
  `}function rt(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),Array.isArray(e.groups)&&e.groups.forEach(e=>{e&&e.label&&e.choice&&t.push(`${e.label} : ${e.choice}`)}),t.join(` · `)}async function it(t){if(D)return;D=!0;let r=document.querySelector(`#submit-order`),a=document.querySelector(`#submit-status`),o=r?.innerHTML??``;r&&(r.disabled=!0,r.setAttribute(`aria-busy`,`true`),r.innerHTML=`<span class="oi-btn-spinner" aria-hidden="true"></span>Envoi…`),a&&(a.textContent=`Envoi de la commande en cours…`);try{let e,n={...t,restaurant_id:b?.id||null,restaurantId:b?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(w)e=await w.createOrder(n);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=i(t,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}S=[],E=null,de(null),D=!1,Y(),at(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),n(e,{restaurantId:b?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:String(t?.message||``).includes(`RATE_LIMITED`)?`Trop de commandes envoyées récemment avec ce numéro. Réessaie dans quelques minutes.`:`Impossible d’envoyer la commande pour le moment.`),D=!1,r&&(r.disabled=!1,r.removeAttribute(`aria-busy`),r.innerHTML=o),a&&(a.textContent=``)}}function at(e){let t=a(e),n=e?.type===`DELIVERY`?`Livraison`:O===`onsite`?`Heure`:`Retrait`;X(),document.querySelector(`#modal-content`).innerHTML=`
    <div class="confirmation oi-confirmation">

      <div class="confirmed-stamp">
        ✓
      </div>

      <p class="eyebrow">
        Commande envoyée
      </p>

      <h2 class="oi-confirmation-number">
        ${r(t.number)}
      </h2>

      <p>
        Commande envoyée à
        <strong>
          ${r(U())}
        </strong>.
      </p>

      <div class="oi-confirmation-summary">

        <div class="oi-confirmation-row">
          <span>Mode</span>
          <strong>${O===`onsite`?`Sur place`:`À emporter`}</strong>
        </div>

        <div class="oi-confirmation-row">
          <span>${r(n)}</span>
          <strong>${r(t.pickup)}</strong>
        </div>

        <div class="oi-confirmation-row oi-confirmation-row--total">
          <span>Total</span>
          <strong>${r(t.totalLabel)}</strong>
        </div>

      </div>

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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),W()}}async function ot(){try{p(),Re(),await Ae(),await Pe(),W()}catch(e){if(!s()&&!d()){window.location.replace(`/pro.html`);return}ze(e)}}ot();