-- Phase 2: Content Update

-- 1. Rich Flashcards (Markdown Support)
-- We'll clear existing flashcards to avoid duplicates/conflicts with the new schema usage
truncate table flashcards cascade;

insert into flashcards (front_content, back_content, category, difficulty, tags) values
(
  'Como declarar uma variável que **não pode** ser reatribuída?',
  'Use a palavra-chave `const`.
Exemplo:
```javascript
const pi = 3.14;
pi = 3.15; // Erro!
```',
  'syntax',
  1,
  '{variables,es6}'
),
(
  'O que o método `.map()` faz em um array?',
  'Cria um **novo array** com os resultados da chamada de uma função para cada elemento.
Exemplo:
```javascript
const nums = [1, 2, 3];
const dobro = nums.map(n => n * 2);
// [2, 4, 6]
```',
  'concept',
  2,
  '{arrays,functional}'
),
(
  'Qual a diferença entre `==` e `===`?',
  '- `==`: Compara valor com **coerção de tipo** (ex: `"5" == 5` é `true`).
- `===`: Compara valor **e** tipo (ex: `"5" === 5` é `false`).

**Recomendação:** Sempre use `===`.',
  'common-error',
  1,
  '{operators,best-practices}'
),
(
  'Como filtrar elementos de um array?',
  'Use o método `.filter()`. Ele retorna um novo array com todos os elementos que passam no teste.
Exemplo:
```javascript
const nums = [1, 2, 3, 4];
const pares = nums.filter(n => n % 2 === 0);
// [2, 4]
```',
  'syntax',
  2,
  '{arrays,functional}'
),
(
  'O que é uma *Arrow Function*?',
  'Uma sintaxe mais curta para escrever funções.
Exemplo:
```javascript
// Tradicional
function soma(a, b) { return a + b; }

// Arrow Function
const soma = (a, b) => a + b;
```
Ela também não tem seu próprio `this`.',
  'syntax',
  2,
  '{functions,es6}'
),
(
  'Como acessar o último elemento de um array?',
  'Você pode usar `array[array.length - 1]` ou o método mais moderno `.at(-1)`.
Exemplo:
```javascript
const frutas = ["Maçã", "Banana"];
console.log(frutas.at(-1)); // "Banana"
```',
  'syntax',
  1,
  '{arrays,tips}'
),
(
  'O que é *Hoisting*?',
  'É o comportamento do JS de mover declarações para o topo do escopo.
- `var` e `function` são "içadas".
- `let` e `const` também são, mas ficam na "Zona Morta Temporal" até a linha de declaração.',
  'concept',
  3,
  '{advanced,scope}'
),
(
  'Como converter uma String para Número?',
  'Existem várias formas:
1. `Number("123")`
2. `parseInt("123")`
3. Operador unário `+`: `+"123"`',
  'syntax',
  1,
  '{types,conversion}'
),
(
  'O que é uma *Promise*?',
  'Um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona.
Estados:
- `pending` (pendente)
- `fulfilled` (realizada)
- `rejected` (rejeitada)',
  'concept',
  3,
  '{async,promises}'
),
(
  'Como verificar se um valor é `NaN`?',
  'Use `Number.isNaN(valor)`.
Cuidado: `typeof NaN` retorna `"number"`.',
  'common-error',
  2,
  '{types,validation}'
);

-- 2. New Level: Variables (World 1, Island 1)
-- Assuming World 1 and Island 1 exist from previous script
insert into levels (island_id, title, slug, type, order_index, xp_reward, coins_reward) values
(1, 'Variáveis Mágicas', 'variaveis-magicas', 'lesson', 2, 20, 10);

insert into lessons (level_id, content_markdown, initial_code, solution_code, test_case) values
((select id from levels where slug = 'variaveis-magicas'), 
'# O Poder das Variáveis 📦

No JavaScript, variáveis são como caixas onde guardamos informações.

Temos 3 tipos principais de caixas:
1. `const`: Uma caixa blindada. O que você coloca, não sai mais (não pode mudar o valor).
2. `let`: Uma caixa aberta. Você pode trocar o conteúdo quando quiser.
3. `var`: Uma caixa antiga e meio estranha. Evite usar por enquanto.

**Missão:**
1. Crie uma constante chamada `heroi` com o nome do seu personagem.
2. Crie uma variável `let` chamada `nivel` começando com 1.
3. Imprima o `heroi` no console.',
'// Digite seu código aqui
',
'const heroi = "Jedi"; let nivel = 1; console.log(heroi);',
'if (!output.length) throw new Error("Você precisa imprimir algo!"); 
if (!code.includes("const")) throw new Error("Use const para o herói");
if (!code.includes("let")) throw new Error("Use let para o nível");
return true;'
);
