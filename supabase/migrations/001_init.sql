create table game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  room_idx int default 0,
  player_state jsonb,
  rooms_state jsonb,
  updated_at timestamptz default now(),
  unique(user_id)
);
alter table game_saves enable row level security;
create policy "Users can only access own saves"
  on game_saves for all using (auth.uid() = user_id);