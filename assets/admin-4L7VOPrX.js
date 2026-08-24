import{a as e,i as t,r as n,s as r,t as i,u as a}from"./styles-DKdK2-Rq.js";async function o(e,t,n){let{data:r,error:i}=await e.auth.signInWithPassword({email:t,password:n});if(i)throw i;return r.session}async function s(e){let{data:t,error:n}=await e.auth.getSession();if(n)throw n;return t.session}async function c(e){let{error:t}=await e.auth.signOut();if(t)throw t}function l(e){let t=new Map;for(let n of e??[]){let e=n.order_items??n.items??[];for(let n of e){let e=n.product_name??n.name??`Article`,r=n.options?.meat??``,i=n.options?.sauce??``,a=n.options?.drink??``,o=[e,r,i,a].join(`|`),s=Number(n.quantity??0),c=Math.round(n.line_total_cents??(n.price??0)*s*100),l=t.get(o);l?(l.quantity+=s,l.revenueCents+=c):t.set(o,{name:e,meat:r,sauce:i,drink:a,quantity:s,revenueCents:c})}}return[...t.values()].sort((e,t)=>t.quantity-e.quantity||e.name.localeCompare(t.name))}function u(e){let t=e=>{let t=String(e??``);return/[;"\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t},n=[`Article`,`Viande`,`Sauce`,`Boisson`,`Quantité`,`Total (€)`],r=(e??[]).map(e=>[e.name,e.meat,e.sauce,e.drink,e.quantity,(e.revenueCents/100).toFixed(2).replace(`.`,`,`)].map(t).join(`;`));return[n.join(`;`),...r].join(`
`)}function d(e,t={},n=(e=``,t=`_blank`)=>window.open(e,t)){let r=n(``,`_blank`);if(!r)return!1;let i=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,a=(e??[]).reduce((e,t)=>e+t.quantity,0),o=(e??[]).reduce((e,t)=>e+t.revenueCents,0),s=(e??[]).map(e=>`
        <tr>
          <td>${e.name}</td>
          <td>${[e.meat,e.sauce,e.drink].filter(Boolean).join(` · `)||`—`}</td>
          <td class="num">${e.quantity}</td>
          <td class="num">${i(e.revenueCents)}</td>
        </tr>
      `).join(``);return r.document.write(`
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Résumé stock — Caz Food</title>

        <style>
          body { font: 13px/1.4 sans-serif; margin: 0; padding: 24px; color: #111; }
          h1 { font-size: 18px; margin: 0 0 2px; }
          p.meta { color: #666; margin: 0 0 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 7px 6px; border-bottom: 1px solid #ddd; }
          th { font-size: 11px; text-transform: uppercase; letter-spacing: .03em; color: #666; }
          td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
          tfoot td { font-weight: bold; border-top: 2px solid #111; border-bottom: none; }
        </style>
      </head>

      <body>
        <h1>Résumé stock — Caz Food</h1>
        <p class="meta">
          ${t.rangeLabel??`Toutes les commandes affichées`} ·
          généré le ${new Date().toLocaleString(`fr-FR`)}
        </p>

        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Options</th>
              <th class="num">Qté</th>
              <th class="num">Total</th>
            </tr>
          </thead>
          <tbody>
            ${s||`<tr><td colspan="4">Aucun article</td></tr>`}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total</td>
              <td class="num">${a}</td>
              <td class="num">${i(o)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `),r.document.close(),r.focus(),r.print(),!0}function f(e,t,n){if(!e)return null;let r=`caz-food-orders-${Date.now()}`,i=e.channel(r,{config:{broadcast:{self:!1},presence:{key:``}}}).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Nouvelle commande reçue`,e),t(e)}).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande mise à jour`,e),t(e)}).on(`postgres_changes`,{event:`DELETE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande supprimée`,e),t(e)});return i.subscribe((e,t)=>{console.log(`[Realtime] Statut:`,e),t&&console.error(`[Realtime] Erreur:`,t),e===`SUBSCRIBED`&&console.log(`[Realtime] Abonnement actif pour public.orders`),e===`CHANNEL_ERROR`&&console.error(`[Realtime] CHANNEL_ERROR`,t),e===`TIMED_OUT`&&console.error(`[Realtime] TIMED_OUT`),e===`CLOSED`&&console.warn(`[Realtime] Canal fermé`),n?.(e,t)}),i}function p(e,t=(e=``,t=`_blank`)=>window.open(e,t)){let n=t(``,`_blank`);if(!n)return!1;let i=e.order_items??e.items??[],a=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,o=r(e.pickup_time),s=i.map(e=>`
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
            ${a(e.line_total_cents??(e.price||0)*e.quantity*100)}
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

        ${s||`<div>Détail des articles indisponible</div>`}

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
          ${o}
        </div>

        <div class="total">
          <span>TOTAL</span>
          <span>
            ${a(e.total_cents??Number(e.total||0)*100)}
          </span>
        </div>

        <div class="center" style="margin-top:20px">
          MERCI
        </div>
      </body>
    </html>
  `),n.document.close(),n.focus(),n.print(),!0}var m=document.querySelector(`#admin-root`),h={NEW:`Nouvelle`,ACCEPTED:`Acceptée`,PREPARING:`En préparation`,READY:`Prête`,CANCELLED:`Annulée`},g=null,_=`local`,v=null,y=null,b=null;function x(){return JSON.parse(localStorage.getItem(`caz-food-orders`)||`[]`)}function S(e){localStorage.setItem(`caz-food-orders`,JSON.stringify(e))}function C(e){return`${Number(e).toFixed(2).replace(`.`,`,`)} €`}async function w(){if(!t){E();return}try{y=await s(t)}catch(e){console.error(`Erreur récupération session:`,e),O();return}if(y){try{b=await i(t)}catch(e){console.error(`Erreur résolution restaurant:`,e),D(e);return}g=e(t,b.id),_=`remote`,T(),await j();return}O()}function T(){v&&t&&t.removeChannel(v),t&&y?.access_token&&t.realtime.setAuth(y.access_token),v=f(t,()=>j(),e=>{(e===`CLOSED`||e===`TIMED_OUT`||e===`CHANNEL_ERROR`)&&_===`remote`&&(console.warn(`[Realtime] Reconnexion dans 3s...`),setTimeout(()=>{_===`remote`&&T()},3e3))})}function E(){m.innerHTML=`
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
  `}function D(e){m.innerHTML=`
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
  `,m.querySelector(`#retry-restaurant`).onclick=()=>w()}function O(n=``){m.innerHTML=`
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
  `;let r=m.querySelector(`#login-form`);r.onsubmit=async n=>{n.preventDefault();let r=new FormData(n.currentTarget),a=n.currentTarget.querySelector(`button`);a.disabled=!0,a.textContent=`CONNEXION…`;try{y=await o(t,r.get(`email`),r.get(`password`))}catch(e){console.error(`Erreur connexion admin:`,e),O(`Email ou mot de passe incorrect.`);return}try{b=await i(t),g=e(t,b.id),_=`remote`,T(),await j()}catch(e){console.error(`Erreur résolution restaurant:`,e),D(e)}}}async function k(){if(_===`remote`)try{return await g.listOrders()}catch(e){return console.error(`Erreur récupération commandes:`,e),[]}return x()}async function A(e){let t={NEW:`ACCEPTED`,ACCEPTED:`PREPARING`,PREPARING:`READY`}[e.status];if(t)try{_===`remote`?await g.updateStatus(e.id,t):S(a(x(),e.id,t)),await j()}catch(e){console.error(`Erreur changement statut:`,e),alert(`Impossible de modifier le statut de la commande.`)}}async function j(){if(!y&&_===`remote`){O();return}let e=(await k()).slice().sort((e,t)=>new Date(t.created_at??t.createdAt)-new Date(e.created_at??e.createdAt)),n=e.reduce((e,t)=>e+Number(t.total??(t.total_cents??0)/100),0);m.innerHTML=`
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
            ${_===`remote`?`Commandes en direct · Supabase Realtime`:`Mode démo local`}
          </p>
        </div>
        <div class="admin-actions">
          <button
            class="secondary"
            id="export-stock"
          >
            Exporter (CSV)
          </button>
          <button
            class="secondary"
            id="print-stock"
          >
            Imprimer le résumé
          </button>
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
            ${C(n)}
          </strong>
        </div>
      </section>
      <section class="orders-grid">
        ${e.length?e.map(F).join(``):`
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
        ${_===`remote`?`Temps réel actif. Les nouvelles commandes apparaissent automatiquement.`:`Mode démo local.`}
      </p>
    </main>
  `;let r=m.querySelector(`#logout`);r&&(r.onclick=async()=>{try{v&&t&&await t.removeChannel(v),t&&await c(t)}finally{y=null,b=null,g=null,_=`local`,v=null,O()}}),m.querySelectorAll(`[data-next]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&A(n)}}),m.querySelectorAll(`[data-print]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&p(n)}});let i=m.querySelector(`#export-stock`);i&&(i.onclick=()=>M(e));let a=m.querySelector(`#print-stock`);a&&(a.onclick=()=>d(l(e),{rangeLabel:`${e.length} commande${e.length>1?`s`:``} affichée${e.length>1?`s`:``}`})),m.querySelectorAll(`.order-card`).forEach(t=>{t.onclick=n=>{if(n.target.closest(`button`))return;let r=e.find(e=>String(e.id??``)===String(t.dataset.order));r&&P(r)}})}function M(e){let t=u(l(e)),n=new Blob([`﻿`+t],{type:`text/csv;charset=utf-8;`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`caz-food-stock-${new Date().toISOString().slice(0,10)}.csv`,i.click(),URL.revokeObjectURL(r)}function N(){let e=document.querySelector(`#order-detail-overlay`);e&&e.remove()}async function P(e){let t=e.items??e.order_items??[],n=e.total??(e.total_cents??0)/100,i=document.createElement(`div`);if(i.id=`order-detail-overlay`,i.className=`modal`,i.innerHTML=`
    <div class="modal-card order-detail-card">
      <button
        class="modal-close"
        id="close-order-detail"
      >
        ×
      </button>
      <p class="eyebrow">
        ${e.number??e.order_number??`—`}
        ·
        ${h[e.status]??e.status}
      </p>
      <h2>
        ${e.customer?.name??e.customer_name??`Client`}
      </h2>
      <p>
        ${e.customer?.phone??e.customer_phone??`—`}
        · retrait
        ${r(e.pickup_time)||`—`}
      </p>
      <table class="detail-items">
        <tbody>
          ${t.map(e=>`
                <tr>
                  <td>
                    <strong>
                      ${e.quantity}×
                      ${e.name??e.product_name??`Article`}
                    </strong>
                    <br>
                    <small>
                      ${[e.options?.meat,e.options?.sauce,e.options?.drink].filter(Boolean).join(` · `)||`—`}
                    </small>
                  </td>
                  <td class="num">
                    ${C((e.line_total_cents??(e.price??0)*e.quantity*100)/100)}
                  </td>
                </tr>
              `).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td class="num">
              ${C(n)}
            </td>
          </tr>
        </tfoot>
      </table>
      ${e.notes?`
            <p class="detail-notes">
              <strong>Note :</strong>
              ${e.notes}
            </p>
          `:``}
      <div id="detail-timeline">
        <p class="eyebrow">
          Historique
        </p>
        <p class="detail-timeline-loading">
          ${_===`remote`?`Chargement…`:`Non disponible en mode local.`}
        </p>
      </div>
      <button
        class="secondary full"
        id="print-from-detail"
      >
        ⌁ Imprimer le ticket
      </button>
    </div>
  `,document.body.appendChild(i),i.onclick=e=>{e.target===i&&N()},i.querySelector(`#close-order-detail`).onclick=N,i.querySelector(`#print-from-detail`).onclick=()=>p(e),_===`remote`&&g?.getOrderEvents)try{let t=await g.getOrderEvents(e.id),n=i.querySelector(`#detail-timeline`);if(!n)return;n.innerHTML=`
        <p class="eyebrow">
          Historique
        </p>
        ${t.length?`
              <ul class="detail-timeline-list">
                ${t.map(e=>`
                      <li>
                        <span>
                          ${new Date(e.created_at).toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`})}
                        </span>
                        ${h[e.from_status]??e.from_status??`—`}
                        →
                        ${h[e.to_status]??e.to_status}
                      </li>
                    `).join(``)}
              </ul>
            `:`
              <p class="detail-timeline-loading">
                Aucun changement de statut encore.
              </p>
            `}
      `}catch(e){console.error(`Erreur historique commande:`,e);let t=i.querySelector(`.detail-timeline-loading`);t&&(t.textContent=`Historique indisponible.`)}}function F(e){let t=e.status,i=e.items??e.order_items??[],a={...e.customer??{},name:e.customer?.name??e.customer_name??`Client`,phone:e.customer?.phone??e.customer_phone??`—`,pickupTime:r(e.pickup_time)},o=e.number??e.order_number??`—`,s=e.total??(e.total_cents??0)/100,c=n(t),l=c?`
        <button
          class="primary"
          data-next
          data-id="${e.id}"
        >
          ${c} →
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
            ${o}
          </span>
          <span class="status">
            ${h[t]??t}
          </span>
        </div>
        <strong>
          ${a.pickupTime||`—`}
        </strong>
      </header>
      <div class="order-customer">
        <strong>
          ${a.name}
        </strong>
        <span>
          ${a.phone}
        </span>
      </div>
      ${i.length?`
            <ul>
              ${i.map(e=>`
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
          ${C(s)}
        </strong>
        <div class="order-actions">
          ${l}
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
  `}w();