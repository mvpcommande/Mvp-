import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const supabase = createClient(
  'https://ffuykessameuonpnyiyc.supabase.co',
  'sb_publishable_MIwz0MWTUF74o8FOsMGQmw_k0yxlvk7'
);

const RESTAURANT_ID = '2043c98b-2b77-4ed8-a6ac-f3fdac62af71';
const since = new Date();

const countEl = document.querySelector('#count');
const statusEl = document.querySelector('#status');

async function refresh() {
  const { data, error } = await supabase.rpc('count_orders_since', {
    p_restaurant_id: RESTAURANT_ID,
    p_since: since.toISOString()
  });

  if (error) {
    statusEl.textContent = 'Erreur de lecture, nouvelle tentative…';
    return;
  }

  countEl.textContent = data;
  statusEl.textContent =
    'Mis à jour à ' + new Date().toLocaleTimeString('fr-FR');
}

refresh();
setInterval(refresh, 3000);
