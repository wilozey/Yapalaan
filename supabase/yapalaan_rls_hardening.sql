-- Durcissement RLS avant preview privée.
-- À exécuter après `yapalaan_schema.sql` et `yapalaan_seed.sql`.

drop policy if exists "Public can create demo orders" on public.warilo_orders;
drop policy if exists "Public can create demo order items" on public.warilo_order_items;

drop policy if exists "Public can create checkout orders" on public.warilo_orders;
create policy "Public can create checkout orders"
  on public.warilo_orders for insert
  with check (
    total_amount_fcfa > 0
    and delivery_fee_fcfa >= 0
    and delivery_commission_fcfa >= 0
    and buyer_phone is not null
    and buyer_whatsapp is not null
    and buyer_location_label is not null
    and status = 'pending_payment'
  );

drop policy if exists "Public can create checkout order items" on public.warilo_order_items;
create policy "Public can create checkout order items"
  on public.warilo_order_items for insert
  with check (
    quantity > 0
    and unit_price_fcfa >= 0
  );

drop policy if exists "Public can create courier ratings" on public.warilo_courier_ratings;
create policy "Public can create courier ratings"
  on public.warilo_courier_ratings for insert
  with check (rating between 1 and 5);

-- Les écritures vendeur/admin doivent passer plus tard par auth.uid(),
-- rôles applicatifs, ou backend sécurisé. Ne pas ouvrir update/delete au public.
