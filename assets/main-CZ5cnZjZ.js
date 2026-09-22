import{i as e,n as t,r as n,t as r}from"./styles-CFpOEART.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{d as i,i as a,l as o,n as s,o as c,r as l,s as u,t as d,u as f}from"./restaurantResolver-9IOtyM5e.js";import{t as p}from"./analytics-1YGI5PQu.js";import{a as m,i as h,o as g,r as _}from"./loyalty-Bi6_Ljfe.js";function v(e,t){return[...e,{...t,quantity:t.quantity??1}]}function y(e){return Number(e.reduce((e,t)=>e+t.price*t.quantity,0).toFixed(2))}function b(e,t,n=()=>Date.now()){return{number:`#${n()}`,type:t?.fulfillmentType===`DELIVERY`?`DELIVERY`:`PICKUP`,status:`NEW`,items:e,customer:t,total:y(e),createdAt:new Date().toISOString()}}function ee(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}async function te(e,t,{email:n,password:r,name:i,phone:a,marketingEmail:o,marketingSms:s}){let{data:c,error:l}=await e.auth.signUp({email:String(n).trim(),password:r});if(l)throw l;let u=c?.user?.id;if(!c?.session)return{pendingConfirmation:!0};let{data:d,error:f}=await e.from(`customers`).insert({restaurant_id:t,auth_user_id:u,name:String(i||``).trim()||null,phone:String(a||``).trim()||null,email:String(n).trim()}).select().single();if(f)throw f;let p=[{channel:`EMAIL`,granted:!!o},{channel:`SMS`,granted:!!s}].map(e=>({restaurant_id:t,customer_id:d.id,channel:e.channel,granted:e.granted,source:`signup`,granted_at:e.granted?new Date().toISOString():null})),{error:m}=await e.from(`marketing_consents`).insert(p);if(m)throw m;return{pendingConfirmation:!1,customer:d}}async function ne(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function re(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function ie(e,t){let{data:{user:n}}=await e.auth.getUser();if(!n)return null;let{data:r,error:i}=await e.from(`customers`).select(`*`).eq(`auth_user_id`,n.id).eq(`restaurant_id`,t).maybeSingle();if(i)throw i;return r}async function ae(e,t){let{data:n,error:r}=await e.from(`orders`).select(`id, order_number, status, total_cents, pickup_time, created_at, order_items(product_name, quantity, line_total_cents)`).eq(`customer_id`,t).order(`created_at`,{ascending:!1}).limit(50);if(r)throw r;return n??[]}async function oe(e,t){let{data:n,error:r}=await e.from(`marketing_consents`).select(`channel, granted`).eq(`customer_id`,t);if(r)throw r;return n??[]}async function se(e,{restaurantId:t,customerId:n,channel:r,granted:i}){let{error:a}=await e.from(`marketing_consents`).upsert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`,granted_at:i?new Date().toISOString():null,withdrawn_at:i?null:new Date().toISOString()},{onConflict:`restaurant_id,customer_id,channel`});if(a)throw a;let{error:o}=await e.from(`marketing_consent_events`).insert({restaurant_id:t,customer_id:n,channel:r,granted:i,source:`account`});if(o)throw o}async function ce(e){let{error:t}=await e.rpc(`delete_customer_account`);if(t)throw t;await re(e)}var x=null;t(e,{page:`client`,getRestaurantId:()=>x?.id??null});var S=[],C=[],w=null,T=null,E=null,D=`takeaway`,O=`review`,k=`login`,A=``,j=!1,M=null,N=[],P=[],F=null,I=[],L=!1,R=!1,le=[`Kebab`,`Poulet Paprika`,`Tenders`,`Kefta`,`Merguez`,`Nuggets`,`Steak Haché`,`Cordon Bleu`,`Veggy`],ue=[`Ketchup`,`Biggy`,`Marocaine`,`Mayo`,`Blanche`,`Curry`,`Algérienne`,`Harissa`,`Andalouse`,`Brésilienne`,`Moutarde`,`Fromagère`],de=[`Canette`,`Bouteille`,`Eau`,`Redbull`,`Compote`,`Capri-Sun`],z=document.querySelector(`#root`),B={info:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/></svg>`,account:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>`,cart:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,arrow:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>`,chevronLeft:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="15 6 9 12 15 18"/></svg>`};function fe(){return!!window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches}var V=e=>`${Number(e??0).toFixed(2).replace(`.`,`,`)} €`,pe=()=>C.reduce((e,t)=>e+Number(t.quantity??0),0);function me(){return o(x?.settings?.opening_hours,new Date)}function he(){let e=x?.settings||{},t=Number(e.pickup_eta_min),n=Number(e.pickup_eta_max);if(Number.isFinite(t)&&Number.isFinite(n)&&t>0&&n>=t)return{type:`range`,min:t,max:n};let r=Number(e.pickup_eta_minutes);return Number.isFinite(r)&&r>0?{type:`single`,minutes:r}:null}function ge(){let e=he();return e?e.type===`range`?`Retrait ${e.min}–${e.max} min`:`Retrait ~${e.minutes} min`:null}function _e(){let e=he();if(!e)return null;if(e.type===`range`)return`Retrait estimé : ${e.min}–${e.max} min`;let t=new Date(Date.now()+e.minutes*60*1e3);return`Retrait estimé vers ${new Intl.DateTimeFormat(`fr-FR`,{timeZone:`Europe/Paris`,hour:`2-digit`,minute:`2-digit`,hourCycle:`h23`}).format(t)}`}function ve(e){let t=e.options||{};return!!(t.popular||t.is_popular||t.bestseller||t.is_bestseller||t.badge===`populaire`||t.badge===`popular`)}function ye(e){let t=e.options||{};return!!(t.new||t.is_new||t.badge===`nouveau`||t.badge===`new`)}function be(e){return!!(e.meat||e.sauce||e.drink||Array.isArray(e.options?.groups)&&e.options.groups.length)}function xe(){return S.filter(ve).slice(0,4)}function H(){return x?.name||`FOODATOI`}var Se=new Set([`le`,`la`,`les`,`l`,`un`,`une`,`des`,`du`,`de`,`d`,`et`]);function Ce(e){let t=String(e||``).trim().split(/\s+/).filter(Boolean);if(!t.length)return``;let n=t.filter(e=>!Se.has(e.toLowerCase().replace(/['’]/g,``)));return(n.length?n:t).slice(0,2).map(e=>e.charAt(0)).join(``).toUpperCase()}function we(){return x?.phone||``}function Te(){let e=x?.address;return e?typeof e==`string`?e:typeof e==`object`?[e.street,e.postal_code||e.postalCode,e.city].filter(Boolean).join(` · `):``:``}function Ee(){return x?.primary_color||`#111111`}async function De(){return x=await l(e),console.info(`[FOODATOI] Restaurant résolu:`,x),Oe(),T=c(e,x.id),x}function Oe(){x&&(document.documentElement.style.setProperty(`--restaurant-primary`,Ee()),document.title=`${H()} · FOODATOI`)}function ke(e){if(!Array.isArray(e)||!e.length)return null;let t=[...e].sort((e,t)=>e.is_primary===t.is_primary?(e.sort_order??0)-(t.sort_order??0):e.is_primary?-1:1)[0]?.public_url;return t?/^https?:\/\//i.test(t)?t:`/${t.replace(/^\/+/,``)}`:null}function Ae(e){let t=e.options&&typeof e.options==`object`?e.options:{},n=Number(e.price_cents??0)/100;return{id:e.id,category:e.category||`Autres`,name:e.name||`Produit`,description:e.description||``,price:n,emoji:t.emoji||t.icon||`🍽️`,imageUrl:ke(e.product_images),options:t,meat:!!(t.meat||t.meats||t.viande||t.viandes),sauce:!!(t.sauce||t.sauces),drink:!!(t.drink||t.drinks||t.boisson||t.boissons),multipleMeat:!!(t.multipleMeat||t.multiple_meat),tripleMeat:!!(t.tripleMeat||t.triple_meat),createdAt:e.created_at||null}}async function je(){if(!e)throw Error(`Supabase n’est pas configuré.`);if(!x?.id)throw Error(`Restaurant non résolu.`);let{data:t,error:n}=await e.from(`products`).select(`
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
    `).eq(`restaurant_id`,x.id).eq(`is_active`,!0).order(`sort_order`,{ascending:!0,nullsFirst:!1}).order(`created_at`,{ascending:!0});if(n)throw console.error(`[FOODATOI] Erreur chargement catalogue:`,n),n;return S=(t??[]).filter(e=>e.restaurant_id===x.id).map(Ae),console.info(`[FOODATOI] ${S.length} produit(s) chargé(s) pour ${H()}.`),S}function Me(){return[`Tous`,...new Set(S.map(e=>e.category).filter(Boolean))]}function Ne(e){return String(e).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}function Pe(e){let t=[],n=new Map;return e.forEach(e=>{let r=e.category||`Autres`;n.has(r)||(n.set(r,[]),t.push(r)),n.get(r).push(e)}),t.map(e=>({category:e,slug:Ne(e),items:n.get(e)}))}function Fe(){z.innerHTML=`
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
  `}function Ie(t){console.error(`[FOODATOI] Erreur application:`,t),n(e,{context:`main.init`,message:t?.message??String(t),page:`main`}),z.innerHTML=`
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
  `}function U(){let e=Me(),t=H(),n=Te(),i=we(),a=me(),o=xe(),s=pe(),c=y(C),l=Ce(t),d=ge();z.innerHTML=`
    <div class="app-frame client-app">

      <header class="oi-header">

        <div class="oi-header-row">

          <div class="brand-lockup">

            ${x?.logo_url?`<img class="brand-mark-image" src="${r(x.logo_url)}" alt="${r(t)}">`:l?`<span class="brand-mark">${r(l)}</span>`:``}

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
              ${B.info}
            </button>

            <button class="icon-btn" id="open-account" type="button" aria-label="Mon compte">
              ${B.account}
            </button>

            <button class="icon-btn oi-cart-btn" id="open-cart" type="button" aria-label="Panier, ${s} article${s>1?`s`:``}">
              ${B.cart}
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
            <button type="button" class="oi-segmented-btn${D===`takeaway`?` is-active`:``}" data-order-mode="takeaway" aria-pressed="${D===`takeaway`}">
              À emporter
            </button>
            <button type="button" class="oi-segmented-btn${D===`onsite`?` is-active`:``}" data-order-mode="onsite" aria-pressed="${D===`onsite`}">
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

        ${x?.settings?.delivery_mode===`redirect`&&x?.settings?.delivery_redirect_url?`
              <section class="delivery-banner oi-delivery-banner">
                <div>
                  <p class="eyebrow">Livraison à domicile</p>
                  <p>${r(t)} livre aussi à domicile via Uber Eats.</p>
                </div>
                <a
                  class="secondary"
                  href="${r(x.settings.delivery_redirect_url)}"
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
                        data-target="${e===`Tous`?`top`:r(Ne(e))}"
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
                    ${o.map(Le).join(``)}
                  </div>
                </section>
              `:``}

          ${S.length?Pe(S).map(e=>`
                      <section class="menu-category-section oi-section" id="menu-cat-${e.slug}">
                        <div class="oi-section-head">
                          <h2>${r(e.category)}</h2>
                        </div>
                        <div class="oi-card-list">
                          ${e.items.map(Le).join(``)}
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

        ${u(x?.settings?.opening_hours).length?`
              <div class="footer-hours">
                ${u(x?.settings?.opening_hours).map(e=>`
                      <span>
                        ${r(e.label)}
                        <b>${r(e.hours)}</b>
                      </span>
                    `).join(``)}
              </div>
            `:``}

        <div>
          ${i?`<a href="tel:${r(i)}">${r(i)}</a>`:``}
          ${x?.settings?.facebook_url?`
                <a href="${r(x.settings.facebook_url)}" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              `:``}
          <a href="/legal.html">Mentions légales</a>
        </div>

      </footer>

    </div>

    <div class="oi-sticky-cart${C.length?``:` hidden`}" id="sticky-cart-bar">
      <button type="button" id="sticky-cart-btn" class="oi-sticky-cart-btn">
        <span class="oi-sticky-cart-info">
          <span class="oi-sticky-cart-count">${s} article${s>1?`s`:``}</span>
          <span class="oi-sticky-cart-total">${V(c)}</span>
        </span>
        <span class="oi-sticky-cart-cta">Voir le panier ${B.arrow}</span>
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

      <div id="cart-content"></div>

    </aside>

    <div class="modal hidden" id="product-modal">
      <div class="modal-card" id="modal-content"></div>
    </div>
  `,Be(),$()}function Le(e){let t=[];return ve(e)&&t.push(`<span class="oi-badge oi-badge--acid">Populaire</span>`),ye(e)&&t.push(`<span class="oi-badge oi-badge--ink">Nouveau</span>`),`
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

          <span class="oi-card-price">${V(e.price)}</span>

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
  `}function Re(){document.querySelectorAll(`.oi-card-media img, .product-photo`).forEach(e=>{e.onerror=()=>{let t=e.closest(`.oi-card-media`),n=e.closest(`.oi-card`);if(t){t.remove(),n?.classList.add(`oi-card--no-photo`);return}e.remove()}})}function ze(){w&&w.disconnect();let e=document.querySelectorAll(`.menu-category-section`);if(!e.length)return;let t=document.querySelector(`.category-rail`)?.offsetHeight||0;w=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=e.target.id.replace(`menu-cat-`,``);document.querySelectorAll(`[data-category]`).forEach(e=>{let n=e.dataset.target===t;e.classList.toggle(`is-active`,n),n?(e.setAttribute(`aria-current`,`true`),e.scrollIntoView({behavior:fe()?`auto`:`smooth`,inline:`center`,block:`nearest`})):e.removeAttribute(`aria-current`)})}})},{rootMargin:`-${t+20}px 0px -70% 0px`,threshold:0}),e.forEach(e=>w.observe(e))}function Be(){document.querySelectorAll(`[data-category]`).forEach(e=>{e.onclick=()=>{let t=e.dataset.target;if(t===`top`){window.scrollTo({top:0,behavior:`smooth`});return}let n=document.getElementById(`menu-cat-${t}`);if(n){let e=document.querySelector(`.category-rail`)?.offsetHeight||0,t=n.getBoundingClientRect().top+window.scrollY-e-12;window.scrollTo({top:t,behavior:`smooth`})}}}),ze(),document.querySelectorAll(`[data-add]`).forEach(e=>{e.onclick=()=>We(e.dataset.add)}),document.querySelectorAll(`[data-open]`).forEach(e=>{e.onclick=()=>W(e.dataset.open)}),Re(),document.querySelectorAll(`[data-order-mode]`).forEach(e=>{e.onclick=()=>{D=e.dataset.orderMode,document.querySelectorAll(`[data-order-mode]`).forEach(e=>{let t=e.dataset.orderMode===D;e.classList.toggle(`is-active`,t),e.setAttribute(`aria-pressed`,String(t))})}});let e=document.querySelector(`#open-cart`);e&&(e.onclick=q);let t=document.querySelector(`#sticky-cart-btn`);t&&(t.onclick=q);let n=document.querySelector(`#open-account`);n&&(n.onclick=Ke);let r=document.querySelector(`#open-info`);r&&(r.onclick=Ge);let i=document.querySelector(`#close-cart`);i&&(i.onclick=Y);let a=document.querySelector(`#backdrop`);a&&(a.onclick=Y)}function W(e,t=null){let n=S.find(t=>t.id===e);if(!n)return;let i=t===null?null:C[t],a=i?.options||{},o=Ve(n,a),s=He(n,a),c=Ue(n,a),l=Array.isArray(n.options?.groups)?n.options.groups:[],u=Array.isArray(a.groups)?a.groups:[],d=l.map((e,t)=>{let n=e.label||`Choix`,r=(e.min??1)>=1,i=u.find(e=>e.label===n)?.choice??null;return K({name:`grp-${t}`,label:n,options:(e.items||[]).map(String),selected:i,required:r,groupLabel:n})}).join(``),f=Math.max(1,Math.min(20,Number(i?.quantity??1))),p=()=>`${t===null?`Ajouter au panier`:`Enregistrer`} · ${V(n.price*f)}`;document.querySelector(`#modal-content`).innerHTML=`

    <button class="modal-close" id="modal-close" type="button" aria-label="Fermer">×</button>

    <div class="oi-sheet-scroll">

      ${n.imageUrl?`<img class="product-photo" src="${r(n.imageUrl)}" alt="">`:``}

      <p class="eyebrow">${r(n.category)}</p>

      <h2>${r(n.name)}</h2>

      ${n.description?`<p class="oi-sheet-desc">${r(n.description)}</p>`:``}

      <p class="oi-sheet-price">${V(n.price)}</p>

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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#product-modal`).classList.add(`oi-sheet`),Re();let m=document.querySelector(`#confirm-add`);function h(){m.textContent=p()}document.querySelector(`#modal-close`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`)};let g=document.querySelector(`#qty-value`),_=document.querySelector(`#qty-minus`),y=document.querySelector(`#qty-plus`);function b(){_.disabled=f<=1,y.disabled=f>=20}_.onclick=()=>{f=Math.max(1,f-1),g.textContent=String(f),b(),h()},y.onclick=()=>{f=Math.min(20,f+1),g.textContent=String(f),b(),h()},b(),document.querySelectorAll(`#product-modal input[type="radio"]`).forEach(e=>{e.onchange=h}),m.onclick=()=>{let e={},r=document.querySelector(`input[name="meat-1"]:checked`)?.value,i=document.querySelector(`input[name="meat-2"]:checked`)?.value,a=document.querySelector(`input[name="meat-3"]:checked`)?.value,o=document.querySelector(`input[name="sauce"]:checked`)?.value,s=document.querySelector(`input[name="drink"]:checked`)?.value;r&&(e.meat=r),i&&(e.meat2=i),a&&(e.meat3=a),(i||a)&&(e.meats=[r,i,a].filter(Boolean)),o&&(e.sauce=o),s&&(e.drink=s);let c=null,u=[];if(l.forEach((e,t)=>{let n=e.label||`Choix`,r=(e.min??1)>=1,i=document.querySelector(`input[name="grp-${t}"]:checked`)?.value;r&&!i&&!c&&(c=n),i&&u.push({label:n,choice:i})}),c){alert(`Merci de choisir : `+c);return}if(u.length&&(e.groups=u),t!==null){C=C.map((r,i)=>i===t?{...n,quantity:f,options:e}:r),document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`),$(),J();return}C=v(C,{...n,quantity:f,options:e}),document.querySelector(`#product-modal`).classList.add(`hidden`),document.querySelector(`#product-modal`).classList.remove(`oi-sheet`),U(),q()}}function G(e,t,n){for(let n of t)if(Array.isArray(e?.[n])&&e[n].length)return e[n];return n}function K({name:e,label:t,options:n,selected:i=null,required:a=!1}){return n.length?`
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
  `:``}function Ve(e,t={}){if(!e.meat)return``;let n=G(e.options,[`meats`,`meat`,`viandes`,`viande`],le);return e.tripleMeat?[K({name:`meat-1`,label:`Viande 1`,options:n,selected:t.meat??null}),K({name:`meat-2`,label:`Viande 2`,options:n,selected:t.meat2??null}),K({name:`meat-3`,label:`Viande 3`,options:n,selected:t.meat3??null})].join(``):e.multipleMeat?[K({name:`meat-1`,label:`Viande 1`,options:n,selected:t.meat??null}),K({name:`meat-2`,label:`Viande 2`,options:n,selected:t.meat2??null})].join(``):K({name:`meat-1`,label:`Viande`,options:n,selected:t.meat??null})}function He(e,t={}){return e.sauce?K({name:`sauce`,label:`Sauce`,options:G(e.options,[`sauces`,`sauce`],ue),selected:t.sauce??null}):``}function Ue(e,t={}){return e.drink?K({name:`drink`,label:`Boisson`,options:G(e.options,[`drinks`,`drink`,`boissons`,`boisson`],de),selected:t.drink??null}):``}function q(){O=`review`,document.querySelector(`#drawer`).classList.add(`open`),document.querySelector(`#backdrop`).classList.remove(`hidden`),$()}function We(e){let t=S.find(t=>t.id===e);if(t){if(!be(t)){C=v(C,{...t,quantity:1,options:{}}),U();return}W(e)}}function J(){let e=pe(),t=document.querySelector(`#cart-badge`);t&&(t.textContent=String(e),t.classList.toggle(`hidden`,e===0));let n=document.querySelector(`#open-cart`);n&&n.setAttribute(`aria-label`,`Panier, ${e} article${e>1?`s`:``}`);let r=document.querySelector(`#sticky-cart-bar`);if(r){r.classList.toggle(`hidden`,C.length===0);let t=r.querySelector(`.oi-sticky-cart-count`),n=r.querySelector(`.oi-sticky-cart-total`);t&&(t.textContent=`${e} article${e>1?`s`:``}`),n&&(n.textContent=V(y(C)))}}function Y(){document.querySelector(`#drawer`).classList.remove(`open`),document.querySelector(`#backdrop`).classList.add(`hidden`)}function Ge(){let e=H(),t=Te(),n=we(),i=u(x?.settings?.opening_hours),a=me(),o=document.querySelector(`#info-overlay`);o||(o=document.createElement(`div`),o.id=`info-overlay`,o.className=`modal`,document.body.appendChild(o),o.onclick=e=>{e.target===o&&o.remove()}),o.innerHTML=`
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

      ${x?.settings?.delivery_mode===`redirect`&&x?.settings?.delivery_redirect_url?`
            <a
              class="secondary full oi-info-delivery"
              href="${r(x.settings.delivery_redirect_url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Livraison via Uber Eats →
            </a>
          `:``}

    </div>
  `,o.querySelector(`#info-close`).onclick=()=>{o.remove()}}async function Ke(){let t=document.querySelector(`#account-overlay`);t||(t=document.createElement(`div`),t.id=`account-overlay`,t.className=`modal`,t.innerHTML=`
      <div class="modal-card order-detail-card" id="account-content"></div>
    `,document.body.appendChild(t),t.onclick=e=>{e.target===t&&t.remove()}),A=``,j=!0,Q();try{let{data:{session:t}}=await e.auth.getSession();t?await X():k=`login`}catch(e){console.error(`[FOODATOI] Erreur ouverture compte:`,e),A=`Impossible de charger ton compte pour le moment.`}j=!1,Q()}async function X(){if(M=await ie(e,x.id),!M){k=`login`;return}let[t,n]=await Promise.all([ae(e,M.id),oe(e,M.id)]);N=t,P=n;try{if((await _(e,x.id))?.is_active){let[t,n]=await Promise.all([m(e,x.id),h(e,x.id)]);F=t,I=n.filter(e=>e.is_active)}else F=null,I=[]}catch(e){console.error(`[FOODATOI] Erreur chargement fidélité:`,e),F=null,I=[]}k=`dashboard`}function Z(e){return!!P.find(t=>t.channel===e)?.granted}function Q(){let e=document.querySelector(`#account-content`);if(!e)return;let t=A?`<p class="account-error">${r(A)}</p>`:``;if(j){e.innerHTML=`
      <p class="eyebrow">Mon compte</p>
      <h2>Chargement…</h2>
    `;return}if(k===`dashboard`&&M){e.innerHTML=`
      <button class="modal-close" id="account-close">×</button>

      <p class="eyebrow">Mon compte</p>
      <h2>${r(M.name||`Bonjour`)}</h2>
      <p>${r(M.email||``)}</p>

      ${t}

      <div class="account-section">
        <h3>Mes commandes</h3>
        ${N.length?`<ul class="account-orders">
                ${N.map(e=>`
                      <li>
                        <div>
                          <strong>${r(e.order_number)}</strong>
                          <span>${new Date(e.created_at).toLocaleDateString(`fr-FR`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}</span>
                        </div>
                        <div>
                          ${(e.order_items||[]).map(e=>`${e.quantity}× ${r(e.product_name)}`).join(`, `)}
                        </div>
                        <strong>${V((e.total_cents||0)/100)}</strong>
                      </li>
                    `).join(``)}
              </ul>`:`<p class="muted">Aucune commande pour le moment.</p>`}
      </div>

      ${F||I.length?`
            <div class="account-section">
              <h3>Ma fidélité</h3>
              <p class="loyalty-balance">${F?.balance_points??0} points</p>
              ${I.length?`<ul class="account-orders loyalty-rewards">
                      ${I.map(e=>`
                            <li>
                              <div>
                                <strong>${r(e.name)}</strong>
                                ${e.description?`<span>${r(e.description)}</span>`:``}
                              </div>
                              <button
                                class="secondary small"
                                data-redeem-reward="${e.id}"
                                type="button"
                                ${(F?.balance_points??0)<e.cost_points||L?`disabled`:``}
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

        ${R?`
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
    `,Je();return}let n=k===`signup`;e.innerHTML=`
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
              Tes données servent uniquement à gérer ton compte et tes commandes chez ${r(H())}. Tu peux les supprimer à tout moment depuis cet espace.
            </p>
          `:``}

      <button class="primary full" type="submit">
        ${n?`Créer mon compte →`:`Se connecter →`}
      </button>
    </form>

    <button class="secondary full" id="account-toggle-mode" type="button">
      ${n?`J’ai déjà un compte`:`Créer un compte`}
    </button>
  `,qe()}function qe(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-toggle-mode`);r&&(r.onclick=()=>{k=k===`signup`?`login`:`signup`,A=``,Q()});let i=document.querySelector(`#account-form`);i&&(i.onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!ee(r.email)){A=`Adresse email invalide.`,Q();return}j=!0,A=``,Q();try{if(k===`signup`){if((await te(e,x.id,r)).pendingConfirmation){j=!1,A=`Compte créé ! Vérifie tes emails pour confirmer ton adresse avant de te connecter.`,k=`login`,Q();return}await X()}else await ne(e,r),await X()}catch(t){console.error(`[FOODATOI] Erreur compte client:`,t),n(e,{restaurantId:x?.id,context:`main.customerAccount`,message:t?.message??String(t),page:`main`}),A=String(t?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(t?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`}j=!1,Q()})}function Je(){let t=document.querySelector(`#account-close`);t&&(t.onclick=()=>document.querySelector(`#account-overlay`)?.remove());let r=document.querySelector(`#account-logout`);r&&(r.onclick=async()=>{await re(e),k=`login`,M=null,N=[],P=[],R=!1,Q()}),document.querySelectorAll(`[data-redeem-reward]`).forEach(t=>{t.onclick=async()=>{if(!L){L=!0,Q();try{await g(e,t.dataset.redeemReward),F=await m(e,x.id),alert(`Récompense échangée ! Montre cet écran en caisse pour en profiter.`)}catch(e){console.error(`[FOODATOI] Erreur échange récompense:`,e),alert(`Impossible d’échanger cette récompense pour le moment.`)}finally{L=!1,Q()}}}}),[`EMAIL`,`SMS`].forEach(t=>{let n=document.querySelector(`#consent-${t.toLowerCase()}`);n&&(n.onchange=async()=>{try{await se(e,{restaurantId:x.id,customerId:M.id,channel:t,granted:n.checked}),P=await oe(e,M.id)}catch(e){console.error(`[FOODATOI] Erreur consentement:`,e),n.checked=!n.checked}})});let i=document.querySelector(`#account-delete`);i&&(i.onclick=()=>{R=!0,Q()});let a=document.querySelector(`#account-delete-cancel`);a&&(a.onclick=()=>{R=!1,Q()});let o=document.querySelector(`#account-delete-confirm`);o&&(o.onclick=async()=>{j=!0,Q();try{await ce(e),k=`login`,M=null,N=[],P=[],R=!1,A=`Ton compte et tes données ont été supprimés.`}catch(t){console.error(`[FOODATOI] Erreur suppression compte:`,t),n(e,{restaurantId:x?.id,context:`main.deleteAccount`,message:t?.message??String(t),page:`main`}),A=`Impossible de supprimer le compte pour le moment.`,R=!1}j=!1,Q()})}function $(){let e=document.querySelector(`#cart-content`);if(e){if(!C.length){O=`review`,e.innerHTML=`
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
    `,e.querySelector(`#back-menu`).onclick=Y;return}if(O===`details`){Xe(e);return}Ye(e)}}function Ye(e){let t=y(C),n=_e();e.innerHTML=`
    <div class="oi-cart-items">
      ${C.map((e,t)=>Ze(e,t)).join(``)}
    </div>

    <div class="oi-cart-totals">
      <div class="oi-cart-total-row">
        <span>Sous-total</span>
        <span>${V(t)}</span>
      </div>
      <div class="oi-cart-total-row oi-cart-total-row--grand">
        <span>Total</span>
        <strong>${V(t)}</strong>
      </div>
    </div>

    ${n?`<p class="oi-cart-estimate">${r(n)}</p>`:``}

    <div class="oi-sheet-cta">
      <button class="primary full" id="cart-continue" type="button">
        Continuer · ${V(t)}
      </button>
    </div>
  `,e.querySelectorAll(`[data-remove]`).forEach(e=>{e.onclick=()=>{C.splice(Number(e.dataset.remove),1),$(),J()}}),e.querySelectorAll(`[data-edit]`).forEach(e=>{e.onclick=()=>{W(e.dataset.editId,Number(e.dataset.edit))}});let i=e.querySelector(`#cart-continue`);i&&(i.onclick=()=>{O=`details`,$()})}function Xe(e){let t=y(C);e.innerHTML=`
    <button type="button" id="cart-back" class="oi-back-link">
      ${B.chevronLeft} Retour au panier
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
        EMAIL (facultatif)

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
        ${D===`onsite`?`Sur place`:`À emporter`}
      </p>

      ${x?.settings?.delivery_mode===`internal`?`
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

      <p class="eyebrow oi-form-section">
        Créneau
      </p>

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

      <p class="oi-payment-note">
        Paiement au restaurant
      </p>

      <div class="oi-sheet-cta">
        <button
          class="primary full"
          type="submit"
          id="submit-order"
        >
          Commander · ${V(t)}
        </button>

        <small>
          ${T?`Commande transmise directement à l’espace ${r(H())}.`:`Mode démo : aucune commande réelle n’est envoyée.`}
        </small>
      </div>

    </form>
  `;let n=e.querySelector(`#cart-back`);n&&(n.onclick=()=>{O=`review`,$()});let i=e.querySelector(`#order-form`);if(i){let t=i.querySelector(`#pickup-date`),n=i.querySelector(`#pickup-time`),a=e.querySelector(`#hours-banner`),s=i.querySelector(`#submit-order`),c=i.querySelectorAll(`input[name="fulfillmentType"]`),l=e.querySelector(`#delivery-address-fields`),u=i.querySelector(`#pickup-date-label span`);function d(){if(!c.length)return;let e=i.querySelector(`input[name="fulfillmentType"]:checked`)?.value===`DELIVERY`;l&&(l.hidden=!e,l.querySelectorAll(`input`).forEach(t=>{t.required=e&&t.name!==`deliveryComplement`})),u&&(u.textContent=e?`JOUR DE LIVRAISON`:`JOUR DE RETRAIT`)}c.forEach(e=>{e.onchange=d}),d();let p=new Date().toLocaleDateString(`en-CA`),m=new Date(Date.now()+5184e6).toLocaleDateString(`en-CA`);t.min=p,t.max=m,t.value=p;function h(){let e=f(n.value,t.value);return e?new Date(e):null}function g(){let e=h(),t=e&&o(x?.settings?.opening_hours,e);s.disabled=!t,a.innerHTML=t?``:`
          <div class="closed-banner">
            <p class="eyebrow">FERMÉ À CE CRÉNEAU</p>
            <p>
              ${r(H())}
              n'accepte pas de commande à l'horaire choisi.
              Choisis un autre jour ou une autre heure.
            </p>
          </div>
        `}t.onchange=g,n.onchange=g,g();let _=i.querySelector(`#email-field`);i.onsubmit=async e=>{e.preventDefault();let t=h();if(!t||!o(x?.settings?.opening_hours,t)){g();return}let n=Object.fromEntries(new FormData(e.currentTarget)),r=String(n.email||``).trim();if(r&&!ee(r)){_?.setCustomValidity(`Adresse email invalide.`),_?.reportValidity();return}_?.setCustomValidity(``);let i=b(C,n),a=[];D===`onsite`&&a.push(`Sur place`),r&&a.push(`Email : ${r}`);let s=String(n.specialInstructions||``).trim();s&&a.push(s),i.notes=a.join(` — `).slice(0,500)||null,E||=crypto.randomUUID(),i.idempotencyKey=E,await $e(i)}}}function Ze(e,t){let n=Qe(e.options);return`
    <div class="oi-cart-item">

      <div class="oi-cart-item-main">

        <strong>
          ${e.quantity} × ${r(e.name)}
        </strong>

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
        ${V(e.price*e.quantity)}
      </b>

    </div>
  `}function Qe(e={}){if(!e||typeof e!=`object`)return``;let t=[];return Array.isArray(e.meats)?t.push(`Viandes : ${e.meats.join(`, `)}`):e.meat&&t.push(`Viande : ${e.meat}`),e.sauce&&t.push(`Sauce : ${e.sauce}`),e.drink&&t.push(`Boisson : ${e.drink}`),Array.isArray(e.groups)&&e.groups.forEach(e=>{e&&e.label&&e.choice&&t.push(`${e.label} : ${e.choice}`)}),t.join(` · `)}async function $e(t){try{let e,n={...t,restaurant_id:x?.id||null,restaurantId:x?.id||null};if(!n.restaurant_id)throw Error(`Restaurant FOODATOI introuvable pour cette commande.`);if(T)e=await T.createOrder(n);else{let t=JSON.parse(localStorage.getItem(`foodatoi-orders`)||`[]`);e=i(t,n).at(-1),localStorage.setItem(`foodatoi-orders`,JSON.stringify([...t,e]))}C=[],E=null,J(),et(e)}catch(t){console.error(`[FOODATOI] Erreur création commande:`,t),n(e,{restaurantId:x?.id,context:`main.createOrder`,message:t?.message??String(t),page:`main`}),alert(String(t?.message||``).includes(`RESTAURANT_CLOSED`)?`Le restaurant est fermé actuellement, la commande n’a pas pu être envoyée.`:String(t?.message||``).includes(`RATE_LIMITED`)?`Trop de commandes envoyées récemment avec ce numéro. Réessaie dans quelques minutes.`:`Impossible d’envoyer la commande pour le moment.`)}}function et(e){let t=a(e);Y(),document.querySelector(`#modal-content`).innerHTML=`
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
          ${r(H())}
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
  `,document.querySelector(`#product-modal`).classList.remove(`hidden`),document.querySelector(`#done`).onclick=()=>{document.querySelector(`#product-modal`).classList.add(`hidden`),U()}}async function tt(){try{p(),Fe(),await De(),await je(),U()}catch(e){if(!s()&&!d()){window.location.replace(`/pro.html`);return}Ie(e)}}tt();