# Redesign OHOLO HUB — Stitch → Código → Animações

Marca nova: **branco · preto · cinza · vermelho**.
Conteúdo: **o do site actual, sem inventar nada**.

---

## Fluxo de trabalho

**Fase 1 — Desenhar no Stitch.** Uma página de cada vez, em partes. De cada
resultado guarda-se **duas coisas**: a imagem (para aprovar o aspecto) e o
**código exportado** (para tirar os valores exactos — espaçamentos, tamanhos,
pesos, hex, raios). O código é a fonte de verdade, a foto é só para ver.

**Fase 2 — Ajustar e integrar.** Compara-se o código do Stitch com o site,
extraem-se os tokens para `css/style.css`, e reconstrói-se cada página mantendo
o HTML dinâmico e os `id`/`data-` que o JS já usa. Nesta fase corrige-se o que
ficou torto. **Nada de animações ainda.**

**Fase 3 — Animações.** Só depois do layout aprovado é que entra GSAP +
ScrollTrigger + Lenis. Prompt no fim deste ficheiro.

### Como guardar cada design

```
design/
  01-home/        screenshot.png  +  code.html  +  notas.md
  02-facim/       screenshot.png  +  code.html
  03-empresa/     ...
```

Assim, na Fase 2, abre-se o `code.html` lado a lado com o ficheiro real e o
resultado sai pixel-perfect em vez de "parecido".

---

## Regra de ouro: o conteúdo é fixo, o design é que muda

O site tem **dois tipos de conteúdo** e o Stitch tem de respeitar os dois.

### 1. Conteúdo estático — tem de aparecer literalmente

Está escrito nos `.html`. Vai nos prompts entre aspas e **copia-se tal e qual**,
com a ortografia de Portugal que o site usa (*seleccionada*, *projecto*,
*directamente*, *sector*). Se o Stitch reescrever a copy, o design é rejeitado.

### 2. Conteúdo dinâmico — o desenho é um *molde*, não texto final

As empresas, a galeria e os stands são gerados por JavaScript a partir de
`data/facim/<slug>/dados.json` e `js/facim-data.js`. O Stitch desenha **um
cartão**, e o JS repete-o 48 vezes.

Por isso o cartão desenhado só pode mostrar campos que **existem** nos dados:

| Campo no JSON | Onde aparece no cartão |
|---|---|
| `nome` | título do cartão |
| `industria` | chip/badge (ex.: "Serviços & Consultoria") |
| `provincia` | linha de meta (ex.: "Cabo Delgado") |
| `descricao` | resumo de 2 linhas |
| `servicos[]` | contagem: "5 serviços" |
| `badges[]` | selo "Empresa Apurada" |
| `logo.png` / `cover.jpg` | imagem do cartão |

Campos que o site **não tem** — rating, estrelas, preço, número de seguidores,
"verificado há X dias" — não podem entrar no desenho. Se entrarem, na integração
ou ficam vazios ou é preciso deitar fora metade do design.

Ficha de empresa, campos disponíveis: `nome`, `descricao`, `badges[]`, `nuit`,
`fundacao`, `anosActividade`, `industria`, `provincia`,
`contactos{email, telefone, website, linkedin, twitter}`,
`responsavel{nome, cargo}`, `servicos[{nome, descricao}]`, fotografias
`cover.jpg` e `servico_N.jpg`.

---

## BLOCO A — Sistema de marca (colar primeiro, uma vez por projecto)

```
You are designing a world-class, award-winning website (Awwwards Site of the Day
calibre) for OHOLO HUB — a Mozambican B2B platform, run by Market Access and
TechnoServe under the OHOLO Project, that prepares companies for market, connects
them to buyers, and showcases them at trade fairs (FACIM 2026, FENA). Audience:
exporters, buyers, investors, development partners. Tone: institutional,
confident, editorial — never startup-generic, never template-looking.

BRAND SYSTEM (the logo is white, black, grey and red — those four are the whole
palette; introduce no fifth colour)
- Black #000000 — the anchor: wordmark, display headings on light backgrounds,
  outline buttons.
- Ink #0B0C0E — near-black for large dark surfaces (hero scrim, CTA band, footer).
  Pure black for type and logo; Ink for big areas — it reads richer on screen and
  lets photography sit inside it without banding.
- Red #E01F26 — accent only, never a large flat background.
  Pressed/hover #B0161C. Tint #FFF1F1.
- Greys: Graphite #17191C · Slate #3A3E44 · Grey #6E7278 · Line #E4E6E9 ·
  Mist #F4F5F7. White #FFFFFF.
- Ratio: ~60% white, ~35% black/Ink + greys + photography, ~5% red.
  Red only in: micro-labels, rules/underlines, active states, the primary button,
  data highlights, the scroll-progress bar.
- The page alternates white and black in big confident blocks, so the rhythm is
  part of the design. Each black section carries white type and exactly one red
  accent. Black-and-white is the design; red is the punctuation.

TYPOGRAPHY
- Headings: Inter (or a close high-contrast grotesk), weight 600, display sizes
  clamp 48px → 96px, tracking -0.03em, line-height 0.95–1.05, left-aligned.
- Body: Inter 17–19px, line-height 1.65, colour Slate #3A3E44.
- Eyebrows: 11px uppercase, letter-spacing 0.18em, red or grey, preceded by a 6px
  red dot or a 24px red rule.
- Numbers (stats, countdown) tabular and oversized.

LAYOUT
- 12 columns, 1440px max width, 80px gutters desktop / 20px mobile.
- Sections breathe: 140–200px vertical padding.
- Asymmetry over symmetry: 7/5 and 8/4 splits, offset headings, images bleeding
  off the right edge, section numbers ("03 / 06") in the left margin.
- 1px #E4E6E9 hairlines as separators. Radii: 4px controls, 16px cards, 0 on
  full-bleed media. No heavy shadows — depth comes from layering and scale.

COMPONENTS
- Primary button: solid red, white text, 52px tall, 4px radius, arrow that slides
  right on hover. Secondary: 1px black outline, fills black on hover.
  On dark: 1px white outline, or solid white with black text.
- Cards: white, 1px #E4E6E9, 16px radius, image top, chip, title, 2-line
  description, hairline, meta row with a small red arrow. Hover: image scales,
  a 2px red rule draws across the card top.

PHOTOGRAPHY
Documentary, real Mozambican businesses, warm natural light, people at work.
Slightly desaturated; Ink duotone inside dark sections. Every image sits inside a
mask frame so it can later be revealed by a clip-path animation.

REFERENCE QUALITY BAR
Stripe (clarity), Linear (precision), Apple (scale and scroll storytelling),
Vercel (typographic confidence), Cartier / Rolls-Royce (editorial luxury),
Locomotive and Basement Studio (grid tension). It must look like an international
agency built it — not a template.

Every screen: desktop 1440px and mobile 390px. All copy in European Portuguese.
```

---

## BLOCO B — Regras de conteúdo e de código (colar junto do bloco A, e repetir sempre que o Stitch começar a inventar)

```
CONTENT RULES — these override any design instinct:
1. Use ONLY the Portuguese copy given in quotes in my prompts. Reproduce it
   character for character, including accents and European Portuguese spelling
   ("seleccionada", "projecto", "sector", "directamente"). Never translate,
   shorten, rewrite, or "improve" it.
2. Never invent headings, taglines, testimonials, statistics, prices, ratings,
   star reviews, follower counts, awards or partner logos. If a block needs a
   label I did not give you, leave it out.
3. Where I mark an item as REPEATED, design ONE instance carefully — it is a
   template that will be filled by real data later. Show 3 copies at most, and
   only with the fields I list.
4. Placeholder text for dynamic values must look like the real thing: company
   names like "Agro Nice Lda", sectors like "Serviços & Consultoria", provinces
   like "Cabo Delgado", never "Lorem ipsum" or "Company Name".

CODE RULES — I will export the code and rebuild the site from it, so:
5. Semantic HTML: header, nav, main, section, article, footer. One h1 per page.
6. Use exact hex values from the palette, not approximations.
7. Consistent spacing on an 8px scale (8/16/24/32/48/64/80/120/160).
8. Give every section a clear id and class in Portuguese matching my prompt
   ("hero", "vitrine", "galeria", "cta", "footer").
9. Inline SVG for icons — thin 1.5px strokes, no icon-font, no emoji.
10. Real <img> tags with meaningful alt text, not background-image divs.
11. Do not add JavaScript behaviour — static markup and CSS only.
```

---

## PROMPT 1 — HOMEPAGE (`index.html`) — em 4 partes

> O Stitch trunca páginas longas: passa das 4–5 secções e salta blocos. Cola o 1A,
> espera, depois 1B, 1C, 1D **como mensagens seguintes no mesmo ecrã**. Se faltar
> uma secção, cola só essa outra vez.

### 1A — Header + Hero

```
OHOLO HUB homepage — PART 1 of 4. Desktop 1440px and mobile 390px. Build only the
two blocks below; the rest of the page comes in later messages, so no footer yet.

HEADER (fixed, 80px, white, 1px bottom hairline #E4E6E9)
- Left: wordmark "OHOLO HUB", pure black, 20px, uppercase, "HUB" in red.
- Centre: "Início" (active) · "FACIM 2026" · "FENA" — 14px, black, 40px apart.
  Active link carries a 2px red underline 6px below the text.
- Right: outline button "Vitrine FACIM 2026" (1px black, 44px, grid icon) and
  solid red button "Agendar Reunião" (44px, calendar icon).
- A 2px red scroll-progress bar sits on the header's bottom edge, at ~8% width.
- Mobile: wordmark left, black hamburger right, buttons move into the menu.

HERO — full-viewport photographic slider (100vh, 5 slides, slide 1 shown)
- Background: documentary photograph of Mozambican agribusiness, desaturated,
  full-bleed. Scrim: gradient from Ink #0B0C0E at 92% in the bottom-left to
  transparent at the top-right.
- Content left-aligned, starting at column 2, baseline at ~62% of the height:
  · eyebrow — a 6px red dot then "AVANÇA O TEU NEGÓCIO", 11px, white, uppercase,
    letter-spacing 0.18em.
  · headline, white, clamp 56px → 92px, weight 600, line-height 1.0,
    tracking -0.03em, on two lines:
        "Preparamos Negócios."
        "Conectamos Mercados."   ← second line in italic, with a 3px red rule
                                    under the last word only.
  · two buttons, 52px: "Explorar Empresas" (solid red, arrow) and
    "Agendar Reunião" (1px white outline).
- Bottom-right, 80px from the edges: counter "01 / 05" in white tabular numerals
  ("01" in red), five 16px progress segments (first red, rest white 30%), and two
  44px circular white outline arrows.
- Bottom-left: "SCROLL" set vertically, 10px, letter-spacing 0.3em, white 60%,
  with a 48px hairline beneath.
- Show the other four slides as small side frames, using exactly this copy:
    2 — "ACESSO AO MERCADO" / "Cadeias de Abastecimento que" + "Conectam Fronteiras"
    3 — "PREPARAÇÃO PARA O MERCADO" / "Da Terra Moçambicana" + "Para o Mundo"
    4 — "CRESCIMENTO DO NEGÓCIO" / "Soluções Digitais" + "Para o Seu Negócio"
    5 — "GERAMOS IMPACTO" / "A Construir o Futuro" + "de Moçambique"
  In every slide the second line is the italic one.
```

### 1B — Pesquisa + Números + Faixa FACIM

```
Keep everything on the screen unchanged. PART 2 of 4 — add these three blocks
below the hero, in order.

SEARCH CARD — white card, 1100px wide, centred, overlapping the hero's bottom
edge by 72px. 16px radius, 1px #E4E6E9, soft shadow, 32px padding.
- One row: a search field filling the width, thin search icon on the left,
  placeholder exactly "Procurar por indústria, serviço ou nome da empresa...",
  18px; then a solid red button "Procurar", 52px tall. The field is a 1px bottom
  hairline only — no box — turning red on focus.
- 20px below, a centred row of six 34px pill tags, 1px #E4E6E9 border, 13px grey,
  filling black with white text on hover, reading exactly:
  "Agricultura" · "Energia" · "Logística" · "Finanças & Fintech" · "Construção" ·
  "Turismo".

NUMBERS STRIP — white, 1px hairline above and below, three equal columns split by
vertical hairlines. Each column centred: a small red dot, a number at 72px weight
600 tabular in pure black, and an 11px uppercase grey label at 0.18em spacing.
The three labels, exactly:
  "EMPRESAS VERIFICADAS" · "SERVIÇOS CATALOGADOS" · "PROVÍNCIAS COBERTAS"
The numbers are filled in by data later — draw them as "48", "120" and "11" and
design them to count up.

FACIM BAND — full-bleed Ink #0B0C0E, 520px tall, split 7/5. Left: content from
column 2, vertically centred. Right: a duotone trade-fair photograph bleeding off
the right edge inside a mask frame.
- red eyebrow: "61.ª FEIRA INTERNACIONAL DE MAPUTO · 31 AGO — 06 SET 2026"
- headline, white, 44px, weight 600, line-height 1.1, max 620px:
  "19 empresas apoiadas pela TechnoServe vão expor na FACIM 2026"
- paragraph, white 72%, 17px, max 560px: "A Vitrine Digital já está online!
  Conheça os produtos e serviços, veja as fotografias e aceda aos contactos de
  cada expositor."
- buttons: "Ver a Vitrine Digital" (solid white, black text) and
  "Plano da missão" (1px white outline).
- below them a countdown row in white tabular numerals with red colons, three
  groups labelled "DIAS", "HORAS", "MIN" in 10px grey uppercase.
```

### 1C — Empresas em Destaque + Galeria

```
Keep everything on the screen unchanged. PART 3 of 4 — add these two sections.

EMPRESAS EM DESTAQUE — white, 160px vertical padding.
- Header row: section number "03 / 05" in 11px grey in the far-left margin; red
  eyebrow "EXCELÊNCIA SELECCIONADA"; headline "Empresas em Destaque" in black,
  56px, weight 600, tracking -0.03em, with a 64px red rule beneath. On the right,
  baseline-aligned, the text link "Ver todas as empresas" in black with a red
  arrow that slides on hover.
- Below, a horizontal track of company cards, each 380px wide, the row running
  past the right edge of the viewport to signal horizontal scroll.
- REPEATED — the card is a template filled from data. Design ONE carefully and
  show three. It may contain ONLY these fields:
    · a 4:3 photograph in a 16px-radius frame
    · a sector chip over the photo's top-left corner (11px uppercase, white pill)
    · the company name, black, 22px, weight 600
    · a two-line grey description
    · a hairline
    · a meta row: a thin pin icon + province, then "·", then "5 serviços", and a
      small red circular arrow button on the right
  Use realistic sample data: "Agro Nice Lda" / "Serviços & Consultoria" /
  "Cabo Delgado" / "5 serviços". Do NOT add ratings, stars, prices or any field
  not listed.
- Hover: photo scales to 1.05 inside the frame, a 2px red rule draws across the
  card top, the arrow button fills red.
- Under the track: a 240px grey progress line with a red segment on the left, and
  prev/next circular black outline arrows on the right.

GALERIA — Mist #F4F5F7, 160px vertical padding.
- Centred header: headline "Galeria" in black 56px, and beneath it, 17px grey,
  max 560px: "FENA 2026 e momentos das empresas que preparamos para o mercado."
- Below the header, two tabs as plain text with small thin icons — "Fotos"
  (active) and "Vídeos" — 16px, active in black with a 2px red underline, the
  other grey. The underline slides between them.
- Then an asymmetric editorial grid — NOT uniform: seven images of different
  heights across 12 columns (a tall portrait spanning two rows on the left, a
  wide landscape, two stacked squares, one image bleeding off the right edge),
  8px gaps, 0 radius, each inside a mask frame.
- REPEATED — the grid items are generated from data; design the item states only:
  video items carry a centred 64px white circular play button with a red triangle
  and a duration label bottom-left; hover fades in a black gradient with a caption.
```

### 1D — CTA final + Footer

```
Keep everything on the screen unchanged. PART 4 of 4 — add the closing CTA and
the footer.

CTA — full-bleed Ink #0B0C0E, 560px, content centred.
- Behind it, the word "OHOLO" at about 380px in a very low-contrast dark grey,
  cropped by the section's left and right edges — a watermark, not a headline.
- Foreground: a 120px red hairline; then the headline "Pronto para Avançar o Teu
  Negócio?" in white, 64px, weight 600, tracking -0.03em; then a paragraph in
  white 72%, 18px, max 560px: "Junte-se ao OHOLO Hub e prepare a sua empresa para
  o mercado, aceda a novas oportunidades e cresça com o apoio do Projecto OHOLO.";
  then one button, solid white with black text and a small grid icon:
  "Registar a Sua Empresa".

FOOTER — Ink #0B0C0E, continuing from the CTA with no seam.
- A full-width row with the wordmark "OHOLO HUB" set edge to edge across the
  1440px, about 180px tall, in #17191C so it reads as texture, "HUB" in deep red.
  A 1px white-10% hairline above and below it.
- Then a grid, 80px top padding:
  · Left column (wider): "OHOLO Hub" in white 20px, and beneath it, white 70%,
    max 320px: "Preparamos negócios. Conectamos mercados. Geramos impacto —
    suportado pelo Projecto OHOLO."
  · Right column: heading "CONTACTO" (10px uppercase grey, 0.2em) and the e-mail
    "infomarketaccessmz@gmail.com" as a white link with a thin envelope icon,
    turning red on hover.
- Bottom bar: a 1px white-10% hairline, then a 72px row with, centred or left,
  13px grey: "© 2026 Powered by Market Access. Todos os direitos reservados."
- Mobile: columns stack, the giant wordmark scales down, the bottom bar wraps.
```

---

## PROMPT 2 — FACIM 2026 (`facim.html`) — em 3 partes

### 2A — Hero escuro

```
FACIM 2026 page — PART 1 of 3. Desktop 1440px and mobile 390px.

DARK HERO — full height, Ink #0B0C0E, with a soft red radial glow bleeding in
from the top-right corner.
- eyebrow: "61.ª Edição" in bold white followed by " · Feira Internacional de
  Maputo" in grey, 11px, uppercase, 0.18em.
- headline in white, clamp 56px → 96px, weight 600, line-height 1.0, three lines:
      "Do Norte"
      "para todo o país"
      "Negócios que crescem e geram impacto."   ← this third line in italic,
                                                  slightly smaller, in red-tinted
                                                  white
- paragraph, white 72%, 17px, max 620px, exactly:
  "Aqui encontrará empresas de diferentes sectores, incluindo participantes da
  FENA, com os seus produtos, serviços e histórias. Mais do que uma montra, esta
  plataforma representa o compromisso da TechnoServe em fortalecer pequenas e
  médias empresas, ampliar o seu acesso a mercados, criar conexões e promover
  negócios mais competitivos e sustentáveis."
- beneath it, in 13px grey italic: "TechnoServe & Marketacess | Fortalecendo
  empresas. Conectando mercados. Criando oportunidades."
- a meta row of four facts separated by vertical hairlines, each a 10px grey
  uppercase label above a 16px white value:
      "Quando" → "31 Ago — 06 Set 2026"
      "Onde" → "Ricatla, Marracuene"
      "Tema da edição" → "Transformação Digital e Energética"
      "Organização" → "Ministério da Economia · APIEX"
- a large countdown in white tabular numerals with red colons.
- two buttons: "Ver a Vitrine Digital" (solid white, black text) and
  "Marcar reunião no stand" (1px white outline).
- bottom: a thin animated scroll cue with the label "Continue a descer".
```

### 2B — Vitrine Digital

```
Keep everything unchanged. FACIM 2026 — PART 2 of 3. Add the "Vitrine Digital"
section below the hero, on white, 160px vertical padding.

- Header: red eyebrow "VITRINE DIGITAL"; headline in black, 56px:
  "Os produtos e serviços que vão estar na feira"; a 64px red rule beneath it;
  then a paragraph, grey, 17px, max 640px: "Cada empresa tem a sua página com
  fotografias, descrição dos produtos e, quando disponível, vídeo. Pesquise por
  sector, origem ou nome — e marque a reunião directamente a partir da página da
  empresa."
- FILTER BAR on Mist #F4F5F7, 16px radius, 24px padding, one row on desktop:
  · a labelled field "Pesquisar empresa" with placeholder exactly
    "Procurar por empresa, produto ou representante..."
  · a select labelled "Sector", showing "Todos os sectores"
  · a select labelled "Origem", showing "Todas as origens"
  · a checkbox "Só apuradas"
  · a text link "Limpar" in red on the right
  All fields are hairline-underlined, no boxes; focus turns the hairline red.
- A counter line beneath: "48 empresas" in black bold, then in grey
  "As empresas apuradas aparecem primeiro."
- A 3-column grid of company cards, 32px gaps.
- REPEATED — one card template, shown three times, containing ONLY: cover
  photograph (4:3), a white square logo badge (56px) overlapping its bottom-left
  corner, a red "Empresa Apurada" badge top-right of the photo, the company name
  (22px black), the sector chip, a two-line description, a hairline, and a meta
  row "pin icon + province · N serviços" with a small red arrow.
  Sample data: "Agro Nice Lda", "Serviços & Consultoria", "Cabo Delgado",
  "5 serviços". No ratings, no prices, no invented fields.
- An empty state below: a centred hairline card reading "Nenhuma empresa
  corresponde a estes filtros. Experimente limpar a pesquisa."
- A centred outline button "Ver mais empresas".
```

### 2C — Planta + Plano da missão

```
Keep everything unchanged. FACIM 2026 — PART 3 of 3. Add two sections, then the
same CTA and footer as the homepage.

PLANTA DO PAVILHÃO — Mist #F4F5F7, 160px padding.
- Header: red eyebrow "DISTRIBUIÇÃO DE STANDS"; headline black 56px "Quem está
  onde, e em que área"; 64px red rule; paragraph grey max 640px: "Cada bloco
  representa o espaço atribuído a uma empresa apurada. Os blocos mais largos são
  stands de 3×2 m; os restantes, de 2×2 m. Clique num bloco para abrir a página
  da empresa."
- A white panel, 16px radius, containing the pavilion drawn as clean rectangular
  stand blocks on a subtle grid: wide blocks (3×2) and square blocks (2×2), each
  with a stand number. Free stands are white with a 1px black outline; assigned
  stands are solid black with white numbers; the hovered stand is red and raises
  a small white tooltip card showing the company name and stand number.
- A legend beside the plan with three rows: black square "Atribuído", outlined
  square "Livre", red square "Seleccionado".

PLANO DA MISSÃO — white, 160px padding.
- Header: red eyebrow "LOGÍSTICA DA MISSÃO"; headline black 56px "Do Norte a
  Marracuene, dia a dia"; 64px red rule; paragraph grey: "Calendário de trabalho
  e plano de deslocação dos expositores, conforme o Plano Integrado FACIM 2026."
- A vertical timeline: a 2px grey line down the centre with a red segment showing
  progress. REPEATED — design one step and show four, alternating left and right:
  a date in red 11px uppercase, a title in black 24px, a two-line grey paragraph,
  and a small photograph. A red dot marks each step on the line.
```

---

## PROMPT 3 — FICHA DE EMPRESA (`facim-empresa.html` / `empresa.html`)

```
Company profile page for OHOLO HUB. Desktop 1440px and mobile 390px.
EVERYTHING on this page is generated from one company's data file, so design it
as a template using this real example, and use ONLY these fields:
  nome "Agro Nice Lda" · industria "Serviços & Consultoria" · provincia
  "Cabo Delgado" · badge "Empresa Apurada" · anosActividade "8" · nuit
  "400805210" · responsável "Adolfo Graciano Marcelino, Director de Operações e
  Implementação" · e-mail "amarcelino@agronicemz.com" · telefone "+258844559856"
  · descrição "Comercialização de sementes e insumos agrícolas, consultoria e
  assistência técnica, produção agrícola, agregação e compra de cereais,
  capacitação e implementação de projectos agrícolas."
  · serviços: "Treinamentos", "Produção de Hortícolas", "Sementes de Milho",
    "Insumos Agrícolas", "Formação de Jovens"
Do not invent any other field — no ratings, no prices, no employee counts.

- Breadcrumb in 11px grey uppercase: "FACIM 2026 / Vitrine / Agro Nice Lda".
- HERO: full-bleed 16:6 cover photograph with an Ink scrim on the lower half; a
  white 120px square logo card overlapping the bottom edge at column 2; beside it
  the company name in white 56px weight 600, a red "Empresa Apurada" badge, and
  chips for sector and province. On the right, two buttons: "Agendar Reunião"
  (solid red) and "Contactar" (1px white outline).
- STICKY SUB-NAV, 56px, white, hairline bottom: "Sobre · Serviços · Galeria ·
  Contacto", 14px, with a red underline tracking the active section.
- SOBRE — 8/4 split. Left: the description set large (24px, black, line-height
  1.5) followed by body text. Right: a facts card with hairline rows —
  "Sector", "Origem", "Anos de actividade", "NUIT", "Responsável" — label in grey
  10px uppercase, value in black 15px.
- SERVIÇOS — REPEATED. A 3-column grid of service cards: a photograph on top,
  the service name in black 20px, and a one-line grey description. Show the five
  services listed above. Hover scales the photo inside its frame.
- GALERIA — a mixed photo/video grid, 8px gaps, opening a full-screen lightbox
  (black backdrop, large image, prev/next circular white arrows, counter "03 / 12"
  bottom-centre, close X top-right).
- CONTACTO — Ink band, 8/4 split. Left: e-mail, telefone and the responsável's
  name and role, each on a hairline row with a thin icon. Right: a red button
  "Agendar Reunião" and a white outline button "Ver todas as empresas".
- OUTRAS EMPRESAS — three cards using the homepage card template.
- Same footer as the homepage.
```

---

## PROMPT 4 — EXPLORAR (`explore.html`)

```
"Explorar" page — the company directory. Desktop 1440px and mobile 390px.

- Compact hero on white, 200px padding: red eyebrow "ECOSSISTEMA"; headline in
  black, 64px, max 900px: "Explore o Ecossistema Empresarial de Moçambique";
  then a full-width search field with a thin icon and the placeholder "Procurar
  por indústria, serviço ou nome da empresa..." and a red "Procurar" button.
- Below, a two-column layout: a sticky filter sidebar (280px) and the results.
- SIDEBAR: groups separated by hairlines, each with a 10px uppercase grey
  heading and a checkbox list — "Sector", "Província", "Só empresas apuradas".
  A red text link "Limpar filtros" at the top-right of the sidebar. Checkboxes
  are 16px squares, 1px black, filling red with a white tick when checked.
- RESULTS: a header row with "48 empresas" in black and a sort select on the
  right; active filters appear above as removable chips with a 1px red outline
  and a small ×.
- REPEATED — this directory uses a LOGO-FIRST card, different from the homepage:
  a white card whose top half is a centred framed company logo on Mist
  background, and whose body carries the sector chip, the company name (22px),
  a short two-line description, a hairline, and the meta row
  "pin + Cabo Delgado · 5 serviços". Show nine in a 3-column grid.
- Pagination: a minimal numbered row, active page in red.
- Same footer.
```

---

## PROMPT 5 — SERVIÇOS (`servicos.html`)

```
"Serviços" page. Desktop 1440px and mobile 390px.
Note: this page's current copy is partly in English and will be rewritten — use
only the Portuguese strings I give here.

- Hero on white: red eyebrow "O QUE FAZEMOS"; headline black 64px "Serviços que
  preparam empresas para o mercado"; a red CTA "Agendar Reunião".
- "Explorar por Categoria" — a 4-column grid of tiles: each a large square with a
  1px black outline, a thin-line inline SVG icon, the category name in black 20px,
  a grey count line, and a red arrow bottom-right. Hover fills the tile black and
  turns the type white. REPEATED — categories come from data.
- "Serviços em Destaque" — alternating full-width rows, image on one side and
  content on the other, flipping each row: a number "01" in 11px red, a title in
  black 40px, a grey paragraph, a list with small red ticks, and a text link with
  a red arrow. REPEATED — show three rows.
- A process strip: four numbered steps on a horizontal hairline that will later
  draw in on scroll; each step a red number, a black title, a one-line caption.
- Closing CTA on Ink, centred: "Pronto para Avançar o Teu Negócio?" with a solid
  white button "Registar a Sua Empresa". Same footer.
```

---

## PROMPT 6 — MODAIS E ESTADOS

```
Shared overlays for OHOLO HUB. Static markup only.

1) "Agendar Reunião" modal — centred white sheet, 560px wide, 16px radius, on an
   Ink backdrop at 60% with a blur. A close × top-right. Title "Agendar Reunião"
   in black 32px and a grey subtitle line. Fields, labels above, hairline
   underlines, no boxes, red on focus: "Nome", "Empresa", "E-mail", "Telefone",
   "Assunto" (select), "Data e hora", "Mensagem" (textarea). A full-width red
   button "Confirmar Agendamento". Also show the success state: a red circular
   tick, "Pedido enviado", and a line of grey confirmation text.
2) Mobile menu — full-screen Ink panel: the wordmark and a close × at the top,
   then oversized stacked links "Início / FACIM 2026 / FENA" in white 40px, the
   two CTAs at the bottom, and the contact e-mail in small grey type.
3) Empty and loading states — a centred hairline card with a grey line of text
   and, for loading, three grey skeleton cards with a subtle shimmer.
4) 404 — Ink page with a giant red "404", the line "Página não encontrada" and a
   white outline button "Voltar ao início".
```

---

## Checklist de aceitação (Fase 2 — antes de animar)

Para cada página, antes de dar por aprovada:

- [ ] Toda a copy bate certo com o site, letra por letra
- [ ] Nenhum campo inventado nos cartões (sem estrelas, preços, ratings)
- [ ] Os cartões mostram só: nome, indústria, província, descrição, nº de serviços, badge
- [ ] Paleta só com branco / preto / cinza / vermelho — vermelho ≤ 5% da área
- [ ] Mobile 390px desenhado, não só o desktop
- [ ] `code.html` exportado e guardado em `design/<pagina>/`
- [ ] Tokens (espaçamento, tamanhos, hex) extraídos para `css/style.css`
- [ ] `id` e atributos `data-` que o JS usa mantidos:
      `hero-slider`, `empresas-destaque`, `facim-grid`, `facim-planta`,
      `facim-contagem`, `stat-empresas`, `stat-servicos`, `stat-provincias`,
      `data-search-input`, `data-search-tag`, `data-galeria-tab`
- [ ] O site continua a funcionar com os dados reais (48 empresas carregam)

---

## Fase 3 — Animações (só depois do layout aprovado)

```
The layout is approved and matches the Stitch design pixel for pixel. Now add
motion, without changing any spacing, size or colour.

Stack: GSAP 3 + ScrollTrigger + SplitText + Flip, and Lenis for smooth scroll.

- Page load: an Ink curtain lifts while a red line fills to 100%; then the hero
  headline reveals with a masked SplitText line stagger (y:110%, 0.9s, expo.out,
  0.08 stagger), the eyebrow and buttons following at 0.15s.
- Headings: masked line reveal on ScrollTrigger enter, once.
- Images: clip-path inset(100% 0 0 0) → inset(0), with the inner img going
  scale 1.06 → 1 over the same 1.1s.
- Cards: ScrollTrigger.batch, stagger 0.08, y:40, fade.
- Numbers strip and the FACIM countdown: count up on enter, once.
- "Empresas em Destaque": horizontal scroll via ScrollTrigger pin + scrub, with
  the progress line bound to it.
- Header: condenses on scroll; the red bar is bound to scroll progress.
- Buttons: magnetic hover with gsap.quickTo on x/y and an elastic release.
- Custom cursor: a black dot with quickTo lerp, expanding into a red ring over
  media.
- Timeline and process lines: scaleY / drawSVG scrubbed to scroll.
- Page transitions: the Ink curtain closes on link click and lifts on load.
- prefers-reduced-motion: every reveal becomes instant, no parallax, no scrub.
- Keep the existing <noscript> block so nothing stays hidden without JS.
```
