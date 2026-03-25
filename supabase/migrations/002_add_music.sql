-- Albums table
create table if not exists album (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null default 'Wheel',
  cover_image_url text,
  year integer,
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tracks table
create table if not exists track (
  id uuid default gen_random_uuid() primary key,
  album_id uuid not null references album(id) on delete cascade,
  title text not null,
  track_number integer not null default 1,
  audio_url text not null,
  duration_seconds integer,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists track_album_id_idx on track(album_id);

-- RLS
alter table album enable row level security;
alter table track enable row level security;

create policy "Public read album" on album
  for select using (true);

create policy "Public read track" on track
  for select using (true);
