/* ============================================================
   QUALIFICAÇÃO DE EMPRESAS — ÍNDICE DE PRONTIDÃO
   ============================================================
   O OHOLO Hub prepara empresas para o mercado. Esta camada
   traduz esse trabalho num sinal legível: quão pronto está o
   perfil de cada empresa para ser apresentado a um comprador.

   O índice NÃO é uma opinião nem uma nota de qualidade do
   negócio. É a leitura do que já está preenchido na ficha da
   empresa — descrição, oferta, contactos, identificação legal
   e distinções. Tudo o que conta aqui vem de
   data/empresas/<slug>/dados.json.

   ESCALA (0 a 100)
     Descrição da empresa .................... 20
     Oferta (serviços e produtos) ............ 28
     Contactos ............................... 30
     Identificação (NUIT, fundação, equipa) .. 17
     Distinções .............................. 5

   ESCALÕES
     ≥ 75  Pronta para o mercado — ficha completa, pode ser
           apresentada a um comprador tal como está.
     45–74 Em activação — está a ser trabalhada; falta fechar
           uma ou outra parte.
     < 45  Com potencial — registo inicial, ainda em recolha.

   Para acrescentar ou mudar critérios, mexa só em CRITERIOS.
   ============================================================ */

const ESCALOES = {
  pronta: {
    id: "pronta",
    minimo: 75,
    rotulo: "Pronta para o mercado",
    curto: "Pronta",
    descricao:
      "Ficha completa — descrição, oferta e contactos prontos a apresentar a um comprador.",
  },
  activacao: {
    id: "activacao",
    minimo: 45,
    rotulo: "Em activação",
    curto: "Em activação",
    descricao:
      "Perfil em construção com o OHOLO Hub — falta fechar uma ou outra parte da ficha.",
  },
  potencial: {
    id: "potencial",
    minimo: 0,
    rotulo: "Com potencial",
    curto: "Com potencial",
    descricao:
      "Registo inicial. A recolha de informação e a preparação estão a começar.",
  },
};

/* ── Critérios: cada um devolve os pontos obtidos e o total ── */
const CRITERIOS = [
  {
    id: "descricao",
    rotulo: "Descrição da empresa",
    total: 20,
    avaliar(e) {
      const n = (e.descricao || "").trim().length;
      if (n >= 400) return 20;
      if (n >= 150) return 14;
      if (n >= 40) return 7;
      return 0;
    },
  },
  {
    id: "oferta",
    rotulo: "Oferta detalhada",
    total: 28,
    avaliar(e) {
      const servicos = e.servicos || [];
      if (servicos.length === 0) return 0;

      const quantidade = Math.min(4, servicos.length) * 5; // até 20
      const descritos = servicos.filter((s) =>
        (s.descricao || "").trim(),
      ).length;
      const proporcao = descritos / servicos.length;

      let detalhe = 0;
      if (proporcao >= 0.9) detalhe = 8;
      else if (proporcao >= 0.5) detalhe = 4;

      return quantidade + detalhe;
    },
  },
  {
    id: "contactos",
    rotulo: "Canais de contacto",
    total: 30,
    avaliar(e) {
      const c = e.contactos || {};
      let p = 0;
      if ((c.email || "").trim()) p += 11;
      if ((c.telefone || "").trim()) p += 11;
      if ((c.website || "").trim()) p += 5;
      if ((c.linkedin || "").trim() || (c.twitter || "").trim()) p += 3;
      return p;
    },
  },
  {
    id: "identificacao",
    rotulo: "Identificação da empresa",
    total: 17,
    avaliar(e) {
      let p = 0;
      if ((e.nuit || "").toString().trim()) p += 8;
      if ((e.fundacao || "").toString().trim()) p += 6;
      if (
        (e.funcionarios || "").toString().trim() ||
        (e.anosActividade || "").toString().trim()
      ) {
        p += 3;
      }
      return p;
    },
  },
  {
    id: "distincoes",
    rotulo: "Distinções e selos",
    total: 5,
    avaliar(e) {
      const n = (e.badges || []).length;
      if (n >= 2) return 5;
      if (n === 1) return 3;
      return 0;
    },
  },
];

/**
 * Calcula o índice de prontidão de uma empresa.
 * @param {object} empresa - objecto vindo de dados.json
 * @returns {{indice:number, escalao:object, criterios:Array, emFalta:Array}}
 */
function qualificarEmpresa(empresa) {
  const e = empresa || {};

  const criterios = CRITERIOS.map((c) => {
    const pontos = c.avaliar(e);
    return {
      id: c.id,
      rotulo: c.rotulo,
      pontos,
      total: c.total,
      completo: pontos >= c.total,
    };
  });

  const indice = Math.round(
    criterios.reduce((soma, c) => soma + c.pontos, 0),
  );

  let escalao = ESCALOES.potencial;
  if (indice >= ESCALOES.pronta.minimo) escalao = ESCALOES.pronta;
  else if (indice >= ESCALOES.activacao.minimo) escalao = ESCALOES.activacao;

  const emFalta = criterios
    .filter((c) => !c.completo)
    .sort((a, b) => b.total - b.pontos - (a.total - a.pontos))
    .map((c) => c.rotulo);

  return { indice, escalao, criterios, emFalta };
}

/** Só o escalão, para filtrar e ordenar listas. */
function escalaoDaEmpresa(empresa) {
  return qualificarEmpresa(empresa).escalao.id;
}

/** Ordem de apresentação: as mais prontas primeiro. */
const ORDEM_ESCALOES = ["pronta", "activacao", "potencial"];

function ordenarPorProntidao(empresas) {
  return [...empresas].sort((a, b) => {
    const qa = qualificarEmpresa(a);
    const qb = qualificarEmpresa(b);
    const pa = ORDEM_ESCALOES.indexOf(qa.escalao.id);
    const pb = ORDEM_ESCALOES.indexOf(qb.escalao.id);
    if (pa !== pb) return pa - pb;
    return qb.indice - qa.indice;
  });
}

/** Contagem por escalão, para a barra de resumo. */
function contarPorEscalao(empresas) {
  const contagem = { pronta: 0, activacao: 0, potencial: 0 };
  empresas.forEach((e) => {
    contagem[escalaoDaEmpresa(e)] += 1;
  });
  return contagem;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    qualificarEmpresa,
    escalaoDaEmpresa,
    ordenarPorProntidao,
    contarPorEscalao,
    ESCALOES,
  };
}

/* ============================================================
   LISTA ÚNICA DE EMPRESAS DO SITE
   ============================================================
   O site tem duas origens de dados:
     data/empresas/<slug>/  — as empresas do programa (ficha em empresa.html)
     data/facim/<slug>/     — as expositoras da FACIM 2026 (facim-empresa.html)

   A página "Empresas" mostra as duas. Cada registo leva a origem, a pasta
   das imagens e o link da ficha, para o cartão saber para onde apontar.
   Empresas presentes nas duas listas aparecem uma só vez — fica a ficha
   mais completa.
   ============================================================ */

function _chaveEmpresa(empresa) {
  return (empresa.nome || empresa.slug || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function carregarEmpresasDoSite() {
  const [doPrograma, daFacim] = await Promise.all([
    typeof carregarTodasEmpresas === "function"
      ? carregarTodasEmpresas()
      : Promise.resolve([]),
    typeof carregarTodasEmpresasFacim === "function"
      ? carregarTodasEmpresasFacim()
      : Promise.resolve([]),
  ]);

  const marcar = (lista, fonte, pasta, pagina) =>
    lista.map((e) => ({
      ...e,
      fonte,
      pasta,
      href: `${pagina}?id=${e.slug}`,
    }));

  const todas = [
    ...marcar(doPrograma, "programa", "data/empresas", "empresa.html"),
    ...marcar(daFacim, "facim", "data/facim", "facim-empresa.html"),
  ];

  // Duplicados: fica a ficha com o índice de prontidão mais alto
  const porChave = new Map();
  todas.forEach((empresa) => {
    const chave = _chaveEmpresa(empresa);
    const actual = porChave.get(chave);
    if (!actual) {
      porChave.set(chave, empresa);
      return;
    }
    const melhor =
      qualificarEmpresa(empresa).indice > qualificarEmpresa(actual).indice
        ? empresa
        : actual;
    // guarda as duas origens, para o cartão poder assinalar quem expõe na FACIM
    melhor.tambemNaFacim =
      empresa.fonte === "facim" || actual.fonte === "facim";
    porChave.set(chave, melhor);
  });

  return [...porChave.values()];
}
