create table if not exists public.yapalaan_import_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id text,
  buyer_phone text,
  buyer_whatsapp text,
  buyer_email text,
  source_marketplace text,
  product_url text,
  product_image_url text,
  product_request text,
  translated_description text,
  product_cost_fcfa integer not null default 0 check (product_cost_fcfa >= 0),
  shipping_cost_fcfa integer not null default 0 check (shipping_cost_fcfa >= 0),
  customs_cost_fcfa integer not null default 0 check (customs_cost_fcfa >= 0),
  yapalaan_fee_fcfa integer not null default 0 check (yapalaan_fee_fcfa >= 0),
  total_estimated_fcfa integer not null default 0 check (total_estimated_fcfa >= 0),
  group_order_requested boolean not null default false,
  buy_for_me_requested boolean not null default false,
  status text not null default 'quote_requested'
    check (status in (
      'quote_requested',
      'quote_sent',
      'payment_pending',
      'paid',
      'supplier_purchase',
      'international_shipping',
      'arrived',
      'local_delivery',
      'delivered',
      'cancelled',
      'disputed'
    )),
  created_at timestamptz not null default now()
);

alter table public.yapalaan_import_requests enable row level security;

drop policy if exists "Public can create import quote requests" on public.yapalaan_import_requests;
create policy "Public can create import quote requests"
  on public.yapalaan_import_requests for insert
  to anon, authenticated
  with check (
    nullif(trim(coalesce(product_url, product_request, '')), '') is not null
    and total_estimated_fcfa >= 0
  );

grant insert on public.yapalaan_import_requests to anon, authenticated;
