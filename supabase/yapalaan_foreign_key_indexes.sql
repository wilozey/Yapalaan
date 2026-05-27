create index if not exists idx_warilo_products_seller_id
  on public.warilo_products(seller_id);

create index if not exists idx_warilo_orders_seller_id
  on public.warilo_orders(seller_id);

create index if not exists idx_warilo_orders_courier_id
  on public.warilo_orders(courier_id);

create index if not exists idx_warilo_order_items_order_id
  on public.warilo_order_items(order_id);

create index if not exists idx_warilo_order_items_product_id
  on public.warilo_order_items(product_id);

create index if not exists idx_warilo_courier_ratings_courier_id
  on public.warilo_courier_ratings(courier_id);

create index if not exists idx_warilo_courier_ratings_order_id
  on public.warilo_courier_ratings(order_id);
