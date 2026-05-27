grant usage on schema public to anon, authenticated;

grant select on public.warilo_seller_profiles to anon, authenticated;
grant select on public.warilo_products to anon, authenticated;
grant select on public.warilo_couriers to anon, authenticated;

grant insert on public.warilo_orders to anon, authenticated;
grant insert on public.warilo_order_items to anon, authenticated;
grant insert on public.warilo_courier_ratings to anon, authenticated;
