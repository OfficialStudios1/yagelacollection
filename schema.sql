create extension if not exists pgcrypto;
create table if not exists public.products(id uuid primary key default gen_random_uuid(),name text not null,category text not null check(category in ('personal','home','fashion','ppe','fragrance','juice')),price numeric(12,2) not null check(price>=0),image_url text,badge text,description text,active boolean not null default true,sort_order integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.orders(id uuid primary key default gen_random_uuid(),customer_name text not null,customer_phone text not null,delivery_address text not null,items jsonb not null,payment_method text not null default 'momo',total numeric(12,2) not null check(total>=0),status text not null default 'pending' check(status in ('pending','processing','completed','cancelled')),created_at timestamptz not null default now());
create table if not exists public.subscribers(id uuid primary key default gen_random_uuid(),email text not null unique,created_at timestamptz not null default now());
alter table public.products enable row level security; alter table public.orders enable row level security; alter table public.subscribers enable row level security;
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select to anon,authenticated using(active=true);
drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products for all to authenticated using(true) with check(true);
drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders" on public.orders for select to authenticated using(true);
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update to authenticated using(true) with check(true);
drop policy if exists "Admins can read subscribers" on public.subscribers;
create policy "Admins can read subscribers" on public.subscribers for select to authenticated using(true);
insert into public.products(name,category,price,image_url,badge,description,sort_order)
select * from (values
('Metal Steel Tongue Scraper','personal',65.0,'assets/Picture1.jpg','New',null, 0),
('Metal tongue scraper with plastic handle','personal',30.0,'assets/Picture2.jpg','New',null, 1),
('Shape wear','personal',100.0,'assets/shape.jpg','Popular',null, 2),
('Toilet Stamp Gel','home',20.0,'assets/toilet.png','Sale','In packages-Big', 3),
('Toilet Stamp Gel','home',12.0,'assets/Toilet stamp gel small.png','Sale','In packages-Small', 4),
('Laundry Pods','home',85.0,'assets/Pod.jpeg','Sale',null, 5),
('Reflector shirt','ppe',165.0,'assets/top.jpg','Safety','TYPE: Long Sleeve and Short sleeve Sizes: M, L, XL, XXL', 6),
('Reflector trousers','ppe',265.0,'assets/down.jpeg','Safety','TYPE: Long trousers Sizes: M, L, XL, XXL', 7),
('DIFFUSER 130ML','fragrance',70.0,'assets/Picture9.jpg','New',null, 8),
('4 in Box Mini Perfumes','fragrance',120.0,'assets/perfume.jpg','Hot','75ml', 9),
('Flavoured mouth fresh','home',15.0,'assets/mouth fresh.jpeg',null,null, 10),
('Silicone tongue cleaner','home',10.0,'assets/tongue.png',null,null, 11)
) v(name,category,price,image_url,badge,description,sort_order)
where not exists(select 1 from public.products);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
