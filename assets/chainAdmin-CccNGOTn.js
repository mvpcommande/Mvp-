import{i as e,n as t,r as n,t as r}from"./styles-CuOxO0W1.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{c as i,s as a}from"./restaurantOwner-CqwJnIPL.js";async function o(e){let{data:t,error:n}=await e.from(`chains`).select(`*`).maybeSingle();if(n)throw n;return t}async function s(e,t){let{data:n,error:r}=await e.rpc(`get_chain_dashboard`,{p_chain_id:t});if(r)throw r;return n??[]}t(e,{page:`chain-admin`,getRestaurantId:()=>null});var c=document.querySelector(`#chain-admin-root`),l=`loading`,u=``,d=null,f=[];function p(e){return(e/100).toFixed(2).replace(`.`,`,`)+` €`}function m(){if(l===`loading`){c.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(l===`auth`){h();return}if(l===`no-chain`){c.innerHTML=`
      <div class="onboarding-shell narrow">
        <p class="eyebrow">FOODATOI · CHAÎNE</p>
        <h1>Aucune chaîne associée à ce compte.</h1>
        <p class="onboarding-lede">
          Ce compte n'est pas rattaché à une chaîne de restaurants.
          Contactez FOODATOI si vous pensez qu'il s'agit d'une erreur.
        </p>
        <button class="secondary full" id="logout" type="button">Se déconnecter</button>
      </div>
    `,document.querySelector(`#logout`).onclick=async()=>{await i(e),l=`auth`,m()};return}g()}function h(){c.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE CHAÎNE</p>
      <h1>Tableau de bord chaîne</h1>
      <p class="onboarding-lede">
        Suivez vos établissements en un coup d'œil. Cet espace est
        réservé aux comptes chaîne créés par FOODATOI.
      </p>

      ${u?`<p class="onboarding-error">${r(u)}</p>`:``}

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
  `,document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));u=``,l=`loading`,m();try{await a(e,n),await _()}catch(e){console.error(`[FOODATOI chain-admin]`,e),l=`auth`,u=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:`Impossible de se connecter pour le moment.`,m()}}}function g(){let t=f.reduce((e,t)=>e+t.orders_today,0),n=f.reduce((e,t)=>e+t.revenue_today_cents,0);c.innerHTML=`
    <div class="onboarding-shell">
      <p class="eyebrow">FOODATOI · CHAÎNE</p>
      <h1>${r(d.name)}</h1>
      <p class="onboarding-lede">
        ${f.length} établissement${f.length>1?`s`:``} ·
        ${t} commande${t>1?`s`:``} aujourd'hui ·
        ${p(n)} de chiffre d'affaires du jour
      </p>

      <div class="product-list">
        ${f.length?f.map(e=>`
                <a class="product-row chain-site-row" href="/admin.html?resto=${encodeURIComponent(e.slug)}">
                  <div class="product-row-main">
                    <strong>${r(e.name)}</strong>
                    <span>
                      ${e.is_active?`Actif`:`Inactif`} ·
                      ${e.orders_today} commande${e.orders_today>1?`s`:``} aujourd'hui ·
                      ${p(e.revenue_today_cents)}
                    </span>
                  </div>
                </a>
              `).join(``):`<p class="muted">Aucun établissement rattaché à cette chaîne pour le moment.</p>`}
      </div>

      <button class="secondary full" id="logout" type="button">Se déconnecter</button>
    </div>
  `,document.querySelector(`#logout`).onclick=async()=>{await i(e),l=`auth`,d=null,f=[],m()}}async function _(){if(d=await o(e),!d){l=`no-chain`,m();return}f=await s(e,d.id),l=`dashboard`,m()}async function v(){try{let{data:{user:t}}=await e.auth.getUser();if(!t){l=`auth`,m();return}await _()}catch(t){console.error(`[FOODATOI chain-admin]`,t),n(e,{restaurantId:null,context:`chain-admin.bootstrap`,message:t?.message??String(t),page:`chain-admin`}),l=`auth`,u=`Impossible de charger le tableau de bord pour le moment.`,m()}}v();