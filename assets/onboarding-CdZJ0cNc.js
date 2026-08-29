import{n as e,t}from"./styles-BGoon_IL.js";import{a as n,c as r,d as i,f as a,h as o,i as s,l as c,m as l,n as u,o as d,p as f,r as p,s as m,t as h,u as g}from"./restaurantOwner-_xjjkWsK.js";function _(e){return e===`logo`?{maxDimension:600,quality:.9}:{maxDimension:1600,quality:.85}}async function v(e,t=`product`){let{maxDimension:n,quality:r}=_(t);if(!e.type.startsWith(`image/`))return e;let i=await createImageBitmap(e),a=Math.min(1,n/Math.max(i.width,i.height)),o=Math.round(i.width*a),s=Math.round(i.height*a),c=document.createElement(`canvas`);c.width=o,c.height=s,c.getContext(`2d`).drawImage(i,0,0,o,s),i.close();let l=await new Promise(e=>c.toBlob(e,`image/jpeg`,r));return!l||l.size>=e.size?e:new File([l],e.name.replace(/\.\w+$/,`.jpg`),{type:`image/jpeg`})}var y=document.querySelector(`#onboarding-root`),b=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],x=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],S=`loading`,C=`signup`,w=``,T=null,E={},D=[];function O(){return`${window.location.protocol}//${window.location.host}`}function k(){return`${O()}/?resto=${T.slug}`}function A(){return`${O()}/admin.html?resto=${T.slug}`}async function j(){if(!e){S=`error`,w=`Supabase n’est pas configuré.`,N();return}let{data:{session:t}}=await e.auth.getSession();if(!t){S=`auth`,N();return}await M()}async function M(){S=`loading`,N();try{if(T=await n(e),!T){S=`create`,N();return}E=T.settings?.opening_hours||{},D=await s(e,T.id),S=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),w=`Impossible de charger votre espace pour le moment.`,S=`error`}N()}function N(){if(S===`loading`){y.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(S===`error`){y.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${t(w)}</p>
      </div>
    `;return}if(S===`auth`){P();return}if(S===`create`){F();return}I()}function P(){let n=C===`signup`;y.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${n?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${w?`<p class="onboarding-error">${t(w)}</p>`:``}

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
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{C=n?`login`:`signup`,w=``,N()},document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!d(r.email)){w=`Adresse email invalide.`,N();return}w=``,S=`loading`,N();try{if(n){if((await c(e,r)).pendingConfirmation){S=`auth`,w=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,C=`login`,N();return}}else await m(e,r);await M()}catch(e){console.error(`[FOODATOI onboarding]`,e),S=`auth`,w=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,N()}}}function F(){y.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${w?`<p class="onboarding-error">${t(w)}</p>`:``}

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
            ${b.map(([e,n])=>`<option value="${e}">${t(n)}</option>`).join(``)}
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
  `;let n=document.querySelector(`#create-name`),r=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;n.oninput=()=>{a||(r.value=g(n.value),i.textContent=r.value||`votre-restaurant`)},r.oninput=()=>{a=!0,r.value=g(r.value),i.textContent=r.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));w=``,S=`loading`,N();try{await u(e,n),await M()}catch(e){console.error(`[FOODATOI onboarding]`,e),S=`create`,w=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,N()}}}function I(){y.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${t(T.name)}</p>
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
            <code>${t(k())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(k())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${t(A())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(A())}" type="button">
            Copier
          </button>
        </div>

        ${T.is_active?``:`
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
        <div class="identity-row">
          <div class="identity-logo-preview">
            ${T.logo_url?`<img src="${t(T.logo_url)}" alt="">`:`<span>${t((T.name||`?`).slice(0,2).toUpperCase())}</span>`}
          </div>
          <label class="secondary" id="logo-upload-label">
            ${T.logo_url?`Changer le logo`:`Ajouter un logo`}
            <input type="file" id="logo-input" accept="image/jpeg,image/png,image/webp" hidden>
          </label>
        </div>
        <label class="color-picker-row">
          COULEUR PRINCIPALE
          <input type="color" id="color-input" value="${t(T.primary_color||`#e84d27`)}">
        </label>
      </section>

      <section class="onboarding-section">
        <h2>Horaires d'ouverture</h2>
        <form id="hours-form">
          ${x.map(([e,t])=>{let n=E[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${D.length})</h2>

        <div class="product-list">
          ${D.length?D.map(e=>{let n=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div class="product-row-main">
                        <strong>${t(e.name)}</strong>
                        <span>${t(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
                      <div class="product-row-actions">
                        ${n?`<span class="photo-ok">Photo ✓</span>`:`
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
          <label>
            PHOTO (facultatif)
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp">
          </label>
          <label class="account-toggle"><input type="checkbox" name="meat">Choix de viande</label>
          <label class="account-toggle"><input type="checkbox" name="sauce">Choix de sauce</label>
          <label class="account-toggle"><input type="checkbox" name="drink">Boisson incluse</label>
          <button class="primary full" type="submit">Ajouter le produit</button>
        </form>
      </section>
    </div>
  `,L()}function L(){document.querySelector(`#signout-btn`).onclick=async()=>{await r(e),T=null,S=`auth`,C=`login`,N()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await a(e,T.id,n),E=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await i(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await p(e,t.dataset.delete),D=D.filter(e=>e.id!==t.dataset.delete),N()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}}),document.querySelector(`#color-input`).onchange=async t=>{try{await f(e,T.id,t.target.value),T.primary_color=t.target.value}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer la couleur pour le moment.`)}},document.querySelector(`#logo-input`).onchange=async t=>{let n=t.target.files[0];if(!n)return;let r=document.querySelector(`#logo-upload-label`),i=r.firstChild.textContent;r.firstChild.textContent=`Envoi…`;try{let t=await v(n,`logo`);T.logo_url=await o(e,T.id,t),N()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer le logo pour le moment.`),r.firstChild.textContent=i}},document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let n=t.files[0];if(!n)return;let r=t.closest(`.photo-upload-btn`);r.textContent=`Envoi…`;try{let r=await v(n,`product`);await l(e,T.id,t.dataset.product,r),D=await s(e,T.id),N()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer cette photo pour le moment.`),r.textContent=`Ajouter une photo`}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let n=t.currentTarget,r=Object.fromEntries(new FormData(n)),i=n.photo.files[0];try{let t=await h(e,T.id,r);if(i){let n=await v(i,`product`);await l(e,T.id,t.id,n)}D=await s(e,T.id),N()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter ce produit pour le moment.`)}}}j();