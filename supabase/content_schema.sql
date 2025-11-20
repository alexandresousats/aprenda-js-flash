-- Reset (Caution: Deletes all content data)
drop table if exists user_progress cascade;
drop table if exists lessons cascade;
drop table if exists levels cascade;
drop table if exists islands cascade;
drop table if exists worlds cascade;

-- Content Structure
create table worlds (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text,
  order_index integer not null
);

create table islands (
  id serial primary key,
  world_id integer references worlds(id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text,
  order_index integer not null
);

create table levels (
  id serial primary key,
  island_id integer references islands(id) on delete cascade,
  slug text unique not null,
  title text not null,
  type text check (type in ('lesson', 'quiz', 'boss')) default 'lesson',
  order_index integer not null,
  xp_reward integer default 10,
  coins_reward integer default 5
);

create table lessons (
  id serial primary key,
  level_id integer references levels(id) on delete cascade unique,
  content_markdown text not null, -- The explanation
  initial_code text, -- Starter code for the editor
  solution_code text, -- Expected solution (or regex for validation)
  test_case text -- JS code to run to validate the user's answer
);

-- User Progress
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  level_id integer references levels(id) on delete cascade,
  status text check (status in ('locked', 'available', 'completed', 'perfect')) default 'locked',
  score integer default 0,
  completed_at timestamp with time zone,
  
  unique(user_id, level_id)
);

-- RLS
alter table worlds enable row level security;
alter table islands enable row level security;
alter table levels enable row level security;
alter table lessons enable row level security;
alter table user_progress enable row level security;

-- Public read access for content
create policy "Public content read worlds" on worlds for select using (true);
create policy "Public content read islands" on islands for select using (true);
create policy "Public content read levels" on levels for select using (true);
create policy "Public content read lessons" on lessons for select using (true);

-- User progress access
create policy "Users can view own progress" on user_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on user_progress
  for update using (auth.uid() = user_id);

-- Seed Data (World 1)
insert into worlds (title, slug, description, order_index) values
('Fundamentos', 'fundamentos', 'O início da sua jornada', 1);

insert into islands (world_id, title, slug, description, order_index) values
(1, 'Primeiros Passos', 'primeiros-passos', 'Aprenda o básico do JS', 1);

insert into levels (island_id, title, slug, type, order_index) values
(1, 'Olá Mundo', 'ola-mundo', 'lesson', 1);

insert into lessons (level_id, content_markdown, initial_code, solution_code, test_case) values
(1, 
'# Olá, Viajante! 👋

Bem-vindo ao mundo do JavaScript. Sua primeira missão é simples: fazer o computador falar com você.

Em JavaScript, usamos `console.log()` para imprimir mensagens.

**Missão:**
Faça o console imprimir a mensagem "Hello World".',
'// Escreva seu código abaixo
',
'Hello World',
'if (output.includes("Hello World")) return true; else throw new Error("A mensagem deve ser exatamente: Hello World");'
);
