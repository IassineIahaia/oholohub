/* ============================================================
   OHOLO HUB — MOTOR DE MOVIMENTO
   ------------------------------------------------------------
   Autónomo, sem bibliotecas externas. Faz o trabalho que se
   costuma pedir ao GSAP + ScrollTrigger:

     · revelações ao entrar no ecrã, com cascata
     · parallax ligado ao scroll
     · contadores com desaceleração
     · header que se esconde, se solidifica e mostra progresso
     · barra lateral de secções com secção activa
     · botões magnéticos

   Tudo em transform/opacity (compositado pela GPU) e num único
   requestAnimationFrame. Desliga-se inteiro em
   prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  const semMovimento =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Utilitários ────────────────────────────────────────── */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
  // expo.out — a curva que dá a sensação de travagem suave
  const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  /* ============================================================
     1. REVELAÇÕES
     ============================================================ */
  let observador = null;

  function prepararCascata(raiz = document) {
    $$("[data-anim-stagger]", raiz).forEach((grupo) => {
      const passo = parseInt(grupo.getAttribute("data-anim-stagger"), 10) || 70;
      grupo.style.setProperty("--stagger-passo", `${passo}ms`);
      Array.from(grupo.children).forEach((filho, i) => {
        if (filho.hasAttribute("data-anim")) filho.style.setProperty("--i", i);
      });
    });
  }

  function prepararAtrasos(raiz = document) {
    $$("[data-anim-delay]", raiz).forEach((el) => {
      el.style.setProperty("--anim-delay", `${el.getAttribute("data-anim-delay")}ms`);
    });
  }

  /** Parte o texto em linhas mascaradas, para o título subir por trás de um corte. */
  function prepararLinhasMascara(raiz = document) {
    $$("[data-anim-linhas]", raiz).forEach((el) => {
      if (el.dataset.linhasProntas) return;
      const passo = parseInt(el.getAttribute("data-anim-linhas"), 10) || 90;
      const partes = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = partes
        .map(
          (p, i) =>
            `<span class="linha-mascara" style="--anim-delay:${i * passo}ms"><span>${p.trim()}</span></span>`,
        )
        .join("");
      el.dataset.linhasProntas = "1";
      // O anfitrião passa a ser observável — é ele que dispara as linhas
      if (!el.hasAttribute("data-anim")) el.setAttribute("data-anim", "fade");
    });
  }

  function revelar(el) {
    el.classList.add("is-in");
    if (el.classList.contains("linha-mascara")) return;
    $$(".linha-mascara", el).forEach((l) => l.classList.add("is-in"));
    const contadores = el.hasAttribute("data-count") ? [el] : $$("[data-count]", el);
    contadores.forEach(animarContador);
    el.addEventListener(
      "transitionend",
      () => el.classList.add("is-done"),
      { once: true },
    );
  }

  function observarNovos(raiz = document) {
    prepararAtrasos(raiz);
    prepararCascata(raiz);
    prepararLinhasMascara(raiz);

    const alvos = $$("[data-anim]:not(.is-in)", raiz);
    if (semMovimento || !("IntersectionObserver" in window)) {
      alvos.forEach(revelar);
      $$(".linha-mascara", raiz).forEach((l) => l.classList.add("is-in"));
      $$("[data-count]", raiz).forEach(animarContador);
      return;
    }
    alvos.forEach((el) => observador.observe(el));
  }

  function iniciarRevelacoes() {
    if (!semMovimento && "IntersectionObserver" in window) {
      observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            revelar(e.target);
            observador.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
    }
    observarNovos(document);
  }

  /* ============================================================
     2. CONTADORES
     ============================================================ */
  function animarContador(el) {
    if (el.dataset.contado === "1") return;
    const alvo = parseFloat(el.getAttribute("data-count"));
    if (Number.isNaN(alvo)) return;
    el.dataset.contado = "1";

    const sufixo = el.getAttribute("data-count-sufixo") || "";
    if (semMovimento) {
      el.textContent = alvo + sufixo;
      return;
    }

    const duracao = 1400;
    const inicio = performance.now();
    (function passo(agora) {
      const p = limitar((agora - inicio) / duracao, 0, 1);
      el.textContent = Math.round(expoOut(p) * alvo) + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    })(inicio);
  }

  /* ============================================================
     3. SCROLL — header, progresso, parallax, secção activa
     ============================================================ */
  const navbar = $(".navbar");
  const progresso = $(".navbar-progresso");
  const rail = $(".secoes-rail");
  const fita = $(".secoes-fita");
  const heroEscuro = $("[data-hero-escuro]");

  let elementosParallax = [];
  let ligacoesSeccao = [];
  let seccoes = [];

  let ultimoY = window.scrollY;
  let aguardaFrame = false;
  let seccaoActual = "";

  function medir() {
    // Altura real do header — o CSS usa-a para o scroll-padding e para a fita
    if (navbar) {
      document.documentElement.style.setProperty(
        "--nav-altura",
        `${Math.round(navbar.offsetHeight)}px`,
      );
    }

    elementosParallax = $$("[data-parallax]").map((el) => ({
      el,
      factor: parseFloat(el.getAttribute("data-parallax")) || 0.1,
    }));

    ligacoesSeccao = $$("[data-seccao-link]");
    seccoes = ligacoesSeccao
      .map((a) => {
        const alvo = document.getElementById(a.getAttribute("href").replace("#", ""));
        return alvo ? { id: alvo.id, el: alvo } : null;
      })
      .filter(Boolean);
    // remove duplicados (rail + fita apontam para os mesmos ids)
    const vistos = new Set();
    seccoes = seccoes.filter((s) => (vistos.has(s.id) ? false : vistos.add(s.id)));
  }

  function aoRolar() {
    const y = window.scrollY;
    const alturaDoc = document.documentElement.scrollHeight - window.innerHeight;

    /* ── Header ── */
    if (navbar) {
      navbar.classList.toggle("is-scrolled", y > 24);

      const menuAberto = navbar.classList.contains("is-menu-aberto");
      const desceu = y > ultimoY && y > 220;
      navbar.classList.toggle("is-hidden", desceu && !menuAberto && !semMovimento);

      if (heroEscuro) {
        const limite = heroEscuro.offsetTop + heroEscuro.offsetHeight - 80;
        navbar.classList.toggle("is-over", y < limite);
      }
    }

    /* ── Fio de progresso ── */
    if (progresso && alturaDoc > 0) {
      progresso.style.setProperty("--progresso", (y / alturaDoc).toFixed(4));
    }

    /* ── Parallax ── */
    if (!semMovimento) {
      const meio = window.innerHeight / 2;
      elementosParallax.forEach(({ el, factor }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const desvio = (r.top + r.height / 2 - meio) * factor;
        el.style.transform = `translate3d(0, ${desvio.toFixed(2)}px, 0)`;
      });
    }

    /* ── Secção activa + visibilidade da navegação lateral ── */
    if (seccoes.length) {
      const linha = y + window.innerHeight * 0.32;
      let activa = seccoes[0].id;
      for (const s of seccoes) {
        if (s.el.offsetTop <= linha) activa = s.id;
      }
      if (activa !== seccaoActual) {
        seccaoActual = activa;
        ligacoesSeccao.forEach((a) =>
          a.classList.toggle("is-activa", a.getAttribute("href") === `#${activa}`),
        );
      }

      const mostrar = y > window.innerHeight * 0.55 && y < alturaDoc - 240;
      rail && rail.classList.toggle("is-visivel", mostrar);
      fita && fita.classList.toggle("is-visivel", mostrar);
    }

    ultimoY = y;
    aguardaFrame = false;
  }

  function pedirFrame() {
    if (aguardaFrame) return;
    aguardaFrame = true;
    requestAnimationFrame(aoRolar);
  }

  /* ============================================================
     4. BOTÕES MAGNÉTICOS
     ============================================================ */
  function iniciarMagneticos() {
    if (semMovimento || !window.matchMedia("(hover: hover)").matches) return;
    $$(".magnetico").forEach((el) => {
      el.addEventListener("mousemove", (ev) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) * 0.22;
        const y = (ev.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ============================================================
     5. ÂNCORAS SUAVES  (respeitando a altura do header)
     ============================================================ */
  function iniciarAncoras() {
    document.addEventListener("click", (ev) => {
      const link = ev.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const alvo = document.getElementById(id);
      if (!alvo) return;

      ev.preventDefault();
      const topo =
        alvo.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight + 12 : 0);
      window.scrollTo({ top: topo, behavior: semMovimento ? "auto" : "smooth" });
      history.replaceState(null, "", `#${id}`);

      // o header não deve tapar o destino
      navbar && navbar.classList.remove("is-hidden");
    });
  }

  /* ============================================================
     6. ARRANQUE
     ============================================================ */
  function iniciar() {
    iniciarRevelacoes();
    iniciarMagneticos();
    iniciarAncoras();
    medir();
    aoRolar();

    window.addEventListener("scroll", pedirFrame, { passive: true });
    window.addEventListener("resize", () => {
      medir();
      pedirFrame();
    });

    // Quando o menu mobile abre, o header não se pode esconder
    const toggle = $(".navbar-toggle");
    const links = $(".navbar-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        requestAnimationFrame(() =>
          navbar.classList.toggle("is-menu-aberto", links.classList.contains("is-open")),
        );
      });
      links.addEventListener("click", () => navbar.classList.remove("is-menu-aberto"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  /* ── API pública: conteúdo injectado depois (cartões, tabelas) ── */
  window.Movimento = {
    observar: observarNovos,
    contar: (el) => (el ? animarContador(el) : null),
    remedir: () => {
      medir();
      pedirFrame();
    },
    semMovimento,
  };
})();
