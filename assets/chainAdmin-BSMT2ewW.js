import{n as e,t}from"./styles-DldXSre1.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{t as n}from"./errorLog-DYeNOlWf.js";import{c as r,s as i}from"./restaurantOwner-CqwJnIPL.js";async function a(e){let{data:t,error:n}=await e.from(`chains`).select(`*`).maybeSingle();if(n)throw n;return t}async function o(e,t){let{data:n,error:r}=await e.rpc(`get_chain_dashboard`,{p_chain_id:t});if(r)throw r;return n??[]}var s=document.querySelector(`#chain-admin-root`),c=`loading`,l=``,u=null,d=[];function f(e){return(e/100).toFixed(2).replace(`.`,`,`)+` €`}function p(){if(c===`loading`){s.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(c===`auth`){m();return}if(c===`no-chain`){s.innerHTML=`
      <div class="onboarding-shell narrow">
        <p class="eyebrow">FOODATOI · CHAÎNE</p>
        <h1>Aucune chaîne associée à ce compte.</h1>
        <p class="onboarding-lede">
          Ce compte n'est pas rattaché à une chaîne de restaurants.
          Contactez FOODATOI si vous pensez qu'il s'agit d'une erreur.
        </p>
        <button class="secondary full" id="logout" type="button">Se déconnecter</button>
      </div>
    `,document.querySelector(`#logout`).onclick=async()=>{await r(e),c=`auth`,p()};return}h()}function m(){s.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE CHAÎNE</p>
      <h1>Tableau de bord chaîne</h1>
      <p class="onboarding-lede">
        Suivez vos établissements en un coup d'œil. Cet espace est
        réservé aux comptes chaîne créés par FOODATOI.
      </p>

      ${l?`<p class="onboarding-error">${t(l)}</p>`:``}

      <form id="auth-form" class="order-form">
        <label>
          EMAIL
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label>
          MOT DE PASSE
          <input name="password" type="password" required minlength="6" autocomplete="current-password">
        </label>
        <button class="primary full" type="submit">Se connecter →</button>
      </form>
    </div>
  `,document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));l=``,c=`loading`,p();try{await i(e,n),await g()}catch(e){console.error(`[FOODATOI chain-admin]`,e),c=`auth`,l=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:`Impossible de se connecter pour le moment.`,p()}}}function h(){let n=d.reduce((e,t)=>e+t.orders_today,0),i=d.reduce((e,t)=>e+t.revenue_today_cents,0);s.innerHTML=`
    <div class="onboarding-shell">
      <p class="eyebrow">FOODATOI · CHAÎNE</p>
      <h1>${t(u.name)}</h1>
      <p class="onboarding-lede">
        ${d.length} établissement${d.length>1?`s`:``} ·
        ${n} commande${n>1?`s`:``} aujourd'hui ·
        ${f(i)} de chiffre d'affaires du jour
      </p>

      <div class="product-list">
        ${d.length?d.map(e=>`
                <a class="product-row chain-site-row" href="/admin.html?resto=${encodeURIComponent(e.slug)}">
                  <div class="product-row-main">
                    <strong>${t(e.name)}</strong>
                    <span>
                      ${e.is_active?`Actif`:`Inactif`} ·
                      ${e.orders_today} commande${e.orders_today>1?`s`:``} aujourd'hui ·
                      ${f(e.revenue_today_cents)}
                    </span>
                  </div>
                </a>
              `).join(``):`<p class="muted">Aucun établissement rattaché à cette chaîne pour le moment.</p>`}
      </div>

      <button class="secondary full" id="logout" type="button">Se déconnecter</button>
    </div>
  `,document.querySelector(`#logout`).onclick=async()=>{await r(e),c=`auth`,u=null,d=[],p()}}async function g(){if(u=await a(e),!u){c=`no-chain`,p();return}d=await o(e,u.id),c=`dashboard`,p()}async function _(){try{let{data:{user:t}}=await e.auth.getUser();if(!t){c=`auth`,p();return}await g()}catch(t){console.error(`[FOODATOI chain-admin]`,t),n(e,{restaurantId:null,context:`chain-admin.bootstrap`,message:t?.message??String(t),page:`chain-admin`}),c=`auth`,l=`Impossible de charger le tableau de bord pour le moment.`,p()}}_();