-- Flash Cards System

-- Reset (Caution)
drop table if exists user_flashcards cascade;
drop table if exists flashcards cascade;

create table flashcards (
  id serial primary key,
  front_content text not null, -- Question/Concept
  back_content text not null, -- Answer/Explanation
  category text check (category in ('concept', 'syntax', 'example', 'common-error')) default 'concept',
  difficulty integer default 1, -- 1-5
  tags text[] default '{}'
);

create table user_flashcards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  flashcard_id integer references flashcards(id) on delete cascade,
  
  -- Spaced Repetition (SM-2 inspired)
  next_review_at timestamp with time zone default now(),
  interval_days integer default 0,
  ease_factor numeric default 2.5,
  streak integer default 0,
  
  last_reviewed_at timestamp with time zone,
  
  unique(user_id, flashcard_id)
);

-- RLS
alter table flashcards enable row level security;
alter table user_flashcards enable row level security;

create policy "Public read flashcards" on flashcards for select using (true);

create policy "Users can view own flashcards" on user_flashcards
  for select using (auth.uid() = user_id);

create policy "Users can insert own flashcards" on user_flashcards
  for insert with check (auth.uid() = user_id);

create policy "Users can update own flashcards" on user_flashcards
  for update using (auth.uid() = user_id);

-- Seed Data
insert into flashcards (front_content, back_content, category, difficulty) values
('O que é uma variável const?', 'Uma variável cujo valor não pode ser reatribuído após a inicialização.', 'concept', 1),
('Como declarar uma função arrow?', 'const minhaFuncao = () => { ... }', 'syntax', 2),
('O que o método .map() faz?', 'Cria um novo array com os resultados da chamada de uma função para cada elemento.', 'concept', 2),
('Qual a diferença entre == e ===?', '== compara valor (com coerção), === compara valor e tipo.', 'common-error', 1),
('Como adicionar um elemento ao final de um array?', 'array.push(elemento)', 'syntax', 1);
