-- ============================================================================
-- MIGRATION À VALIDER — NON APPLIQUÉE PAR CET AGENT.
-- Créée dans le cadre de l'audit de durcissement Bloc 5 (hardening
-- pilote), à relire et appliquer manuellement après vérification.
-- ============================================================================
--
-- PROBLÈME (P1 — fiabilité, race condition sous vraie concurrence) :
--
-- create_order() implémente l'idempotence en "check-then-insert" :
--
--   1. SELECT ... WHERE restaurant_id = p_restaurant_id
--        AND idempotency_key = p_idempotency_key
--   2. si trouvé -> retourne la commande existante, s'arrête
--   3. sinon -> INSERT une nouvelle commande avec cette clé
--
-- Ces deux étapes ne sont PAS atomiques entre elles. Si deux requêtes
-- avec la même clé d'idempotence arrivent véritablement en parallèle
-- (ex : double-tap réseau lent, deux onglets, retry client + requête
-- initiale qui n'avait en fait pas échoué), les DEUX peuvent passer
-- l'étape 1 (aucune ne voit encore la ligne de l'autre) avant que l'une
-- des deux insère -- résultat : deux commandes distinctes créées pour
-- un seul geste client, exactement ce que la clé d'idempotence est
-- censée empêcher.
--
-- PREUVE :
--
--   TEST LIVE (projet Supabase Foodatoi réel, inspection en lecture
--   seule de pg_constraint sur public.orders) : la liste complète des
--   contraintes existantes est orders_customer_id_fkey,
--   orders_delivery_status_check, orders_fulfillment_type_check,
--   orders_order_number_key (unique), orders_payment_status_check,
--   orders_pkey, orders_restaurant_id_fkey, orders_status_check,
--   orders_total_cents_check. AUCUNE contrainte unique ou d'exclusion
--   ne porte sur idempotency_key (seule ni combinée à restaurant_id) :
--   rien au niveau base ne rend une vraie course impossible, seule la
--   logique applicative en Bloc procédural du RPC la rend improbable.
--
--   TEST LIVE (comportemental, séquentiel) : deux appels successifs à
--   create_order() avec la même p_idempotency_key sur la fixture
--   demo-charge ont correctement renvoyé la même commande (la seconde
--   n'a rien inséré). Ceci confirme que le chemin "check" fonctionne
--   pour des appels séquentiels, mais NE PROUVE RIEN sur le
--   comportement sous concurrence réelle (deux transactions
--   simultanées), qui nécessiterait une exécution parallèle exacte non
--   reproductible de façon sûre et non destructive dans cet audit --
--   ce point précis reste donc NOT LIVE-VERIFIED pour la fenêtre de
--   course elle-même, seule l'ABSENCE de la contrainte protectrice est
--   TEST LIVE (structurel, via pg_constraint).
--
-- IMPACT : sous forte charge ou instabilité réseau (le scénario même
-- que ce Bloc 5 doit durcir), un même geste client pourrait produire
-- deux commandes facturées/préparées séparément. Aucune fuite
-- cross-tenant, aucun contournement de prix -- d'où un classement P1
-- (fiabilité opérationnelle) plutôt que P0, mais avec un impact
-- opérationnel et client direct (double préparation, double charge
-- éventuelle côté paiement en ligne).
--
-- CAUSE : absence de contrainte unique en base sur (restaurant_id,
-- idempotency_key) ; le check applicatif seul ne peut pas être
-- atomique sans elle.
--
-- CORRECTIF PROPOSÉ :
--
--   1. Un index unique PARTIEL sur (restaurant_id, idempotency_key),
--      limité aux lignes où idempotency_key n'est pas null (les
--      commandes sans clé -- aucune aujourd'hui côté client, mais
--      possible via un appel RPC direct sans p_idempotency_key --
--      restent libres de se répéter, comme aujourd'hui).
--   2. create_order() enveloppe désormais son INSERT INTO orders dans
--      un bloc BEGIN/EXCEPTION : si l'insertion échoue avec
--      unique_violation (i.e. une autre transaction a gagné la course
--      entre-temps), la fonction relit la commande existante par
--      (restaurant_id, idempotency_key) et la retourne normalement,
--      au lieu de laisser remonter une erreur 23505 brute au client.
--      Le chemin "check" existant (étape 1) reste inchangé : il reste
--      la voie rapide normale (pas de course), l'exception ne se
--      déclenche que dans le cas rare qu'elle est censée couvrir.
--
-- RISQUE SI NON CORRIGÉ : doublons de commande sous vraie concurrence
-- (P1, fiabilité opérationnelle, pas de fuite de données ni de prix).
-- RISQUE DE CE CORRECTIF :
--   - L'index unique peut échouer à la création s'il existe déjà des
--     doublons (restaurant_id, idempotency_key) en base -- échec net et
--     visible à l'application de la migration, pas de corruption
--     silencieuse. À VÉRIFIER AVANT application avec la requête de
--     pré-contrôle ci-dessous.
--   - Le comportement pour un appel normal (pas de course) est
--     strictement inchangé : le chemin "check" trouve toujours la ligne
--     avant que l'exception n'entre en jeu.
--
-- ROLLBACK :
--   drop index if exists public.orders_restaurant_idempotency_key_uidx;
--   -- puis restaurer la version de create_order() sans le bloc
--   -- BEGIN/EXCEPTION, telle que définie dans
--   -- 20260906130000_create_order_flood_breaker.sql.
--
-- VÉRIFICATION MANUELLE (à exécuter sur une branche de dev Supabase,
-- jamais en production) :
--
--   -- 0. PRÉ-CONTRÔLE avant d'appliquer cette migration (doit renvoyer
--   --    0 lignes ; sinon nettoyer les doublons avant d'appliquer) :
--   select restaurant_id, idempotency_key, count(*)
--   from public.orders
--   where idempotency_key is not null
--   group by restaurant_id, idempotency_key
--   having count(*) > 1;
--
--   -- 1. Appel normal (doit RÉUSSIR, crée une commande) :
--   select * from create_order(
--     p_restaurant_id => '<restaurant actif réel>',
--     p_customer_name => 'Test',
--     p_customer_phone => '0600000000',
--     p_pickup_time => now() + interval '20 minutes',
--     p_notes => null,
--     p_items => '[{"product_id": "<produit actif réel>", "quantity": 1}]'::jsonb,
--     p_idempotency_key => 'test-race-key-001'
--   );
--
--   -- 2. Même appel, même clé (doit RÉUSSIR et renvoyer LA MÊME
--   --    commande, sans en créer une seconde) :
--   select * from create_order(
--     p_restaurant_id => '<même restaurant>',
--     p_customer_name => 'Test',
--     p_customer_phone => '0600000000',
--     p_pickup_time => now() + interval '20 minutes',
--     p_notes => null,
--     p_items => '[{"product_id": "<produit actif réel>", "quantity": 1}]'::jsonb,
--     p_idempotency_key => 'test-race-key-001'
--   );
--
--   -- 3. Vérifier qu'une seule commande existe pour cette clé :
--   select count(*) from public.orders
--   where restaurant_id = '<même restaurant>'
--     and idempotency_key = 'test-race-key-001';
--   -- doit renvoyer 1
--
-- ============================================================================

create unique index if not exists orders_restaurant_idempotency_key_uidx
  on public.orders (restaurant_id, idempotency_key)
  where idempotency_key is not null;

create or replace function public.create_order(
  p_restaurant_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_pickup_time timestamptz,
  p_notes text,
  p_items jsonb,
  p_idempotency_key text default null,
  p_payment_method text default 'PAY_AT_STORE',
  p_fulfillment_type text default 'PICKUP',
  p_delivery_address jsonb default null
)
returns table (
  id uuid,
  order_number text,
  status text,
  total_cents integer
)
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_number text;
  v_total_cents integer := 0;
  v_item jsonb;
  v_product_id uuid;
  v_product_name text;
  v_product_price_cents integer;
  v_quantity integer;
  v_line_total integer;
  v_opening_hours jsonb;
  v_pickup_paris timestamp;
  v_day_key text;
  v_local_minutes integer;
  v_range jsonb;
  v_is_open boolean := false;
  v_existing record;
  v_recent_count integer;
  v_burst_count integer;
  v_payment_status text;
  v_delivery_mode text;
begin
  if p_idempotency_key is not null then
    select o.id, o.order_number, o.status, o.total_cents
      into v_existing
    from public.orders o
    where o.restaurant_id = p_restaurant_id
      and o.idempotency_key = p_idempotency_key;

    if found then
      return query select v_existing.id, v_existing.order_number, v_existing.status, v_existing.total_cents;
      return;
    end if;
  end if;

  if p_fulfillment_type not in ('PICKUP', 'DELIVERY') then
    raise exception 'INVALID_FULFILLMENT_TYPE';
  end if;

  select r.settings -> 'opening_hours', r.settings ->> 'delivery_mode'
    into v_opening_hours, v_delivery_mode
  from public.restaurants r
  where r.id = p_restaurant_id and r.is_active = true;

  if not found then
    raise exception 'RESTAURANT_NOT_FOUND';
  end if;

  if p_fulfillment_type = 'DELIVERY' then
    if v_delivery_mode is distinct from 'internal' then
      raise exception 'DELIVERY_NOT_AVAILABLE';
    end if;

    if coalesce(trim(p_delivery_address ->> 'street'), '') = ''
       or coalesce(trim(p_delivery_address ->> 'postal_code'), '') = ''
       or coalesce(trim(p_delivery_address ->> 'city'), '') = '' then
      raise exception 'MISSING_DELIVERY_ADDRESS';
    end if;
  end if;

  if p_pickup_time is null then
    raise exception 'MISSING_PICKUP_TIME';
  end if;

  if p_pickup_time < now() - interval '5 minutes' then
    raise exception 'PICKUP_TIME_IN_PAST';
  end if;

  if p_pickup_time > now() + interval '60 days' then
    raise exception 'PICKUP_TIME_TOO_FAR';
  end if;

  if v_opening_hours is not null then
    v_pickup_paris := p_pickup_time at time zone 'Europe/Paris';
    v_day_key := (array['sun','mon','tue','wed','thu','fri','sat'])[extract(dow from v_pickup_paris)::int + 1];
    v_local_minutes := extract(hour from v_pickup_paris)::int * 60 + extract(minute from v_pickup_paris)::int;

    for v_range in select * from jsonb_array_elements(coalesce(v_opening_hours -> v_day_key, '[]'::jsonb))
    loop
      if v_local_minutes >= (
        split_part(v_range->>0, ':', 1)::int * 60 + split_part(v_range->>0, ':', 2)::int
      ) and v_local_minutes <= (
        split_part(v_range->>1, ':', 1)::int * 60 + split_part(v_range->>1, ':', 2)::int
      ) then
        v_is_open := true;
      end if;
    end loop;

    if not v_is_open then
      raise exception 'RESTAURANT_CLOSED';
    end if;
  end if;

  if p_customer_phone is not null and length(trim(p_customer_phone)) > 0 then
    select count(*) into v_recent_count
    from public.orders o
    where o.restaurant_id = p_restaurant_id
      and o.customer_phone = p_customer_phone
      and o.created_at > now() - interval '10 minutes';

    if v_recent_count >= 5 then
      raise exception 'RATE_LIMITED';
    end if;
  end if;

  -- Coupe-circuit anti-flood par restaurant (défense en profondeur).
  -- Seuil volontairement large pour ne JAMAIS gêner un vrai coup de feu :
  -- un resto en click-and-collect ne fait pas 60 commandes en ligne en 2 min,
  -- alors qu'un script de spam en ferait des centaines. NB : l'anti-abus fin
  -- (par IP/appareil) doit vivre au niveau edge (Cloudflare/WAF), pas en SQL.
  select count(*) into v_burst_count
  from public.orders o
  where o.restaurant_id = p_restaurant_id
    and o.created_at > now() - interval '2 minutes';

  if v_burst_count >= 60 then
    raise exception 'RATE_LIMITED';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_ORDER';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if (v_item ->> 'product_id') is null then
      raise exception 'MISSING_PRODUCT_ID';
    end if;

    select p.id, p.name, p.price_cents
      into v_product_id, v_product_name, v_product_price_cents
    from public.products p
    where p.id = (v_item ->> 'product_id')::uuid
      and p.restaurant_id = p_restaurant_id
      and p.is_active = true;

    if v_product_id is null then
      raise exception 'PRODUCT_NOT_FOUND: %', v_item ->> 'product_id';
    end if;

    v_quantity := coalesce((v_item ->> 'quantity')::integer, 1);
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'INVALID_QUANTITY';
    end if;
    v_total_cents := v_total_cents + (v_product_price_cents * v_quantity);
  end loop;

  v_order_number := 'FA-' || to_char(now() at time zone 'Europe/Paris', 'YYMMDD')
    || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  v_payment_status := case
    when p_payment_method = 'ONLINE' then 'PENDING'
    else 'PAY_AT_STORE'
  end;

  -- Bloc 5 (hardening) : l'INSERT ci-dessous est désormais protégé par
  -- l'index unique partiel orders_restaurant_idempotency_key_uidx. Sous
  -- vraie concurrence (deux transactions passées le check ci-dessus avant
  -- que l'une des deux n'ait inséré), l'une des deux insertions échoue
  -- avec unique_violation au lieu de créer un doublon silencieux -- on
  -- relit alors la commande gagnante et on la retourne normalement,
  -- exactement comme le chemin "check" l'aurait fait si le timing avait
  -- été légèrement différent. Comportement normal (pas de course)
  -- strictement inchangé.
  begin
    insert into public.orders (
      id, restaurant_id, order_number, customer_name, customer_phone,
      pickup_time, status, payment_status, fulfillment_type, total_cents, notes,
      idempotency_key, delivery_address, delivery_status
    ) values (
      v_order_id, p_restaurant_id, v_order_number,
      coalesce(p_customer_name, ''), coalesce(p_customer_phone, ''),
      p_pickup_time, 'NEW', v_payment_status, p_fulfillment_type, v_total_cents, p_notes,
      p_idempotency_key,
      case when p_fulfillment_type = 'DELIVERY' then p_delivery_address else null end,
      case when p_fulfillment_type = 'DELIVERY' then 'TO_DELIVER' else null end
    );
  exception
    when unique_violation then
      if p_idempotency_key is null then
        raise;
      end if;

      select o.id, o.order_number, o.status, o.total_cents
        into v_existing
      from public.orders o
      where o.restaurant_id = p_restaurant_id
        and o.idempotency_key = p_idempotency_key;

      if found then
        return query select v_existing.id, v_existing.order_number, v_existing.status, v_existing.total_cents;
        return;
      else
        raise;
      end if;
  end;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select p.id, p.name, p.price_cents
      into v_product_id, v_product_name, v_product_price_cents
    from public.products p
    where p.id = (v_item ->> 'product_id')::uuid
      and p.restaurant_id = p_restaurant_id;

    v_quantity := greatest(1, coalesce((v_item ->> 'quantity')::integer, 1));
    v_line_total := v_product_price_cents * v_quantity;

    insert into public.order_items (
      order_id, product_id, product_name, quantity,
      unit_price_cents, options, line_total_cents
    ) values (
      v_order_id, v_product_id, v_product_name, v_quantity,
      v_product_price_cents,
      coalesce(v_item -> 'options', '{}'::jsonb),
      v_line_total
    );
  end loop;

  return query select v_order_id, v_order_number, 'NEW'::text, v_total_cents;
end;
$$;

grant execute on function public.create_order(uuid, text, text, timestamptz, text, jsonb, text, text, text, jsonb) to anon, authenticated;
