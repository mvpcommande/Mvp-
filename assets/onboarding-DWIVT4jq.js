import{n as e,t}from"./styles-DldXSre1.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{t as n}from"./errorLog-DYeNOlWf.js";import{a as r,c as i,d as a,f as o,h as s,i as c,l,m as u,n as d,o as f,p,r as m,s as h,t as g,u as _}from"./restaurantOwner-CqwJnIPL.js";function v(e){return e===`logo`?{maxDimension:600,quality:.9}:{maxDimension:1600,quality:.85}}async function y(e,t=`product`){let{maxDimension:n,quality:r}=v(t);if(!e.type.startsWith(`image/`))return e;let i=await createImageBitmap(e),a=Math.min(1,n/Math.max(i.width,i.height)),o=Math.round(i.width*a),s=Math.round(i.height*a),c=document.createElement(`canvas`);c.width=o,c.height=s,c.getContext(`2d`).drawImage(i,0,0,o,s),i.close();let l=await new Promise(e=>c.toBlob(e,`image/jpeg`,r));return!l||l.size>=e.size?e:new File([l],e.name.replace(/\.\w+$/,`.jpg`),{type:`image/jpeg`})}async function b(e,t){let{data:n,error:r}=await e.from(`loyalty_programs`).select(`*`).eq(`restaurant_id`,t).maybeSingle();if(r)throw r;return n}async function x(e,t,n){let r=await b(e,t),i={restaurant_id:t,name:n.name,is_active:!!n.isActive,earn_mode:n.earnMode||`points_per_euro`,points_per_euro:Number(n.pointsPerEuro)||1},{error:a}=await(r?e.from(`loyalty_programs`).update(i).eq(`id`,r.id):e.from(`loyalty_programs`).insert(i));if(a)throw a}async function S(e,t){let{data:n,error:r}=await e.from(`loyalty_rewards`).select(`*`).eq(`restaurant_id`,t).order(`cost_points`,{ascending:!0});if(r)throw r;return n??[]}async function C(e,t,n){let{error:r}=await e.from(`loyalty_rewards`).insert({restaurant_id:t,name:n.name,description:n.description||null,cost_points:Number(n.costPoints),reward_type:`MANUAL`,reward_value:{}});if(r)throw r}async function w(e,t,n){let{error:r}=await e.from(`loyalty_rewards`).update({is_active:n}).eq(`id`,t);if(r)throw r}async function T(e,t){let{error:n}=await e.from(`loyalty_rewards`).delete().eq(`id`,t);if(n)throw n}var E=document.querySelector(`#onboarding-root`),D=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],O=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],k=`loading`,A=`signup`,j=``,M=null,N={},P=[],F=null,I=[];function L(){return`${window.location.protocol}//${window.location.host}`}function R(){return`${L()}/?resto=${M.slug}`}function z(){return`${L()}/admin.html?resto=${M.slug}`}async function B(){if(!e){k=`error`,j=`Supabase n’est pas configuré.`,H();return}let{data:{session:t}}=await e.auth.getSession();if(!t){k=`auth`,H();return}await V()}async function V(){k=`loading`,H();try{if(M=await r(e),!M){k=`create`,H();return}N=M.settings?.opening_hours||{},P=await c(e,M.id),M.plan!==`commerce`&&(F=await b(e,M.id),I=await S(e,M.id)),k=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),j=`Impossible de charger votre espace pour le moment.`,k=`error`}H()}function H(){if(k===`loading`){E.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(k===`error`){E.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${t(j)}</p>
      </div>
    `;return}if(k===`auth`){U();return}if(k===`create`){W();return}G()}function U(){let n=A===`signup`;E.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${n?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${j?`<p class="onboarding-error">${t(j)}</p>`:``}

      <form id="auth-form" class="order-form">
        <label>
          EMAIL
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label>
          MOT DE PASSE
          <input name="password" type="password" required minlength="6" autocomplete="${n?`new-password`:`current-password`}">
        </label>
        <button class="primary full" type="submit">
          ${n?`Créer mon compte →`:`Se connecter →`}
        </button>
      </form>

      <button class="secondary full" id="toggle-auth-mode" type="button">
        ${n?`J’ai déjà un compte`:`Créer un compte`}
      </button>
    </div>
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{A=n?`login`:`signup`,j=``,H()},document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!f(r.email)){j=`Adresse email invalide.`,H();return}j=``,k=`loading`,H();try{if(n){if((await l(e,r)).pendingConfirmation){k=`auth`,j=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,A=`login`,H();return}}else await h(e,r);await V()}catch(e){console.error(`[FOODATOI onboarding]`,e),k=`auth`,j=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,H()}}}function W(){E.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${j?`<p class="onboarding-error">${t(j)}</p>`:``}

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
            ${D.map(([e,n])=>`<option value="${e}">${t(n)}</option>`).join(``)}
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
  `;let n=document.querySelector(`#create-name`),r=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;n.oninput=()=>{a||(r.value=_(n.value),i.textContent=r.value||`votre-restaurant`)},r.oninput=()=>{a=!0,r.value=_(r.value),i.textContent=r.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));j=``,k=`loading`,H();try{await d(e,n),await V()}catch(e){console.error(`[FOODATOI onboarding]`,e),k=`create`,j=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,H()}}}function G(){E.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${t(M.name)}</p>
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
            <code>${t(R())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(R())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${t(z())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(z())}" type="button">
            Copier
          </button>
        </div>

        ${M.is_active?``:`
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
        ${M.plan===`commerce`?`<p class="muted">Logo et couleur personnalisés disponibles avec le palier Pro.</p>`:`
              <div class="identity-row">
                <div class="identity-logo-preview">
                  ${M.logo_url?`<img src="${t(M.logo_url)}" alt="">`:`<span>${t((M.name||`?`).slice(0,2).toUpperCase())}</span>`}
                </div>
                <label class="secondary" id="logo-upload-label">
                  ${M.logo_url?`Changer le logo`:`Ajouter un logo`}
                  <input type="file" id="logo-input" accept="image/jpeg,image/png,image/webp" hidden>
                </label>
              </div>
              <label class="color-picker-row">
                COULEUR PRINCIPALE
                <input type="color" id="color-input" value="${t(M.primary_color||`#e84d27`)}">
              </label>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Programme de fidélité</h2>
        ${M.plan===`commerce`?`<p class="muted">Programme de fidélité disponible avec le palier Pro.</p>`:`
              <label class="account-toggle">
                <input type="checkbox" id="loyalty-active" ${F?.is_active?`checked`:``}>
                Activer le programme de fidélité
              </label>
              <div class="form-grid">
                <label>
                  NOM DU PROGRAMME
                  <input id="loyalty-name" value="${t(F?.name||`Carte fidélité`)}">
                </label>
                <label>
                  POINTS PAR EURO DÉPENSÉ
                  <input id="loyalty-rate" type="number" min="0.1" step="0.1" value="${F?.points_per_euro||1}">
                </label>
              </div>
              <button class="secondary full" id="save-loyalty-program" type="button">Enregistrer le programme</button>

              <p class="onboarding-hint">
                Les points sont attribués automatiquement quand une commande passe au statut "Prête" -
                aucune action supplémentaire nécessaire au comptoir.
              </p>

              <h3>Récompenses</h3>
              <div class="product-list">
                ${I.length?I.map(e=>`
                        <div class="product-row">
                          <div class="product-row-main">
                            <strong>${t(e.name)}</strong>
                            <span>${e.cost_points} points${e.description?` · `+t(e.description):``}</span>
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
          ${O.map(([e,t])=>{let n=N[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${P.length})</h2>

        <div class="product-list">
          ${P.length?P.map(e=>{let n=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div class="product-row-main">
                        <strong>${t(e.name)}</strong>
                        <span>${t(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
                      <div class="product-row-actions">
                        ${n?`<span class="photo-ok">Photo ✓</span>`:M.plan===`commerce`?`<span class="muted small-note">Photo (palier Pro)</span>`:`
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
          ${M.plan===`commerce`?``:`
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
  `,K()}function K(){document.querySelector(`#signout-btn`).onclick=async()=>{await i(e),M=null,k=`auth`,A=`login`,H()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await o(e,M.id,n),N=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await a(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await m(e,t.dataset.delete),P=P.filter(e=>e.id!==t.dataset.delete),H()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}});let t=document.querySelector(`#color-input`);t&&(t.onchange=async t=>{try{await p(e,M.id,t.target.value),M.primary_color=t.target.value}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer la couleur pour le moment.`)}});let r=document.querySelector(`#logo-input`);r&&(r.onchange=async t=>{let n=t.target.files[0];if(!n)return;let r=document.querySelector(`#logo-upload-label`),i=r.firstChild.textContent;r.firstChild.textContent=`Envoi…`;try{let t=await y(n,`logo`);M.logo_url=await s(e,M.id,t),H()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer le logo pour le moment.`),r.firstChild.textContent=i}}),document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let r=t.files[0];if(!r)return;let i=t.closest(`.photo-upload-btn`);i.textContent=`Envoi…`;try{let n=await y(r,`product`);await u(e,M.id,t.dataset.product,n),P=await c(e,M.id),H()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:M?.id,context:`onboarding.uploadProductPhoto`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’envoyer cette photo pour le moment.`),i.textContent=`Ajouter une photo`}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let r=t.currentTarget,i=Object.fromEntries(new FormData(r)),a=r.photo.files[0];try{let t=await g(e,M.id,i);if(a){let n=await y(a,`product`);await u(e,M.id,t.id,n)}P=await c(e,M.id),H()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:M?.id,context:`onboarding.addProduct`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’ajouter ce produit pour le moment.`)}};let l=document.querySelector(`#save-loyalty-program`);l&&(l.onclick=async()=>{try{await x(e,M.id,{name:document.querySelector(`#loyalty-name`).value,isActive:document.querySelector(`#loyalty-active`).checked,pointsPerEuro:document.querySelector(`#loyalty-rate`).value}),F=await b(e,M.id),H()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer le programme pour le moment.`)}});let d=document.querySelector(`#reward-form`);d&&(d.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));try{await C(e,M.id,n),I=await S(e,M.id),H()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter cette récompense pour le moment.`)}}),document.querySelectorAll(`.reward-active`).forEach(t=>{t.onchange=async()=>{try{await w(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de mettre à jour cette récompense pour le moment.`),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete-reward]`).forEach(t=>{t.onclick=async()=>{try{await T(e,t.dataset.deleteReward),I=I.filter(e=>e.id!==t.dataset.deleteReward),H()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer cette récompense pour le moment.`)}}})}B();