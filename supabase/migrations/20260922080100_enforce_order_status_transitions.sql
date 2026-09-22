-- ============================================================================
-- MIGRATION À VALIDER — NON APPLIQUÉE EN PRODUCTION PAR CET AGENT.
-- Créée dans le cadre de l'audit de durcissement Bloc 5 (hardening
-- pilote), à relire et appliquer manuellement après vérification.
-- ============================================================================
--
-- PROBLÈME (P1 — important avant pilote, concurrence comptoir) :
--
-- orders_admin_update.with check (20260822113258_lock_down_order_tenant_isolation.sql)
-- vérifie que le nouveau statut appartient à l'ensemble valide
-- {NEW, ACCEPTED, PREPARING, READY, CANCELLED}, mais ne vérifie JAMAIS
-- que la transition depuis le statut ACTUEL de la ligne est légitime.
-- Le seul endroit qui connaît la machine à états réelle
-- (NEW -> ACCEPTED -> PREPARING -> READY, terminal) est côté client,
-- dans orderWorkflow.mjs (transitions), dupliqué une seconde fois de
-- façon indépendante dans admin.js::advance(). Rien ne l'impose côté
-- serveur.
--
-- IMPACT DÉMONTRÉ (Phase 5 de l'audit — concurrence comptoir) :
--
-- Scénario réaliste avec deux appareils employés sur le même
-- restaurant (tablette A et tablette B), sans qu'aucun des deux ne
-- soit malveillant :
--   1. A et B affichent tous deux la même commande, statut PREPARING.
--   2. A clique "Marquer prête" -> UPDATE ... SET status = 'READY'.
--      Le serveur accepte (READY est un statut valide). La commande
--      est maintenant READY en base.
--   3. B, dont l'onglet n'a pas encore reçu l'événement Realtime
--      (déconnexion momentanée, onglet resté en arrière-plan...),
--      affiche encore PREPARING et clique lui aussi sur son propre
--      bouton "Marquer prête" -- mais B calcule son "next" à partir
--      de SA valeur affichée obsolète. Rien n'empêche non plus B de
--      renvoyer, par un bug futur ou un replay de requête, un statut
--      antérieur : le serveur accepterait tout aussi bien
--      READY -> NEW ou READY -> PREPARING, une régression silencieuse
--      qui ferait "reculer" une commande déjà prête aux yeux de la
--      cuisine.
-- Aucune donnée cross-tenant n'est concernée, aucun prix n'est
-- affecté, aucune commande n'est dupliquée -- d'où un classement P1
-- (fiabilité opérationnelle) plutôt que P0.
--
-- CORRECTIF PROPOSÉ :
--
-- Un trigger BEFORE UPDATE qui rejette toute transition de statut qui
-- ne correspond pas exactement à la machine à états déjà définie côté
-- client dans orderWorkflow.mjs, plus une entrée explicite vers
-- CANCELLED (valeur déjà présente dans la contrainte de la policy RLS
-- et dans admin.js::labels, bien qu'aucune action UI ne la déclenche
-- aujourd'hui -- l'autoriser en base ne change aucun comportement
-- observable tant qu'aucun bouton ne l'utilise, et évite de bloquer
-- une annulation manuelle ou une future fonctionnalité). Aucune
-- nouvelle machine à états n'est inventée : celle-ci est une copie
-- fidèle de orderWorkflow.mjs, appliquée une seconde fois côté
-- serveur (défense en profondeur, pas une nouvelle règle métier).
--
-- Transitions autorisées :
--   NEW       -> ACCEPTED | CANCELLED
--   ACCEPTED  -> PREPARING | CANCELLED
--   PREPARING -> READY | CANCELLED
--   READY     -> (aucune, terminal, comme aujourd'hui côté client)
--   CANCELLED -> (aucune, terminal)
--
-- RISQUE SI NON CORRIGÉ : régression silencieuse de statut sous
-- concurrence multi-appareils (P1, fiabilité opérationnelle).
-- RISQUE DE CE CORRECTIF : un client (admin.js) qui enverrait déjà
-- une transition invalide échouerait désormais avec une erreur
-- explicite au lieu de réussir silencieusement -- comportement
-- strictement plus sûr. Aucun chemin actuel de admin.js ne dépend
-- d'une transition non listée ci-dessus (vérifié par revue statique
-- de advance()/toggleDelivery() dans admin.js : le seul enchaînement
-- utilisé est NEW->ACCEPTED->PREPARING->READY, un par un).
--
-- ROLLBACK :
--   drop trigger if exists enforce_order_status_transition_trigger on public.orders;
--   drop function if exists public.enforce_order_status_transition();
--
-- VÉRIFICATION MANUELLE (à exécuter sur une branche de dev Supabase,
-- jamais en production) :
--
--   -- Doit RÉUSSIR (transition valide) :
--   update orders set status = 'ACCEPTED' where id = '<commande NEW réelle>';
--
--   -- Doit ÉCHOUER avec INVALID_STATUS_TRANSITION (saut direct) :
--   update orders set status = 'READY' where id = '<commande NEW réelle>';
--
--   -- Doit ÉCHOUER avec INVALID_STATUS_TRANSITION (retour en arrière) :
--   update orders set status = 'PREPARING' where id = '<commande READY réelle>';
--
--   -- Doit RÉUSSIR (annulation depuis un statut actif) :
--   update orders set status = 'CANCELLED' where id = '<commande ACCEPTED réelle>';
--
-- ============================================================================

create or replace function public.enforce_order_status_transition()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_allowed boolean := false;
begin
  if new.status is distinct from old.status then
    v_allowed := case old.status
      when 'NEW' then new.status in ('ACCEPTED', 'CANCELLED')
      when 'ACCEPTED' then new.status in ('PREPARING', 'CANCELLED')
      when 'PREPARING' then new.status in ('READY', 'CANCELLED')
      else false
    end;

    if not v_allowed then
      raise exception 'INVALID_STATUS_TRANSITION: % -> %', old.status, new.status;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_order_status_transition_trigger on public.orders;

create trigger enforce_order_status_transition_trigger
before update on public.orders
for each row
execute function public.enforce_order_status_transition();
