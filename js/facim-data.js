/* ============================================================
   FACIM 2026 — CAMADA DE DADOS
   ------------------------------------------------------------
   Lê data/facim/<slug>/dados.json (mesma lógica do data.js da FENA,
   mas apontando para a pasta da FACIM).

   COMO ACRESCENTAR UMA EMPRESA
   1) Cria a pasta data/facim/<slug>/ com dados.json + logo + cover +
      servico_1.jpg, servico_2.jpg, ...
   2) Acrescenta o slug na lista FACIM_SLUGS abaixo.
      Se for empresa apurada, mete "apurada": true dentro do bloco
      "facim" do dados.json (a lista abaixo não precisa de saber).

   COMO ACRESCENTAR UM VÍDEO À VITRINE DIGITAL
   Abre data/facim/<slug>/dados.json e preenche:
      "vitrine": { "videos": ["https://youtu.be/XXXXXXXX"], ... }
   ============================================================ */

/* ── Informação oficial do evento ── */
const FACIM_EVENTO = {
  edicao: "61.ª Edição",
  nome: "FACIM 2026 — Feira Internacional de Maputo",
  tema: "Transformação Digital e Energética Rumo a uma Economia Sustentável",
  inicio: "2026-08-31",
  fim: "2026-09-06",
  periodoTexto: "31 de Agosto a 6 de Setembro de 2026",
  local: "Centro Internacional de Feiras e Exposições de Ricatla",
  cidade: "Marracuene, Província de Maputo",
  organizacao: "Ministério da Economia, através da APIEX",
  siteOficial: "https://www.facim.gov.mz/",
};

/* ── Empresas com conteúdos na plataforma ── */
const FACIM_SLUGS = [
  // ── Apuradas para expor (Plano Integrado FACIM 2026) ──
  "agro-nice-lda",
  "al-muzawad-su-lda",
  "ammc",
  "ampcm",
  "ancha-investimento",
  "belmoz-lda",
  "consertera-lda",
  "crima-s-limitada",
  "delicias-do-jardim",
  "global-monica",
  "instituto-medio-politecnico-vahocha",
  "madopera",
  "mavasbeneslu-services-el",
  "mk-agronuti",
  "nutrinatural-lda",
  "nutriverdeokala",
  "nutrivida",
  "o-castelo",
  "wetimane-empreendimento-e-servicos",
  "xima-de-namaua",

  // ── Restantes candidaturas submetidas ──
  "agrimech-mozambique-lda",
  "aguiar-consultores-logistica-sociedade-unipessoal-limitada",
  "bsf-servicos-lda",
  "butterfly-beleza-e-cosmetico-su-lda",
  "casquinha-company",
  "consultores-multilingue-su-lda",
  "delivmoz",
  "ekhalaco-s-catering-e-servicos",
  "green-agro-commodities",
  "green-agro-service",
  "hotel-oceano",
  "imprima-solutions-su-limitada",
  "indico-seafood-lda",
  "manica-agroprocessamento-limitada",
  "matharia-empreendimentos",
  "mind-future-investment-group-lda",
  "mozagro-business",
  "nada-consulting",
  "oruwera-limitada",
  "network-telecommunications",
  "nelia-so-frescos",
  "omega3mf",
  "quiosque-e-residencial-na-sandra",
  "recae",
  "sabores-do-campo",
  "sociedade-agro-florestal-de-mocambique-lda-saf-moz-lda",
  "studio-7-arted",
  "tecmarc-su-lda",
  "topoland-lda",
];

/* ── Plano de deslocação (folha "Plano de Viagem") ── */
const FACIM_DESLOCACAO = [
  {
    cidade: "Pemba",
    partida: "25 de Agosto",
    duracao: "3 dias",
    chegada: "27 de Agosto",
    recolha: "DPIC — Pemba",
    responsavel: "Market Access",
  },
  {
    cidade: "Nampula",
    partida: "26 de Agosto",
    duracao: "2 dias",
    chegada: "27 de Agosto",
    recolha: "DPIC — Nampula",
    responsavel: "Empresas",
  },
];

/* ── Plano de trabalho em Maputo (folha "Plano de Viagem") ── */
const FACIM_CRONOGRAMA = [
  {
    data: "01 a 23 de Agosto",
    actividade: "Divulgação e confirmação das empresas seleccionadas, assinatura dos termos",
    resultado: "Empresas oficialmente notificadas e 20 termos assinados",
    estado: "concluido",
  },
  {
    data: "28 de Agosto",
    actividade: "Visita ao pavilhão, distribuição das empresas e início da organização dos stands",
    resultado: "Empresas distribuídas nos respectivos stands",
    estado: "proximo",
  },
  {
    data: "29 de Agosto",
    actividade: "Continuação da montagem e organização dos espaços",
    resultado: "Espaços organizados e material exposto",
    estado: "proximo",
  },
  {
    data: "30 de Agosto",
    actividade: "Sessão prática e entrega do formulário de registo de negócios",
    resultado: "Empresas preparadas para a abertura oficial",
    estado: "proximo",
  },
  {
    data: "31 de Agosto a 06 de Setembro",
    actividade: "FACIM 2026 — acompanhamento técnico e monitoria diária",
    resultado: "Relatórios de acompanhamento",
    estado: "destaque",
  },
  {
    data: "07 a 09 de Setembro",
    actividade: "Regresso das empresas às províncias de origem",
    resultado: "Missão encerrada",
    estado: "futuro",
  },
  {
    data: "15 de Setembro",
    actividade: "Consolidação e apresentação do relatório final da missão",
    resultado: "Relatório Final da FACIM 2026",
    estado: "futuro",
  },
];

/* ── Representantes a viajar, por origem (folha "Plano de Viagem") ── */
const FACIM_REPRESENTANTES = [
  { origem: "Nampula", empresas: 12, representantes: 13 },
  { origem: "Cabo Delgado", empresas: 6, representantes: 6 },
  { origem: "Distrito de Mocuba", empresas: 1, representantes: 1 },
  { origem: "Niassa", empresas: 0, representantes: 0 },
];

/* ============================================================
   FUNÇÕES DE CARREGAMENTO
   ============================================================ */

/** Caminho de uma imagem de uma empresa da FACIM. */
function imagemFacim(slug, ficheiro) {
  return `data/facim/${slug}/${ficheiro}`;
}

/** Carrega o dados.json de uma empresa da FACIM. */
async function carregarEmpresaFacim(slug) {
  try {
    const res = await fetch(`data/facim/${slug}/dados.json`);
    if (!res.ok) throw new Error(`Falha ao carregar ${slug}`);
    const json = await res.json();
    return {
      slug,
      ...json.empresa,
      facim: json.facim || {},
      vitrine: json.vitrine || { videos: [] },
    };
  } catch (err) {
    console.error(`Erro ao carregar a empresa "${slug}":`, err);
    return null;
  }
}

/** Carrega todas as empresas listadas em FACIM_SLUGS. */
async function carregarTodasEmpresasFacim() {
  const resultados = await Promise.all(FACIM_SLUGS.map(carregarEmpresaFacim));
  return resultados.filter(Boolean);
}

/** Dias que faltam para a abertura da feira (negativo depois de começar). */
function diasParaFacim(referencia = new Date()) {
  const inicio = new Date(`${FACIM_EVENTO.inicio}T08:00:00`);
  return Math.ceil((inicio - referencia) / 86400000);
}

/** Estado do evento: "antes" | "adecorrer" | "terminado". */
function estadoFacim(referencia = new Date()) {
  const inicio = new Date(`${FACIM_EVENTO.inicio}T00:00:00`);
  const fim = new Date(`${FACIM_EVENTO.fim}T23:59:59`);
  if (referencia < inicio) return "antes";
  if (referencia > fim) return "terminado";
  return "adecorrer";
}
