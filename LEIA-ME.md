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
| `data/facim/` | 48 empresas convertidas, com logótipos e fotografias |

### Ficheiros alterados

| Ficheiro | O que mudou |
|---|---|
| `js/main.js` | Popup novo; modal de agendamento passa a servir as duas feiras |
| `index.html` | Link FACIM na navbar, faixa da FACIM, `css/facim.css` ligado |
| `explore.html` | Link FACIM na navbar |
| `empresa.html` | Link FACIM na navbar |

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
