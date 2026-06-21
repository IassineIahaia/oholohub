/* ============================================================
   B2B MOZAMBIQUE — DATA LAYER
   Lista de empresas + funções para carregar dados.json
   ============================================================ */

// ── Lista de empresas (adicionar aqui o slug de cada nova pasta) ──
const EMPRESAS_SLUGS = [
  'aguiar-consultores',
  'alva-consultores',
  'apollo-informatica',
  // 'beliva-consultores',
  'casquinha-company',
  'francis-casmeticos',
  'green-leaf-mozambique',
  'juca-e-services-sociedade',
  'mimos-da-chris',
  'moz-vetsu',
  'mozagro-business',
  'natural-pharm',
  'NeLIA-S0-FRESCOS',
  'nutrinatural',
  'omega3-maninguefish',
  'network-telecommunications',
  // 'SSP-SU',
  'WATCH-ME-SU',
  'Versatil-Arquitectos',
  'TOPOLAND',
  'Studio-7-Artes',
  'SNS-TransporteLogistica-Consultoria-SULDA',
  'UMcanto-arquitetura-paisagismo',
  'SABORES-DO-CAMPO',
  'Owani',
  'Opuha-Tourism-Trips',
  'SSP-SU',
];

/**
 * Carrega o dados.json de uma empresa específica.
 * @param {string} slug - nome da pasta em data/empresas/
 * @returns {Promise<object|null>} objecto "empresa" ou null se falhar
 */
async function carregarEmpresa(slug) {
  try {
    const res = await fetch(`data/empresas/${slug}/dados.json`);
    if (!res.ok) throw new Error(`Falha ao carregar ${slug}`);
    const json = await res.json();
    return { slug, ...json.empresa };
  } catch (err) {
    console.error(`Erro ao carregar empresa "${slug}":`, err);
    return null;
  }
}

/**
 * Carrega todas as empresas listadas em EMPRESAS_SLUGS.
 * @returns {Promise<object[]>} array de empresas (ignora falhas)
 */
async function carregarTodasEmpresas() {
  const resultados = await Promise.all(EMPRESAS_SLUGS.map(carregarEmpresa));
  return resultados.filter(Boolean);
}

/**
 * Devolve o caminho de uma imagem da empresa (logo, cover, servico_N).
 * @param {string} slug
 * @param {string} ficheiro - ex: 'logo.jpg', 'cover.jpg', 'servico_1.jpg'
 */
function imagemEmpresa(slug, ficheiro) {
  return `data/empresas/${slug}/${ficheiro}`;
}

/**
 * Lê o parâmetro "id" da URL actual (?id=slug).
 */
function obterIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Lê qualquer parâmetro da URL actual (ex: obterParamDaUrl('q')).
 */
function obterParamDaUrl(nome) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nome) || '';
}