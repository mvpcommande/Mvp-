-- Mode de livraison par restaurant, en complément de la redirection
-- Uber Eats existante (settings.delivery_redirect_url) : certains
-- restaurants (ex: Rice District) livrent avec leurs propres livreurs
-- et n'ont besoin ni d'Uber Eats ni de rester en pickup/sur-place seul.
--
-- settings.delivery_mode :
--   absent / 'none'  -> aucune mention de livraison (comportement actuel)
--   'redirect'       -> bannière + lien vers settings.delivery_redirect_url
--   'internal'       -> encart adresse dans le formulaire de commande,
--                       livraison gérée par les livreurs du resto
--
-- Un resto n'est jamais dans deux modes à la fois.

-- Backfill : tout resto qui a déjà delivery_redirect_url configuré passe
-- automatiquement en mode 'redirect' -> flow Caz Food inchangé, rien à
-- reconfigurer manuellement pour les restos existants.
update public.restaurants
set settings = settings || jsonb_build_object('delivery_mode', 'redirect')
where settings ->> 'delivery_redirect_url' is not null
  and settings ->> 'delivery_mode' is null;

alter table public.orders
  add column if not exists delivery_address jsonb,
  add column if not exists delivery_status text;

alter table public.orders
  add constraint orders_delivery_status_check
  check (delivery_status is null or delivery_status in ('TO_DELIVER', 'DELIVERED'));

comment on column public.orders.delivery_address is
  'Adresse de livraison {street, postal_code, city, complement}. Renseignée uniquement quand fulfillment_type = DELIVERY sur un resto en settings.delivery_mode = internal.';
comment on column public.orders.delivery_status is
  'TO_DELIVER puis DELIVERED, pour le suivi des livreurs internes du resto. Null si non applicable (pickup, ou livraison redirigée vers Uber Eats).';

-- create_order gagne p_fulfillment_type et p_delivery_address, tous deux
-- avec une valeur par défaut identique au comportement actuel : tout appel
-- existant qui ne les fournit pas continue de créer une commande PICKUP
-- exactement comme avant. Reste de la logique (horaires, items, total)
-- inchangée à l'identique.
create or replace function public.create_order(
  p_restaurant_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_pickup_time timestamptz,
  p_notes text,
  p_items jsonb,
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
  v_delivery_mode text;
  v_paris_now timestamp;
  v_day_key text;
  v_local_minutes integer;
  v_range jsonb;
  v_is_open boolean := false;
begin
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

  if v_opening_hours is not null then
    v_paris_now := now() at time zone 'Europe/Paris';
    v_day_key := (array['sun','mon','tue','wed','thu','fri','sat'])[extract(dow from v_paris_now)::int + 1];
    v_local_minutes := extract(hour from v_paris_now)::int * 60 + extract(minute from v_paris_now)::int;

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

    v_quantity := greatest(1, coalesce((v_item ->> 'quantity')::integer, 1));
    v_total_cents := v_total_cents + (v_product_price_cents * v_quantity);
  end loop;

  v_order_number := 'FA-' || to_char(now() at time zone 'Europe/Paris', 'YYMMDD')
    || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    id, restaurant_id, order_number, customer_name, customer_phone,
    pickup_time, status, payment_status, fulfillment_type, total_cents, notes,
    delivery_address, delivery_status
  ) values (
    v_order_id, p_restaurant_id, v_order_number,
    coalesce(p_customer_name, ''), coalesce(p_customer_phone, ''),
    p_pickup_time, 'NEW', 'PAY_AT_STORE', p_fulfillment_type, v_total_cents, p_notes,
    case when p_fulfillment_type = 'DELIVERY' then p_delivery_address else null end,
    case when p_fulfillment_type = 'DELIVERY' then 'TO_DELIVER' else null end
  );

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
