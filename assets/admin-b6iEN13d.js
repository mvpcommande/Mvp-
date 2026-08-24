import{a as e,i as t,r as n,s as r,t as i}from"./styles-DVhRy9qT.js";async function a(e,t,n){let{data:r,error:i}=await e.auth.signInWithPassword({email:t,password:n});if(i)throw i;return r.session}async function o(e){let{data:t,error:n}=await e.auth.getSession();if(n)throw n;return t.session}async function s(e){let{error:t}=await e.auth.signOut();if(t)throw t}function c(e){let t=new Map;for(let n of e??[]){let e=n.order_items??n.items??[];for(let n of e){let e=n.product_name??n.name??`Article`,r=n.options?.meat??``,i=n.options?.sauce??``,a=n.options?.drink??``,o=[e,r,i,a].join(`|`),s=Number(n.quantity??0),c=Math.round(n.line_total_cents??(n.price??0)*s*100),l=t.get(o);l?(l.quantity+=s,l.revenueCents+=c):t.set(o,{name:e,meat:r,sauce:i,drink:a,quantity:s,revenueCents:c})}}return[...t.values()].sort((e,t)=>t.quantity-e.quantity||e.name.localeCompare(t.name))}function l(e){let t=e=>{let t=String(e??``);return/[;"\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t},n=[`Article`,`Viande`,`Sauce`,`Boisson`,`Quantité`,`Total (€)`],r=(e??[]).map(e=>[e.name,e.meat,e.sauce,e.drink,e.quantity,(e.revenueCents/100).toFixed(2).replace(`.`,`,`)].map(t).join(`;`));return[n.join(`;`),...r].join(`
`)}function u(e,t={},n=(e=``,t=`_blank`)=>window.open(e,t)){let r=n(``,`_blank`);if(!r)return!1;let i=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,a=(e??[]).reduce((e,t)=>e+t.quantity,0),o=(e??[]).reduce((e,t)=>e+t.revenueCents,0),s=(e??[]).map(e=>`
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
  `),r.document.close(),r.focus(),r.print(),!0}function d(e,t){if(!e)return null;let n=`caz-food-orders-${Date.now()}`,r=e.channel(n,{config:{broadcast:{self:!1},presence:{key:``}}}).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Nouvelle commande reçue`,e),t(e)}).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande mise à jour`,e),t(e)}).on(`postgres_changes`,{event:`DELETE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande supprimée`,e),t(e)});return r.subscribe((e,t)=>{console.log(`[Realtime] Statut:`,e),t&&console.error(`[Realtime] Erreur:`,t),e===`SUBSCRIBED`&&console.log(`[Realtime] Abonnement actif pour public.orders`),e===`CHANNEL_ERROR`&&console.error(`[Realtime] CHANNEL_ERROR`,t),e===`TIMED_OUT`&&console.error(`[Realtime] TIMED_OUT`),e===`CLOSED`&&console.warn(`[Realtime] Canal fermé`)}),r}function f(e,t=(e=``,t=`_blank`)=>window.open(e,t)){let n=t(``,`_blank`);if(!n)return!1;let r=e.order_items??e.items??[],i=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,a=e.pickup_time?new Date(e.pickup_time).toLocaleTimeString(`fr-FR`,{hour:`2-digit`,minute:`2-digit`}):`—`,o=r.map(e=>`
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
  `),n.document.close(),n.focus(),n.print(),!0}var p=document.querySelector(`#admin-root`),m={NEW:`Nouvelle`,ACCEPTED:`Acceptée`,PREPARING:`En préparation`,READY:`Prête`,CANCELLED:`Annulée`},h=null,g=`local`,_=null,v=null,y=null;function b(){return JSON.parse(localStorage.getItem(`caz-food-orders`)||`[]`)}function x(e){localStorage.setItem(`caz-food-orders`,JSON.stringify(e))}function S(e){return`${Number(e).toFixed(2).replace(`.`,`,`)} €`}function C(e){if(!e)return`—`;let t=String(e).trim(),n=t.match(/^\d{4}-\d{2}-\d{2}[T ](\d{2}:\d{2})/);if(n)return n[1];let r=t.match(/^(\d{2}):(\d{2})/);return r?`${r[1]}:${r[2]}`:`—`}async function w(){if(!t){E();return}try{v=await o(t)}catch(e){console.error(`Erreur récupération session:`,e),O();return}if(v){try{y=await i(t)}catch(e){console.error(`Erreur résolution restaurant:`,e),D(e);return}h=e(t,y.id),g=`remote`,T(),await j();return}O()}function T(){_&&t&&t.removeChannel(_),_=d(t,()=>j())}function E(){p.innerHTML=`
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
  `}function D(e){p.innerHTML=`
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
  `,p.querySelector(`#retry-restaurant`).onclick=()=>w()}function O(n=``){p.innerHTML=`
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
  `;let r=p.querySelector(`#login-form`);r.onsubmit=async n=>{n.preventDefault();let r=new FormData(n.currentTarget),o=n.currentTarget.querySelector(`button`);o.disabled=!0,o.textContent=`CONNEXION…`;try{v=await a(t,r.get(`email`),r.get(`password`))}catch(e){console.error(`Erreur connexion admin:`,e),O(`Email ou mot de passe incorrect.`);return}try{y=await i(t),h=e(t,y.id),g=`remote`,T(),await j()}catch(e){console.error(`Erreur résolution restaurant:`,e),D(e)}}}async function k(){if(g===`remote`)try{return await h.listOrders()}catch(e){return console.error(`Erreur récupération commandes:`,e),[]}return b()}async function A(e){let t={NEW:`ACCEPTED`,ACCEPTED:`PREPARING`,PREPARING:`READY`}[e.status];if(t)try{g===`remote`?await h.updateStatus(e.id,t):x(r(b(),e.id,t)),await j()}catch(e){console.error(`Erreur changement statut:`,e),alert(`Impossible de modifier le statut de la commande.`)}}async function j(){if(!v&&g===`remote`){O();return}let e=(await k()).slice().sort((e,t)=>new Date(t.created_at??t.createdAt)-new Date(e.created_at??e.createdAt)),n=e.reduce((e,t)=>e+Number(t.total??(t.total_cents??0)/100),0);p.innerHTML=`
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
            ${g===`remote`?`Commandes en direct · Supabase Realtime`:`Mode démo local`}
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
            ${S(n)}
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
        ${g===`remote`?`Temps réel actif. Les nouvelles commandes apparaissent automatiquement.`:`Mode démo local.`}
      </p>
    </main>
  `;let r=p.querySelector(`#logout`);r&&(r.onclick=async()=>{try{_&&t&&await t.removeChannel(_),t&&await s(t)}finally{v=null,y=null,h=null,g=`local`,_=null,O()}}),p.querySelectorAll(`[data-next]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&A(n)}}),p.querySelectorAll(`[data-print]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&f(n)}});let i=p.querySelector(`#export-stock`);i&&(i.onclick=()=>M(e));let a=p.querySelector(`#print-stock`);a&&(a.onclick=()=>u(c(e),{rangeLabel:`${e.length} commande${e.length>1?`s`:``} affichée${e.length>1?`s`:``}`})),p.querySelectorAll(`.order-card`).forEach(t=>{t.onclick=n=>{if(n.target.closest(`button`))return;let r=e.find(e=>String(e.id??``)===String(t.dataset.order));r&&P(r)}})}function M(e){let t=l(c(e)),n=new Blob([`﻿`+t],{type:`text/csv;charset=utf-8;`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`caz-food-stock-${new Date().toISOString().slice(0,10)}.csv`,i.click(),URL.revokeObjectURL(r)}function N(){let e=document.querySelector(`#order-detail-overlay`);e&&e.remove()}async function P(e){let t=e.items??e.order_items??[],n=e.total??(e.total_cents??0)/100,r=document.createElement(`div`);if(r.id=`order-detail-overlay`,r.className=`modal`,r.innerHTML=`
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
        ${m[e.status]??e.status}
      </p>
      <h2>
        ${e.customer?.name??e.customer_name??`Client`}
      </h2>
      <p>
        ${e.customer?.phone??e.customer_phone??`—`}
        · retrait
        ${C(e.pickup_time)||`—`}
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
                    ${S((e.line_total_cents??(e.price??0)*e.quantity*100)/100)}
                  </td>
                </tr>
              `).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td class="num">
              ${S(n)}
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
          ${g===`remote`?`Chargement…`:`Non disponible en mode local.`}
        </p>
      </div>
      <button
        class="secondary full"
        id="print-from-detail"
      >
        ⌁ Imprimer le ticket
      </button>
    </div>
  `,document.body.appendChild(r),r.onclick=e=>{e.target===r&&N()},r.querySelector(`#close-order-detail`).onclick=N,r.querySelector(`#print-from-detail`).onclick=()=>f(e),g===`remote`&&h?.getOrderEvents)try{let t=await h.getOrderEvents(e.id),n=r.querySelector(`#detail-timeline`);if(!n)return;n.innerHTML=`
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
                        ${m[e.from_status]??e.from_status??`—`}
                        →
                        ${m[e.to_status]??e.to_status}
                      </li>
                    `).join(``)}
              </ul>
            `:`
              <p class="detail-timeline-loading">
                Aucun changement de statut encore.
              </p>
            `}
      `}catch(e){console.error(`Erreur historique commande:`,e);let t=r.querySelector(`.detail-timeline-loading`);t&&(t.textContent=`Historique indisponible.`)}}function F(e){let t=e.status,r=e.items??e.order_items??[],i={...e.customer??{},name:e.customer?.name??e.customer_name??`Client`,phone:e.customer?.phone??e.customer_phone??`—`,pickupTime:C(e.pickup_time)},a=e.number??e.order_number??`—`,o=e.total??(e.total_cents??0)/100,s=n(t),c=s?`
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
            ${m[t]??t}
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
          ${S(o)}
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
  `}w();