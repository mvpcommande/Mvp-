import{i as e,n as t,r as n,t as r}from"./styles-CuOxO0W1.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{c as i,i as a,n as o,r as s,s as c,t as l}from"./loyalty-Bi6_Ljfe.js";import{a as u,c as d,d as f,f as p,h as m,i as h,l as g,m as _,n as v,o as y,p as b,r as x,s as S,t as C,u as w}from"./restaurantOwner-CqwJnIPL.js";function T(e){return e===`logo`?{maxDimension:600,quality:.9}:{maxDimension:1600,quality:.85}}async function E(e,t=`product`){let{maxDimension:n,quality:r}=T(t);if(!e.type.startsWith(`image/`))return e;let i=await createImageBitmap(e),a=Math.min(1,n/Math.max(i.width,i.height)),o=Math.round(i.width*a),s=Math.round(i.height*a),c=document.createElement(`canvas`);c.width=o,c.height=s,c.getContext(`2d`).drawImage(i,0,0,o,s),i.close();let l=await new Promise(e=>c.toBlob(e,`image/jpeg`,r));return!l||l.size>=e.size?e:new File([l],e.name.replace(/\.\w+$/,`.jpg`),{type:`image/jpeg`})}var D=`cc_classic_FekbkakoriGLZPgAYEy6xCBlEKHLw`,O=`https://ffuykessameuonpnyiyc.supabase.co/functions/v1/sumup-oauth-callback`,k=`transactions.history`;(()=>{let e=new URLSearchParams(window.location.search).get(`sumup`);if(!e)return;e===`connected`?alert(`Compte SumUp connecté ✓`):e===`error`&&alert(`La connexion SumUp a échoué. Réessayez.`);let t=new URL(window.location.href);t.searchParams.delete(`sumup`),window.history.replaceState({},``,t)})();var A=document.querySelector(`#onboarding-root`),j=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],M=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],N=`loading`,P=`signup`,F=``,I=null;t(e,{page:`onboarding`,getRestaurantId:()=>I?.id??null});var L={},R=[],z=null,B=[];function V(){return`${window.location.protocol}//${window.location.host}`}function H(){return`${V()}/?resto=${I.slug}`}function U(){return`${V()}/admin.html?resto=${I.slug}`}async function W(){if(!e){N=`error`,F=`Supabase n’est pas configuré.`,K();return}let{data:{session:t}}=await e.auth.getSession();if(!t){N=`auth`,K();return}await G()}async function G(){N=`loading`,K();try{if(I=await u(e),!I){N=`create`,K();return}L=I.settings?.opening_hours||{},R=await h(e,I.id),I.plan!==`commerce`&&(z=await s(e,I.id),B=await a(e,I.id)),N=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),F=`Impossible de charger votre espace pour le moment.`,N=`error`}K()}function K(){if(N===`loading`){A.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(N===`error`){A.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${r(F)}</p>
      </div>
    `;return}if(N===`auth`){q();return}if(N===`create`){J();return}Y()}function q(){let t=P===`signup`;A.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${t?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${F?`<p class="onboarding-error">${r(F)}</p>`:``}

      <form id="auth-form" class="order-form">
        <label>
          EMAIL
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label>
          MOT DE PASSE
          <input name="password" type="password" required minlength="6" autocomplete="${t?`new-password`:`current-password`}">
        </label>
        <button class="primary full" type="submit">
          ${t?`Créer mon compte →`:`Se connecter →`}
        </button>
      </form>

      <button class="secondary full" id="toggle-auth-mode" type="button">
        ${t?`J’ai déjà un compte`:`Créer un compte`}
      </button>
    </div>
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{P=t?`login`:`signup`,F=``,K()},document.querySelector(`#auth-form`).onsubmit=async n=>{n.preventDefault();let r=Object.fromEntries(new FormData(n.currentTarget));if(!y(r.email)){F=`Adresse email invalide.`,K();return}F=``,N=`loading`,K();try{if(t){if((await g(e,r)).pendingConfirmation){N=`auth`,F=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,P=`login`,K();return}}else await S(e,r);await G()}catch(e){console.error(`[FOODATOI onboarding]`,e),N=`auth`,F=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,K()}}}function J(){A.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${F?`<p class="onboarding-error">${r(F)}</p>`:``}

      <form id="create-form" class="order-form">
        <label>
          NOM DU RESTAURANT
          <input name="name" id="create-name" required autocomplete="organization">
        </label>

        <label>
          ADRESSE DE VOTRE ESPACE
          <div class="slug-preview">
            foodatoi.fr/?resto=<span id="slug-preview-text">votre-restaurant</span>
          </div>
          <input name="slug" id="create-slug" required>
        </label>

        <label>
          TYPE D'ÉTABLISSEMENT
          <select name="sector" required>
            ${j.map(([e,t])=>`<option value="${e}">${r(t)}</option>`).join(``)}
          </select>
        </label>

        <label>
          TÉLÉPHONE (facultatif)
          <input name="phone" inputmode="tel" autocomplete="tel">
        </label>

        <label>
          ADRESSE (facultatif)
          <input name="addressStreet" placeholder="Rue" autocomplete="street-address">
        </label>
        <div class="form-grid">
          <label>
            CODE POSTAL
            <input name="addressPostalCode" inputmode="numeric">
          </label>
          <label>
            VILLE
            <input name="addressCity" autocomplete="address-level2">
          </label>
        </div>

        <button class="primary full" type="submit">
          Créer mon restaurant →
        </button>
      </form>
    </div>
  `;let t=document.querySelector(`#create-name`),n=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;t.oninput=()=>{a||(n.value=w(t.value),i.textContent=n.value||`votre-restaurant`)},n.oninput=()=>{a=!0,n.value=w(n.value),i.textContent=n.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));F=``,N=`loading`,K();try{await v(e,n),await G()}catch(e){console.error(`[FOODATOI onboarding]`,e),N=`create`,F=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,K()}}}function Y(){A.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${r(I.name)}</p>
          <h1>Votre espace.</h1>
        </div>
        <button class="secondary" id="signout-btn" type="button">Se déconnecter</button>
      </div>

      <section class="links-card">
        <p class="eyebrow">VOS LIENS</p>

        <div class="link-row">
          <div>
            <strong>Lien de commande</strong>
            <span>À partager avec vos clients (Facebook, flyers…)</span>
            <code>${r(H())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(H())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${r(U())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(U())}" type="button">
            Copier
          </button>
        </div>

        ${I.is_active?``:`
              <p class="onboarding-note">
                Votre espace est prêt à être configuré. Un dernier
                contrôle de notre équipe avant la mise en ligne
                publique (généralement sous 24h) — vous pouvez
                déjà tout préparer ci-dessous.
              </p>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Identité visuelle</h2>
        ${I.plan===`commerce`?`<p class="muted">Logo et couleur personnalisés disponibles avec le palier Pro.</p>`:`
              <div class="identity-row">
                <div class="identity-logo-preview">
                  ${I.logo_url?`<img src="${r(I.logo_url)}" alt="">`:`<span>${r((I.name||`?`).slice(0,2).toUpperCase())}</span>`}
                </div>
                <label class="secondary" id="logo-upload-label">
                  ${I.logo_url?`Changer le logo`:`Ajouter un logo`}
                  <input type="file" id="logo-input" accept="image/jpeg,image/png,image/webp" hidden>
                </label>
              </div>
              <label class="color-picker-row">
                COULEUR PRINCIPALE
                <input type="color" id="color-input" value="${r(I.primary_color||`#e84d27`)}">
              </label>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Paiement en ligne (SumUp)</h2>
        ${I.sumup_connected?`<p class="muted">\u2713 Compte SumUp connecté${I.sumup_merchant_code?` \u2014 ${r(I.sumup_merchant_code)}`:``}. Les commandes payées en ligne seront encaissées directement sur votre compte SumUp, sans commission.</p>
               <button type="button" class="secondary" id="sumup-connect">Reconnecter SumUp</button>`:`<p class="muted">Connectez votre compte SumUp pour encaisser les commandes payées en ligne directement sur votre compte — sans commission, l'argent va chez vous.</p>
               <button type="button" class="secondary" id="sumup-connect">Connecter SumUp</button>`}
      </section>

      <section class="onboarding-section">
        <h2>Programme de fidélité</h2>
        ${I.plan===`commerce`?`<p class="muted">Programme de fidélité disponible avec le palier Pro.</p>`:`
              <label class="account-toggle">
                <input type="checkbox" id="loyalty-active" ${z?.is_active?`checked`:``}>
                Activer le programme de fidélité
              </label>
              <div class="form-grid">
                <label>
                  NOM DU PROGRAMME
                  <input id="loyalty-name" value="${r(z?.name||`Carte fidélité`)}">
                </label>
                <label>
                  POINTS PAR EURO DÉPENSÉ
                  <input id="loyalty-rate" type="number" min="0.1" step="0.1" value="${z?.points_per_euro||1}">
                </label>
              </div>
              <button class="secondary full" id="save-loyalty-program" type="button">Enregistrer le programme</button>

              <p class="onboarding-hint">
                Les points sont attribués automatiquement quand une commande passe au statut "Prête" -
                aucune action supplémentaire nécessaire au comptoir.
              </p>

              <h3>Récompenses</h3>
              <div class="product-list">
                ${B.length?B.map(e=>`
                        <div class="product-row">
                          <div class="product-row-main">
                            <strong>${r(e.name)}</strong>
                            <span>${e.cost_points} points${e.description?` · `+r(e.description):``}</span>
                          </div>
                          <div class="product-row-actions">
                            <label class="account-toggle small">
                              <input type="checkbox" class="reward-active" data-id="${e.id}" ${e.is_active?`checked`:``}>
                              Active
                            </label>
                            <button class="danger small" data-delete-reward="${e.id}" type="button">Supprimer</button>
                          </div>
                        </div>
                      `).join(``):`<p class="muted">Aucune récompense pour le moment.</p>`}
              </div>

              <form id="reward-form" class="order-form">
                <label>
                  NOM DE LA RÉCOMPENSE
                  <input name="name" required placeholder="Ex: Boisson offerte">
                </label>
                <div class="form-grid">
                  <label>
                    COÛT EN POINTS
                    <input name="costPoints" type="number" min="1" required>
                  </label>
                  <label>
                    DESCRIPTION (facultatif)
                    <input name="description">
                  </label>
                </div>
                <button class="primary full" type="submit">Ajouter la récompense</button>
              </form>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Horaires d'ouverture</h2>
        <form id="hours-form">
          ${M.map(([e,t])=>{let n=L[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
              <div class="hours-row" data-day="${e}">
                <label class="account-toggle">
                  <input type="checkbox" class="day-open" ${r?`checked`:``}>
                  ${t}
                </label>
                <div class="hours-inputs" ${r?``:`style="display:none"`}>
                  <input type="time" class="r1-start" value="${i[0]}">
                  <input type="time" class="r1-end" value="${i[1]}">
                  <label class="account-toggle small">
                    <input type="checkbox" class="has-r2" ${n[1]?`checked`:``}>
                    2e créneau
                  </label>
                  <div class="hours-inputs r2" ${n[1]?``:`style="display:none"`}>
                    <input type="time" class="r2-start" value="${a[0]}">
                    <input type="time" class="r2-end" value="${a[1]}">
                  </div>
                </div>
              </div>
            `}).join(``)}
          <button class="primary" type="submit">Enregistrer les horaires</button>
          <span id="hours-saved" class="onboarding-saved hidden">Enregistré ✓</span>
        </form>
      </section>

      <section class="onboarding-section">
        <h2>Votre carte (${R.length})</h2>

        <div class="product-list">
          ${R.length?R.map(e=>{let t=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div class="product-row-main">
                        <strong>${r(e.name)}</strong>
                        <span>${r(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
                      <div class="product-row-actions">
                        ${t?`<span class="photo-ok">Photo ✓</span>`:I.plan===`commerce`?`<span class="muted small-note">Photo (palier Pro)</span>`:`
                              <label class="photo-upload-btn">
                                Ajouter une photo
                                <input type="file" accept="image/jpeg,image/png,image/webp" class="photo-input" data-product="${e.id}" hidden>
                              </label>
                            `}
                        <label class="account-toggle small">
                          <input type="checkbox" class="product-active" data-id="${e.id}" ${e.is_active?`checked`:``}>
                          Actif
                        </label>
                        <button class="danger small" data-delete="${e.id}" type="button">Supprimer</button>
                      </div>
                    </div>
                  `}).join(``):`<p class="muted">Aucun produit pour le moment.</p>`}
        </div>

        <h3>Ajouter un produit</h3>
        <form id="product-form" class="order-form">
          <label>
            NOM
            <input name="name" required>
          </label>
          <div class="form-grid">
            <label>
              CATÉGORIE
              <input name="category" placeholder="Ex: Burgers" required>
            </label>
            <label>
              PRIX (€)
              <input name="price" type="number" step="0.01" min="0" required>
            </label>
          </div>
          <label>
            DESCRIPTION (facultatif)
            <input name="description">
          </label>
          ${I.plan===`commerce`?``:`
                <label>
                  PHOTO (facultatif)
                  <input name="photo" type="file" accept="image/jpeg,image/png,image/webp">
                </label>
              `}
          <label class="account-toggle"><input type="checkbox" name="meat">Choix de viande</label>
          <label class="account-toggle"><input type="checkbox" name="sauce">Choix de sauce</label>
          <label class="account-toggle"><input type="checkbox" name="drink">Boisson incluse</label>
          <button class="primary full" type="submit">Ajouter le produit</button>
        </form>
      </section>
    </div>
  `,X()}function X(){document.querySelector(`#signout-btn`).onclick=async()=>{await d(e),I=null,N=`auth`,P=`login`,K()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await p(e,I.id,n),L=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await f(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await x(e,t.dataset.delete),R=R.filter(e=>e.id!==t.dataset.delete),K()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}});let t=document.querySelector(`#color-input`);t&&(t.onchange=async t=>{try{await b(e,I.id,t.target.value),I.primary_color=t.target.value}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer la couleur pour le moment.`)}});let r=document.querySelector(`#logo-input`);r&&(r.onchange=async t=>{let n=t.target.files[0];if(!n)return;let r=document.querySelector(`#logo-upload-label`),i=r.firstChild.textContent;r.firstChild.textContent=`Envoi…`;try{let t=await E(n,`logo`);I.logo_url=await m(e,I.id,t),K()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer le logo pour le moment.`),r.firstChild.textContent=i}});let u=document.querySelector(`#sumup-connect`);u&&(u.onclick=async()=>{u.disabled=!0;try{let{data:t,error:n}=await e.rpc(`sumup_begin_connect`);if(n||!t)throw n||Error(`no state`);let r=new URLSearchParams({response_type:`code`,client_id:D,redirect_uri:O,scope:k,state:t});window.location.href=`https://api.sumup.com/authorize?${r.toString()}`}catch(e){console.error(`[FOODATOI onboarding] SumUp connect`,e),alert(`Impossible de démarrer la connexion SumUp pour le moment.`),u.disabled=!1}}),document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let r=t.files[0];if(!r)return;let i=t.closest(`.photo-upload-btn`);i.textContent=`Envoi…`;try{let n=await E(r,`product`);await _(e,I.id,t.dataset.product,n),R=await h(e,I.id),K()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:I?.id,context:`onboarding.uploadProductPhoto`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’envoyer cette photo pour le moment.`),i.textContent=`Ajouter une photo`}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let r=t.currentTarget,i=Object.fromEntries(new FormData(r)),a=r.photo.files[0];try{let t=await C(e,I.id,i);if(a){let n=await E(a,`product`);await _(e,I.id,t.id,n)}R=await h(e,I.id),K()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:I?.id,context:`onboarding.addProduct`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’ajouter ce produit pour le moment.`)}};let g=document.querySelector(`#save-loyalty-program`);g&&(g.onclick=async()=>{try{await i(e,I.id,{name:document.querySelector(`#loyalty-name`).value,isActive:document.querySelector(`#loyalty-active`).checked,pointsPerEuro:document.querySelector(`#loyalty-rate`).value}),z=await s(e,I.id),K()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer le programme pour le moment.`)}});let v=document.querySelector(`#reward-form`);v&&(v.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));try{await l(e,I.id,n),B=await a(e,I.id),K()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter cette récompense pour le moment.`)}}),document.querySelectorAll(`.reward-active`).forEach(t=>{t.onchange=async()=>{try{await c(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de mettre à jour cette récompense pour le moment.`),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete-reward]`).forEach(t=>{t.onclick=async()=>{try{await o(e,t.dataset.deleteReward),B=B.filter(e=>e.id!==t.dataset.deleteReward),K()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer cette récompense pour le moment.`)}}})}W();