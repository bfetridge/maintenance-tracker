-- Run this in the Supabase SQL editor

create table buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade,
  unit_number text not null,
  created_at timestamptz default now()
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete cascade,
  category text not null,
  description text not null,
  is_emergency boolean default false,
  status text not null default 'submitted',
  tenant_email text not null,
  tenant_name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ticket_updates (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references tickets(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz default now()
);

-- Enable Row Level Security but allow anon to insert/read tickets
-- (tenants don't log in — they just use a public form)
alter table buildings enable row level security;
alter table units enable row level security;
alter table tickets enable row level security;
alter table ticket_updates enable row level security;

-- Anyone can read buildings and units (for the dropdowns)
create policy "Public read buildings" on buildings for select using (true);
create policy "Public read units" on units for select using (true);

-- Anyone can insert a ticket (tenant submission)
create policy "Public insert tickets" on tickets for insert with check (true);

-- Anyone can read a ticket by ID (for the tracker page)
create policy "Public read tickets" on tickets for select using (true);

-- Anyone can read ticket_updates (for the tracker page)
create policy "Public read ticket_updates" on ticket_updates for select using (true);

-- Service role (used by Edge Functions) handles updates — no extra policy needed

-- Sample data — delete or edit as needed
insert into buildings (name, address) values
  ('123 Main St', '123 Main Street, Chicago, IL 60601'),
  ('456 Oak Ave', '456 Oak Avenue, Chicago, IL 60614');

insert into units (building_id, unit_number)
select id, u from buildings, unnest(array['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4']) as u
where name = '123 Main St';

insert into units (building_id, unit_number)
select id, u from buildings, unnest(array['Floor 1', 'Floor 2', 'Floor 3']) as u
where name = '456 Oak Ave';
