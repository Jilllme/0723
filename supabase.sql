-- Jeremy's Phone · 双人编辑 & 互动消息 / 来电云端数据库
-- 在 Supabase 控制台 > SQL Editor 运行此脚本。然后用实际两人的邮箱替换最后两行示例，再运行。
-- 安全说明：所有内容和虚构聊天都可以由访客查看；只有授权邮箱能改写。不要在此放真实隐私资料。
create extension if not exists pgcrypto;

create table if not exists public.phone_editors (
  email text primary key check (email = lower(email))
);
create table if not exists public.phone_documents (
  id text primary key check (id='main'),
  content jsonb not null,
  revision integer not null default 1 check(revision>0),
  updated_at timestamptz not null default now()
);
create table if not exists public.phone_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('wechat','call')),
  contact_id text not null check (length(contact_id) between 1 and 100),
  sender text not null check (sender in ('self','other')),
  text text not null check (char_length(text) between 1 and 5000),
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists phone_events_created_at_idx on public.phone_events (created_at desc);

create or replace function public.is_phone_editor() returns boolean
language sql stable security definer set search_path=public as $$
  select auth.uid() is not null and exists(
    select 1 from public.phone_editors where email=lower(coalesce(auth.jwt()->>'email',''))
  );
$$;
revoke all on function public.is_phone_editor() from public;
grant execute on function public.is_phone_editor() to anon,authenticated;

alter table public.phone_editors enable row level security;
alter table public.phone_documents enable row level security;
alter table public.phone_events enable row level security;

drop policy if exists "editors see their own record" on public.phone_editors;
create policy "editors see their own record" on public.phone_editors
  for select to authenticated using(email=lower(coalesce(auth.jwt()->>'email','')));

drop policy if exists "visitors view content" on public.phone_documents;
create policy "visitors view content" on public.phone_documents
  for select to anon,authenticated using(true);
drop policy if exists "editors create content" on public.phone_documents;
create policy "editors create content" on public.phone_documents
  for insert to authenticated with check(public.is_phone_editor());
drop policy if exists "editors update content" on public.phone_documents;
create policy "editors update content" on public.phone_documents
  for update to authenticated using(public.is_phone_editor()) with check(public.is_phone_editor());

drop policy if exists "visitors view events" on public.phone_events;
create policy "visitors view events" on public.phone_events
  for select to anon,authenticated using(true);
drop policy if exists "editors post events" on public.phone_events;
create policy "editors post events" on public.phone_events
  for insert to authenticated with check(public.is_phone_editor() and created_by=auth.uid());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values('phone-images','phone-images',true,4000000,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=4000000,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "editors upload phone images" on storage.objects;
create policy "editors upload phone images" on storage.objects
 for insert to authenticated with check(bucket_id='phone-images' and public.is_phone_editor());
drop policy if exists "view shared phone images" on storage.objects;
create policy "view shared phone images" on storage.objects
 for select to anon,authenticated using(bucket_id='phone-images');

-- 必须改成真实的两位编辑者邮箱，再执行下面的语句。其他邮箱即使登录也不能编辑。
-- insert into public.phone_editors(email) values('你的邮箱@example.com'),('朋友邮箱@example.com') on conflict do nothing;
