create extension if not exists pgcrypto;

create table if not exists public.warilo_seller_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  store_name text not null,
  commune text not null,
  whatsapp_number text not null,
  phone text,
  email text,
  location_label text,
  latitude numeric,
  longitude numeric,
  trust_score integer not null default 60,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.warilo_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.warilo_seller_profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  product_type text not null default 'other'
    check (product_type in ('shoes', 'watch', 'other')),
  brand text,
  purchase_note text,
  condition_label text,
  authenticity_note text,
  estimated_market_price_fcfa integer check (estimated_market_price_fcfa is null or estimated_market_price_fcfa >= 0),
  price_fcfa integer not null check (price_fcfa >= 0),
  images jsonb not null default '[]'::jsonb,
  stock integer not null default 1 check (stock >= 0),
  status text not null default 'active'
    check (status in ('draft', 'active', 'sold', 'hidden', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.warilo_couriers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  commune text not null,
  vehicle_type text not null default 'moto'
    check (vehicle_type in ('moto', 'car', 'van', 'walk')),
  delivery_fee_fcfa integer not null default 0 check (delivery_fee_fcfa >= 0),
  yapalaan_commission_fcfa integer not null default 0 check (yapalaan_commission_fcfa >= 0),
  average_rating numeric not null default 5,
  ratings_count integer not null default 0,
  notes text,
  location_label text,
  latitude numeric,
  longitude numeric,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.warilo_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id text,
  seller_id uuid references public.warilo_seller_profiles(id),
  courier_id uuid references public.warilo_couriers(id),
  total_amount_fcfa integer not null check (total_amount_fcfa >= 0),
  delivery_fee_fcfa integer not null default 0,
  delivery_commission_fcfa integer not null default 0 check (delivery_commission_fcfa >= 0),
  delivery_commune text,
  delivery_landmark text,
  delivery_notes text,
  buyer_phone text,
  buyer_whatsapp text,
  buyer_email text,
  buyer_location_label text,
  buyer_latitude numeric,
  buyer_longitude numeric,
  payment_method text,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'accepted', 'in_delivery', 'delivered')),
  created_at timestamptz not null default now()
);

create table if not exists public.warilo_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.warilo_orders(id) on delete cascade,
  product_id uuid not null references public.warilo_products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price_fcfa integer not null check (unit_price_fcfa >= 0)
);

create table if not exists public.warilo_courier_ratings (
  id uuid primary key default gen_random_uuid(),
  courier_id uuid not null references public.warilo_couriers(id) on delete cascade,
  order_id uuid references public.warilo_orders(id) on delete set null,
  buyer_id text,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.warilo_products
  add column if not exists product_type text not null default 'other',
  add column if not exists brand text,
  add column if not exists purchase_note text,
  add column if not exists condition_label text,
  add column if not exists authenticity_note text,
  add column if not exists estimated_market_price_fcfa integer;

alter table public.warilo_couriers
  add column if not exists yapalaan_commission_fcfa integer not null default 0;

alter table public.warilo_orders
  add column if not exists delivery_commission_fcfa integer not null default 0;

alter table public.warilo_seller_profiles enable row level security;
alter table public.warilo_products enable row level security;
alter table public.warilo_couriers enable row level security;
alter table public.warilo_orders enable row level security;
alter table public.warilo_order_items enable row level security;
alter table public.warilo_courier_ratings enable row level security;

drop policy if exists "Public can read active sellers" on public.warilo_seller_profiles;
create policy "Public can read active sellers"
  on public.warilo_seller_profiles for select
  using (verification_status = 'verified');

drop policy if exists "Public can read active products" on public.warilo_products;
create policy "Public can read active products"
  on public.warilo_products for select
  using (status = 'active');

drop policy if exists "Public can read active couriers" on public.warilo_couriers;
create policy "Public can read active couriers"
  on public.warilo_couriers for select
  using (status = 'active');

drop policy if exists "Public can create demo orders" on public.warilo_orders;
create policy "Public can create demo orders"
  on public.warilo_orders for insert
  with check (true);

drop policy if exists "Public can create demo order items" on public.warilo_order_items;
create policy "Public can create demo order items"
  on public.warilo_order_items for insert
  with check (true);
