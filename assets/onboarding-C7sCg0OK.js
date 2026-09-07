import{i as e,n as t,r as n,t as r}from"./styles-CIDj8i6P.js";import"./modulepreload-polyfill-P2Xu9kJm.js";import{c as i,i as a,n as o,r as s,s as c,t as l}from"./loyalty-Bi6_Ljfe.js";import{a as u,c as d,d as f,f as p,h as m,i as h,l as g,m as _,n as v,o as y,p as b,r as x,s as S,t as C,u as w}from"./restaurantOwner-CqwJnIPL.js";function T(e){return e===`logo`?{maxDimension:600,quality:.9}:{maxDimension:1600,quality:.85}}async function E(e,t=`product`){let{maxDimension:n,quality:r}=T(t);if(!e.type.startsWith(`image/`))return e;let i=await createImageBitmap(e),a=Math.min(1,n/Math.max(i.width,i.height)),o=Math.round(i.width*a),s=Math.round(i.height*a),c=document.createElement(`canvas`);c.width=o,c.height=s,c.getContext(`2d`).drawImage(i,0,0,o,s),i.close();let l=await new Promise(e=>c.toBlob(e,`image/jpeg`,r));return!l||l.size>=e.size?e:new File([l],e.name.replace(/\.\w+$/,`.jpg`),{type:`image/jpeg`})}var D=`restaurant-media`;function O(e){return(Number(e||0)/100).toFixed(2)}function k(e,t={},n=[]){let r=document.createElement(e);Object.assign(r,t);for(let e of[].concat(n))e&&r.append(e);return r}function A({supabase:e,restaurant:t,onImported:n}){let r=document.querySelector(`#menu-import-file`),i=document.querySelector(`#menu-import-review`),a=document.querySelector(`#menu-import-status`);if(!r||!i||!t)return;let o=e=>{a.textContent=e||``};r.onchange=async()=>{let n=r.files&&r.files[0];if(!n)return;if(i.replaceChildren(),n.size>10485760){o(`Fichier trop lourd (max 10 Mo).`);return}let a=n.type===`application/pdf`||/\.pdf$/i.test(n.name),c=a?`pdf`:/\.png$/i.test(n.name)?`png`:`jpg`,l=`${t.id}/menu-imports/${Date.now()}.${c}`;o(`Envoi du fichier…`);try{let{error:r}=await e.storage.from(D).upload(l,n,{upsert:!1});if(r)throw r;let{data:i,error:c}=await e.from(`menu_imports`).insert({restaurant_id:t.id,source_type:a?`pdf`:`image`,storage_path:l,status:`PENDING`}).select(`id`).single();if(c)throw c;o(`Lecture du menu par l’IA… (quelques secondes)`);let{data:u,error:d}=await e.functions.invoke(`parse-menu`,{body:{import_id:i.id}});if(d||!u||!Array.isArray(u.products))throw d||Error(`extraction impossible`);o(``),s(u.products,i.id)}catch(e){console.error(`[FOODATOI onboarding] import menu`,e),o(`Impossible de lire ce menu. Réessayez avec un PDF ou une photo nette.`)}finally{r.value=``}};function s(t,r){if(i.replaceChildren(),!t.length){o(`Aucun produit détecté. Réessayez avec un document plus lisible.`);return}let a=[],s=k(`p`,{className:`menu-import-intro`,textContent:`${t.length} produits détectés. Vérifiez et corrigez avant d’ajouter à votre carte.`}),c=k(`div`,{className:`menu-import-rows`});t.forEach(e=>{let t=k(`input`,{value:e.name||``,placeholder:`Nom`}),n=k(`input`,{value:e.category||``,placeholder:`Catégorie`}),r=k(`input`,{value:O(e.price_cents),type:`number`,step:`0.01`,min:`0`,placeholder:`Prix €`}),i=k(`input`,{value:e.description||``,placeholder:`Description (optionnel)`}),o=k(`button`,{type:`button`,className:`menu-import-remove`,textContent:`✕`}),s=k(`div`,{className:`menu-import-row`},[t,n,r,i,o]),l={name:t,category:n,price:r,desc:i,row:s};o.onclick=()=>{s.remove(),l.removed=!0},a.push(l),c.append(s)});let l=k(`button`,{type:`button`,className:`primary full`,textContent:`Ajouter ces produits à ma carte`});l.onclick=async()=>{l.disabled=!0;let t=a.filter(e=>!e.removed&&e.name.value.trim()).map(e=>({name:e.name.value.trim(),category:e.category.value.trim()||`Autre`,price_cents:Math.round(parseFloat(e.price.value||`0`)*100),description:e.desc.value.trim()||null}));if(!t.length){l.disabled=!1;return}try{let{data:a,error:s}=await e.rpc(`import_products_from_payload`,{p_products:t,p_import_id:r});if(s)throw s;i.replaceChildren(),o(`${a} produits ajoutés à votre carte ✓`),typeof n==`function`&&await n()}catch(e){console.error(`[FOODATOI onboarding] import confirm`,e),o(`Impossible d’ajouter les produits pour le moment.`),l.disabled=!1}},i.append(s,c,l)}}var j=`cc_classic_FekbkakoriGLZPgAYEy6xCBlEKHLw`,M=`https://ffuykessameuonpnyiyc.supabase.co/functions/v1/sumup-oauth-callback`,N=`transactions.history`;(()=>{let e=new URLSearchParams(window.location.search).get(`sumup`);if(!e)return;e===`connected`?alert(`Compte SumUp connecté ✓`):e===`error`&&alert(`La connexion SumUp a échoué. Réessayez.`);let t=new URL(window.location.href);t.searchParams.delete(`sumup`),window.history.replaceState({},``,t)})();var P=document.querySelector(`#onboarding-root`),F=[[`pizza`,`Pizza`],[`kebab`,`Kebab`],[`burger`,`Burger`],[`restaurant`,`Restaurant`],[`snack`,`Snack`],[`boulangerie`,`Boulangerie`],[`sushi`,`Sushi`],[`other`,`Autre`]],I=[[`mon`,`Lundi`],[`tue`,`Mardi`],[`wed`,`Mercredi`],[`thu`,`Jeudi`],[`fri`,`Vendredi`],[`sat`,`Samedi`],[`sun`,`Dimanche`]],L=`loading`,R=`signup`,z=``,B=null;t(e,{page:`onboarding`,getRestaurantId:()=>B?.id??null});var V={},H=[],U=null,W=[];function G(){return`${window.location.protocol}//${window.location.host}`}function K(){return`${G()}/?resto=${B.slug}`}function q(){return`${G()}/admin.html?resto=${B.slug}`}async function J(){if(!e){L=`error`,z=`Supabase n’est pas configuré.`,X();return}let{data:{session:t}}=await e.auth.getSession();if(!t){L=`auth`,X();return}await Y()}async function Y(){L=`loading`,X();try{if(B=await u(e),!B){L=`create`,X();return}V=B.settings?.opening_hours||{},H=await h(e,B.id),B.plan!==`commerce`&&(U=await s(e,B.id),W=await a(e,B.id)),L=`dashboard`}catch(e){console.error(`[FOODATOI onboarding]`,e),z=`Impossible de charger votre espace pour le moment.`,L=`error`}X()}function X(){if(L===`loading`){P.innerHTML=`<div class="onboarding-shell"><p class="eyebrow">FOODATOI</p><h1>Chargement…</h1></div>`;return}if(L===`error`){P.innerHTML=`
      <div class="onboarding-shell">
        <p class="eyebrow">FOODATOI</p>
        <h1>Un problème est survenu.</h1>
        <p>${r(z)}</p>
      </div>
    `;return}if(L===`auth`){Z();return}if(L===`create`){Q();return}$()}function Z(){let t=R===`signup`;P.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ESPACE RESTAURATEUR</p>
      <h1>${t?`Créer mon restaurant`:`Se connecter`}</h1>
      <p class="onboarding-lede">
        Créez votre espace, configurez votre carte et récupérez vos
        liens de commande et de comptoir en quelques minutes.
      </p>

      ${z?`<p class="onboarding-error">${r(z)}</p>`:``}

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
  `,document.querySelector(`#toggle-auth-mode`).onclick=()=>{R=t?`login`:`signup`,z=``,X()},document.querySelector(`#auth-form`).onsubmit=async n=>{n.preventDefault();let r=Object.fromEntries(new FormData(n.currentTarget));if(!y(r.email)){z=`Adresse email invalide.`,X();return}z=``,L=`loading`,X();try{if(t){if((await g(e,r)).pendingConfirmation){L=`auth`,z=`Compte créé ! Vérifiez vos emails pour confirmer votre adresse avant de vous connecter.`,R=`login`,X();return}}else await S(e,r);await Y()}catch(e){console.error(`[FOODATOI onboarding]`,e),L=`auth`,z=String(e?.message||``).includes(`Invalid login credentials`)?`Email ou mot de passe incorrect.`:String(e?.message||``).includes(`already registered`)?`Un compte existe déjà avec cet email.`:`Impossible de traiter la demande pour le moment.`,X()}}}function Q(){P.innerHTML=`
    <div class="onboarding-shell narrow">
      <p class="eyebrow">FOODATOI · ÉTAPE 1</p>
      <h1>Votre restaurant</h1>
      <p class="onboarding-lede">
        Quelques infos de base pour créer votre espace. Vous
        pourrez tout modifier ensuite.
      </p>

      ${z?`<p class="onboarding-error">${r(z)}</p>`:``}

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
            ${F.map(([e,t])=>`<option value="${e}">${r(t)}</option>`).join(``)}
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
  `;let t=document.querySelector(`#create-name`),n=document.querySelector(`#create-slug`),i=document.querySelector(`#slug-preview-text`),a=!1;t.oninput=()=>{a||(n.value=w(t.value),i.textContent=n.value||`votre-restaurant`)},n.oninput=()=>{a=!0,n.value=w(n.value),i.textContent=n.value||`votre-restaurant`},document.querySelector(`#create-form`).onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));z=``,L=`loading`,X();try{await v(e,n),await Y()}catch(e){console.error(`[FOODATOI onboarding]`,e),L=`create`,z=String(e?.message||``).includes(`SLUG_ALREADY_TAKEN`)?`Cette adresse est déjà prise, choisissez-en une autre.`:`Impossible de créer le restaurant pour le moment.`,X()}}}function $(){P.innerHTML=`
    <div class="onboarding-shell">
      <div class="onboarding-header">
        <div>
          <p class="eyebrow">FOODATOI · ${r(B.name)}</p>
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
            <code>${r(K())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(K())}" type="button">
            Copier
          </button>
        </div>

        <div class="link-row">
          <div>
            <strong>Lien comptoir</strong>
            <span>Gardez-le pour vous et votre équipe uniquement</span>
            <code>${r(q())}</code>
          </div>
          <button class="primary copy-btn" data-copy="${r(q())}" type="button">
            Copier
          </button>
        </div>

        ${B.is_active?``:`
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
        ${B.plan===`commerce`?`<p class="muted">Logo et couleur personnalisés disponibles avec le palier Pro.</p>`:`
              <div class="identity-row">
                <div class="identity-logo-preview">
                  ${B.logo_url?`<img src="${r(B.logo_url)}" alt="">`:`<span>${r((B.name||`?`).slice(0,2).toUpperCase())}</span>`}
                </div>
                <label class="secondary" id="logo-upload-label">
                  ${B.logo_url?`Changer le logo`:`Ajouter un logo`}
                  <input type="file" id="logo-input" accept="image/jpeg,image/png,image/webp" hidden>
                </label>
              </div>
              <label class="color-picker-row">
                COULEUR PRINCIPALE
                <input type="color" id="color-input" value="${r(B.primary_color||`#e84d27`)}">
              </label>
            `}
      </section>

      <section class="onboarding-section">
        <h2>Paiement en ligne (SumUp)</h2>
        ${B.sumup_connected?`<p class="muted">\u2713 Compte SumUp connecté${B.sumup_merchant_code?` \u2014 ${r(B.sumup_merchant_code)}`:``}. Les commandes payées en ligne seront encaissées directement sur votre compte SumUp, sans commission.</p>
               <button type="button" class="secondary" id="sumup-connect">Reconnecter SumUp</button>`:`<p class="muted">Connectez votre compte SumUp pour encaisser les commandes payées en ligne directement sur votre compte — sans commission, l'argent va chez vous.</p>
               <button type="button" class="secondary" id="sumup-connect">Connecter SumUp</button>`}
      </section>

      <section class="onboarding-section">
        <h2>Programme de fidélité</h2>
        ${B.plan===`commerce`?`<p class="muted">Programme de fidélité disponible avec le palier Pro.</p>`:`
              <label class="account-toggle">
                <input type="checkbox" id="loyalty-active" ${U?.is_active?`checked`:``}>
                Activer le programme de fidélité
              </label>
              <div class="form-grid">
                <label>
                  NOM DU PROGRAMME
                  <input id="loyalty-name" value="${r(U?.name||`Carte fidélité`)}">
                </label>
                <label>
                  POINTS PAR EURO DÉPENSÉ
                  <input id="loyalty-rate" type="number" min="0.1" step="0.1" value="${U?.points_per_euro||1}">
                </label>
              </div>
              <button class="secondary full" id="save-loyalty-program" type="button">Enregistrer le programme</button>

              <p class="onboarding-hint">
                Les points sont attribués automatiquement quand une commande passe au statut "Prête" -
                aucune action supplémentaire nécessaire au comptoir.
              </p>

              <h3>Récompenses</h3>
              <div class="product-list">
                ${W.length?W.map(e=>`
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
          ${I.map(([e,t])=>{let n=V[e]||[],r=n.length>0,i=n[0]||[`11:30`,`14:00`],a=n[1]||[`18:30`,`22:00`];return`
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
        <h2>Votre carte (${H.length})</h2>

        <div class="product-list">
          ${H.length?H.map(e=>{let t=(e.product_images||[]).length>0;return`
                    <div class="product-row">
                      <div class="product-row-main">
                        <strong>${r(e.name)}</strong>
                        <span>${r(e.category)} · ${(e.price_cents/100).toFixed(2)} €</span>
                      </div>
                      <div class="product-row-actions">
                        ${t?`<span class="photo-ok">Photo ✓</span>`:B.plan===`commerce`?`<span class="muted small-note">Photo (palier Pro)</span>`:`
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

        <h3>Importer un menu (PDF ou photo)</h3>
        <p class="menu-import-hint">Envoyez la carte : l'IA la lit et pré-remplit vos produits. Vous vérifiez et corrigez avant l'ajout.</p>
        <input type="file" id="menu-import-file" accept="application/pdf,image/jpeg,image/png,image/webp">
        <span id="menu-import-status" class="onboarding-saved"></span>
        <div id="menu-import-review"></div>

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
          ${B.plan===`commerce`?``:`
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
  `,ee()}function ee(){document.querySelector(`#signout-btn`).onclick=async()=>{await d(e),B=null,L=`auth`,R=`login`,X()},document.querySelectorAll(`.copy-btn`).forEach(e=>{e.onclick=()=>{navigator.clipboard.writeText(e.dataset.copy).then(()=>{let t=e.textContent;e.textContent=`Copié ✓`,setTimeout(()=>{e.textContent=t},1500)})}}),document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.querySelector(`.day-open`),n=e.querySelector(`.hours-inputs`),r=e.querySelector(`.has-r2`),i=e.querySelector(`.r2`);t.onchange=()=>{n.style.display=t.checked?``:`none`},r.onchange=()=>{i.style.display=r.checked?``:`none`}}),document.querySelector(`#hours-form`).onsubmit=async t=>{t.preventDefault();let n={};document.querySelectorAll(`.hours-row`).forEach(e=>{let t=e.dataset.day;if(!e.querySelector(`.day-open`).checked){n[t]=[];return}let r=[[e.querySelector(`.r1-start`).value,e.querySelector(`.r1-end`).value]];e.querySelector(`.has-r2`).checked&&r.push([e.querySelector(`.r2-start`).value,e.querySelector(`.r2-end`).value]),n[t]=r});try{await p(e,B.id,n),V=n;let t=document.querySelector(`#hours-saved`);t.classList.remove(`hidden`),setTimeout(()=>t.classList.add(`hidden`),2e3)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer les horaires pour le moment.`)}},document.querySelectorAll(`.product-active`).forEach(t=>{t.onchange=async()=>{try{await f(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete]`).forEach(t=>{t.onclick=async()=>{if(confirm(`Supprimer ce produit ?`))try{await x(e,t.dataset.delete),H=H.filter(e=>e.id!==t.dataset.delete),X()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer ce produit pour le moment.`)}}});let t=document.querySelector(`#color-input`);t&&(t.onchange=async t=>{try{await b(e,B.id,t.target.value),B.primary_color=t.target.value}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer la couleur pour le moment.`)}});let r=document.querySelector(`#logo-input`);r&&(r.onchange=async t=>{let n=t.target.files[0];if(!n)return;let r=document.querySelector(`#logo-upload-label`),i=r.firstChild.textContent;r.firstChild.textContent=`Envoi…`;try{let t=await E(n,`logo`);B.logo_url=await m(e,B.id,t),X()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’envoyer le logo pour le moment.`),r.firstChild.textContent=i}});let u=document.querySelector(`#sumup-connect`);u&&(u.onclick=async()=>{u.disabled=!0;try{let{data:t,error:n}=await e.rpc(`sumup_begin_connect`);if(n||!t)throw n||Error(`no state`);let r=new URLSearchParams({response_type:`code`,client_id:j,redirect_uri:M,scope:N,state:t});window.location.href=`https://api.sumup.com/authorize?${r.toString()}`}catch(e){console.error(`[FOODATOI onboarding] SumUp connect`,e),alert(`Impossible de démarrer la connexion SumUp pour le moment.`),u.disabled=!1}}),document.querySelectorAll(`.photo-input`).forEach(t=>{t.onchange=async()=>{let r=t.files[0];if(!r)return;let i=t.closest(`.photo-upload-btn`);i.textContent=`Envoi…`;try{let n=await E(r,`product`);await _(e,B.id,t.dataset.product,n),H=await h(e,B.id),X()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:B?.id,context:`onboarding.uploadProductPhoto`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’envoyer cette photo pour le moment.`),i.textContent=`Ajouter une photo`}}}),A({supabase:e,restaurant:B,onImported:async()=>{H=await h(e,B.id),X()}}),document.querySelector(`#product-form`).onsubmit=async t=>{t.preventDefault();let r=t.currentTarget,i=Object.fromEntries(new FormData(r)),a=r.photo.files[0];try{let t=await C(e,B.id,i);if(a){let n=await E(a,`product`);await _(e,B.id,t.id,n)}H=await h(e,B.id),X()}catch(t){console.error(`[FOODATOI onboarding]`,t),n(e,{restaurantId:B?.id,context:`onboarding.addProduct`,message:t?.message??String(t),page:`onboarding`}),alert(`Impossible d’ajouter ce produit pour le moment.`)}};let g=document.querySelector(`#save-loyalty-program`);g&&(g.onclick=async()=>{try{await i(e,B.id,{name:document.querySelector(`#loyalty-name`).value,isActive:document.querySelector(`#loyalty-active`).checked,pointsPerEuro:document.querySelector(`#loyalty-rate`).value}),U=await s(e,B.id),X()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’enregistrer le programme pour le moment.`)}});let v=document.querySelector(`#reward-form`);v&&(v.onsubmit=async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(t.currentTarget));try{await l(e,B.id,n),W=await a(e,B.id),X()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible d’ajouter cette récompense pour le moment.`)}}),document.querySelectorAll(`.reward-active`).forEach(t=>{t.onchange=async()=>{try{await c(e,t.dataset.id,t.checked)}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de mettre à jour cette récompense pour le moment.`),t.checked=!t.checked}}}),document.querySelectorAll(`[data-delete-reward]`).forEach(t=>{t.onclick=async()=>{try{await o(e,t.dataset.deleteReward),W=W.filter(e=>e.id!==t.dataset.deleteReward),X()}catch(e){console.error(`[FOODATOI onboarding]`,e),alert(`Impossible de supprimer cette récompense pour le moment.`)}}})}J();