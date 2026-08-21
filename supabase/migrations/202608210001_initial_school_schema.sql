create extension if not exists pgcrypto;

create type public.app_role as enum ('cluster_head', 'principal', 'teacher', 'staff', 'student');
create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');

create table public.clusters (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_kh text not null,
  district text,
  province text,
  created_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.clusters(id) on delete restrict,
  code text not null unique,
  name_kh text not null,
  principal_name text,
  phone text,
  address text,
  is_cluster_center boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete restrict,
  role public.app_role not null,
  display_name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.classrooms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  academic_year text not null,
  grade smallint not null check (grade between 0 and 6),
  section text not null,
  room_number text,
  homeroom_teacher_id uuid references public.profiles(id) on delete set null,
  unique (school_id, academic_year, grade, section)
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  classroom_id uuid references public.classrooms(id) on delete set null,
  code text not null unique,
  name_kh text not null,
  name_en text,
  gender text not null check (gender in ('male', 'female')),
  date_of_birth date,
  guardian_name text,
  guardian_phone text,
  address text,
  status text not null default 'active' check (status in ('active', 'suspended', 'transferred', 'graduated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  classroom_id uuid not null references public.classrooms(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status public.attendance_status not null,
  note text,
  recorded_by uuid not null references public.profiles(id) on delete restrict,
  recorded_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  school_id uuid references public.schools(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index students_school_class_idx on public.students(school_id, classroom_id);
create index attendance_class_date_idx on public.attendance(classroom_id, attendance_date);
create index audit_logs_school_created_idx on public.audit_logs(school_id, created_at desc);

create or replace function public.current_profile()
returns public.profiles
language sql stable security definer set search_path = public
as $$ select * from public.profiles where id = auth.uid() $$;

alter table public.clusters enable row level security;
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.classrooms enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;
alter table public.audit_logs enable row level security;

create policy "authenticated can read cluster" on public.clusters for select to authenticated using (true);
create policy "authenticated can read schools" on public.schools for select to authenticated using (true);
create policy "users read own profile" on public.profiles for select to authenticated using (
  id = auth.uid() or (select role from public.current_profile()) = 'cluster_head'
);
create policy "school members read classrooms" on public.classrooms for select to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
  or school_id = (select school_id from public.current_profile())
);
create policy "school members read students" on public.students for select to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
  or school_id = (select school_id from public.current_profile())
);
create policy "school managers manage students" on public.students for all to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
  or (school_id = (select school_id from public.current_profile()) and (select role from public.current_profile()) in ('principal', 'staff'))
) with check (
  (select role from public.current_profile()) = 'cluster_head'
  or (school_id = (select school_id from public.current_profile()) and (select role from public.current_profile()) in ('principal', 'staff'))
);
create policy "school members read attendance" on public.attendance for select to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
  or school_id = (select school_id from public.current_profile())
);
create policy "teachers manage own school attendance" on public.attendance for all to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
  or (school_id = (select school_id from public.current_profile()) and (select role from public.current_profile()) in ('principal', 'teacher', 'staff'))
) with check (
  recorded_by = auth.uid() and (
    (select role from public.current_profile()) = 'cluster_head'
    or school_id = (select school_id from public.current_profile())
  )
);
create policy "cluster head reads audit log" on public.audit_logs for select to authenticated using (
  (select role from public.current_profile()) = 'cluster_head'
);

insert into public.clusters (code, name_kh, district, province)
values ('TD-CLUSTER', 'កម្រងសាលាបឋមសិក្សាថ្លុកដង្កោ', 'ស្រុកជើងព្រៃ', 'ខេត្តកំពង់ចាម');


