import{a as e,i as t,r as n,s as r,t as i}from"./styles-DdYE6VjH.js";async function a(e,t,n){let{data:r,error:i}=await e.auth.signInWithPassword({email:t,password:n});if(i)throw i;return r.session}async function o(e){let{data:t,error:n}=await e.auth.getSession();if(n)throw n;return t.session}async function s(e){let{error:t}=await e.auth.signOut();if(t)throw t}function c(e,t){if(!e)return null;let n=`caz-food-orders-${Date.now()}`,r=e.channel(n,{config:{broadcast:{self:!1},presence:{key:``}}}).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Nouvelle commande reçue`,e),t(e)}).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande mise à jour`,e),t(e)}).on(`postgres_changes`,{event:`DELETE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande supprimée`,e),t(e)});return r.subscribe((e,t)=>{console.log(`[Realtime] Statut:`,e),t&&console.error(`[Realtime] Erreur:`,t),e===`SUBSCRIBED`&&console.log(`[Realtime] Abonnement actif pour public.orders`),e===`CHANNEL_ERROR`&&console.error(`[Realtime] CHANNEL_ERROR`,t),e===`TIMED_OUT`&&console.error(`[Realtime] TIMED_OUT`),e===`CLOSED`&&console.warn(`[Realtime] Canal fermé`)}),r}function l(e,t=(e=``,t=`_blank`)=>window.open(e,t)){let n=t(``,`_blank`);if(!n)return!1;let r=e.order_items??e.items??[],i=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,a=e.pickup_time?new Date(e.pickup_time).toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`}):`—`,o=r.map(e=>`
        <div class="row">
          <div>
            <strong>
              ${e.quantity}× ${e.product_name??e.name}
            </strong>
            <small>
              ${e.options?.meat?`Viande : ${e.options.meat}`:``}
              ${e.options?.sauce?` · Sauce : ${e.options.sauce}`:``}
              ${e.options?.drink?` · Boisson : ${e.options.drink}`:``}
            </small>
          </div>
          <b>
            ${i(e.line_total_cents??(e.price||0)*e.quantity*100)}
          </b>
        </div>
      `).join(``);return n.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>${e.order_number??e.number??`Commande`}</title>

        <style>
          body {
            font: 13px monospace;
            width: 72mm;
            margin: 0;
            padding: 10px;
            color: #111;
          }

          .center {
            text-align: center;
          }

          .line {
            border-top: 1px dashed #777;
            margin: 10px 0;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin: 8px 0;
          }

          .row small {
            display: block;
            color: #555;
            margin-top: 2px;
          }

          .total {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            margin-top: 12px;
          }
        </style>
      </head>

      <body>
        <div class="center">
          <strong>CAZ FOOD</strong>
          <br>
          CAZÈRES
          <br><br>
          ${e.order_number??e.number??`—`}
        </div>

        <div class="line"></div>

        ${o||`<div>Détail des articles indisponible</div>`}

        <div class="line"></div>

        <div>
          CLIENT :
          ${e.customer_name??e.customer?.name??`—`}
        </div>

        <div>
          TÉLÉPHONE :
          ${e.customer_phone??e.customer?.phone??`—`}
        </div>

        <div>
          RETRAIT :
          ${a}
        </div>

        <div class="total">
          <span>TOTAL</span>
          <span>
            ${i(e.total_cents??Number(e.total||0)*100)}
          </span>
        </div>

        <div class="center" style="margin-top:20px">
          MERCI
        </div>
      </body>
    </html>
  `),n.document.close(),n.focus(),n.print(),!0}var u=document.querySelector(`#admin-root`),d={NEW:`Nouvelle`,ACCEPTED:`Acceptée`,PREPARING:`En préparation`,READY:`Prête`,CANCELLED:`Annulée`},f=null,p=`local`,m=null,h=null,g=null;function _(){return JSON.parse(localStorage.getItem(`caz-food-orders`)||`[]`)}function v(e){localStorage.setItem(`caz-food-orders`,JSON.stringify(e))}function y(e){return`${Number(e).toFixed(2).replace(`.`,`,`)} €`}function b(e){if(!e)return`—`;let t=String(e).trim(),n=t.match(/^\d{4}-\d{2}-\d{2}[T ](\d{2}:\d{2})/);if(n)return n[1];let r=t.match(/^(\d{2}):(\d{2})/);return r?`${r[1]}:${r[2]}`:`—`}async function x(){if(!t){C();return}try{h=await o(t)}catch(e){console.error(`Erreur récupération session:`,e),T();return}if(h){try{g=await i(t)}catch(e){console.error(`Erreur résolution restaurant:`,e),w(e);return}f=e(t,g.id),p=`remote`,S(),await O();return}T()}function S(){m&&t&&t.removeChannel(m),m=c(t,()=>O())}function C(){u.innerHTML=`
    <main class="admin-auth">
      <div class="auth-card">
        <div class="auth-mark">
          CF
        </div>
        <p class="eyebrow">
          CAZ FOOD · CONFIGURATION
        </p>
        <h1>
          Le comptoir<br>
          <em>arrive bientôt.</em>
        </h1>
        <p>
          Ajoute
          <code>VITE_SUPABASE_URL</code>
          et
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
          dans Netlify pour activer le compte commerçant.
        </p>
      </div>
    </main>
  `}function w(e){u.innerHTML=`
    <main class="admin-auth">
      <div class="auth-card">
        <div class="auth-mark">
          CF
        </div>
        <p class="eyebrow">
          CAZ FOOD · LE COMPTOIR
        </p>
        <h1>
          Restaurant introuvable.
        </h1>
        <p>
          ${e?.message||`Impossible de résoudre ce restaurant FOODATOI.`}
        </p>
        <button
          class="primary full"
          type="button"
          id="retry-restaurant"
        >
          RÉESSAYER →
        </button>
        <a
          class="secondary auth-back"
          href="/"
        >
          ← Retour à la commande
        </a>
      </div>
    </main>
  `,u.querySelector(`#retry-restaurant`).onclick=()=>x()}function T(n=``){u.innerHTML=`
    <main class="admin-auth">
      <div class="auth-card">
        <div class="auth-mark">
          CF
        </div>
        <p class="eyebrow">
          CAZ FOOD · LE COMPTOIR
        </p>
        <h1>
          Bon retour.
        </h1>
        <p>
          Connexion réservée à l'équipe Caz Food.
        </p>
        ${n?`
              <div class="auth-error">
                ${n}
              </div>
            `:``}
        <form
          id="login-form"
          class="auth-form"
        >
          <label>
            EMAIL
            <input
              name="email"
              type="email"
              autocomplete="username"
              required
              placeholder="vous@cazfood.fr"
            >
          </label>
          <label>
            MOT DE PASSE
            <input
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
            >
          </label>
          <button
            class="primary full"
            type="submit"
          >
            OUVRIR LE COMPTOIR →
          </button>
        </form>
        <a
          class="secondary auth-back"
          href="/"
        >
          ← Retour à la commande
        </a>
      </div>
    </main>
  `;let r=u.querySelector(`#login-form`);r.onsubmit=async n=>{n.preventDefault();let r=new FormData(n.currentTarget),o=n.currentTarget.querySelector(`button`);o.disabled=!0,o.textContent=`CONNEXION…`;try{h=await a(t,r.get(`email`),r.get(`password`))}catch(e){console.error(`Erreur connexion admin:`,e),T(`Email ou mot de passe incorrect.`);return}try{g=await i(t),f=e(t,g.id),p=`remote`,S(),await O()}catch(e){console.error(`Erreur résolution restaurant:`,e),w(e)}}}async function E(){if(p===`remote`)try{return await f.listOrders()}catch(e){return console.error(`Erreur récupération commandes:`,e),[]}return _()}async function D(e){let t={NEW:`ACCEPTED`,ACCEPTED:`PREPARING`,PREPARING:`READY`}[e.status];if(t)try{p===`remote`?await f.updateStatus(e.id,t):v(r(_(),e.id,t)),await O()}catch(e){console.error(`Erreur changement statut:`,e),alert(`Impossible de modifier le statut de la commande.`)}}async function O(){if(!h&&p===`remote`){T();return}let e=(await E()).slice().sort((e,t)=>new Date(t.created_at??t.createdAt)-new Date(e.created_at??e.createdAt)),n=e.reduce((e,t)=>e+Number(t.total??(t.total_cents??0)/100),0);u.innerHTML=`
    <main class="admin-shell">
      <header class="admin-header">
        <div>
          <p class="eyebrow">
            CAZ FOOD · SERVICE
          </p>
          <h1>
            Le comptoir.
          </h1>
          <p>
            ${p===`remote`?`Commandes en direct · Supabase Realtime`:`Mode démo local`}
          </p>
        </div>
        <div class="admin-actions">
          <button
            class="secondary"
            id="logout"
          >
            Quitter
          </button>
          <a
            class="secondary"
            href="/"
          >
            ← Voir la commande
          </a>
        </div>
      </header>
      <section class="admin-stats">
        <div>
          <span>
            À prendre en charge
          </span>
          <strong>
            ${e.filter(e=>e.status===`NEW`).length}
          </strong>
        </div>
        <div>
          <span>
            En préparation
          </span>
          <strong>
            ${e.filter(e=>e.status===`PREPARING`).length}
          </strong>
        </div>
        <div>
          <span>
            Prêtes
          </span>
          <strong>
            ${e.filter(e=>e.status===`READY`).length}
          </strong>
        </div>
        <div>
          <span>
            Commandé
          </span>
          <strong>
            ${y(n)}
          </strong>
        </div>
      </section>
      <section class="orders-grid">
        ${e.length?e.map(k).join(``):`
              <div class="empty-ticket admin-empty">
                <div class="empty-ticket-mark">
                  +
                </div>
                <h2>
                  Le comptoir est calme.
                </h2>
                <p>
                  La prochaine commande apparaîtra ici
                  dès qu'elle sera envoyée.
                </p>
              </div>
            `}
      </section>
      <p class="admin-note">
        ●
        ${p===`remote`?`Temps réel actif. Les nouvelles commandes apparaissent automatiquement.`:`Mode démo local.`}
      </p>
    </main>
  `;let r=u.querySelector(`#logout`);r&&(r.onclick=async()=>{try{m&&t&&await t.removeChannel(m),t&&await s(t)}finally{h=null,g=null,f=null,p=`local`,m=null,T()}}),u.querySelectorAll(`[data-next]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&D(n)}}),u.querySelectorAll(`[data-print]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&l(n)}})}function k(e){let t=e.status,r=e.items??e.order_items??[],i={...e.customer??{},name:e.customer?.name??e.customer_name??`Client`,phone:e.customer?.phone??e.customer_phone??`—`,pickupTime:b(e.pickup_time)},a=e.number??e.order_number??`—`,o=e.total??(e.total_cents??0)/100,s=n(t),c=s?`
        <button
          class="primary"
          data-next
          data-id="${e.id}"
        >
          ${s} →
        </button>
      `:`
        <span class="ready-badge">
          ✓ Prête pour retrait
        </span>
      `;return`
    <article
      class="order-card status-${String(t).toLowerCase()}"
      data-order="${e.id}"
    >
      <header>
        <div>
          <span class="order-number">
            ${a}
          </span>
          <span class="status">
            ${d[t]??t}
          </span>
        </div>
        <strong>
          ${i.pickupTime||`—`}
        </strong>
      </header>
      <div class="order-customer">
        <strong>
          ${i.name}
        </strong>
        <span>
          ${i.phone}
        </span>
      </div>
      ${r.length?`
            <ul>
              ${r.map(e=>`
                    <li>
                      <strong>
                        ${e.quantity}×
                      </strong>
                      ${e.name??e.product_name??`Article`}
                      ${e.options?.meat?`
                            <small>
                              · ${e.options.meat}
                            </small>
                          `:``}
                      ${e.options?.sauce?`
                            <small>
                              · ${e.options.sauce}
                            </small>
                          `:``}
                      ${e.options?.drink?`
                            <small>
                              · ${e.options.drink}
                            </small>
                          `:``}
                    </li>
                  `).join(``)}
            </ul>
          `:`
            <p class="order-items-empty">
              Détail des articles indisponible
            </p>
          `}
      <footer>
        <strong>
          ${y(o)}
        </strong>
        <div class="order-actions">
          ${c}
          <button
            class="print-button"
            data-print
            data-id="${e.id}"
            title="Imprimer le ticket"
          >
            ⌁ TICKET
          </button>
        </div>
      </footer>
    </article>
  `}x();