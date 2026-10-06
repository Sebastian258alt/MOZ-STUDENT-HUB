-- MOZ STUDENT HUB V2: tables + security. Run in Supabase > SQL Editor.
create table public.institutions(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,category text,description text,logo_url text,active boolean not null default true,created_at timestamptz not null default now());
create table public.categories(id uuid primary key default gen_random_uuid(),name text unique not null,sort int not null default 0);
create table public.profiles(id uuid primary key references auth.users on delete cascade,full_name text,email text,avatar_url text,institution_id uuid references public.institutions on delete set null,role text not null default 'user' check(role in('user','admin')),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.products(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,institution_id uuid references public.institutions on delete set null,subject text,description text,price numeric(10,2) not null check(price>=0),type text,includes text[] not null default '{}',demo boolean not null default true,cover_url text,file_url text,active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.orders(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users on delete set null,product_id uuid not null references public.products,amount numeric(10,2) not null default 0,status text not null default 'pending' check(status in('pending','confirmed','cancelled')),payment_method text not null default 'other' check(payment_method in('mpesa','emola','bank_transfer','cash','other')),created_at timestamptz not null default now());
create table public.favorites(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,product_id uuid not null references public.products on delete cascade,created_at timestamptz not null default now(),unique(user_id,product_id));
create table public.quizzes(id uuid primary key default gen_random_uuid(),title text not null,description text,institution_id uuid references public.institutions on delete set null,subject text,duration_minutes int not null default 10,active boolean not null default true,created_at timestamptz not null default now());
create table public.questions(id uuid primary key default gen_random_uuid(),quiz_id uuid not null references public.quizzes on delete cascade,question text not null,option_a text not null,option_b text not null,option_c text not null,option_d text not null,correct_option text not null check(correct_option in('a','b','c','d')),explanation text,order_number int not null default 0);
create table public.quiz_attempts(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,quiz_id uuid not null references public.quizzes on delete cascade,score int not null,total_questions int not null check(total_questions>0),percentage numeric(5,2) generated always as (round(score*100.0/total_questions,2)) stored,started_at timestamptz,completed_at timestamptz not null default now(),check(score between 0 and total_questions));
create table public.user_progress(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,subject text not null,quizzes_completed int not null default 0,average_score numeric(5,2) not null default 0,updated_at timestamptz not null default now(),unique(user_id,subject));

-- Helpers. is_admin() reads the role from the DB, never from the browser.
create function public.is_admin() returns boolean language sql security definer stable set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
create function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger t_prof_upd before update on public.profiles for each row execute function set_updated_at();
create trigger t_prod_upd before update on public.products for each row execute function set_updated_at();

-- New auth user -> profile row (role is always 'user').
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin
 insert into profiles(id,full_name,email,avatar_url) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name'),new.email,coalesce(new.raw_user_meta_data->>'avatar_url',new.raw_user_meta_data->>'picture')) on conflict do nothing; return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Orders: amount always comes from the product price; non-admins can only create 'pending'.
create function public.orders_before_insert() returns trigger language plpgsql security definer set search_path=public as $$ begin
 select price into new.amount from products where id=new.product_id and active;
 if new.amount is null then raise exception 'Produto inválido'; end if;
 if not is_admin() then new.status='pending'; end if; return new; end $$;
create trigger t_orders_ins before insert on public.orders for each row execute function orders_before_insert();

-- Progress is calculated by the database after each attempt (users cannot write it).
create function public.update_progress() returns trigger language plpgsql security definer set search_path=public as $$
declare s text; begin select subject into s from quizzes where id=new.quiz_id; if s is null then return new; end if;
 insert into user_progress(user_id,subject,quizzes_completed,average_score) select new.user_id,s,count(*),round(avg(a.percentage),2) from quiz_attempts a join quizzes q on q.id=a.quiz_id where a.user_id=new.user_id and q.subject=s
 on conflict(user_id,subject) do update set quizzes_completed=excluded.quizzes_completed,average_score=excluded.average_score,updated_at=now(); return new; end $$;
create trigger t_attempt_progress after insert on public.quiz_attempts for each row execute function update_progress();

-- Row Level Security
alter table public.institutions,public.categories,public.profiles,public.products,public.orders,public.favorites,public.quizzes,public.questions,public.quiz_attempts,public.user_progress enable row level security;

-- Public catalogue: anyone reads active rows; only admins write.
create policy "read" on public.institutions for select using(active or is_admin());
create policy "read" on public.products for select using(active or is_admin());
create policy "read" on public.quizzes for select using(active or is_admin());
create policy "read" on public.categories for select using(true);
create policy "read" on public.questions for select using(exists(select 1 from quizzes q where q.id=quiz_id and q.active) or is_admin());
create policy "admin" on public.institutions for all using(is_admin()) with check(is_admin());
create policy "admin" on public.products for all using(is_admin()) with check(is_admin());
create policy "admin" on public.quizzes for all using(is_admin()) with check(is_admin());
create policy "admin" on public.categories for all using(is_admin()) with check(is_admin());
create policy "admin" on public.questions for all using(is_admin()) with check(is_admin());

-- User data: own rows only.
create policy "own read" on public.profiles for select using(id=auth.uid() or is_admin());
create policy "own update" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "own read" on public.orders for select using(user_id=auth.uid() or is_admin());
create policy "own create" on public.orders for insert with check(user_id=auth.uid());
create policy "admin update" on public.orders for update using(is_admin()) with check(is_admin());
create policy "own read" on public.favorites for select using(user_id=auth.uid());
create policy "own create" on public.favorites for insert with check(user_id=auth.uid());
create policy "own delete" on public.favorites for delete using(user_id=auth.uid());
create policy "own read" on public.quiz_attempts for select using(user_id=auth.uid());
create policy "own create" on public.quiz_attempts for insert with check(user_id=auth.uid());
create policy "own read" on public.user_progress for select using(user_id=auth.uid());

-- Column-level limits: users edit only name/avatar/institution (never role); file_url is never readable from the browser.
revoke update on public.profiles from anon,authenticated;
grant update(full_name,avatar_url,institution_id) on public.profiles to authenticated;
revoke select on public.products from anon,authenticated;
grant select(id,title,slug,institution_id,subject,description,price,type,includes,demo,cover_url,active,created_at,updated_at) on public.products to anon,authenticated;
revoke insert,update,delete on public.user_progress from anon,authenticated;
revoke update,delete on public.orders,public.quiz_attempts from anon,authenticated;
