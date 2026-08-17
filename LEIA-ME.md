# FACIM 2026 — pacote para o b2b-mozambique

Tudo o que é preciso para a vertente FACIM 2026 do site. Copie o conteúdo desta
pasta para a raiz do repositório `b2b-mozambique`, mantendo a estrutura. Nada da
FENA é apagado — as páginas antigas continuam a funcionar exactamente como antes.

```
cp -r facim-2026/* /caminho/para/b2b-mozambique/
```

---

## O que vem aqui

### Ficheiros novos

| Ficheiro | O que é |
|---|---|
| `facim.html` | Página da FACIM 2026 — hero, Vitrine Digital, planta do pavilhão, painel de conteúdos, plano da missão |
| `facim-empresa.html` | Página de cada expositor (`facim-empresa.html?id=slug`) |
| `css/facim.css` | Estilos da vertente. **Todas as classes começam por `.facim-`** — não colide com nada do `style.css` |
| `js/facim-data.js` | Lista de empresas, dados do evento, cronograma e plano de viagem |
| `js/facim.js` | Renderização: vitrine, filtros, planta, painel de conteúdos, perfil, lightbox |
| `css/motion.css` | Sistema de movimento: revelações, header reactivo, rail de secções |
| `js/motion.js` | Motor de animação (~7 KB, sem bibliotecas externas) |
| `data/facim/` | 48 empresas convertidas, com logótipos e fotografias |

### Ficheiros alterados

| Ficheiro | O que mudou |
|---|---|
| `js/main.js` | Popup novo; modal de agendamento passa a servir as duas feiras |
| `index.html` | Link FACIM na navbar, faixa da FACIM, revelações, `motion` ligado |
| `explore.html` | Link FACIM na navbar, revelações, `motion` ligado |
| `empresa.html` | Link FACIM na navbar, `motion` ligado |
| `servicos.html` | `motion` ligado |

> Se já mexeu no `main.js` desde que me enviou o ZIP, veja a secção
> «Alterações no main.js» no fim deste ficheiro antes de substituir.

---

## Como acrescentar conteúdos à Vitrine Digital

É isto que a coordenação da FACIM pediu: vídeos, fotografias e informação do
produto de cada beneficiário. Tudo entra na pasta da empresa, em
`data/facim/<slug>/`.

### Fotografias

Coloque os ficheiros na pasta e registe os nomes no `dados.json`:

```
data/facim/nutrivida/
  cover.jpg        ← foto principal (aparece no cartão e no topo da página)
  servico_1.jpg    ← foto do 1.º produto
  servico_2.jpg    ← foto do 2.º produto
  logo.png
```

```json
"vitrine": {
  "cover": "cover.jpg",
  "fotos": ["servico_1.jpg", "servico_2.jpg"],
  "logo": "logo.png"
}
```

As fotos aparecem pela ordem da lista, e cada `servico_N` fica emparelhada com o
serviço na mesma posição do array `empresa.servicos`.

### Vídeos

Cole o link do YouTube — qualquer formato serve (`youtu.be/…`,
`youtube.com/watch?v=…`, `/shorts/…`):

```json
"vitrine": {
  "videos": ["https://youtu.be/XXXXXXXXXXX"]
}
```

O vídeo passa a aparecer na página da empresa e o cartão da vitrine deixa de
mostrar «0 vídeos».

### Informação do produto

É o campo `empresa.descricao`. O que a empresa leva à feira está em
`facim.produtosExpor` (vem do Plano Integrado, para as apuradas).

### Empresa nova

1. Crie `data/facim/<slug>/dados.json` (copie o de outra empresa como modelo).
2. Acrescente o `<slug>` ao array `FACIM_SLUGS` em `js/facim-data.js`.

Mais nada — os números, filtros, planta e painel de conteúdos actualizam-se
sozinhos.

---

## Painel de recolha de conteúdos

Na página FACIM, secção **«O que já temos de cada beneficiário»**. Mostra, por
empresa, se já há fotografias, vídeo, descrição e logótipo, com barras de
progresso e um filtro «só com material em falta». É a lista de trabalho da
equipa — à medida que for acrescentando material aos `dados.json`, o painel
acompanha.

Ponto de partida (16 de Agosto), nas 19 apuradas:

- **Fotografias:** 13 de 19
- **Vídeos:** 0 de 19
- **Descrição:** 19 de 19
- **Logótipo:** 11 de 19

Sem qualquer fotografia: Agro Nice, Ancha Investimento, Consertera, Delícias do
Jardim, Madopera e Xima de Namaua.

---

## Correcções aplicadas aos dados

Três campos vinham mal preenchidos nos formulários:

1. **«Nampula»** estava no campo do nome da empresa. A descrição identifica-a
   como **Oruwera, Limitada** — é esse o nome usado (slug `oruwera-limitada`).
   Para reverter, mude `OVERRIDE_NOME` no script de conversão ou edite o
   `dados.json` e o `FACIM_SLUGS`.
2. **Mozagro Business** e **Ômega3mf** tinham o nome do responsável no campo do
   serviço («Alberto Chauque», «Osvaldo Simão»). Esses serviços foram removidos;
   as fotografias mantêm-se.
3. **Sectores**: o formulário da FACIM não tinha campo de sector. Para as
   apuradas usei o do Plano Integrado; para as restantes, deduzi a partir do
   nome e dos produtos. Se algum estiver errado, corrija `empresa.industria` no
   `dados.json` da empresa.

**Delícias do Jardim** está no Plano Integrado mas não tem pasta de conteúdos —
foi criada só com os dados do Excel, e aparece no painel com tudo em falta.

---

## Alterações no `js/main.js`

Se preferir aplicar à mão em vez de substituir o ficheiro:

1. **Popup** — o bloco `POPUP — Manifestação de Interesse FACIM 2026` foi
   substituído. O anterior anunciava inscrições «até 03 de Agosto» e apontava
   para `form-fena.vercel.app`; o novo leva à Vitrine Digital, tem selo dinâmico
   («Faltam X dias» → «A decorrer» → «Encerrada») e não aparece nas páginas da
   FACIM. A chave do `sessionStorage` mudou, por isso o popup volta a aparecer
   uma vez a quem já tinha fechado o antigo.

2. **Agendamento** — `abrirModalAgendamento(slug, vertente)` passou a aceitar um
   segundo argumento. Existe o atalho `abrirModalAgendamentoFacim(slug)`. Na
   vertente FACIM: lista as empresas da feira com o stand ao lado do nome, o
   local por omissão é «Stand OHOLO Hub — FACIM 2026 (Ricatla, Marracuene)», as
   datas ficam limitadas a 31/08–06/09 e o email que chega à equipa identifica a
   feira no assunto. As chamadas existentes sem segundo argumento continuam a
   funcionar como antes (FENA).


---

## Sistema de movimento

`css/motion.css` + `js/motion.js`. Faz o que se costuma pedir ao GSAP com
ScrollTrigger — revelações ao entrar no ecrã, cascatas, parallax, contadores,
header reactivo e secção activa — mas sem biblioteca externa: cerca de 7 KB, um
único `requestAnimationFrame`, tudo em `transform` e `opacity` (compositado pela
GPU).

Optei por não carregar o GSAP de um CDN por três razões: são mais ~70 KB antes de
a página pintar, num público que muitas vezes navega em dados móveis; um CDN em
baixo deixaria a página com secções invisíveis; e o site não tem build nem
gestor de pacotes. Se preferir GSAP mesmo assim, diga — a troca é directa, os
atributos `data-anim` mapeiam quase um-para-um para `ScrollTrigger.batch`.

### Como animar qualquer elemento

```html
<div data-anim="up">…</div>                    <!-- sobe e aparece -->
<div data-anim="rise" data-anim-delay="120">…</div>
<div data-anim-stagger="70">                   <!-- filhos em cascata -->
  <article data-anim="rise">…</article>
  <article data-anim="rise">…</article>
</div>
<h1 data-anim-linhas="110">Linha um<br>Linha dois</h1>
<span data-count="19">0</span>                 <!-- conta até 19 -->
<span data-parallax="0.06">…</span>            <!-- desloca-se ao rolar -->
```

Variantes de `data-anim`: `up`, `down`, `left`, `right`, `scale`, `rise`,
`blur`, `clip`, `line`, `fade`. A curva é `cubic-bezier(0.16, 1, 0.3, 1)` —
expo.out, a que dá a travagem suave.

Para conteúdo injectado por JavaScript depois do arranque:

```js
window.Movimento.observar(container);  // regista as animações dos novos nós
window.Movimento.remedir();            // recalcula alturas das secções
```

### Rede de segurança

Cada página tem um bloco `<noscript>` que anula os estados iniciais. Se o
JavaScript falhar, nada fica invisível à espera de uma animação.

Quem tem `prefers-reduced-motion: reduce` activo no sistema recebe a página
inteira sem uma única animação — não é uma versão degradada, é o mesmo conteúdo
sem movimento.

---

## Como a página FACIM deixou de parecer longa

O conteúdo é o mesmo; o que mudou foi o percurso.

1. **Rail de secções.** Barra vertical à direita (desktop) com a secção actual
   marcada. No telemóvel, barra flutuante no fundo do ecrã. Aparece depois do
   hero e desaparece perto do fim.
2. **Fio de progresso** no header, para se saber quanto falta.
3. **Vitrine por lotes.** Passou de páginas numeradas para 9 cartões e um botão
   «Ver mais 9 empresas — 39 por mostrar». Números numerados obrigam a decidir;
   um botão só pede um clique. Os filtros repõem o lote inicial.
4. **Painel de conteúdos recolhido.** É ferramenta interna, não vitrine. Ficou
   um resumo de uma linha sempre visível (13/19 com fotografias, 0/19 com
   vídeo…) e o detalhe abre-se com um clique. A tabela rola por dentro, com o
   cabeçalho fixo, em vez de esticar a página.
5. **Ordem revista.** O painel de conteúdos passou para depois do plano da
   missão — o visitante externo chega ao agendamento sem passar por uma tabela
   de gestão interna.
6. **Revelações ao descer.** O conteúdo chega à medida que se rola, em vez de
   estar todo parado à espera.

## Header

- Sobre o hero da FACIM fica transparente com texto branco; ao sair do hero
  torna-se vidro fosco e encolhe.
- Recolhe ao descer e volta ao subir — devolve altura de ecrã sem tirar o acesso
  à navegação.
- Sublinhado que se desenha nos links, e fio de progresso da página em baixo.
- No telemóvel, os itens do menu entram em cascata.
- Nas páginas com hero escuro o header é `position: fixed` (classe
  `tem-hero-escuro` no `<body>`); nas restantes continua `sticky`, como estava.
