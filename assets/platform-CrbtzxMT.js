import{i as e,n as t,t as n}from"./styles-BeptKHnq.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{c as r,s as i}from"./restaurantOwner-CqwJnIPL.js";t(e,{page:`platform`,getRestaurantId:()=>null});var a=document.querySelector(`#platform-root`),o=`loading`,s=``,c=[];async function l(){if(!e){o=`error`,s=`Supabase n’est pas configuré.`,d();return}let{data:{session:t}}=await e.auth.getSession();if(!t){o=`auth`,d();return}await u()}async function u(){o=`loading`,d();let{data:t,error:n}=await e.from(`restaurants`).select(`*`).eq(`is_active`,!1).order(`created_at`,{ascending:!0});if(n){console.error(`[FOODATOI platform]`,n),o=`auth`,s=`Accès refusé ou session expirée. Reconnectez-vous avec le compte plateforme.`,d();return}c=t??[],o=`dashboard`,d()}function d(){if(o===`loading`){a.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI · PLATEFORME</p><h1>Chargement…</h1></div>`;return}if(o===`error`){a.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Erreur</h1><p>${n(s)}</p></div>`;return}if(o===`auth`){f();return}p()}function f(){a.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · PLATEFORME</p>
      <h1>Connexion</h1>
      ${s?`<p class="onboarding-error">${n(s)}</p>`:``}
      <form id="login-form" class="order-form">
        <label>EMAIL<input name="email" type="email" required autocomplete="email"></label>
        <label>MOT DE PASSE<input name="password" type="password" required autocomplete="current-password"></label>
        <button class="primary full" type="submit">Se connecter →</button>
      </form>
    </div>
  `,document.querySelector(`#login-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));s=``,o=`loading`,d();try{await i(e,n),await u()}catch(e){console.error(`[FOODATOI platform]`,e),o=`auth`,s=`Email ou mot de passe incorrect.`,d()}}}function p(){a.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · PLATEFORME</p>
          <h1>Restaurants en attente.</h1>
        </div>
        <button class="secondary" id="signout-btn" type="button">Se déconnecter</button>
      </div>

      ${c.length?`<div class="product-list">
              ${c.map(e=>`
                <div class="pending-row">
                  <div>
                    <strong>${n(e.name)}</strong>
                    <span>${n(e.sector||`—`)} · /?resto=${n(e.slug)}</span>
                    <span>${n(e.phone||`Pas de téléphone renseigné`)}</span>
                    <span>Créé le ${new Date(e.created_at).toLocaleDateString(`fr-FR`)}</span>
                  </div>
                  <div class="pending-actions">
                    <button class="primary" data-activate="${e.id}" type="button">Activer</button>
                    <button class="danger small" data-reject="${e.id}" type="button">Rejeter</button>
                  </div>
                </div>
              `).join(``)}
            </div>`:`<p class="muted">Aucun restaurant en attente pour le moment.</p>`}
    </div>
  `,document.querySelector(`#signout-btn`).onclick=async()=>{await r(e),o=`auth`,d()},document.querySelectorAll(`[data-activate]`).forEach(t=>{t.onclick=async()=>{t.disabled=!0;let{error:n}=await e.from(`restaurants`).update({is_active:!0,onboarding_status:`READY`}).eq(`id`,t.dataset.activate);if(n){console.error(`[FOODATOI platform]`,n),alert(`Impossible d’activer ce restaurant pour le moment.`),t.disabled=!1;return}c=c.filter(e=>e.id!==t.dataset.activate),d()}}),document.querySelectorAll(`[data-reject]`).forEach(t=>{t.onclick=async()=>{if(!confirm(`Supprimer définitivement ce restaurant en attente ?`))return;let{error:n}=await e.from(`restaurants`).delete().eq(`id`,t.dataset.reject);if(n){console.error(`[FOODATOI platform]`,n),alert(`Impossible de supprimer ce restaurant pour le moment.`);return}c=c.filter(e=>e.id!==t.dataset.reject),d()}})}l();