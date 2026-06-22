/* ============================================================
   B2B MOZAMBIQUE — RENDERIZAÇÃO DINÂMICA
   ============================================================ */

/* ── Navbar mobile: abre/fecha o menu hamburger (todas as páginas) ── */
function inicializarNavbarMobile() {
  const toggle = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".navbar-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });

  // fechar o menu ao clicar num link (mobile)
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("is-open"));
  });
}

document.addEventListener("DOMContentLoaded", inicializarNavbarMobile);

/* ── Explore: abre/fecha o painel de filtros no telemóvel ── */
function inicializarToggleFiltros() {
  const toggle = document.querySelector(".explore-filters-toggle");
  const body = document.querySelector(".explore-filters-body");
  if (!toggle || !body) return;

  toggle.addEventListener("click", () => {
    body.classList.toggle("is-open");
  });
}

document.addEventListener("DOMContentLoaded", inicializarToggleFiltros);

/**
 * Liga qualquer formulário de pesquisa marcado com [data-search-form] para
 * redireccionar para explore.html?q=... em vez de recarregar a página
 * sem fazer nada. Usado na home e em servicos.html.
 */
function inicializarFormulariosPesquisa() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const input = form.querySelector("[data-search-input]");
      const provinciaSel = form.querySelector("[data-search-provincia]");
      const termo = input ? input.value.trim() : "";

      const params = new URLSearchParams();
      if (termo) params.set("q", termo);
      if (provinciaSel && provinciaSel.value && !/all/i.test(provinciaSel.value)) {
        params.set("provincia", provinciaSel.value);
      }

      window.location.href = `explore.html${params.toString() ? "?" + params.toString() : ""}`;
    });
  });

  // Badges/categorias clicáveis (ex: hero da home) também filtram a explore.
  document.querySelectorAll("[data-search-tag]").forEach((el) => {
    el.addEventListener("click", () => {
      const termo = el.getAttribute("data-search-tag");
      window.location.href = `explore.html?q=${encodeURIComponent(termo)}`;
    });
  });
}

document.addEventListener("DOMContentLoaded", inicializarFormulariosPesquisa);

/* ============================================================
   ÍCONES SVG (substituem emojis — consistência visual com Inter)
   ============================================================ */
const ICONES = {
  pin: '<svg viewBox="0 0 24 24"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>',
  search:
    '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  truck:
    '<svg viewBox="0 0 24 24"><path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  scale:
    '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M5 7 3 12a2.5 2.5 0 0 0 5 0L5 7Zm14 0-2 5a2.5 2.5 0 0 0 5 0l-2-5Z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>',
  wallet:
    '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h.01"/></svg>',
  briefcase:
    '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
};

function icone(nome, classeExtra = "") {
  return `<span class="icon ${classeExtra}">${ICONES[nome] || ""}</span>`;
}

/**
 * Mapeia o nome de uma indústria (campo livre vindo do dados.json)
 * para a classe CSS da variante de cor do badge.
 */
function classeBadgeIndustria(industria = "") {
  const i = industria.toLowerCase();
  if (i.includes("finan")) return "badge-ind-financas";
  if (
    i.includes("agricultura") ||
    i.includes("pecuária") ||
    i.includes("pecuaria")
  )
    return "badge-ind-agricultura";
  if (
    i.includes("tecnologia") ||
    i.includes("comunicação") ||
    i.includes("comunicacao")
  )
    return "badge-ind-tecnologia";
  if (i.includes("ensino") || i.includes("bds")) return "badge-ind-ensino";
  if (
    i.includes("logística") ||
    i.includes("logistica") ||
    i.includes("supply")
  )
    return "badge-ind-logistica";
  if (i.includes("construção") || i.includes("construcao"))
    return "badge-ind-construcao";
  return "badge-success";
}

// ── Helper: encurtar texto para preview em cards ──
function resumir(texto, max = 120) {
  if (!texto) return "";
  const limpo = texto.replace(/\n/g, " ").trim();
  return limpo.length > max ? limpo.slice(0, max).trim() + "…" : limpo;
}

// ── Helper: igual ao imgComFallback, mas quando esgota as extensões do
//    "cover", tenta o "logo" como fundo (com classe para aplicar blur via CSS) ──
function coverComFallback(slug, classeExtra = "") {
  const extensoes = ["jpg", "png", "jpeg"];
  const candidatosCover = extensoes.map((ext) =>
    imagemEmpresa(slug, `cover.${ext}`),
  );
  const candidatosLogo = extensoes.map((ext) =>
    imagemEmpresa(slug, `logo.${ext}`),
  );
  const primeiro = candidatosCover[0];
  const restoCover = candidatosCover.slice(1);

  // Lista combinada: resto dos covers, depois os logos marcados com prefixo "LOGO:"
  const resto = [
    ...restoCover.map((c) => `N:${c}`),
    ...candidatosLogo.map((c) => `L:${c}`),
  ];
  const restoJson = JSON.stringify(resto);

  const onerror = `
    (function(img){
      var lista = JSON.parse(img.dataset.fallback || '[]');
      if (lista.length === 0) { img.style.display='none'; return; }
      var prox = lista.shift();
      img.dataset.fallback = JSON.stringify(lista);
      if (prox.indexOf('L:') === 0) {
        img.src = prox.slice(2);
        img.classList.add('cover-fallback-logo');
      } else {
        img.src = prox.slice(2);
      }
    })(this)
  `
    .replace(/\s+/g, " ")
    .trim();

  return `src="${primeiro}" data-fallback='${restoJson}' onerror="${onerror}" class="${classeExtra}"`;
}

// ── Helper: gerar atributos src + onerror de uma <img> que tenta
//    várias extensões em cascata (jpg → png → jpeg) antes de desistir ──
function imgComFallback(slug, baseNome, extensoes = ["jpg", "png", "jpeg"]) {
  const candidatos = extensoes.map((ext) =>
    imagemEmpresa(slug, `${baseNome}.${ext}`),
  );
  const primeiro = candidatos[0];
  const resto = JSON.stringify(candidatos.slice(1));
  // onerror: avança para o próximo candidato guardado em data-fallback;
  // quando a lista acaba, esconde a imagem.
  const onerror = `
    (function(img){
      var lista = JSON.parse(img.dataset.fallback || '[]');
      if (lista.length === 0) { img.style.display='none'; return; }
      img.src = lista.shift();
      img.dataset.fallback = JSON.stringify(lista);
    })(this)
  `
    .replace(/\s+/g, " ")
    .trim();

  return `src="${primeiro}" data-fallback='${resto}' onerror="${onerror}"`;
}

// ── Helper: gerar HTML de 1 card de empresa (usado em index.html e explore.html) ──
function cardEmpresaHTML(empresa) {
  const nServicos = (empresa.servicos || []).length;

  return `
    <a href="empresa.html?id=${empresa.slug}" class="card">
      <div class="card-cover" style="position:relative; height:240px; background-color: var(--color-surface-container);">
        <img ${coverComFallback(empresa.slug)} alt="${empresa.nome}" style="width:100%; height:100%; object-fit:cover;">
        <span class="badge ${classeBadgeIndustria(empresa.industria)}" style="position:absolute; top: var(--space-sm); left: var(--space-sm);">${empresa.industria || "Empresa"}</span>
      </div>
      <div style="padding: var(--space-lg);">
        <div class="text-headline-md" style="margin-bottom: var(--space-xs);">${empresa.nome}</div>
        <p class="text-body-md text-muted" style="margin-bottom: var(--space-md);">
          ${resumir(empresa.descricao)}
        </p>
        <span class="text-label-sm" style="color: var(--color-primary); display:flex; align-items:center; gap: var(--space-xs);">${icone("pin")} ${empresa.provincia || "Moçambique"} &nbsp;·&nbsp; ${nServicos} serviço${nServicos === 1 ? "" : "s"}</span>
      </div>
    </a>
  `;
}

// ── Helper: gerar HTML de 1 card de empresa para o EXPLORE.HTML —
//    aqui o destaque visual é a LOGO (pequena, centrada, em moldura),
//    em vez da foto de capa, para um layout mais "directório de marcas" ──
function cardEmpresaExploreHTML(empresa) {
  const nServicos = (empresa.servicos || []).length;
  const verificada = empresa.badges && empresa.badges.length > 0;

  return `
    <a href="empresa.html?id=${empresa.slug}" class="card explore-card">
      <div class="explore-card-top">
        <div class="explore-card-logo-frame">
          <img ${imgComFallback(empresa.slug, "logo")} alt="Logo ${empresa.nome}" class="explore-card-logo">
        </div>
      </div>
      <div class="explore-card-body">
        <span class="badge ${classeBadgeIndustria(empresa.industria)}" style="margin-bottom: var(--space-sm);">${empresa.industria || "Empresa"}</span>
        <div class="text-headline-md" style="margin-bottom: var(--space-xs);">${empresa.nome}</div>
        <p class="text-body-md text-muted" style="margin-bottom: var(--space-md);">
          ${resumir(empresa.descricao, 90)}
        </p>
        <span class="text-label-sm explore-card-meta">${icone("pin")} ${empresa.provincia || "Moçambique"} &nbsp;·&nbsp; ${nServicos} serviço${nServicos === 1 ? "" : "s"}</span>
      </div>
    </a>
  `;
}

// ── Renderizar grid de empresas num container (explore.html / index.html) ──
// { limite } — corta as N primeiras (ordem de EMPRESAS_SLUGS)
// { slugs }  — mostra exactamente estas empresas, pela ordem dada
async function renderizarGridEmpresas(containerId, { limite = null, slugs = null } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let empresas = await carregarTodasEmpresas();

  if (slugs && slugs.length > 0) {
    const porSlug = new Map(empresas.map((e) => [e.slug, e]));
    empresas = slugs.map((s) => porSlug.get(s)).filter(Boolean);
  } else if (limite) {
    empresas = empresas.slice(0, limite);
  }

  if (empresas.length === 0) {
    container.innerHTML =
      '<p class="text-body-md text-muted">Nenhuma empresa encontrada.</p>';
    return;
  }

  container.innerHTML = empresas.map(cardEmpresaExploreHTML).join("");
}

// ── Renderizar perfil completo de 1 empresa (empresa.html) ──
async function renderizarPerfilEmpresa() {
  const slug = obterIdDaUrl();
  const root = document.getElementById("empresa-root");
  if (!root) return;

  if (!slug) {
    root.innerHTML =
      '<div class="container" style="padding: var(--space-xxl) 0;"><p class="text-body-lg">Empresa não especificada.</p></div>';
    return;
  }

  const empresa = await carregarEmpresa(slug);

  if (!empresa) {
    root.innerHTML =
      '<div class="container" style="padding: var(--space-xxl) 0;"><p class="text-body-lg">Empresa não encontrada.</p></div>';
    return;
  }

  document.title = `${empresa.nome} — OHOLO Hub`;

  const contactos = empresa.contactos || {};
  const stats = empresa.stats || {};
  const labels = stats.labels || [
    "Anos de Experiência",
    "Volume de Produção",
    "Volume de Vendas",
    "Clientes Activos",
  ];
  const servicos = empresa.servicos || [];

  root.innerHTML = `
    <!-- COVER + LOGO -->
    <section>
      <div class="empresa-cover">
        <img ${coverComFallback(slug)} alt="Capa ${empresa.nome}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="container" style="position:relative;">
        <div style="display:flex; align-items:flex-end; gap: var(--space-lg); margin-top:-48px; padding-bottom: var(--space-lg); flex-wrap:wrap;">
          <img ${imgComFallback(slug, "logo")} alt="Logo ${empresa.nome}" class="empresa-logo">
          <div style="padding-bottom: var(--space-xs);">
            <h1 class="text-headline-lg">${empresa.nome}</h1>
            <p class="text-body-md text-muted" style="display:flex; align-items:center; gap: var(--space-xs);">${icone("pin")} ${empresa.provincia || ""}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- DETALHES -->
    <section class="section-pad-xxl" style="padding-bottom: var(--space-xxl);">
      <div class="container empresa-layout">

        <div>
          <div style="display:flex; gap: var(--space-sm); margin-bottom: var(--space-lg); flex-wrap:wrap;">
            ${(empresa.badges || []).map((b) => `<span class="badge badge-success">✓ ${b}</span>`).join("")}
            <span class="badge ${classeBadgeIndustria(empresa.industria)}">${empresa.industria || ""}</span>
          </div>

          <p class="text-body-lg" style="margin-bottom: var(--space-xl); white-space: pre-line;">${empresa.descricao || ""}</p>

          <div style="display:flex; gap: var(--space-lg); flex-wrap:wrap; margin-bottom: var(--space-xxl);">
            ${contactos.email ? `<a href="mailto:${contactos.email}" class="text-body-md" style="display:flex; align-items:center; gap: var(--space-xs);">${icone("mail")} ${contactos.email}</a>` : ""}
            ${contactos.telefone ? `<a href="tel:${contactos.telefone.replace(/\s/g, "")}" class="text-body-md" style="display:flex; align-items:center; gap: var(--space-xs);">${icone("phone")} ${contactos.telefone}</a>` : ""}
            ${contactos.website ? `<a href="${contactos.website.startsWith("http") ? contactos.website : "#"}" class="text-body-md" style="display:flex; align-items:center; gap: var(--space-xs);">${icone("globe")} ${contactos.website}</a>` : ""}
          </div>

          <h2 class="text-headline-lg" style="margin-bottom: var(--space-lg);">Os Nossos Serviços</h2>

          <div class="empresa-servicos-grid">
            ${servicos
              .map(
                (s, i) => `
              <div class="card">
                <div class="card-cover" style="height:340px; background-color: var(--color-surface-container);">
                  <img ${imgComFallback(slug, `servico_${i + 1}`)} alt="${s.nome || "Serviço"}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="padding: var(--space-lg);">
                  <div class="text-headline-md" style="margin-bottom: var(--space-xs);">${s.nome || "Serviço"}</div>
                  <p class="text-body-md text-muted" style="white-space: pre-line;">${s.descricao || ""}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <!-- SIDEBAR -->
        <aside style="display:flex; flex-direction:column; gap: var(--space-md);">
          <div class="card" style="padding: var(--space-lg);">
            <div class="text-headline-md" style="margin-bottom: var(--space-md);">Dados da Empresa</div>
            <div style="display:flex; justify-content:space-between; padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-outline-variant);">
              <span class="text-body-md text-muted">Fundação</span>
              <span class="text-body-md" style="font-weight:600;">${empresa.fundacao || "—"}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding: var(--space-sm) 0;">
              <span class="text-body-md text-muted">Província</span>
              <span class="text-body-md" style="font-weight:600;">${empresa.provincia || "—"}</span>
            </div>
          </div>

          <button type="button" class="btn btn-primary" style="width:100%; height:48px;" onclick="abrirModalAgendamento('${slug}')">Agendar Reunião B2B</button>
        </aside>

      </div>
    </section>
  `;
}

// ── Helper: gerar HTML de 1 card de serviço (usado em servicos.html) ──
function cardServicoHTML({ empresa, servico, index }) {
  return `
    <a href="empresa?id=${empresa.slug}" class="card">
      <div class="card-cover" style="height:340px; background-color: var(--color-surface-container);">
        <img ${imgComFallback(empresa.slug, `servico_${index + 1}`)} alt="${servico.nome || "Serviço"}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="padding: var(--space-lg);">
        <span class="badge ${classeBadgeIndustria(empresa.industria)}" style="margin-bottom: var(--space-sm);">${empresa.industria || ""}</span>
        <div class="text-headline-md" style="margin-bottom: var(--space-xs);">${servico.nome || "Serviço"}</div>
        <p class="text-body-md text-muted" style="margin-bottom: var(--space-sm);">${resumir(servico.descricao, 110)}</p>
        <div style="display:flex; align-items:center; gap: var(--space-xs);">
          <div style="width:24px; height:24px; border-radius:50%; background-color: var(--color-primary);"></div>
          <span class="text-label-sm text-muted">${empresa.nome}</span>
        </div>
      </div>
    </a>
  `;
}

/**
 * Renderiza "Featured Services" num container, juntando os serviços
 * de todas as empresas carregadas (opcionalmente limitado a N).
 */
async function renderizarServicosDestaque(containerId, { limite = 4 } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const empresas = await carregarTodasEmpresas();

  let servicosTodos = [];
  empresas.forEach((empresa) => {
    (empresa.servicos || []).forEach((servico, index) => {
      servicosTodos.push({ empresa, servico, index });
    });
  });

  if (limite) servicosTodos = servicosTodos.slice(0, limite);

  if (servicosTodos.length === 0) {
    container.innerHTML =
      '<p class="text-body-md text-muted">Nenhum serviço encontrado.</p>';
    return;
  }

  container.innerHTML = servicosTodos.map(cardServicoHTML).join("");
}

/**
 * Conta quantas empresas existem por indústria.
 * @param {object[]} empresas
 * @returns {Object<string, number>}
 */
function contarEmpresasPorIndustria(empresas) {
  const contagem = {};
  empresas.forEach((empresa) => {
    const ind = empresa.industria;
    if (!ind) return;
    contagem[ind] = (contagem[ind] || 0) + 1;
  });
  return contagem;
}

/**
 * Actualiza os badges "X Empresas" das categorias estáticas em
 * servicos.html, usando data-categoria-badge em cada badge para mapear.
 */
async function actualizarContagensCategorias() {
  const badges = document.querySelectorAll("[data-categoria-badge]");
  if (badges.length === 0) return;

  const empresas = await carregarTodasEmpresas();
  const contagem = contarEmpresasPorIndustria(empresas);

  badges.forEach((badge) => {
    const industria = badge.getAttribute("data-categoria-badge");
    const n = contagem[industria] || 0;
    badge.textContent = `${n} Empresa${n === 1 ? "" : "s"}`;
  });
}

/**
 * Ponto de entrada do servicos.html.
 */
function inicializarServicos() {
  renderizarServicosDestaque("servicos-grid", { limite: 4 });
  actualizarContagensCategorias();
}

/**
 * Calcula e injecta as stats gerais da Home: nº empresas,
 * nº serviços catalogados, nº províncias cobertas.
 * Espera 3 elementos com id="stat-empresas", "stat-servicos", "stat-provincias".
 */
async function actualizarStatsHome() {
  const elEmpresas = document.getElementById("stat-empresas");
  const elServicos = document.getElementById("stat-servicos");
  const elProvincias = document.getElementById("stat-provincias");
  if (!elEmpresas && !elServicos && !elProvincias) return;

  const empresas = await carregarTodasEmpresas();

  const nEmpresas = empresas.length;
  const nServicos = empresas.reduce(
    (soma, e) => soma + (e.servicos || []).length,
    0,
  );
  const provincias = new Set(empresas.map((e) => e.provincia).filter(Boolean));
  const nProvincias = provincias.size;

  if (elEmpresas) elEmpresas.textContent = `${nEmpresas}+`;
  if (elServicos) elServicos.textContent = `${nServicos}+`;
  if (elProvincias) elProvincias.textContent = `${nProvincias}`;
}

// ── Guardar todas as empresas em memória depois do 1º carregamento,
//    para os filtros não terem de voltar a fazer fetch sempre que mudam ──
let _empresasCache = null;
let _paginaActual = 1;
const ITEMS_POR_PAGINA = 6;

/**
 * Aplica os filtros activos (texto, verified, indústria[], província) e
 * re-renderiza o grid #empresas-grid, paginado a ITEMS_POR_PAGINA.
 * @param {boolean} resetarPagina - se true, volta à página 1 (usado quando os filtros mudam)
 */
function aplicarFiltrosExplore(resetarPagina = true) {
  if (!_empresasCache) return;
  if (resetarPagina) _paginaActual = 1;

  const termo = (document.getElementById("filter-search")?.value || "")
    .trim()
    .toLowerCase();
  const verifiedOnly = document.getElementById("filter-verified")?.checked;
  const provinciaSel = document.getElementById("filter-provincia")?.value || "";
  const industriasSel = Array.from(
    document.querySelectorAll(".filter-industria:checked"),
  ).map((el) => el.value);

  let filtradas = _empresasCache.filter((empresa) => {
    if (verifiedOnly && !(empresa.badges && empresa.badges.length > 0)) {
      return false;
    }
    if (provinciaSel && empresa.provincia !== provinciaSel) {
      return false;
    }
    if (
      industriasSel.length > 0 &&
      !industriasSel.includes(empresa.industria)
    ) {
      return false;
    }
    if (termo) {
      const alvo = [
        empresa.nome,
        empresa.industria,
        empresa.descricao,
        empresa.provincia,
        ...(empresa.servicos || []).map((s) => s.nome),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    return true;
  });

  const grid = document.getElementById("empresas-grid");
  const emptyMsg = document.getElementById("empty-msg");
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradas.length / ITEMS_POR_PAGINA),
  );
  if (_paginaActual > totalPaginas) _paginaActual = totalPaginas;

  if (filtradas.length === 0) {
    grid.innerHTML = "";
    if (emptyMsg) emptyMsg.style.display = "block";
  } else {
    const inicio = (_paginaActual - 1) * ITEMS_POR_PAGINA;
    const pagina = filtradas.slice(inicio, inicio + ITEMS_POR_PAGINA);
    grid.innerHTML = pagina.map(cardEmpresaExploreHTML).join("");
    if (emptyMsg) emptyMsg.style.display = "none";
  }

  renderizarPaginacaoExplore(filtradas.length, totalPaginas);
}

/**
 * Renderiza os controlos de paginação (Anterior / números / Seguinte)
 * no container #explore-paginacao, com base no nº total de resultados.
 */
function renderizarPaginacaoExplore(totalItens, totalPaginas) {
  const container = document.getElementById("explore-paginacao");
  if (!container) return;

  if (totalItens === 0 || totalPaginas <= 1) {
    container.innerHTML = "";
    return;
  }

  const botoes = [];

  botoes.push(
    `<button type="button" class="btn btn-secondary" data-pagina="${_paginaActual - 1}" ${_paginaActual === 1 ? "disabled" : ""} style="padding: var(--space-sm) var(--space-md);">‹ Anterior</button>`,
  );

  for (let p = 1; p <= totalPaginas; p++) {
    const activo = p === _paginaActual;
    botoes.push(
      `<button type="button" class="btn ${activo ? "btn-primary" : "btn-secondary"}" data-pagina="${p}" style="min-width:40px; padding: var(--space-sm); ${activo ? "" : ""}">${p}</button>`,
    );
  }

  botoes.push(
    `<button type="button" class="btn btn-secondary" data-pagina="${_paginaActual + 1}" ${_paginaActual === totalPaginas ? "disabled" : ""} style="padding: var(--space-sm) var(--space-md);">Seguinte ›</button>`,
  );

  container.innerHTML = botoes.join("");

  container.querySelectorAll("[data-pagina]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const novaPagina = parseInt(btn.getAttribute("data-pagina"), 10);
      if (Number.isNaN(novaPagina) || novaPagina < 1 || novaPagina > totalPaginas) return;
      _paginaActual = novaPagina;
      aplicarFiltrosExplore(false);
      document.getElementById("empresas-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/**
 * Ponto de entrada do explore.html: carrega as empresas, faz o
 * primeiro render, e liga os filtros para re-renderizarem ao mudar.
 * Lê os parâmetros "q" (texto) e "industria" da URL para pré-aplicar
 * filtros vindos de outras páginas (ex: pesquisa da home).
 */
async function inicializarExplore() {
  _empresasCache = await carregarTodasEmpresas();

  const termoUrl = obterParamDaUrl("q");
  const industriaUrl = obterParamDaUrl("industria");
  const provinciaUrl = obterParamDaUrl("provincia");

  const inputSearch = document.getElementById("filter-search");
  if (inputSearch && termoUrl) inputSearch.value = termoUrl;

  if (industriaUrl) {
    document.querySelectorAll(".filter-industria").forEach((el) => {
      if (el.value === industriaUrl) el.checked = true;
    });
  }

  const selectProvincia = document.getElementById("filter-provincia");
  if (selectProvincia && provinciaUrl) selectProvincia.value = provinciaUrl;

  aplicarFiltrosExplore();

  inputSearch?.addEventListener("input", aplicarFiltrosExplore);

  document
    .getElementById("filter-verified")
    ?.addEventListener("change", aplicarFiltrosExplore);

  document
    .getElementById("filter-provincia")
    ?.addEventListener("change", aplicarFiltrosExplore);

  document
    .querySelectorAll(".filter-industria")
    .forEach((el) => el.addEventListener("change", aplicarFiltrosExplore));
}


/* ============================================================
   HERO SLIDER (carrossel de imagens na home)
   ============================================================ */
function inicializarHeroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dotsContainer = slider.querySelector(".hero-dots");
  const btnPrev = slider.querySelector(".hero-arrow-prev");
  const btnNext = slider.querySelector(".hero-arrow-next");

  if (slides.length === 0) return;

  let indiceAtual = slides.findIndex((s) => s.classList.contains("is-active"));
  if (indiceAtual === -1) indiceAtual = 0;

  let dots = [];
  let intervaloAutoplay = null;
  const DURACAO_AUTOPLAY = 6000;

  // ── Gerar os dots dinamicamente ──
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-dot";
      dot.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
      dot.addEventListener("click", () => irParaSlide(i));
      dotsContainer.appendChild(dot);
    });
    dots = Array.from(dotsContainer.querySelectorAll(".hero-dot"));
  }

  function actualizarUI() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === indiceAtual);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === indiceAtual);
    });
  }

  function irParaSlide(indice) {
    indiceAtual = (indice + slides.length) % slides.length;
    actualizarUI();
    reiniciarAutoplay();
  }

  function proximoSlide() {
    irParaSlide(indiceAtual + 1);
  }

  function slideAnterior() {
    irParaSlide(indiceAtual - 1);
  }

  function iniciarAutoplay() {
    intervaloAutoplay = setInterval(proximoSlide, DURACAO_AUTOPLAY);
  }

  function pararAutoplay() {
    if (intervaloAutoplay) clearInterval(intervaloAutoplay);
  }

  function reiniciarAutoplay() {
    pararAutoplay();
    iniciarAutoplay();
  }

  btnPrev?.addEventListener("click", slideAnterior);
  btnNext?.addEventListener("click", proximoSlide);

  slider.addEventListener("mouseenter", pararAutoplay);
  slider.addEventListener("mouseleave", iniciarAutoplay);

  actualizarUI();
  iniciarAutoplay();
}

document.addEventListener("DOMContentLoaded", inicializarHeroSlider);

/* ============================================================
   MODAL — AGENDAR REUNIÃO B2B
   Disponível em qualquer página (basta ter data.js + main.js
   incluídos). Envia o pedido por email via FormSubmit, sem
   necessitar de backend próprio.
   ============================================================ */
const AGENDAMENTO_EMAIL_DESTINO = "iassineiahaiait@gmail.com";
const AGENDAMENTO_HORARIOS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "13:00", "13:30", "14:00",
  "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

let _empresasParaAgendamentoCache = null;

async function _obterEmpresasParaAgendamento() {
  if (!_empresasParaAgendamentoCache) {
    _empresasParaAgendamentoCache = await carregarTodasEmpresas();
  }
  return _empresasParaAgendamentoCache;
}

function _escListenerAgendamento(ev) {
  if (ev.key === "Escape") fecharModalAgendamento();
}

function fecharModalAgendamento() {
  const overlay = document.getElementById("modal-agendamento-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
  document.removeEventListener("keydown", _escListenerAgendamento);
}

/**
 * Abre o modal de agendamento de reunião B2B.
 * @param {string} [slugPreSelecionado] - se vier de uma página de empresa,
 *   pré-selecciona essa empresa no formulário.
 */
async function abrirModalAgendamento(slugPreSelecionado = "") {
  fecharModalAgendamento(); // evita sobrepor 2 modais

  const overlay = document.createElement("div");
  overlay.id = "modal-agendamento-overlay";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-agendamento-titulo">
      <button type="button" class="modal-close" aria-label="Fechar">
        <span class="icon"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
      </button>

      <div style="text-align:center; margin-bottom: var(--space-lg);">
        <h2 id="modal-agendamento-titulo" class="text-headline-md">Agende a Sua Reunião B2B</h2>
        <p class="text-body-md text-muted" style="margin-top: var(--space-xs);">Marque uma reunião com as empresas do OHOLO Hub.</p>
      </div>

      <form id="form-agendamento" style="display:flex; flex-direction:column; gap: var(--space-md);">
        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-nome">O Seu Nome</label>
          <input type="text" id="agendamento-nome" class="input-field" placeholder="Nome completo" required>
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-telefone">Número de Telefone</label>
          <input type="tel" id="agendamento-telefone" class="input-field" placeholder="+258 8X XXX XXXX" required>
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-empresa">Empresa</label>
          <select id="agendamento-empresa" class="input-field" required>
            <option value="" disabled selected>A carregar empresas...</option>
          </select>
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-data">Data</label>
          <input type="date" id="agendamento-data" class="input-field" required>
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-hora">Hora</label>
          <select id="agendamento-hora" class="input-field" required>
            <option value="" disabled selected>Seleccionar hora</option>
            ${AGENDAMENTO_HORARIOS.map((h) => `<option value="${h}">${h}</option>`).join("")}
          </select>
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-local">Local</label>
          <input type="text" id="agendamento-local" class="input-field" value="Stand OHOLO Hub (FENA)">
        </div>

        <div class="modal-field">
          <label class="text-label-sm text-muted" for="agendamento-mensagem">Mensagem (opcional)</label>
          <textarea id="agendamento-mensagem" class="input-field"></textarea>
        </div>

        <p id="agendamento-erro" class="text-body-md" style="color: var(--color-error); display:none;"></p>

        <button type="submit" id="agendamento-submit" class="btn btn-primary" style="width:100%; height:48px; text-transform:uppercase; letter-spacing:0.04em;">Agendar Reunião</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", _escListenerAgendamento);

  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) fecharModalAgendamento();
  });
  overlay.querySelector(".modal-close").addEventListener("click", fecharModalAgendamento);

  // Data mínima = hoje (não deixar marcar reuniões no passado)
  const inputData = overlay.querySelector("#agendamento-data");
  inputData.min = new Date().toISOString().split("T")[0];

  // Popular o select de empresas
  const nome = overlay.querySelector("#agendamento-nome").value.trim();
  const telefone = overlay.querySelector("#agendamento-telefone").value.trim();
  const selectEmpresa = overlay.querySelector("#agendamento-empresa");
  try {
    const empresas = await _obterEmpresasParaAgendamento();
    selectEmpresa.innerHTML = `<option value="" disabled ${slugPreSelecionado ? "" : "selected"}>Seleccionar empresa</option>`;
    empresas
      .slice()
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""))
      .forEach((emp) => {
        const opt = document.createElement("option");
        opt.value = emp.slug;
        opt.textContent = emp.nome;
        if (emp.slug === slugPreSelecionado) opt.selected = true;
        selectEmpresa.appendChild(opt);
      });
  } catch (err) {
    console.error("Erro ao carregar empresas para agendamento:", err);
    selectEmpresa.innerHTML = `<option value="" disabled selected>Não foi possível carregar empresas</option>`;
  }

  overlay.querySelector("#form-agendamento").addEventListener("submit", _submeterAgendamento);
}

async function _submeterAgendamento(ev) {
  ev.preventDefault();
  const overlay = document.getElementById("modal-agendamento-overlay");
  if (!overlay) return;

  const btn = overlay.querySelector("#agendamento-submit");
  const erro = overlay.querySelector("#agendamento-erro");
  erro.style.display = "none";

  const nome = overlay.querySelector("#agendamento-nome").value.trim();
  const telefone = overlay.querySelector("#agendamento-telefone").value.trim();
  const selectEmpresa = overlay.querySelector("#agendamento-empresa");
  const nomeEmpresa = selectEmpresa.options[selectEmpresa.selectedIndex]?.textContent || "";
  const data = overlay.querySelector("#agendamento-data").value;
  const hora = overlay.querySelector("#agendamento-hora").value;
  const local = overlay.querySelector("#agendamento-local").value.trim();
  const mensagem = overlay.querySelector("#agendamento-mensagem").value.trim();

  if (!nome || !telefone || !selectEmpresa.value || !data || !hora) {
    erro.textContent = "Por favor preencha o nome, telefone, empresa, data e hora.";
    erro.style.display = "block";
    return;
  }

  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = "A agendar...";

  try {
    const resp = await fetch(`https://formsubmit.co/ajax/${AGENDAMENTO_EMAIL_DESTINO}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Nova Reunião B2B — ${nomeEmpresa}`,
        Nome: nome,
        Telefone: telefone,
        Empresa: nomeEmpresa,
        Data: data,
        Hora: hora,
        Local: local,
        Mensagem: mensagem || "—",
        _template: "table",
      }),
    });

    if (!resp.ok) throw new Error("Falha no envio do formulário");

    overlay.querySelector(".modal-card").innerHTML = `
      <div style="text-align:center; padding: var(--space-lg) 0;">
        <div class="icon-circle" style="margin: 0 auto var(--space-md); width:56px; height:56px;">
          <span class="icon" style="width:28px; height:28px;"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>
        </div>
        <h2 class="text-headline-md" style="margin-bottom: var(--space-xs);">Reunião agendada!</h2>
        <p class="text-body-md text-muted" style="margin-bottom: var(--space-lg);">Recebemos o seu pedido. A nossa equipa entrará em contacto para confirmar os detalhes.</p>
        <button type="button" class="btn btn-primary" onclick="fecharModalAgendamento()">Fechar</button>
      </div>
    `;
  } catch (err) {
    console.error("Erro ao agendar reunião:", err);
    btn.disabled = false;
    btn.textContent = textoOriginal;
    erro.textContent = "Não foi possível enviar o pedido. Tente novamente.";
    erro.style.display = "block";
  }
}