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

// ── Renderizar grid de empresas num container (explore.html / index.html) ──
async function renderizarGridEmpresas(containerId, { limite = null } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let empresas = await carregarTodasEmpresas();
  if (limite) empresas = empresas.slice(0, limite);

  if (empresas.length === 0) {
    container.innerHTML =
      '<p class="text-body-md text-muted">Nenhuma empresa encontrada.</p>';
    return;
  }

  container.innerHTML = empresas.map(cardEmpresaHTML).join("");
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

  document.title = `${empresa.nome} — B2B Mozambique`;

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
              <span class="text-body-md text-muted">NUIT</span>
              <span class="text-body-md" style="font-weight:600;">${empresa.nuit || "—"}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-outline-variant);">
              <span class="text-body-md text-muted">Fundação</span>
              <span class="text-body-md" style="font-weight:600;">${empresa.fundacao || "—"}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding: var(--space-sm) 0;">
              <span class="text-body-md text-muted">Província</span>
              <span class="text-body-md" style="font-weight:600;">${empresa.provincia || "—"}</span>
            </div>
          </div>


          ${contactos.email ? `<a href="mailto:${contactos.email}" class="btn btn-primary" style="width:100%; height:48px;">Pedir Orçamento</a>` : ""}
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
    grid.innerHTML = pagina.map(cardEmpresaHTML).join("");
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
