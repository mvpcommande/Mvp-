import{i as e,n as t,r as n,t as r}from"./styles-smHzveTX.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{c as i,i as a,n as o,r as s,s as c,t as l}from"./loyalty-Bi6_Ljfe.js";import{a as u,c as d,d as f,f as p,h as m,i as h,l as g,m as _,n as v,o as y,p as b,r as x,s as S,t as C,u as w}from"./restaurantOwner-CqwJnIPL.js";function T(e){return e===`logo`?{maxDimension:600,quality:.9}:{maxDimension:1600,quality:.85}}async function E(e,t=`product`){let{maxDimension:n,quality:r}=T(t);if(!e.type.startsWith(`image/`))return e;let i=await createImageBitmap(e),a=Math.min(1,n/Math.max(i.width,i.height)),o=Math.round(i.width*a),s=Math.round(i.height*a),c=document.createElement(`canvas`);c.width=o,c.height=s,c.getContext(`2d`).drawImage(i,0,0,o,s),i.close();let l=await new Promise(e=>c.toBlob(e,`image/jpeg`,r));return!l||l.size>=e.size?e:new File([l],e.name.replace(/\.\w+$/,`.jpg`),{type:`image/jpeg`})}var D=document.querySelector(`#onboarding-root`),O=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],k=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],A=`loading`,j=`signup`,M=``,N=null;t(e,{page:`onboarding`,getRestaurantId:()=>N?.id??null});var P={},F=[],I=null,L=[];function R(){return`${window.location.protocol}//${window.location.host}`}function z(){return`${R()}/?resto=${N.slug}`}function B(){return`${R()}/admin.html?resto=${N.slug}`}async function V(){if(!e){A=`error`,M=`Supabase n’est pas configuré.`,U();return}let{data:{session:t}}=await e.auth.getSession();if(!t){A=`auth`,U();return}await H()}async function H(){A=`loading`,U();try{if(N=await u(e),!N){A=`create`,U();return}P=N.settings?.opening_hours||{},F=await h(e,N.id),N.plan!==`commerce`&&(I=await s(e,N.id),L=await a(e,N.id)),A=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),M=`Impossible de charger votre espace pour le moment.`,A=`error`}U()}function U(){if(A===`loading`){D.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(A===`error`){D.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${r(M)}</p>
      </div>
    `;return}if(A===`auth`){W();return}if(A===`create`){G();return}K()}function W(){let t=j===`signup`;D.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${t?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${M?`<p class="onboarding-error">${r(M)}</p>`:``}

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
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{j=t?`login`:`signup`,M=``,U()},document.querySelector(`#auth-form`).onsubmit=async n=>{n.preventDefault();let r=Object.fromEntries(new FormData(n.currentTarget));if(!y(r.email)){M=`Adresse email invalide.`,U();return}M=``,A=`loading`,U();try{if(t){if((await g(e,r)).pendingConfirmation){A=`auth`,M=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,j=`login`,U();return}}else await S(e,r);await H()}catch(e){console.error(`[FOODATOI onboarding]`,e),A=`auth`,M=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,U()}}}function G(){D.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${M?`<p class="onboarding-error">${r(M)}</p>`:``}

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
            ${O.map(([e,t])=>`<option value="${e}">${r(t)}</option>`).join(``)}
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
  `;let t=document.querySelector(`#create-name`),n=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;t.oninput=()=>{a||(n.value=w(t.value),i.textContent=n.value||`votre-restaurant`)},n.oninput=()=>{a=!0,n.value=w(n.value),i.textContent=n.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));M=``,A=`loading`,U();try{await v(e,n),await H()}catch(e){console.error(`[FOODATOI onboarding]`,e),A=`create`,M=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,U()}}}function K(){D.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${r(N.name)}</p>
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
            <code>${r(z())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(z())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${r(B())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(B())}" type="button">
            Copier
          </button>
        </div>

        ${N.is_active?``:`
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
        ${N.plan===`commerce`?`<p class="muted">Logo et couleur personnalisés disponibles avec le palier Pro.</p>`:`
              <div class="identity-row">
                <div class="identity-logo-preview">
                  ${N.logo_url?`<img src="${r(N.logo_url)}" alt="">`:`<span>${r((N.name||`?`).slice(0,2).toUpperCase())}</span>`}
                </div>
                <label class="secondary" id="logo-upload-label">
                  ${N.logo_url?`Changer le logo`:`Ajouter un logo`}
                  <input type="file" id="logo-input" accept="image/jpeg,image/png,image/webp" hidden>
                </label>
              </div>
              <label class="color-picker-row">
                COULEUR PRINCIPALE
                <input type="color" id="color-input" value="${r(N.primary_color||`#e84d27`)}">
              </label>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Programme de fidélité</h2>
        ${N.plan===`commerce`?`<p class="muted">Programme de fidélité disponible avec le palier Pro.</p>`:`
              <label class="account-toggle">
                <input type="checkbox" id="loyalty-active" ${I?.is_active?`checked`:``}>
                Activer le programme de fidélité
              </label>
              <div class="form-grid">
                <label>
                  NOM DU PROGRAMME
                  <input id="loyalty-name" value="${r(I?.name||`Carte fidélité`)}">
                </label>
                <label>
                  POINTS PAR EURO DÉPENSÉ
                  <input id="loyalty-rate" type="number" min="0.1" step="0.1" value="${I?.points_per_euro||1}">
                </label>
              </div>
              <button class="secondary full" id="save-loyalty-program" type="button">Enregistrer le programme</button>

              <p class="onboarding-hint">
                Les points sont attribués automatiquement quand une commande passe au statut "Prête" -
                aucune action supplémentaire nécessaire au comptoir.
              </p>

              <h3>Récompenses</h3>
              <div class="product-list">
                ${L.length?L.map(e=>`
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
          ${k.map(([e,t])=>{let n=P[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${F.length})</h2>

        <div class="product-list">
          ${F.length?F.map(e=>{let t=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div class="product-row-main">
                        <strong>${r(e.name)}</strong>
                        <span>${r(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
                      <div class="product-row-actions">
                        ${t?`<span class="photo-ok">Photo ✓</span>`:N.plan===`commerce`?`<span class="muted small-note">Photo (palier Pro)</span>`:`
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
          ${N.plan===`commerce`?``:`
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
  `,q()}function q(){document.querySelector(`#signout-btn`).onclick=async()=>{await d(e),N=null,A=`auth`,j=`login`,U()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await p(e,N.id,n),P=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await f(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await x(e,t.dataset.delete),F=F.filter(e=>e.id!==t.dataset.delete),U()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}});let t=document.querySelector(`#color-input`);t&&(t.onchange=async t=>{try{await b(e,N.id,t.target.value),N.primary_color=t.target.value}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer la couleur pour le moment.`)}});let r=document.querySelector(`#logo-input`);r&&(r.onchange=async t=>{let n=t.target.files[0];if(!n)return;let r=document.querySelector(`#logo-upload-label`),i=r.firstChild.textContent;r.firstChild.textContent=`Envoi…`;try{let t=await E(n,`logo`);N.logo_url=await m(e,N.id,t),U()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer le logo pour le moment.`),r.firstChild.textContent=i}}),document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let r=t.files[0];if(!r)return;let i=t.closest(`.photo-upload-btn`);i.textContent=`Envoi…`;try{let n=await E(r,`product`);await _(e,N.id,t.dataset.product,n),F=await h(e,N.id),U()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:N?.id,context:`onboarding.uploadProductPhoto`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’envoyer cette photo pour le moment.`),i.textContent=`Ajouter une photo`}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let r=t.currentTarget,i=Object.fromEntries(new FormData(r)),a=r.photo.files[0];try{let t=await C(e,N.id,i);if(a){let n=await E(a,`product`);await _(e,N.id,t.id,n)}F=await h(e,N.id),U()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:N?.id,context:`onboarding.addProduct`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’ajouter ce produit pour le moment.`)}};let u=document.querySelector(`#save-loyalty-program`);u&&(u.onclick=async()=>{try{await i(e,N.id,{name:document.querySelector(`#loyalty-name`).value,isActive:document.querySelector(`#loyalty-active`).checked,pointsPerEuro:document.querySelector(`#loyalty-rate`).value}),I=await s(e,N.id),U()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer le programme pour le moment.`)}});let g=document.querySelector(`#reward-form`);g&&(g.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));try{await l(e,N.id,n),L=await a(e,N.id),U()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter cette récompense pour le moment.`)}}),document.querySelectorAll(`.reward-active`).forEach(t=>{t.onchange=async()=>{try{await c(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de mettre à jour cette récompense pour le moment.`),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete-reward]`).forEach(t=>{t.onclick=async()=>{try{await o(e,t.dataset.deleteReward),L=L.filter(e=>e.id!==t.dataset.deleteReward),U()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer cette récompense pour le moment.`)}}})}V();