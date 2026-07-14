/* ============================================================
   GALERIA DA HOME — FOTOS INSTITUCIONAIS + VÍDEOS DO YOUTUBE
   ============================================================
   Este ficheiro é AUTÓNOMO: só mexe na secção "Galeria" da home.
   Não toca em nada do que já existe em main.js / data.js.

   COMO ADICIONAR CONTEÚDO
   ------------------------------------------------------------
   1) FOTOS
      - Coloca os ficheiros de imagem dentro de: images/galeria/
      - Acrescenta uma linha no array GALERIA_FOTOS abaixo, ex:
          { arquivo: "feira-fena-2026.jpg", legenda: "Feira FENA 2026" }
      - "arquivo" = nome exacto do ficheiro dentro de images/galeria/
      - "legenda" = texto curto que aparece por cima da foto (opcional)
      - A primeira foto da lista é sempre mostrada em destaque (tile grande).
        As restantes alternam automaticamente entre tamanhos médios,
        largos e altos para criar um mosaico com ritmo — não precisas
        de escolher tamanhos à mão.

   2) VÍDEOS
      - Cola o link do YouTube tal como copiaste (qualquer formato serve:
        youtube.com/watch?v=..., youtu.be/..., ou o link de partilha).
      - Acrescenta uma linha no array GALERIA_VIDEOS abaixo, ex:
          { url: "https://youtu.be/dQw4w9WgXcQ", titulo: "OHOLO Hub na FENA 2026" }
      - O primeiro vídeo da lista aparece em destaque (mais largo).

   Não é preciso mexer em mais nada — a galeria actualiza-se sozinha.
   ============================================================ */

/* ── FOTOS: acrescentar aqui conforme forem chegando ── */

const LIMITES_GALERIA = {
  fotos: 4,
  videos: 4,
};

const GALERIA_FOTOS = [
  { arquivo: "g1.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g2.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g1.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g3.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g8.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g4.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g6.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g5.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g7.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  { arquivo: "g9.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
//   { arquivo: "g1.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
//   { arquivo: "g1.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
//   { arquivo: "g1.jpeg", legenda: "Stand OHOLO Hub — FENA 2026" },
  // { arquivo: "workshop-nampula.jpg",   legenda: "Workshop de capacitação em Nampula" },
];

/* ── VÍDEOS: acrescentar aqui conforme forem chegando ── */
const GALERIA_VIDEOS = [
  { url: "https://www.youtube.com/watch?v=bZoAuyS0uzA&list=PLc5s6-f4bQ7o&index=1", titulo: "OHOLO Hub — Avança o Teu Negócio" },
  { url: "https://www.youtube.com/watch?v=6erfr5xrIP4&list=PLc5s6-f4bQ7o&index=2", titulo: "OHOLO Hub — Versatil" },
  { url: "https://www.youtube.com/watch?v=JzyEKOFziXA&list=PLc5s6-f4bQ7o&index=4", titulo: "OHOLO Hub — Owani" },
  { url: "https://www.youtube.com/watch?v=yFUSWppGZFg&list=PLc5s6-f4bQ7o&index=5", titulo: "OHOLO Hub — B2B com o Instituto da Propriedade Industria" },
  { url: "https://www.youtube.com/watch?v=mFBtQsESOwg&list=PLc5s6-f4bQ7o&index=6", titulo: "B2B com o Instituto para as Pequenas e Médias Empresas" },
  { url: "https://www.youtube.com/watch?v=Ll6kNrhOj6k&list=PLc5s6-f4bQ7o&index=11", titulo: "BOHOLO Hub — Mimos da Cris" },
  { url: "https://www.youtube.com/watch?v=maJjJjbrRy8&list=PLc5s6-f4bQ7o&index=7", titulo: "BOHOLO Hub — Alva Consultores" },
  { url: "https://www.youtube.com/watch?v=0DSkytOhHfA&list=PLc5s6-f4bQ7o&index=8", titulo: "BOHOLO Hub — Sabores do Campo" },
  { url: "https://www.youtube.com/watch?v=WflsNZj45Gc&list=PLc5s6-f4bQ7o&index=10", titulo: "BOHOLO Hub — Natural Pharm" },
  { url: "https://www.youtube.com/watch?v=ImWPFJCGd7A&list=PLc5s6-f4bQ7o&index=12", titulo: "BOHOLO Hub — MarketAccess" },
  { url: "https://www.youtube.com/watch?v=Ab6dL26o_pw&list=PLc5s6-f4bQ7o&index=13", titulo: "BOHOLO Hub — B2B Nedbank" },
  { url: "https://www.youtube.com/watch?v=GYbtnLFakJQ&list=PLc5s6-f4bQ7o&index=14", titulo: "BOHOLO Hub — Watch Me" },
  { url: "https://www.youtube.com/watch?v=LFJNH5Dnzhs&list=PLc5s6-f4bQ7o&index=15", titulo: "BOHOLO Hub — SSP Su" },
  { url: "https://www.youtube.com/watch?v=jZXdcbPM4pA&list=PLc5s6-f4bQ7o&index=16", titulo: "BOHOLO Hub — Ômega 3" },
  { url: "https://www.youtube.com/watch?v=W_T_v7OUPfM&list=PLc5s6-f4bQ7o&index=17", titulo: "BOHOLO Hub — Nutrivida" },
  { url: "https://www.youtube.com/watch?v=XITOSbrL82I&list=PLc5s6-f4bQ7o&index=18", titulo: "BOHOLO Hub — Network Telecommunications" },
];

/* ── Ritmo do mosaico: a 1ª foto é sempre "tile-lg" (destaque).
   As seguintes repetem este padrão para criar um mosaico assimétrico. ── */
const PADRAO_TAMANHOS_FOTO = [
  "tile-md",
  "tile-md",
  "tile-wide",
  "tile-md",
  "tile-tall",
  "tile-md",
  "tile-wide",
  "tile-md",
];

function tamanhoTileFoto(indice) {
  if (indice === 0) return "tile-lg";
  return PADRAO_TAMANHOS_FOTO[(indice - 1) % PADRAO_TAMANHOS_FOTO.length];
}

/* ── Extrai o ID do vídeo de qualquer formato de link do YouTube ── */
function extrairIdYoutube(url = "") {
  const padroes = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const padrao of padroes) {
    const m = url.match(padrao);
    if (m) return m[1];
  }
  return null;
}

/* ============================================================
   RENDER — FOTOS
   ============================================================ */
function renderizarGaleriaFotos() {
  const grid = document.getElementById("galeria-fotos-grid");
  if (!grid) return;

  if (GALERIA_FOTOS.length === 0) {
    grid.innerHTML = `
      <div class="galeria-vazio">
        <span class="icon-circle" style="margin: 0 auto var(--space-sm);">
          <span class="icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-5-4-4 3-3-2-6 5"/></svg></span>
        </span>
        <p class="text-body-md text-muted">Novas fotos institucionais a caminho.</p>
      </div>`;
    return;
  }

  grid.innerHTML = GALERIA_FOTOS.map((foto, i) => `
    <button type="button" class="galeria-item-foto ${tamanhoTileFoto(i)}" data-indice="${i}">
      <img
        src="images/galeria/${foto.arquivo}"
        alt="${foto.legenda || "Foto OHOLO Hub"}"
        loading="lazy"
        onerror="this.closest('.galeria-item-foto').style.display='none'"
      />
      ${foto.legenda ? `<span class="galeria-item-foto-legenda"><span>${foto.legenda}</span></span>` : ""}
    </button>
  `).join("");

  grid.querySelectorAll(".galeria-item-foto").forEach((btn) => {
    btn.addEventListener("click", () => {
      abrirLightboxFoto(parseInt(btn.getAttribute("data-indice"), 10));
    });
  });
}

/* ── Lightbox de fotos (ampliar + navegar) ── */
let _lightboxIndiceActual = 0;

function abrirLightboxFoto(indice) {
  if (!GALERIA_FOTOS[indice]) return;
  _lightboxIndiceActual = indice;

  let overlay = document.getElementById("galeria-lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "galeria-lightbox-overlay";
    overlay.className = "modal-overlay galeria-lightbox";
    overlay.innerHTML = `
      <button type="button" class="modal-close" aria-label="Fechar">
        <span class="icon"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
      </button>
      <button type="button" class="hero-arrow hero-arrow-prev galeria-lightbox-prev" aria-label="Foto anterior">
        <span class="icon"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></span>
      </button>
      <div class="galeria-lightbox-conteudo">
        <img id="galeria-lightbox-img" src="" alt="" />
        <div class="galeria-lightbox-rodape">
          <p id="galeria-lightbox-legenda" class="text-body-md"></p>
          <span id="galeria-lightbox-contador" class="galeria-lightbox-contador"></span>
        </div>
      </div>
      <button type="button" class="hero-arrow hero-arrow-next galeria-lightbox-next" aria-label="Próxima foto">
        <span class="icon"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></span>
      </button>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) fecharLightboxFoto();
    });
    overlay.querySelector(".modal-close").addEventListener("click", fecharLightboxFoto);
    overlay.querySelector(".galeria-lightbox-prev").addEventListener("click", () => navegarLightbox(-1));
    overlay.querySelector(".galeria-lightbox-next").addEventListener("click", () => navegarLightbox(1));
    document.addEventListener("keydown", _tecladoLightbox);
  }

  document.body.style.overflow = "hidden";
  overlay.style.display = "flex";
  _actualizarImagemLightbox();
}

function _actualizarImagemLightbox() {
  const foto = GALERIA_FOTOS[_lightboxIndiceActual];
  if (!foto) return;
  const img = document.getElementById("galeria-lightbox-img");
  const legenda = document.getElementById("galeria-lightbox-legenda");
  const contador = document.getElementById("galeria-lightbox-contador");
  if (img) img.src = `images/galeria/${foto.arquivo}`;
  if (legenda) legenda.textContent = foto.legenda || "";
  if (contador) {
    const n = String(_lightboxIndiceActual + 1).padStart(2, "0");
    const total = String(GALERIA_FOTOS.length).padStart(2, "0");
    contador.textContent = `${n} / ${total}`;
  }
}

function navegarLightbox(passo) {
  _lightboxIndiceActual = (_lightboxIndiceActual + passo + GALERIA_FOTOS.length) % GALERIA_FOTOS.length;
  _actualizarImagemLightbox();
}

function _tecladoLightbox(ev) {
  const overlay = document.getElementById("galeria-lightbox-overlay");
  if (!overlay || overlay.style.display === "none") return;
  if (ev.key === "Escape") fecharLightboxFoto();
  if (ev.key === "ArrowLeft") navegarLightbox(-1);
  if (ev.key === "ArrowRight") navegarLightbox(1);
}

function fecharLightboxFoto() {
  const overlay = document.getElementById("galeria-lightbox-overlay");
  if (overlay) overlay.style.display = "none";
  document.body.style.overflow = "";
}

/* ============================================================
   RENDER — VÍDEOS (YouTube) — com paginação a partir de 5 vídeos
   ============================================================ */
const VIDEOS_POR_PAGINA = 5;
let _paginaVideoActual = 1;
let _videosValidosCache = [];

function renderizarGaleriaVideos() {
  const grid = document.getElementById("galeria-videos-grid");
  if (!grid) return;

  _videosValidosCache = GALERIA_VIDEOS
    .map((v) => ({ ...v, id: extrairIdYoutube(v.url) }))
    .filter((v) => v.id);

  if (_videosValidosCache.length === 0) {
    grid.innerHTML = `
      <div class="galeria-vazio">
        <span class="icon-circle" style="margin: 0 auto var(--space-sm);">
          <span class="icon"><svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></span>
        </span>
        <p class="text-body-md text-muted">Vídeos a caminho — em breve aqui.</p>
      </div>`;
    const paginacao = document.getElementById("galeria-videos-paginacao");
    if (paginacao) paginacao.innerHTML = "";
    return;
  }

  const totalPaginas = Math.max(1, Math.ceil(_videosValidosCache.length / VIDEOS_POR_PAGINA));
  if (_paginaVideoActual > totalPaginas) _paginaVideoActual = totalPaginas;

  const inicio = (_paginaVideoActual - 1) * VIDEOS_POR_PAGINA;
  const videosPagina = _videosValidosCache.slice(inicio, inicio + VIDEOS_POR_PAGINA);

  grid.innerHTML = videosPagina.map((v, i) => `
    <button type="button" class="galeria-item-video ${_paginaVideoActual === 1 && i === 0 ? "tile-lg" : ""}" data-indice="${inicio + i}">
      <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.titulo || "Vídeo OHOLO Hub"}" loading="lazy" />
      <span class="galeria-video-play">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>
      </span>
      ${v.titulo ? `<span class="galeria-item-video-legenda">${v.titulo}</span>` : ""}
    </button>
  `).join("");

  grid.querySelectorAll(".galeria-item-video").forEach((btn) => {
    const indice = parseInt(btn.getAttribute("data-indice"), 10);
    btn.addEventListener("click", () => abrirModalVideo(_videosValidosCache[indice].id));
  });

  renderizarPaginacaoVideos(_videosValidosCache.length, totalPaginas);
}

/**
 * Renderiza os controlos de paginação (Anterior / números / Seguinte)
 * para a galeria de vídeos, só aparece quando há mais de 5 vídeos.
 */
function renderizarPaginacaoVideos(totalItens, totalPaginas) {
  const container = document.getElementById("galeria-videos-paginacao");
  if (!container) return;

  if (totalItens <= VIDEOS_POR_PAGINA || totalPaginas <= 1) {
    container.innerHTML = "";
    return;
  }

  const botoes = [];

  botoes.push(
    `<button type="button" class="btn btn-secondary" data-pagina-video="${_paginaVideoActual - 1}" ${_paginaVideoActual === 1 ? "disabled" : ""} style="padding: var(--space-sm) var(--space-md);">‹ Anterior</button>`,
  );

  for (let p = 1; p <= totalPaginas; p++) {
    const activo = p === _paginaVideoActual;
    botoes.push(
      `<button type="button" class="btn ${activo ? "btn-primary" : "btn-secondary"}" data-pagina-video="${p}" style="min-width:40px; padding: var(--space-sm);">${p}</button>`,
    );
  }

  botoes.push(
    `<button type="button" class="btn btn-secondary" data-pagina-video="${_paginaVideoActual + 1}" ${_paginaVideoActual === totalPaginas ? "disabled" : ""} style="padding: var(--space-sm) var(--space-md);">Seguinte ›</button>`,
  );

  container.innerHTML = botoes.join("");

  container.querySelectorAll("[data-pagina-video]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const novaPagina = parseInt(btn.getAttribute("data-pagina-video"), 10);
      if (Number.isNaN(novaPagina) || novaPagina < 1 || novaPagina > totalPaginas) return;
      _paginaVideoActual = novaPagina;
      renderizarGaleriaVideos();
      document.getElementById("galeria-videos-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ── Modal de vídeo (embed do YouTube) ── */
function abrirModalVideo(idYoutube) {
  fecharModalVideo();

  const overlay = document.createElement("div");
  overlay.id = "galeria-video-overlay";
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="galeria-video-modal-card">
      <button type="button" class="modal-close" aria-label="Fechar">
        <span class="icon"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></span>
      </button>
      <div class="galeria-video-frame">
        <iframe
          src="https://www.youtube.com/embed/${idYoutube}?autoplay=1&rel=0"
          title="Vídeo OHOLO Hub"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) fecharModalVideo();
  });
  overlay.querySelector(".modal-close").addEventListener("click", fecharModalVideo);
  document.addEventListener("keydown", _escListenerVideo);
}

function _escListenerVideo(ev) {
  if (ev.key === "Escape") fecharModalVideo();
}

function fecharModalVideo() {
  const overlay = document.getElementById("galeria-video-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
  document.removeEventListener("keydown", _escListenerVideo);
}

function configurarVerMais({ grid, wrapId, botaoId, seletorItem, limite, textoMais, textoMenos }) {
  const wrap = document.getElementById(wrapId);
  const botao = document.getElementById(botaoId);
  if (!wrap || !botao || !grid) return;

  const itens = grid.querySelectorAll(seletorItem);
  const total = itens.length;

  if (total <= limite) {
    wrap.style.display = "none";
    return;
  }

  wrap.style.display = "flex";
  botao.classList.remove("is-expandido");
  botao.querySelector(".galeria-ver-mais-texto").textContent = textoMais;

  itens.forEach((el, i) => {
    if (i >= limite) el.classList.add("is-oculto");
  });

  botao.onclick = () => {
    const expandido = botao.classList.toggle("is-expandido");
    itens.forEach((el, i) => {
      if (i >= limite) el.classList.toggle("is-oculto", !expandido);
    });
    botao.querySelector(".galeria-ver-mais-texto").textContent = expandido ? textoMenos : textoMais;
    if (!expandido) wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
}

/* ============================================================
   TABS — alternar entre Fotos e Vídeos
   ============================================================ */
function inicializarTabsGaleria() {
  const tabs = document.querySelectorAll("[data-galeria-tab]");
  const paineis = document.querySelectorAll("[data-galeria-painel]");
  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const alvo = tab.getAttribute("data-galeria-tab");
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      paineis.forEach((p) => {
        p.classList.toggle("is-active", p.getAttribute("data-galeria-painel") === alvo);
      });
    });
  });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderizarGaleriaFotos();
  renderizarGaleriaVideos();
  inicializarTabsGaleria();
});