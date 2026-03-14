-- Shows table
create table if not exists shows (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  show_time text,
  venue text not null,
  city text not null,
  state text not null,
  ticket_url text,
  description text,
  venue_lat double precision,
  venue_lng double precision,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Band members table
create table if not exists band_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  url text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Band info (key-value store for tagline, bio, etc.)
create table if not exists band_info (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: enable on all tables, allow public read
alter table shows enable row level security;
alter table band_members enable row level security;
alter table band_info enable row level security;

create policy "Public read shows" on shows
  for select using (true);

create policy "Public read band_members" on band_members
  for select using (true);

create policy "Public read band_info" on band_info
  for select using (true);

-- Seed data
insert into band_info (key, value) values
  ('tagline', 'A three-piece pop band from Austin, TX'),
  ('bio', 'Wheel is a three-piece pop band from Austin, Texas. Formed in 2023, they blend catchy melodies with honest lyrics and tight arrangements.')
on conflict (key) do nothing;

insert into band_members (name, role, bio, display_order) values
  ('Member 1', 'Guitar / Vocals', 'Bio goes here', 0),
  ('Member 2', 'Bass', 'Bio goes here', 1),
  ('Member 3', 'Drums', 'Bio goes here', 2)
on conflict do nothing;

insert into shows (date, venue, city, state, is_published) values
  ('2026-04-15', 'The Continental Club', 'Austin', 'TX', true),
  ('2026-05-01', 'Mohawk', 'Austin', 'TX', true),
  ('2026-05-20', 'Stubb''s', 'Austin', 'TX', true)
on conflict do nothing;
