import{n as e,t}from"./styles-Duu9ddhv.js";import{a as n,c as r,d as i,f as a,i as o,l as s,n as c,o as l,p as u,r as d,s as f,t as p,u as m}from"./restaurantOwner-B2MoNLIP.js";var h=document.querySelector(`#onboarding-root`),g=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],_=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],v=`loading`,y=`signup`,b=``,x=null,S={},C=[];function w(){return`${window.location.protocol}//${window.location.host}`}function T(){return`${w()}/?resto=${x.slug}`}function E(){return`${w()}/admin.html?resto=${x.slug}`}async function D(){if(!e){v=`error`,b=`Supabase n’est pas configuré.`,k();return}let{data:{session:t}}=await e.auth.getSession();if(!t){v=`auth`,k();return}await O()}async function O(){v=`loading`,k();try{if(x=await n(e),!x){v=`create`,k();return}S=x.settings?.opening_hours||{},C=await o(e,x.id),v=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),b=`Impossible de charger votre espace pour le moment.`,v=`error`}k()}function k(){if(v===`loading`){h.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(v===`error`){h.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${t(b)}</p>
      </div>
    `;return}if(v===`auth`){A();return}if(v===`create`){j();return}M()}function A(){let n=y===`signup`;h.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${n?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${b?`<p class="onboarding-error">${t(b)}</p>`:``}

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
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{y=n?`login`:`signup`,b=``,k()},document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let r=Object.fromEntries(new FormData(t.currentTarget));if(!l(r.email)){b=`Adresse email invalide.`,k();return}b=``,v=`loading`,k();try{if(n){if((await s(e,r)).pendingConfirmation){v=`auth`,b=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,y=`login`,k();return}}else await f(e,r);await O()}catch(e){console.error(`[FOODATOI onboarding]`,e),v=`auth`,b=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,k()}}}function j(){h.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${b?`<p class="onboarding-error">${t(b)}</p>`:``}

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
            ${g.map(([e,n])=>`<option value="${e}">${t(n)}</option>`).join(``)}
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
  `;let n=document.querySelector(`#create-name`),r=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;n.oninput=()=>{a||(r.value=m(n.value),i.textContent=r.value||`votre-restaurant`)},r.oninput=()=>{a=!0,r.value=m(r.value),i.textContent=r.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));b=``,v=`loading`,k();try{await c(e,n),await O()}catch(e){console.error(`[FOODATOI onboarding]`,e),v=`create`,b=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,k()}}}function M(){h.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${t(x.name)}</p>
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
            <code>${t(T())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(T())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${t(E())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(E())}" type="button">
            Copier
          </button>
        </div>

        ${x.is_active?``:`
              <p class="onboarding-note">
                Votre espace est prêt à être configuré. Un dernier
                contrôle de notre équipe avant la mise en ligne
                publique (généralement sous 24h) — vous pouvez
                déjà tout préparer ci-dessous.
              </p>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Horaires d'ouverture</h2>
        <form id="hours-form">
          ${_.map(([e,t])=>{let n=S[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${C.length})</h2>

        <div class="product-list">
          ${C.length?C.map(e=>{let n=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div>
                        <strong>${t(e.name)}</strong>
                        <span>${t(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
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
  `,N()}function N(){document.querySelector(`#signout-btn`).onclick=async()=>{await r(e),x=null,v=`auth`,y=`login`,k()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await a(e,x.id,n),S=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await i(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await d(e,t.dataset.delete),C=C.filter(e=>e.id!==t.dataset.delete),k()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}}),document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let n=t.files[0];if(!n)return;let r=t.closest(`.photo-upload-btn`);r.textContent=`Envoi…`;try{await u(e,x.id,t.dataset.product,n),C=await o(e,x.id),k()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer cette photo pour le moment.`),r.textContent=`Ajouter une photo`}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let n=t.currentTarget,r=Object.fromEntries(new FormData(n)),i=n.photo.files[0];try{let t=await p(e,x.id,r);i&&await u(e,x.id,t.id,i),C=await o(e,x.id),k()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter ce produit pour le moment.`)}}}D();