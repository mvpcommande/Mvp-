import{n as e,t}from"./styles-WU6QyVaC.js";function n(e){return typeof e==`string`&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())}function r(e){return String(e||``).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}async function i(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signUp({email:String(t).trim(),password:n});if(i)throw i;return{pendingConfirmation:!r?.user?.id}}async function a(e,{email:t,password:n}){let{data:r,error:i}=await e.auth.signInWithPassword({email:String(t).trim(),password:n});if(i)throw i;return r}async function o(e){let{error:t}=await e.auth.signOut();if(t)throw t}async function s(e){let{data:{user:t}}=await e.auth.getUser();if(!t)return null;let{data:n,error:r}=await e.from(`restaurant_members`).select(`restaurant_id`).eq(`user_id`,t.id).maybeSingle();if(r)throw r;if(!n)return null;let{data:i,error:a}=await e.from(`restaurants`).select(`*`).eq(`id`,n.restaurant_id).single();if(a)throw a;return i}async function c(e,t){let{data:n,error:r}=await e.rpc(`self_provision_restaurant`,{p_name:t.name,p_slug:t.slug,p_sector:t.sector,p_phone:t.phone||null,p_address_street:t.addressStreet||null,p_address_postal_code:t.addressPostalCode||null,p_address_city:t.addressCity||null});if(r)throw r;return n}async function l(e,t,n){let{data:r,error:i}=await e.from(`restaurants`).select(`settings`).eq(`id`,t).single();if(i)throw i;let{error:a}=await e.from(`restaurants`).update({settings:{...r?.settings||{},opening_hours:n}}).eq(`id`,t);if(a)throw a}async function u(e,t){let{data:n,error:r}=await e.from(`products`).select(`*`).eq(`restaurant_id`,t).order(`sort_order`,{ascending:!0});if(r)throw r;return n??[]}async function d(e,t,n){let{data:r,error:i}=await e.from(`products`).insert({restaurant_id:t,name:n.name,category:n.category||`Autres`,description:n.description||``,price_cents:Math.round(Number(n.price)*100),is_active:!0,sort_order:n.sortOrder??0,options:{meat:!!n.meat,sauce:!!n.sauce,drink:!!n.drink,multipleMeat:!!n.multipleMeat,tripleMeat:!!n.tripleMeat,emoji:n.emoji||`🍽️`}}).select().single();if(i)throw i;return r}async function f(e,t,n){let{error:r}=await e.from(`products`).update({is_active:n}).eq(`id`,t);if(r)throw r}async function p(e,t){let{error:n}=await e.from(`products`).delete().eq(`id`,t);if(n)throw n}var m=document.querySelector(`#onboarding-root`),h=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],g=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],_=`loading`,v=`signup`,y=``,b=null,x={},S=[];function C(){return`${window.location.protocol}//${window.location.host}`}function w(){return`${C()}/?resto=${b.slug}`}function T(){return`${C()}/admin.html?resto=${b.slug}`}async function E(){if(!e){_=`error`,y=`Supabase n’est pas configuré.`,O();return}let{data:{session:t}}=await e.auth.getSession();if(!t){_=`auth`,O();return}await D()}async function D(){_=`loading`,O();try{if(b=await s(e),!b){_=`create`,O();return}x=b.settings?.opening_hours||{},S=await u(e,b.id),_=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),y=`Impossible de charger votre espace pour le moment.`,_=`error`}O()}function O(){if(_===`loading`){m.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(_===`error`){m.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${t(y)}</p>
      </div>
    `;return}if(_===`auth`){k();return}if(_===`create`){A();return}j()}function k(){let r=v===`signup`;m.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${r?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${y?`<p class="onboarding-error">${t(y)}</p>`:``}

      <form id="auth-form" class="order-form">
        <label>
          EMAIL
          <input name="email" type="email" required autocomplete="email">
        </label>
        <label>
          MOT DE PASSE
          <input name="password" type="password" required minlength="6" autocomplete="${r?`new-password`:`current-password`}">
        </label>
        <button class="primary full" type="submit">
          ${r?`Créer mon compte →`:`Se connecter →`}
        </button>
      </form>

      <button class="secondary full" id="toggle-auth-mode" type="button">
        ${r?`J’ai déjà un compte`:`Créer un compte`}
      </button>
    </div>
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{v=r?`login`:`signup`,y=``,O()},document.querySelector(`#auth-form`).onsubmit=async t=>{t.preventDefault();let o=Object.fromEntries(new FormData(t.currentTarget));if(!n(o.email)){y=`Adresse email invalide.`,O();return}y=``,_=`loading`,O();try{if(r){if((await i(e,o)).pendingConfirmation){_=`auth`,y=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,v=`login`,O();return}}else await a(e,o);await D()}catch(e){console.error(`[FOODATOI onboarding]`,e),_=`auth`,y=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,O()}}}function A(){m.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${y?`<p class="onboarding-error">${t(y)}</p>`:``}

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
            ${h.map(([e,n])=>`<option value="${e}">${t(n)}</option>`).join(``)}
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
  `;let n=document.querySelector(`#create-name`),i=document.querySelector(`#create-slug`),a=document.querySelector(`#slug-preview-text`),o=!1;n.oninput=()=>{o||(i.value=r(n.value),a.textContent=i.value||`votre-restaurant`)},i.oninput=()=>{o=!0,i.value=r(i.value),a.textContent=i.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));y=``,_=`loading`,O();try{await c(e,n),await D()}catch(e){console.error(`[FOODATOI onboarding]`,e),_=`create`,y=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,O()}}}function j(){m.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${t(b.name)}</p>
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
            <code>${t(w())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(w())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${t(T())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${t(T())}" type="button">
            Copier
          </button>
        </div>

        ${b.is_active?``:`
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
          ${g.map(([e,t])=>{let n=x[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${S.length})</h2>

        <div class="product-list">
          ${S.length?S.map(e=>`
                  <div class="product-row">
                    <div>
                      <strong>${t(e.name)}</strong>
                      <span>${t(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                    </div>
                    <label class="account-toggle small">
                      <input type="checkbox" class="product-active" data-id="${e.id}" ${e.is_active?`checked`:``}>
                      Actif
                    </label>
                    <button class="danger small" data-delete="${e.id}" type="button">Supprimer</button>
                  </div>
                `).join(``):`<p class="muted">Aucun produit pour le moment.</p>`}
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
          <label class="account-toggle"><input type="checkbox" name="meat">Choix de viande</label>
          <label class="account-toggle"><input type="checkbox" name="sauce">Choix de sauce</label>
          <label class="account-toggle"><input type="checkbox" name="drink">Boisson incluse</label>
          <button class="primary full" type="submit">Ajouter le produit</button>
        </form>
      </section>
    </div>
  `,M()}function M(){document.querySelector(`#signout-btn`).onclick=async()=>{await o(e),b=null,_=`auth`,v=`login`,O()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await l(e,b.id,n),x=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await f(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await p(e,t.dataset.delete),S=S.filter(e=>e.id!==t.dataset.delete),O()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));try{let t=await d(e,b.id,n);S.push(t),O()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter ce produit pour le moment.`)}}}E();