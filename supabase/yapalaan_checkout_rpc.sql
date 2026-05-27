revoke insert on public.warilo_orders from anon, authenticated;
revoke insert on public.warilo_order_items from anon, authenticated;

drop function if exists public.create_yapalaan_checkout_order(
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  numeric,
  text
);

create function public.create_yapalaan_checkout_order(
  p_buyer_id text,
  p_seller_id uuid,
  p_product_id uuid,
  p_courier_id uuid,
  p_delivery_commune text,
  p_delivery_landmark text,
  p_delivery_notes text,
  p_buyer_phone text,
  p_buyer_whatsapp text,
  p_buyer_email text,
  p_buyer_location_label text,
  p_buyer_latitude numeric,
  p_buyer_longitude numeric,
  p_payment_method text
)
returns table(order_id uuid, total_amount_fcfa integer, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product_price integer;
  v_delivery_fee integer;
  v_delivery_commission integer;
  v_order_id uuid;
begin
  if nullif(trim(coalesce(p_buyer_phone, '')), '') is null then
    raise exception 'buyer_phone_required';
  end if;

  if nullif(trim(coalesce(p_buyer_whatsapp, '')), '') is null then
    raise exception 'buyer_whatsapp_required';
  end if;

  if nullif(trim(coalesce(p_buyer_location_label, '')), '') is null then
    raise exception 'buyer_location_required';
  end if;

  select price_fcfa into v_product_price
  from public.warilo_products
  where warilo_products.id = p_product_id
    and warilo_products.seller_id = p_seller_id
    and warilo_products.status = 'active'
    and warilo_products.stock > 0;

  if v_product_price is null then
    raise exception 'product_unavailable';
  end if;

  select delivery_fee_fcfa, yapalaan_commission_fcfa
    into v_delivery_fee, v_delivery_commission
  from public.warilo_couriers
  where warilo_couriers.id = p_courier_id
    and warilo_couriers.status = 'active';

  if v_delivery_fee is null then
    raise exception 'courier_unavailable';
  end if;

  insert into public.warilo_orders (
    buyer_id,
    seller_id,
    courier_id,
    total_amount_fcfa,
    delivery_fee_fcfa,
    delivery_commission_fcfa,
    delivery_commune,
    delivery_landmark,
    delivery_notes,
    buyer_phone,
    buyer_whatsapp,
    buyer_email,
    buyer_location_label,
    buyer_latitude,
    buyer_longitude,
    payment_method,
    status
  ) values (
    p_buyer_id,
    p_seller_id,
    p_courier_id,
    v_product_price + v_delivery_fee,
    v_delivery_fee,
    coalesce(v_delivery_commission, 0),
    p_delivery_commune,
    p_delivery_landmark,
    p_delivery_notes,
    p_buyer_phone,
    p_buyer_whatsapp,
    p_buyer_email,
    p_buyer_location_label,
    p_buyer_latitude,
    p_buyer_longitude,
    p_payment_method,
    'pending_payment'
  ) returning public.warilo_orders.id into v_order_id;

  insert into public.warilo_order_items (
    order_id,
    product_id,
    quantity,
    unit_price_fcfa
  ) values (
    v_order_id,
    p_product_id,
    1,
    v_product_price
  );

  return query select v_order_id, v_product_price + v_delivery_fee, 'pending_payment'::text;
end;
$$;

grant execute on function public.create_yapalaan_checkout_order(
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  numeric,
  text
) to anon, authenticated;
