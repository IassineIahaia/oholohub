/* ============================================================
   FACIM 2026 — RENDERIZAÇÃO
   Depende de: facim-data.js (lista + evento) e main.js (ícones,
   modal de agendamento, navbar). Não altera nada da FENA.
   ============================================================ */

let _facimCache = null;
let _facimVisiveis = 9;
const FACIM_LOTE = 9;

/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */

function _txt(v) {
  return (v === null || v === undefined ? "" : String(v)).trim();
}

function _escapar(s) {
  return _txt(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function _resumirFacim(texto, max = 130) {
  const limpo = _txt(texto).replace(/\s*\n\s*/g, " · ").replace(/\s{2,}/g, " ");
  return limpo.length > max ? limpo.slice(0, max).trim() + "…" : limpo;
}

/** Classe de cor do badge a partir do sector. */
function classeSectorFacim(sector = "") {
  const s = sector.toLowerCase();
  if (s.includes("agroproc")) return "facim-sector-agro";
  if (s.includes("pesca")) return "facim-sector-pescas";
  if (s.includes("artesanato")) return "facim-sector-artesanato";
  if (s.includes("cosm")) return "facim-sector-cosmetica";
  if (s.includes("tecnolog")) return "facim-sector-tecnologia";
  if (s.includes("turismo") || s.includes("hotelaria")) return "facim-sector-turismo";
  if (s.includes("logíst") || s.includes("logist")) return "facim-sector-logistica";
  if (s.includes("constru") || s.includes("topograf")) return "facim-sector-construcao";
  if (s.includes("formação") || s.includes("ensino")) return "facim-sector-ensino";
  return "facim-sector-servicos";
}

/** Caminho de uma foto da empresa, ou "" se não existir. */
function fotoFacim(empresa, qual) {
  const v = empresa.vitrine || {};
  if (qual === "logo") return v.logo ? imagemFacim(empresa.slug, v.logo) : "";
  if (qual === "cover") return v.cover ? imagemFacim(empresa.slug, v.cover) : "";
  return "";
}

/** Melhor imagem disponível para o cartão: cover → 1.ª foto → logo. */
function imagemCartaoFacim(empresa) {
  const v = empresa.vitrine || {};
  if (v.cover) return { src: imagemFacim(empresa.slug, v.cover), tipo: "cover" };
  if (v.fotos && v.fotos.length) return { src: imagemFacim(empresa.slug, v.fotos[0]), tipo: "foto" };
  if (v.logo) return { src: imagemFacim(empresa.slug, v.logo), tipo: "logo" };
  return { src: "", tipo: "vazio" };
}

/** Iniciais para o placeholder quando não há nenhuma imagem. */
function iniciaisEmpresa(nome = "") {
  return _txt(nome)
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

/** Converte um link do YouTube em ID. */
function idYoutube(url) {
  const m = _txt(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return m ? m[1] : "";
}

/* ------------------------------------------------------------
   HERO — CONTAGEM DECRESCENTE
   ------------------------------------------------------------ */
function inicializarContagemFacim() {
  const alvo = document.getElementById("facim-contagem");
  if (!alvo) return;

  function actualizar() {
    const agora = new Date();
    const estado = estadoFacim(agora);

    if (estado === "adecorrer") {
      alvo.innerHTML = `
        <div class="facim-contagem-viva">
          <span class="facim-ponto-vivo"></span> A feira está a decorrer — venha ao nosso pavilhão
        </div>`;
      return;
    }
    if (estado === "terminado") {
      alvo.innerHTML = `<div class="facim-contagem-viva">61.ª Edição encerrada · obrigado a quem passou pelo nosso stand</div>`;
      return;
    }

    const inicio = new Date(`${FACIM_EVENTO.inicio}T08:00:00`);
    let restante = Math.max(0, Math.floor((inicio - agora) / 1000));
    const dias = Math.floor(restante / 86400);
    restante -= dias * 86400;
    const horas = Math.floor(restante / 3600);
    restante -= horas * 3600;
    const minutos = Math.floor(restante / 60);
    const segundos = restante - minutos * 60;

    const bloco = (valor, rotulo) => `
      <div class="facim-contagem-bloco">
        <span class="facim-contagem-num">${String(valor).padStart(2, "0")}</span>
        <span class="facim-contagem-rotulo">${rotulo}</span>
      </div>`;

    alvo.innerHTML =
      bloco(dias, dias === 1 ? "dia" : "dias") +
      bloco(horas, "horas") +
      bloco(minutos, "min") +
      bloco(segundos, "seg");
  }

  actualizar();
  setInterval(actualizar, 1000);
}

/* ------------------------------------------------------------
   NÚMEROS DA MISSÃO
   ------------------------------------------------------------ */
function renderizarNumerosFacim(empresas) {
  const apuradas = empresas.filter((e) => e.facim && e.facim.apurada);
  const provincias = new Set(apuradas.map((e) => _txt(e.provincia)).filter(Boolean));
  const sectores = new Set(apuradas.map((e) => _txt(e.industria)).filter(Boolean));

  const def = (id, valor) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("data-count", valor);
    el.dataset.contado = "";
    if (window.Movimento) window.Movimento.contar(el);
    else el.textContent = valor;
  };

  def("facim-num-apuradas", apuradas.length);
  def("facim-num-candidaturas", empresas.length);
  def("facim-num-provincias", provincias.size);
  def("facim-num-sectores", sectores.size);
}

/* ------------------------------------------------------------
   VITRINE DIGITAL — CARTÕES
   ------------------------------------------------------------ */
function cartaoVitrineHTML(empresa, indiceAnim = -1) {
  const img = imagemCartaoFacim(empresa);
  const f = empresa.facim || {};
  const v = empresa.vitrine || {};
  const nFotos = (v.fotos || []).length + (v.cover ? 1 : 0);
  const nVideos = (v.videos || []).length;

  const media = img.src
    ? `<img src="${img.src}" alt="${_escapar(empresa.nome)}" loading="lazy"
           class="facim-card-img ${img.tipo === "logo" ? "is-logo" : ""}">`
    : `<div class="facim-card-vazio"><span>${iniciaisEmpresa(empresa.nome)}</span></div>`;

  const anim =
    indiceAnim >= 0
      ? ` data-anim="rise" style="--i:${indiceAnim}; --anim-delay:${indiceAnim * 60}ms"`
      : "";

  return `
    <a href="facim-empresa.html?id=${empresa.slug}" class="facim-card"${anim}>
      <div class="facim-card-media">
        ${media}
        ${f.apurada ? '<span class="facim-selo">Apurada</span>' : ""}
        ${f.stand ? `<span class="facim-stand-tag">Stand ${_escapar(f.stand)}</span>` : ""}
      </div>
      <div class="facim-card-corpo">
        <span class="facim-sector ${classeSectorFacim(empresa.industria)}">${_escapar(empresa.industria) || "Empresa"}</span>
        <h3 class="facim-card-nome">${_escapar(empresa.nome)}</h3>
        <p class="facim-card-desc">${_escapar(_resumirFacim(f.produtosExpor || empresa.descricao, 120))}</p>
        <div class="facim-card-rodape">
          <span class="facim-card-local">${icone("pin")} ${_escapar(empresa.provincia) || "Moçambique"}</span>
          <span class="facim-card-media-contagem" title="Conteúdos na vitrine">
            <span class="${nFotos ? "" : "em-falta"}">${nFotos} foto${nFotos === 1 ? "" : "s"}</span>
            <span class="${nVideos ? "" : "em-falta"}">${nVideos} vídeo${nVideos === 1 ? "" : "s"}</span>
          </span>
        </div>
        <span class="facim-card-seta">${icone("arrow")}</span>
      </div>
    </a>`;
}

/* ------------------------------------------------------------
   VITRINE DIGITAL — FILTROS E PAGINAÇÃO
   ------------------------------------------------------------ */
function empresasFiltradasFacim() {
  const termo = _txt(document.getElementById("facim-pesquisa")?.value).toLowerCase();
  const sector = document.getElementById("facim-filtro-sector")?.value || "";
  const provincia = document.getElementById("facim-filtro-provincia")?.value || "";
  const apenasApuradas = document.getElementById("facim-filtro-apuradas")?.checked;

  return (_facimCache || []).filter((e) => {
    const f = e.facim || {};
    if (apenasApuradas && !f.apurada) return false;
    if (sector && _txt(e.industria) !== sector) return false;
    if (provincia && _txt(e.provincia) !== provincia) return false;
    if (termo) {
      const alvo = [
        e.nome,
        e.industria,
        e.provincia,
        e.descricao,
        f.produtosExpor,
        f.representante,
        ...(e.servicos || []).map((s) => s.nome),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    return true;
  });
}

function aplicarFiltrosFacim(resetar = true, animar = false) {
  if (!_facimCache) return;
  if (resetar) _facimVisiveis = FACIM_LOTE;

  const grid = document.getElementById("facim-grid");
  const vazio = document.getElementById("facim-vazio");
  const contador = document.getElementById("facim-contador");
  if (!grid) return;

  const filtradas = empresasFiltradasFacim();
  const total = filtradas.length;
  if (_facimVisiveis > total) _facimVisiveis = Math.max(FACIM_LOTE, total);

  if (contador) {
    contador.textContent =
      total === 0
        ? "Nenhuma empresa"
        : `A mostrar ${Math.min(_facimVisiveis, total)} de ${total} empresa${total === 1 ? "" : "s"}`;
  }

  if (total === 0) {
    grid.innerHTML = "";
    if (vazio) vazio.style.display = "block";
    renderizarVerMaisFacim(0, 0);
    return;
  }
  if (vazio) vazio.style.display = "none";

  const mostrar = filtradas.slice(0, _facimVisiveis);
  grid.innerHTML = mostrar
    .map((e, i) => cartaoVitrineHTML(e, animar ? i % FACIM_LOTE : -1))
    .join("");

  if (animar && window.Movimento) {
    window.Movimento.observar(grid);
  } else {
    grid.querySelectorAll("[data-anim]").forEach((el) => el.classList.add("is-in"));
  }

  renderizarVerMaisFacim(mostrar.length, total);
}

/** Botão "ver mais" — mais discreto do que uma barra de páginas numeradas. */
function renderizarVerMaisFacim(mostradas, total) {
  const container = document.getElementById("facim-ver-mais");
  if (!container) return;

  const restantes = total - mostradas;
  if (restantes <= 0) {
    container.innerHTML =
      total > FACIM_LOTE
        ? '<span class="facim-fim-lista">Chegou ao fim da vitrine</span>'
        : "";
    return;
  }

  container.innerHTML = `
    <button type="button" class="btn btn-secondary facim-ver-mais-btn" id="facim-btn-mais">
      Ver mais ${Math.min(restantes, FACIM_LOTE)} empresa${Math.min(restantes, FACIM_LOTE) === 1 ? "" : "s"}
      <span class="facim-ver-mais-resto">${restantes} por mostrar</span>
    </button>`;

  document.getElementById("facim-btn-mais").addEventListener("click", () => {
    _facimVisiveis += FACIM_LOTE;
    aplicarFiltrosFacim(false, true);
  });
}

/** Preenche os selects de sector e província com o que existe nos dados. */
function preencherFiltrosFacim(empresas) {
  const selSector = document.getElementById("facim-filtro-sector");
  const selProvincia = document.getElementById("facim-filtro-provincia");

  if (selSector) {
    const sectores = [...new Set(empresas.map((e) => _txt(e.industria)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b, "pt"),
    );
    selSector.innerHTML =
      '<option value="">Todos os sectores</option>' +
      sectores.map((s) => `<option value="${_escapar(s)}">${_escapar(s)}</option>`).join("");
  }

  if (selProvincia) {
    const provincias = [...new Set(empresas.map((e) => _txt(e.provincia)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b, "pt"),
    );
    selProvincia.innerHTML =
      '<option value="">Todas as origens</option>' +
      provincias.map((p) => `<option value="${_escapar(p)}">${_escapar(p)}</option>`).join("");
  }
}

/* ------------------------------------------------------------
   PLANTA DO PAVILHÃO — stands proporcionais ao tamanho atribuído
   ------------------------------------------------------------ */
function renderizarPlantaFacim(empresas) {
  const container = document.getElementById("facim-planta");
  if (!container) return;

  const apuradas = empresas.filter((e) => e.facim && e.facim.apurada);
  if (apuradas.length === 0) {
    container.innerHTML = '<p class="text-body-md text-muted">Sem stands atribuídos.</p>';
    return;
  }

  const ordem = { "3x2m": 0, "2x2m": 1 };
  const ordenadas = apuradas.slice().sort((a, b) => {
    const oa = ordem[a.facim.stand] ?? 9;
    const ob = ordem[b.facim.stand] ?? 9;
    if (oa !== ob) return oa - ob;
    return a.nome.localeCompare(b.nome, "pt");
  });

  container.innerHTML = ordenadas
    .map((e, i) => {
      const stand = _txt(e.facim.stand) || "—";
      const grande = stand.startsWith("3x2");
      return `
      <a href="facim-empresa.html?id=${e.slug}" class="facim-stand ${grande ? "is-grande" : ""}"
         data-anim="scale" style="--anim-delay:${Math.min(i, 14) * 45}ms">
        <span class="facim-stand-medida">${_escapar(stand)}</span>
        <span class="facim-stand-nome">${_escapar(e.nome)}</span>
        <span class="facim-stand-origem">${_escapar(e.provincia)}</span>
      </a>`;
    })
    .join("");

  if (window.Movimento) window.Movimento.observar(container);

  const legenda = document.getElementById("facim-planta-legenda");
  if (legenda) {
    const n3 = apuradas.filter((e) => _txt(e.facim.stand).startsWith("3x2")).length;
    const n2 = apuradas.length - n3;
    legenda.innerHTML = `
      <span class="facim-legenda-item"><i class="facim-quadro is-grande"></i> ${n3} stands de 3&times;2 m</span>
      <span class="facim-legenda-item"><i class="facim-quadro"></i> ${n2} stands de 2&times;2 m</span>`;
  }
}

/* ------------------------------------------------------------
   ESTADO DA RECOLHA DE CONTEÚDOS (pedido da coordenação)
   Fotografias · Vídeos · Informação do produto, por beneficiário.
   ------------------------------------------------------------ */
function estadoConteudos(empresa) {
  const v = empresa.vitrine || {};
  const fotos = (v.fotos || []).length + (v.cover ? 1 : 0);
  const videos = (v.videos || []).length;
  const info = _txt(empresa.descricao).length > 20;
  const logo = !!v.logo;
  const completos = [fotos > 0, videos > 0, info, logo].filter(Boolean).length;
  return { fotos, videos, info, logo, completos, total: 4 };
}

function renderizarConteudosFacim(empresas) {
  const corpo = document.getElementById("facim-conteudos-corpo");
  if (!corpo) return;

  const soApuradas = document.getElementById("facim-conteudos-apuradas")?.checked;
  const soFalta = document.getElementById("facim-conteudos-falta")?.checked;

  let lista = empresas.slice();
  if (soApuradas) lista = lista.filter((e) => e.facim && e.facim.apurada);
  lista.sort((a, b) => {
    const ea = estadoConteudos(a).completos;
    const eb = estadoConteudos(b).completos;
    if (ea !== eb) return ea - eb; // primeiro quem tem menos
    return a.nome.localeCompare(b.nome, "pt");
  });
  if (soFalta) lista = lista.filter((e) => estadoConteudos(e).completos < 4);

  // ── Barra de progresso global ──
  const base = soApuradas ? empresas.filter((e) => e.facim && e.facim.apurada) : empresas;
  const somaFotos = base.filter((e) => estadoConteudos(e).fotos > 0).length;
  const somaVideos = base.filter((e) => estadoConteudos(e).videos > 0).length;
  const somaInfo = base.filter((e) => estadoConteudos(e).info).length;
  const somaLogo = base.filter((e) => estadoConteudos(e).logo).length;

  const resumo = document.getElementById("facim-conteudos-resumo");
  if (resumo) {
    const barra = (rotulo, feito) => {
      const pct = base.length ? Math.round((feito / base.length) * 100) : 0;
      return `
        <div class="facim-progresso">
          <div class="facim-progresso-topo">
            <span class="facim-progresso-rotulo">${rotulo}</span>
            <span class="facim-progresso-valor">${feito}/${base.length}</span>
          </div>
          <div class="facim-progresso-barra"><span style="width:${pct}%"></span></div>
        </div>`;
    };
    resumo.innerHTML =
      barra("Fotografias", somaFotos) +
      barra("Vídeos", somaVideos) +
      barra("Descrição do produto", somaInfo) +
      barra("Logótipo", somaLogo);
  }

  // Resumo de uma linha, para quem não abre o painel
  const sumario = document.getElementById("facim-conteudos-sumario");
  if (sumario) {
    const completas = base.filter((e) => estadoConteudos(e).completos === 4).length;
    const emFalta = base.length - completas;
    sumario.innerHTML = `
      <span><b>${somaFotos}</b>/${base.length} com fotografias</span>
      <span><b>${somaVideos}</b>/${base.length} com vídeo</span>
      <span><b>${somaLogo}</b>/${base.length} com logótipo</span>
      <span class="${emFalta ? "em-falta" : ""}"><b>${emFalta}</b> ainda por completar</span>`;
  }

  if (lista.length === 0) {
    corpo.innerHTML =
      '<tr><td colspan="6" class="facim-tabela-vazia">Tudo recolhido nesta selecção.</td></tr>';
    return;
  }

  const marca = (ok, texto) =>
    `<span class="facim-marca ${ok ? "ok" : "falta"}">${ok ? "✓" : "—"}${texto ? ` <em>${texto}</em>` : ""}</span>`;

  corpo.innerHTML = lista
    .map((e) => {
      const s = estadoConteudos(e);
      return `
      <tr>
        <td>
          <a href="facim-empresa.html?id=${e.slug}" class="facim-tabela-nome">${_escapar(e.nome)}</a>
          <span class="facim-tabela-sub">${_escapar(e.provincia)}${e.facim && e.facim.apurada ? " · Apurada" : ""}</span>
        </td>
        <td>${marca(s.fotos > 0, s.fotos ? String(s.fotos) : "")}</td>
        <td>${marca(s.videos > 0, s.videos ? String(s.videos) : "")}</td>
        <td>${marca(s.info)}</td>
        <td>${marca(s.logo)}</td>
        <td><span class="facim-tabela-total ${s.completos === 4 ? "completo" : ""}">${s.completos}/4</span></td>
      </tr>`;
    })
    .join("");
}

/* ------------------------------------------------------------
   CRONOGRAMA E DESLOCAÇÃO
   ------------------------------------------------------------ */
function renderizarCronogramaFacim() {
  const lista = document.getElementById("facim-cronograma");
  if (lista) {
    lista.innerHTML = FACIM_CRONOGRAMA.map(
      (m) => `
      <li class="facim-marco is-${m.estado}">
        <span class="facim-marco-data">${_escapar(m.data)}</span>
        <div class="facim-marco-corpo">
          <span class="facim-marco-titulo">${_escapar(m.actividade)}</span>
          <span class="facim-marco-resultado">${_escapar(m.resultado)}</span>
        </div>
      </li>`,
    ).join("");
  }

  const viagem = document.getElementById("facim-deslocacao");
  if (viagem) {
    viagem.innerHTML = FACIM_DESLOCACAO.map(
      (d) => `
      <div class="facim-rota">
        <div class="facim-rota-cidade">${_escapar(d.cidade)} <span>→ Maputo</span></div>
        <dl class="facim-rota-dados">
          <div><dt>Partida</dt><dd>${_escapar(d.partida)}</dd></div>
          <div><dt>Chegada</dt><dd>${_escapar(d.chegada)}</dd></div>
          <div><dt>Duração</dt><dd>${_escapar(d.duracao)}</dd></div>
          <div><dt>Ponto de recolha</dt><dd>${_escapar(d.recolha)}</dd></div>
        </dl>
      </div>`,
    ).join("");
  }

  const reps = document.getElementById("facim-representantes");
  if (reps) {
    const total = FACIM_REPRESENTANTES.reduce((s, r) => s + r.representantes, 0);
    reps.innerHTML =
      FACIM_REPRESENTANTES.filter((r) => r.representantes > 0)
        .map(
          (r) => `
        <div class="facim-rep">
          <span class="facim-rep-num">${r.representantes}</span>
          <span class="facim-rep-origem">${_escapar(r.origem)}</span>
          <span class="facim-rep-detalhe">${r.empresas} empresa${r.empresas === 1 ? "" : "s"}</span>
        </div>`,
        )
        .join("") +
      `<div class="facim-rep is-total">
         <span class="facim-rep-num">${total}</span>
         <span class="facim-rep-origem">Total</span>
         <span class="facim-rep-detalhe">representantes a viajar</span>
       </div>`;
  }
}

/* ------------------------------------------------------------
   PÁGINA DA EMPRESA (facim-empresa.html)
   ------------------------------------------------------------ */
async function renderizarPerfilFacim() {
  const raiz = document.getElementById("facim-empresa-root");
  if (!raiz) return;

  const slug = obterIdDaUrl();
  if (!slug) {
    raiz.innerHTML = `<div class="container facim-erro"><h1 class="text-headline-lg">Empresa não indicada</h1>
      <p class="text-body-lg text-muted">Volte à <a href="facim.html#vitrine">Vitrine Digital</a> e escolha uma empresa.</p></div>`;
    return;
  }

  const e = await carregarEmpresaFacim(slug);
  if (!e) {
    raiz.innerHTML = `<div class="container facim-erro"><h1 class="text-headline-lg">Empresa não encontrada</h1>
      <p class="text-body-lg text-muted">Volte à <a href="facim.html#vitrine">Vitrine Digital</a> e escolha uma empresa.</p></div>`;
    return;
  }

  document.title = `${e.nome} — FACIM 2026 | OHOLO Hub`;

  const f = e.facim || {};
  const v = e.vitrine || {};
  const contactos = e.contactos || {};
  const responsavel = e.responsavel || {};
  const capa = fotoFacim(e, "cover") || (v.fotos && v.fotos[0] ? imagemFacim(slug, v.fotos[0]) : "");
  const logo = fotoFacim(e, "logo");

  const galeria = (v.fotos || []).map((nome) => imagemFacim(slug, nome));
  if (v.cover) galeria.unshift(imagemFacim(slug, v.cover));

  const linhasFicha = [
    ["Sector", e.industria],
    ["Origem", e.provincia],
    ["Anos de actividade", e.anosActividade],
    ["NUIT", e.nuit],
    ["Representante", f.representante || responsavel.nome],
    ["Cargo", responsavel.cargo],
  ].filter(([, valor]) => _txt(valor));

  raiz.innerHTML = `
    <section class="facim-perfil-topo">
      <div class="facim-perfil-capa">
        ${capa ? `<img src="${capa}" alt="">` : ""}
        <div class="facim-perfil-veu"></div>
      </div>
      <div class="container facim-perfil-cabecalho">
        ${logo ? `<div class="facim-perfil-logo"><img src="${logo}" alt="Logótipo ${_escapar(e.nome)}"></div>`
               : `<div class="facim-perfil-logo is-vazio"><span>${iniciaisEmpresa(e.nome)}</span></div>`}
        <div class="facim-perfil-identidade">
          <div class="facim-perfil-selos" data-anim="up">
            <span class="facim-sector ${classeSectorFacim(e.industria)}">${_escapar(e.industria)}</span>
            ${f.apurada ? '<span class="facim-selo is-estatico">Apurada para expor</span>' : '<span class="facim-selo is-candidata">Candidatura submetida</span>'}
          </div>
          <h1 class="facim-perfil-nome" data-anim="up" data-anim-delay="70">${_escapar(e.nome)}</h1>
          <p class="facim-perfil-local" data-anim="up" data-anim-delay="130">${icone("pin")} ${_escapar(e.provincia) || "Moçambique"}${f.stand ? ` &nbsp;·&nbsp; Stand ${_escapar(f.stand)}` : ""}</p>
        </div>
      </div>
    </section>

    <section class="container facim-perfil-corpo">
      <div class="facim-perfil-principal">
        ${_txt(e.descricao) ? `
          <h2 class="facim-h2" data-anim="up">Sobre a empresa</h2>
          <p class="facim-perfil-desc" data-anim="up" data-anim-delay="60">${_escapar(e.descricao)}</p>` : ""}

        ${_txt(f.produtosExpor) && _txt(f.produtosExpor) !== _txt(e.descricao) ? `
          <div class="facim-destaque-expor" data-anim="rise">
            <span class="facim-eyebrow">O que leva à feira</span>
            <p>${_escapar(f.produtosExpor)}</p>
            ${_txt(f.quantidade) ? `<span class="facim-quantidade">Volume previsto: ${_escapar(f.quantidade)}</span>` : ""}
          </div>` : ""}

        ${(e.servicos || []).length ? `
          <h2 class="facim-h2" data-anim="up">Produtos e serviços</h2>
          <div class="facim-servicos" data-anim-stagger="80">
            ${e.servicos.map((s, i) => {
              const img = (v.fotos || [])[i] ? imagemFacim(slug, v.fotos[i]) : "";
              return `
              <article class="facim-servico" data-anim="rise">
                ${img ? `<div class="facim-servico-img"><img src="${img}" alt="${_escapar(s.nome)}" loading="lazy"></div>` : ""}
                <div class="facim-servico-txt">
                  <h3>${_escapar(s.nome)}</h3>
                  ${_txt(s.descricao) ? `<p>${_escapar(s.descricao)}</p>` : ""}
                </div>
              </article>`;
            }).join("")}
          </div>` : ""}

        ${galeria.length ? `
          <h2 class="facim-h2" data-anim="up">Galeria</h2>
          <div class="facim-galeria" data-anim-stagger="55">
            ${galeria.map((src, i) => `
              <button type="button" class="facim-galeria-item" data-anim="scale" onclick="abrirLightboxFacim(${i})">
                <img src="${src}" alt="" loading="lazy">
              </button>`).join("")}
          </div>` : ""}

        ${(v.videos || []).length ? `
          <h2 class="facim-h2" data-anim="up">Vídeos</h2>
          <div class="facim-videos" data-anim-stagger="80">
            ${v.videos.map((url) => {
              const id = idYoutube(url);
              return id
                ? `<div class="facim-video" data-anim="rise"><iframe src="https://www.youtube.com/embed/${id}" title="Vídeo de ${_escapar(e.nome)}" allowfullscreen loading="lazy"></iframe></div>`
                : `<a href="${_escapar(url)}" class="btn btn-secondary" target="_blank" rel="noopener">Ver vídeo</a>`;
            }).join("")}
          </div>` : ""}
      </div>

      <aside class="facim-perfil-lado" data-anim="up" data-anim-delay="120">
        <div class="facim-ficha">
          <h2 class="facim-ficha-titulo">Ficha</h2>
          <dl>
            ${linhasFicha.map(([r, val]) => `<div><dt>${_escapar(r)}</dt><dd>${_escapar(val)}</dd></div>`).join("")}
          </dl>
        </div>

        ${(_txt(contactos.email) || _txt(contactos.telefone)) ? `
        <div class="facim-ficha facim-ficha-contactos">
          <h2 class="facim-ficha-titulo">Contacto</h2>
          <div class="facim-contactos">
            ${_txt(contactos.telefone) ? `<a href="tel:${_escapar(contactos.telefone).replace(/\s/g, "")}">${icone("phone")} ${_escapar(contactos.telefone)}</a>` : ""}
            ${_txt(contactos.email) ? `<a href="mailto:${_escapar(contactos.email)}">${icone("mail")} ${_escapar(contactos.email)}</a>` : ""}
          </div>
        </div>` : ""}

        <button type="button" class="btn btn-primary facim-btn-bloco" onclick="abrirModalAgendamentoFacim('${slug}')">
          Agendar reunião no stand
        </button>
        <a href="facim.html#vitrine" class="btn btn-secondary facim-btn-bloco">← Voltar à Vitrine Digital</a>
      </aside>
    </section>`;

  window._facimGaleria = galeria;

  if (window.Movimento) {
    window.Movimento.observar(raiz);
    window.Movimento.remedir();
  }
}

/* ── Lightbox simples para a galeria da empresa ── */
function abrirLightboxFacim(indice) {
  const fotos = window._facimGaleria || [];
  if (!fotos.length) return;
  let actual = indice;

  const overlay = document.createElement("div");
  overlay.className = "facim-lightbox";
  overlay.innerHTML = `
    <button type="button" class="facim-lightbox-fechar" aria-label="Fechar">✕</button>
    <button type="button" class="facim-lightbox-nav is-prev" aria-label="Anterior">‹</button>
    <img src="${fotos[actual]}" alt="">
    <button type="button" class="facim-lightbox-nav is-next" aria-label="Seguinte">›</button>
    <span class="facim-lightbox-contador">${actual + 1} / ${fotos.length}</span>`;

  function mover(passo) {
    actual = (actual + passo + fotos.length) % fotos.length;
    overlay.querySelector("img").src = fotos[actual];
    overlay.querySelector(".facim-lightbox-contador").textContent = `${actual + 1} / ${fotos.length}`;
  }
  function fechar() {
    overlay.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", teclado);
  }
  function teclado(ev) {
    if (ev.key === "Escape") fechar();
    if (ev.key === "ArrowRight") mover(1);
    if (ev.key === "ArrowLeft") mover(-1);
  }

  overlay.querySelector(".facim-lightbox-fechar").addEventListener("click", fechar);
  overlay.querySelector(".is-prev").addEventListener("click", () => mover(-1));
  overlay.querySelector(".is-next").addEventListener("click", () => mover(1));
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) fechar();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", teclado);
}

/* ------------------------------------------------------------
   ARRANQUE DA PÁGINA FACIM
   ------------------------------------------------------------ */
async function inicializarFacim() {
  inicializarContagemFacim();
  renderizarCronogramaFacim();

  const grid = document.getElementById("facim-grid");
  _facimCache = await carregarTodasEmpresasFacim();

  // Apuradas primeiro, depois por nome
  _facimCache.sort((a, b) => {
    const aa = a.facim && a.facim.apurada ? 0 : 1;
    const bb = b.facim && b.facim.apurada ? 0 : 1;
    if (aa !== bb) return aa - bb;
    return a.nome.localeCompare(b.nome, "pt");
  });

  if (_facimCache.length === 0 && grid) {
    grid.innerHTML = '<p class="text-body-md text-muted">Não foi possível carregar as empresas.</p>';
    return;
  }

  preencherFiltrosFacim(_facimCache);
  renderizarNumerosFacim(_facimCache);
  renderizarPlantaFacim(_facimCache);
  renderizarConteudosFacim(_facimCache);
  aplicarFiltrosFacim(true, true);

  const refiltrar = () => aplicarFiltrosFacim(true, false);
  document.getElementById("facim-pesquisa")?.addEventListener("input", refiltrar);
  document.getElementById("facim-filtro-sector")?.addEventListener("change", refiltrar);
  document.getElementById("facim-filtro-provincia")?.addEventListener("change", refiltrar);
  document.getElementById("facim-filtro-apuradas")?.addEventListener("change", refiltrar);

  document
    .getElementById("facim-conteudos-apuradas")
    ?.addEventListener("change", () => renderizarConteudosFacim(_facimCache));
  document
    .getElementById("facim-conteudos-falta")
    ?.addEventListener("change", () => renderizarConteudosFacim(_facimCache));

  document.getElementById("facim-limpar")?.addEventListener("click", () => {
    const p = document.getElementById("facim-pesquisa");
    if (p) p.value = "";
    const s = document.getElementById("facim-filtro-sector");
    if (s) s.value = "";
    const pr = document.getElementById("facim-filtro-provincia");
    if (pr) pr.value = "";
    const a = document.getElementById("facim-filtro-apuradas");
    if (a) a.checked = false;
    aplicarFiltrosFacim(true, true);
  });

  // ── Painel de conteúdos: recolhido por omissão (é ferramenta de equipa) ──
  const botaoPainel = document.getElementById("facim-conteudos-toggle");
  const painel = document.getElementById("facim-conteudos-painel");
  if (botaoPainel && painel) {
    botaoPainel.addEventListener("click", () => {
      const aberto = painel.classList.toggle("is-aberto");
      botaoPainel.setAttribute("aria-expanded", aberto ? "true" : "false");
      botaoPainel.querySelector(".facim-toggle-texto").textContent = aberto
        ? "Fechar painel"
        : "Abrir painel detalhado";
      if (window.Movimento) window.Movimento.remedir();
    });
  }

  // As secções mudaram de altura depois de carregar os dados
  if (window.Movimento) window.Movimento.remedir();
}
