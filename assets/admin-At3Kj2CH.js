import{a as e,f as t,l as n,n as r,o as i,r as a,s as o,t as s}from"./styles-99hEtAtt.js";async function c(e,t,n){let{data:r,error:i}=await e.auth.signInWithPassword({email:t,password:n});if(i)throw i;return r.session}async function l(e){let{data:t,error:n}=await e.auth.getSession();if(n)throw n;return t.session}async function u(e){let{error:t}=await e.auth.signOut();if(t)throw t}function d(e){let t=new Map;for(let n of e??[]){let e=n.order_items??n.items??[];for(let n of e){let e=n.product_name??n.name??`Article`,r=n.options?.meat??``,i=n.options?.sauce??``,a=n.options?.drink??``,o=[e,r,i,a].join(`|`),s=Number(n.quantity??0),c=Math.round(n.line_total_cents??(n.price??0)*s*100),l=t.get(o);l?(l.quantity+=s,l.revenueCents+=c):t.set(o,{name:e,meat:r,sauce:i,drink:a,quantity:s,revenueCents:c})}}return[...t.values()].sort((e,t)=>t.quantity-e.quantity||e.name.localeCompare(t.name))}function f(e){let t=e=>{let t=String(e??``);return/[;"\n]/.test(t)?`"${t.replace(/"/g,`""`)}"`:t},n=[`Article`,`Viande`,`Sauce`,`Boisson`,`Quantité`,`Total (€)`],r=(e??[]).map(e=>[e.name,e.meat,e.sauce,e.drink,e.quantity,(e.revenueCents/100).toFixed(2).replace(`.`,`,`)].map(t).join(`;`));return[n.join(`;`),...r].join(`
`)}function p(e,t={},n=(e=``,t=`_blank`)=>window.open(e,t)){let r=n(``,`_blank`);if(!r)return!1;let i=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,a=(e??[]).reduce((e,t)=>e+t.quantity,0),o=(e??[]).reduce((e,t)=>e+t.revenueCents,0),s=(e??[]).map(e=>`
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
  `),r.document.close(),r.focus(),r.print(),!0}function m(e,t){if(!t||t<=0)return null;let n=(e??[]).filter(e=>e.status!==`CANCELLED`),r=n.reduce((e,t)=>e+Math.round(Number(t.total??(t.total_cents??0)/100)*100),0);return{orderCount:n.length,totalCents:r,savingsCents:Math.round(r*t)}}function h(e,t,n){if(!e)return null;let r=`caz-food-orders-${Date.now()}`,i=e.channel(r,{config:{broadcast:{self:!1},presence:{key:``}}}).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Nouvelle commande reçue`,e),t(e)}).on(`postgres_changes`,{event:`UPDATE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande mise à jour`,e),t(e)}).on(`postgres_changes`,{event:`DELETE`,schema:`public`,table:`orders`},e=>{console.log(`[Realtime] Commande supprimée`,e),t(e)});return i.subscribe((e,t)=>{console.log(`[Realtime] Statut:`,e),t&&console.error(`[Realtime] Erreur:`,t),e===`SUBSCRIBED`&&console.log(`[Realtime] Abonnement actif pour public.orders`),e===`CHANNEL_ERROR`&&console.error(`[Realtime] CHANNEL_ERROR`,t),e===`TIMED_OUT`&&console.error(`[Realtime] TIMED_OUT`),e===`CLOSED`&&console.warn(`[Realtime] Canal fermé`),n?.(e,t)}),i}function g(e,t=(e=``,t=`_blank`)=>window.open(e,t)){let r=t(``,`_blank`);if(!r)return!1;let i=e.order_items??e.items??[],a=e=>`${(Number(e||0)/100).toFixed(2).replace(`.`,`,`)} €`,o=n(e.pickup_time),c=i.map(e=>`
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
      `).join(``);return r.document.write(`
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

        ${c||`<div>Détail des articles indisponible</div>`}

        <div class="line"></div>

        <div>
          CLIENT :
          ${s(e.customer_name??e.customer?.name??`—`)}
        </div>

        <div>
          TÉLÉPHONE :
          ${s(e.customer_phone??e.customer?.phone??`—`)}
        </div>

        <div>
          RETRAIT :
          ${o}
        </div>

        ${e.notes?`
              <div class="line"></div>
              <div style="border:1px solid #111;padding:6px;font-weight:bold">
                NOTE : ${s(e.notes)}
              </div>
            `:``}

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
  `),r.document.close(),r.focus(),r.print(),!0}var _=document.querySelector(`#admin-root`),v={NEW:`Nouvelle`,ACCEPTED:`Acceptée`,PREPARING:`En préparation`,READY:`Prête`,CANCELLED:`Annulée`},y=null,b=`local`,x=null,S=null,C=null;function w(){return JSON.parse(localStorage.getItem(`caz-food-orders`)||`[]`)}function T(e){localStorage.setItem(`caz-food-orders`,JSON.stringify(e))}function E(e){return`${Number(e).toFixed(2).replace(`.`,`,`)} €`}async function D(){if(!i){k();return}try{S=await l(i)}catch(e){console.error(`Erreur récupération session:`,e),j();return}if(S){try{C=await a(i)}catch(e){console.error(`Erreur résolution restaurant:`,e),r(i,{context:`admin.resolveRestaurant`,message:e?.message??String(e),page:`admin`}),A(e);return}y=o(i,C.id),b=`remote`,O(),await P();return}j()}function O(){x&&i&&i.removeChannel(x),i&&S?.access_token&&i.realtime.setAuth(S.access_token),x=h(i,()=>P(),e=>{(e===`CLOSED`||e===`TIMED_OUT`||e===`CHANNEL_ERROR`)&&b===`remote`&&(console.warn(`[Realtime] Reconnexion dans 3s...`),r(i,{restaurantId:C?.id,context:`admin.realtime`,message:`Canal realtime perdu (${e}), reconnexion dans 3s`,page:`admin`}),setTimeout(()=>{b===`remote`&&O()},3e3))})}function k(){_.innerHTML=`
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
  `}function A(e){_.innerHTML=`
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
  `,_.querySelector(`#retry-restaurant`).onclick=()=>D()}function j(e=``){_.innerHTML=`
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
        ${e?`
              <div class="auth-error">
                ${e}
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
  `;let t=_.querySelector(`#login-form`);t.onsubmit=async e=>{e.preventDefault();let t=new FormData(e.currentTarget),n=e.currentTarget.querySelector(`button`);n.disabled=!0,n.textContent=`CONNEXION…`;try{S=await c(i,t.get(`email`),t.get(`password`))}catch(e){console.error(`Erreur connexion admin:`,e),j(`Email ou mot de passe incorrect.`);return}try{C=await a(i),y=o(i,C.id),b=`remote`,O(),await P()}catch(e){console.error(`Erreur résolution restaurant:`,e),A(e)}}}async function M(){if(b===`remote`)try{return await y.listOrders()}catch(e){return console.error(`Erreur récupération commandes:`,e),[]}return w()}async function N(e){let n={NEW:`ACCEPTED`,ACCEPTED:`PREPARING`,PREPARING:`READY`}[e.status];if(n)try{b===`remote`?await y.updateStatus(e.id,n):T(t(w(),e.id,n)),await P()}catch(t){console.error(`Erreur changement statut:`,t),r(i,{restaurantId:C?.id,context:`admin.updateStatus`,message:t?.message??String(t),details:{orderId:e.id,from:e.status,to:n},page:`admin`}),alert(`Impossible de modifier le statut de la commande.`)}}async function P(){if(!S&&b===`remote`){j();return}let e=(await M()).slice().sort((e,t)=>new Date(t.created_at??t.createdAt)-new Date(e.created_at??e.createdAt)),t=e.reduce((e,t)=>e+Number(t.total??(t.total_cents??0)/100),0);_.innerHTML=`
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
            ${b===`remote`?`Commandes en direct · Supabase Realtime`:`Mode démo local`}
          </p>
        </div>
        <div class="admin-actions">
          <button
            class="secondary"
            id="system-health"
          >
            État système
          </button>
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
            ${E(t)}
          </strong>
        </div>
      </section>
      ${(()=>{let t=m(e,C?.settings?.uber_eats_commission_rate);return!t||!t.orderCount?``:`
            <section class="roi-banner">
              <p class="eyebrow">
                VOTRE ÉCONOMIE FOODATOI
              </p>
              <p>
                ${t.orderCount}
                commande${t.orderCount>1?`s`:``}
                prise${t.orderCount>1?`s`:``} en direct.
                Au tarif standard Uber Eats (livraison, 30 %),
                ça aurait coûté environ
                <strong>${E(t.savingsCents/100)}</strong>
                de commission. Avec FOODATOI, cette marge reste
                intégralement chez vous.
              </p>
            </section>
          `})()}
      <section class="orders-grid">
        ${e.length?e.map(z).join(``):`
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
        ${b===`remote`?`Temps réel actif. Les nouvelles commandes apparaissent automatiquement.`:`Mode démo local.`}
      </p>
    </main>
  `;let n=_.querySelector(`#logout`);n&&(n.onclick=async()=>{try{x&&i&&await i.removeChannel(x),i&&await u(i)}finally{S=null,C=null,y=null,b=`local`,x=null,j()}}),_.querySelectorAll(`[data-next]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&N(n)}}),_.querySelectorAll(`[data-print]`).forEach(t=>{t.onclick=()=>{let n=e.find(e=>String(e.id??``)===String(t.dataset.id));n&&g(n)}});let r=_.querySelector(`#export-stock`);r&&(r.onclick=()=>F(e));let a=_.querySelector(`#system-health`);a&&(a.onclick=()=>R());let o=_.querySelector(`#print-stock`);o&&(o.onclick=()=>p(d(e),{rangeLabel:`${e.length} commande${e.length>1?`s`:``} affichée${e.length>1?`s`:``}`})),_.querySelectorAll(`.order-card`).forEach(t=>{t.onclick=n=>{if(n.target.closest(`button`))return;let r=e.find(e=>String(e.id??``)===String(t.dataset.order));r&&L(r)}})}function F(e){let t=f(d(e)),n=new Blob([`﻿`+t],{type:`text/csv;charset=utf-8;`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`caz-food-stock-${new Date().toISOString().slice(0,10)}.csv`,i.click(),URL.revokeObjectURL(r)}function I(){let e=document.querySelector(`#order-detail-overlay`);e&&e.remove()}async function L(e){let t=e.items??e.order_items??[],r=e.total??(e.total_cents??0)/100,i=document.createElement(`div`);if(i.id=`order-detail-overlay`,i.className=`modal`,i.innerHTML=`
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
        ${v[e.status]??e.status}
      </p>
      <h2>
        ${e.customer?.name??e.customer_name??`Client`}
      </h2>
      <p>
        ${e.customer?.phone??e.customer_phone??`—`}
        · retrait
        ${n(e.pickup_time)||`—`}
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
                    ${E((e.line_total_cents??(e.price??0)*e.quantity*100)/100)}
                  </td>
                </tr>
              `).join(``)}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td class="num">
              ${E(r)}
            </td>
          </tr>
        </tfoot>
      </table>
      ${e.notes?`
            <p class="detail-notes">
              <strong>Note :</strong>
              ${s(e.notes)}
            </p>
          `:``}
      <div id="detail-timeline">
        <p class="eyebrow">
          Historique
        </p>
        <p class="detail-timeline-loading">
          ${b===`remote`?`Chargement…`:`Non disponible en mode local.`}
        </p>
      </div>
      <button
        class="secondary full"
        id="print-from-detail"
      >
        ⌁ Imprimer le ticket
      </button>
    </div>
  `,document.body.appendChild(i),i.onclick=e=>{e.target===i&&I()},i.querySelector(`#close-order-detail`).onclick=I,i.querySelector(`#print-from-detail`).onclick=()=>g(e),b===`remote`&&y?.getOrderEvents)try{let t=await y.getOrderEvents(e.id),n=i.querySelector(`#detail-timeline`);if(!n)return;n.innerHTML=`
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
                        ${v[e.from_status]??e.from_status??`—`}
                        →
                        ${v[e.to_status]??e.to_status}
                      </li>
                    `).join(``)}
              </ul>
            `:`
              <p class="detail-timeline-loading">
                Aucun changement de statut encore.
              </p>
            `}
      `}catch(e){console.error(`Erreur historique commande:`,e);let t=i.querySelector(`.detail-timeline-loading`);t&&(t.textContent=`Historique indisponible.`)}}async function R(){let e=document.createElement(`div`);if(e.id=`system-health-overlay`,e.className=`modal`,e.innerHTML=`
    <div class="modal-card order-detail-card">
      <button
        class="modal-close"
        id="close-system-health"
      >
        ×
      </button>
      <p class="eyebrow">
        Diagnostic
      </p>
      <h2>
        État système
      </h2>
      <p id="health-loading">
        ${b===`remote`?`Chargement…`:`Non disponible en mode local.`}
      </p>
    </div>
  `,document.body.appendChild(e),e.onclick=t=>{t.target===e&&e.remove()},e.querySelector(`#close-system-health`).onclick=()=>e.remove(),!(b!==`remote`||!y?.getRecentErrors))try{let t=await y.getRecentErrors(),n=e.querySelector(`#health-loading`);if(!n)return;n.outerHTML=t.length?`
        <p>
          ${t.length} erreur${t.length>1?`s`:``}
          enregistrée${t.length>1?`s`:``}, la plus récente en premier.
        </p>
        <ul class="detail-timeline-list health-list">
          ${t.map(e=>`
                <li>
                  <span>
                    ${new Date(e.created_at).toLocaleString(`fr-FR`,{day:`2-digit`,month:`2-digit`,hour:`2-digit`,minute:`2-digit`})}
                  </span>
                  <div>
                    <strong>
                      ${e.context??`—`}
                    </strong>
                    <br>
                    ${e.message??``}
                  </div>
                </li>
              `).join(``)}
        </ul>
      `:`
        <p>
          Aucune erreur enregistrée récemment. Bon signe.
        </p>
      `}catch(t){console.error(`Erreur chargement état système:`,t);let n=e.querySelector(`#health-loading`);n&&(n.textContent=`Impossible de charger les logs.`)}}function z(t){let r=t.status,i=t.items??t.order_items??[],a={...t.customer??{},name:t.customer?.name??t.customer_name??`Client`,phone:t.customer?.phone??t.customer_phone??`—`,pickupTime:n(t.pickup_time)},o=t.number??t.order_number??`—`,s=t.total??(t.total_cents??0)/100,c=e(r),l=c?`
        <button
          class="primary"
          data-next
          data-id="${t.id}"
        >
          ${c} →
        </button>
      `:`
        <span class="ready-badge">
          ✓ Prête pour retrait
        </span>
      `;return`
    <article
      class="order-card status-${String(r).toLowerCase()}"
      data-order="${t.id}"
    >
      <header>
        <div>
          <span class="order-number">
            ${o}
          </span>
          <span class="status">
            ${v[r]??r}
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
          ${E(s)}
        </strong>
        <div class="order-actions">
          ${l}
          <button
            class="print-button"
            data-print
            data-id="${t.id}"
            title="Imprimer le ticket"
          >
            ⌁ TICKET
          </button>
        </div>
      </footer>
    </article>
  `}D();