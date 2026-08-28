/* ============================================================
   OHOLO HUB — CAMADA DE ANIMAÇÃO (GSAP + ScrollTrigger + Lenis)
   ============================================================
   Esta camada assenta por cima do motion.js, que já trata das
   revelações [data-anim], dos contadores, do header e dos
   botões magnéticos. Aqui entra só o que o motion.js não faz:

     1. Scroll suave (Lenis)
     2. Coreografia de entrada da página (cortina + hero)
     3. Parallax da fotografia do hero, preso ao scroll
     4. Cascata das grelhas (cartões, peças da galeria)
     5. Cursor personalizado
     6. Transição entre páginas

   Se o GSAP não carregar, nada disto acontece e o site continua
   a funcionar exactamente como antes — o motion.js é a base.
   Com prefers-reduced-motion, esta camada não arranca de todo.
   ============================================================ */

/* ── Rede de segurança das revelações ──────────────────────────
   Nada no site pode ficar invisível à espera de uma animação que
   não chegou (separador em segundo plano, observer que não
   disparou, script que falhou). Passados uns segundos, tudo o que
   já está dentro do ecrã e continua escondido é mostrado. */
(function () {
  "use strict";

  function revelarOQueFicouParaTras() {
    const altura = window.innerHeight;

    document.querySelectorAll("[data-anim]:not(.is-in)").forEach((el) => {
      const caixa = el.getBoundingClientRect();
      if (caixa.top < altura && caixa.bottom > 0) {
        el.classList.add("is-in");
        el.querySelectorAll(".linha-mascara").forEach((l) =>
          l.classList.add("is-in"),
        );
      }
    });
  }

  window.addEventListener("load", () => {
    setTimeout(revelarOQueFicouParaTras, 2500);
  });

  // Ao voltar de um separador em segundo plano, apanha o que ficou por revelar
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setTimeout(revelarOQueFicouParaTras, 1200);
  });
})();

(function () {
  "use strict";

  const semMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (semMovimento) return;

  const CDN = {
    gsap: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    scrollTrigger:
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
    lenis: "https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js",
  };

  function carregarScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = () => reject(new Error("falhou: " + src));
      document.head.appendChild(s);
    });
  }

  /* ============================================================
     1. SCROLL SUAVE
     ============================================================ */
  function iniciarScrollSuave(gsap, ScrollTrigger) {
    if (typeof Lenis === "undefined") return null;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);

    // Âncoras: o motion.js tem o seu próprio handler com window.scrollTo, que
    // com o Lenis activo daria um salto seco seguido da animação. Este corre
    // na fase de captura e trava o outro, para haver só um movimento.
    document.addEventListener(
      "click",
      (ev) => {
        const link = ev.target.closest('a[href^="#"]');
        if (!link) return;

        const id = link.getAttribute("href").slice(1);
        const alvo = id && document.getElementById(id);
        if (!alvo) return;

        ev.preventDefault();
        ev.stopImmediatePropagation();
        lenis.scrollTo(alvo, { offset: -92, duration: 1.1 });
        history.replaceState(null, "", `#${id}`);
      },
      true,
    );

    return lenis;
  }

  /* ============================================================
     2. ENTRADA DA PÁGINA — cortina + hero
     ============================================================ */
  function criarCortina() {
    const cortina = document.createElement("div");
    cortina.className = "oh-cortina";
    cortina.innerHTML = `
      <span class="oh-cortina-marca">OHOLO <em>HUB</em></span>
      <span class="oh-cortina-linha"><i></i></span>`;
    document.body.appendChild(cortina);
    return cortina;
  }

  function entradaDaPagina(gsap) {
    // Num separador em segundo plano o requestAnimationFrame fica parado e a
    // cortina ficaria colada ao ecrã. Nesse caso não há entrada nenhuma.
    if (document.hidden) return null;

    const cortina = criarCortina();
    const linha = cortina.querySelector(".oh-cortina-linha i");
    const marca = cortina.querySelector(".oh-cortina-marca");

    // Só se anima o que o motion.js NÃO controla. Um gsap.from() num
    // elemento com [data-anim] leria a opacidade actual (0) como estado
    // final e deixava-o invisível para sempre — era o que acontecia ao
    // título do hero da FACIM.
    const doMotion = (el) =>
      el.hasAttribute("data-anim") || el.hasAttribute("data-anim-linhas");

    const heroTitulo = [
      ...document.querySelectorAll(
        ".hero-slide.is-active .hero-slide-title, .facim-hero-titulo",
      ),
    ].filter((el) => !doMotion(el))[0];

    const heroResto = [
      ...document.querySelectorAll(
        ".hero-slide.is-active .hero-pill, .hero-slide.is-active .hero-slide-sub, .hero-slide.is-active .hero-slide-cta, .oh-hero-controlos, .oh-scroll",
      ),
    ].filter((el) => !doMotion(el));

    const tl = gsap.timeline();

    tl.set(document.body, { overflow: "hidden" })
      .fromTo(marca, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(linha, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.1)
      .to(marca, { opacity: 0, duration: 0.3 }, ">-0.1")
      .to(cortina, {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        onComplete: () => cortina.remove(),
      })
      .set(document.body, { overflow: "" });

    if (heroTitulo) {
      tl.from(
        heroTitulo,
        { yPercent: 12, opacity: 0, duration: 1, ease: "expo.out" },
        "-=0.55",
      );
    }

    if (heroResto.length) {
      tl.from(
        heroResto,
        {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
        },
        "-=0.7",
      );
    }

    // Rede de segurança: se por alguma razão a linha do tempo não correr
    // (separador escondido, ticker parado), força o fim e liberta a página.
    setTimeout(() => {
      if (tl.progress() < 1) tl.progress(1);
      document.querySelectorAll(".oh-cortina").forEach((c) => c.remove());
      document.body.style.overflow = "";
    }, 4000);

    return tl;
  }

  /* ============================================================
     2b. HEADER REACTIVO — igual em todas as páginas
     ============================================================
     A regra é a da FACIM: desce-se e o header recolhe, sobe-se e
     volta. Passou dos 24px, encolhe e mostra o fio de progresso.
     Por cima de um [data-hero-escuro], fica transparente.

     O motion.js tem esta mesma lógica, mas com o Lenis a mandar no
     scroll as duas versões pisavam-se. Marca-se a bandeira
     "tem-header-gsap" e o motion.js deixa o header em paz. */
  function headerReactivo(gsap, ScrollTrigger) {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    document.documentElement.classList.add("tem-header-gsap");

    const progresso = navbar.querySelector(".navbar-progresso");
    let heroEscuro = document.querySelector("[data-hero-escuro]");

    const LIMIAR_ENCOLHER = 24;
    const LIMIAR_RECOLHER = 240;

    function actualizar(y, direccao) {
      const menuAberto = navbar.classList.contains("is-menu-aberto");

      navbar.classList.toggle("is-scrolled", y > LIMIAR_ENCOLHER);
      navbar.classList.toggle(
        "is-hidden",
        direccao === 1 && y > LIMIAR_RECOLHER && !menuAberto,
      );

      if (heroEscuro) {
        const limite =
          heroEscuro.offsetTop + heroEscuro.offsetHeight - navbar.offsetHeight;
        navbar.classList.toggle("is-over", y < limite);
      }

      if (progresso) {
        const alturaDoc =
          document.documentElement.scrollHeight - window.innerHeight;
        progresso.style.setProperty(
          "--progresso",
          alturaDoc > 0 ? (y / alturaDoc).toFixed(4) : 0,
        );
      }
    }

    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight,
      onUpdate: (self) => actualizar(self.scroll(), self.direction),
      onRefresh: () => {
        // a ficha da empresa é desenhada por JS: o hero escuro só existe depois
        heroEscuro = document.querySelector("[data-hero-escuro]");
        actualizar(window.scrollY, -1);
      },
    });

    actualizar(window.scrollY, -1);

    // O menu no telemóvel não pode ficar preso com o header recolhido
    const toggle = navbar.querySelector(".navbar-toggle");
    toggle &&
      toggle.addEventListener("click", () =>
        navbar.classList.remove("is-hidden"),
      );
  }

  /* ============================================================
     3. PARALLAX DO HERO
     ============================================================ */
  function parallaxHero(gsap, ScrollTrigger) {
    const slider = document.getElementById("hero-slider");
    if (!slider) return;

    gsap.to(slider.querySelectorAll(".hero-slide-img"), {
      yPercent: 14,
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: slider,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    const conteudo = slider.querySelector(".hero-slide.is-active .hero-slide-content");
    if (conteudo) {
      gsap.to(conteudo, {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: slider,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  /* ============================================================
     4. CASCATA DAS GRELHAS
     ============================================================
     O motion.js revela o contentor; aqui as peças de dentro
     entram uma a uma. Como são geradas por JS depois do
     arranque, observa-se a grelha e liga-se quando aparecerem. */
  function cascataDasGrelhas(gsap, ScrollTrigger) {
    const grelhas = [
      { selector: "#galeria-fotos-grid", item: ".galeria-item-foto" },
      { selector: "#galeria-videos-grid", item: ".galeria-item-video" },
      { selector: "#empresas-grid", item: ".explore-card" },
      { selector: "#empresas-destaque", item: ".card" },
      { selector: "#facim-grid", item: ".facim-card" },
    ];

    grelhas.forEach(({ selector, item }) => {
      const grelha = document.querySelector(selector);
      if (!grelha) return;

      const animar = () => {
        // As peças com [data-anim] pertencem ao motion.js — não se tocam,
        // senão ficam presas no estado escondido.
        const pecas = [
          ...grelha.querySelectorAll(
            `${item}:not([data-oh-animado]):not([data-anim])`,
          ),
        ];
        if (pecas.length === 0) return;

        pecas.forEach((p) => p.setAttribute("data-oh-animado", "1"));

        ScrollTrigger.batch(pecas, {
          start: "top 92%",
          once: true,
          onEnter: (lote) =>
            // fromTo, e não from: o estado final fica escrito, nunca lido
            gsap.fromTo(
              lote,
              { y: 34, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: "expo.out",
                stagger: 0.07,
                overwrite: true,
                clearProps: "transform,opacity",
              },
            ),
        });
      };

      animar();
      new MutationObserver(animar).observe(grelha, { childList: true });
    });
  }

  /* ============================================================
     5. CURSOR PERSONALIZADO
     ============================================================ */
  function cursorPersonalizado(gsap) {
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "oh-cursor";
    cursor.innerHTML = '<span class="oh-cursor-rotulo">Ver</span>';
    document.body.appendChild(cursor);
    document.body.classList.add("tem-cursor-oholo");

    const paraX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const paraY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });

    window.addEventListener(
      "mousemove",
      (ev) => {
        paraX(ev.clientX);
        paraY(ev.clientY);
      },
      { passive: true },
    );

    const alvosMedia =
      ".galeria-item-foto, .galeria-item-video, .facim-card, .explore-card, .card";

    document.addEventListener("mouseover", (ev) => {
      const alvo = ev.target.closest(alvosMedia);
      const clicavel = ev.target.closest("a, button, input, select, textarea");
      cursor.classList.toggle("is-media", !!alvo);
      cursor.classList.toggle("is-activo", !!clicavel || !!alvo);
    });

    document.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-activo", "is-media"),
    );
  }

  /* ============================================================
     6. TRANSIÇÃO ENTRE PÁGINAS
     ============================================================ */
  function transicaoDePagina(gsap) {
    const interno = (a) => {
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;
      if (a.target === "_blank") return false;
      try {
        return new URL(a.href, location.href).origin === location.origin;
      } catch (e) {
        return false;
      }
    };

    document.addEventListener("click", (ev) => {
      const a = ev.target.closest("a");
      if (!a || !interno(a) || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;

      ev.preventDefault();
      const destino = a.href;

      const cortina = criarCortina();
      gsap.set(cortina, { yPercent: 100 });
      gsap.to(cortina, {
        yPercent: 0,
        duration: 0.55,
        ease: "expo.inOut",
        onComplete: () => {
          window.location.href = destino;
        },
      });
    });

    // Voltar atrás no browser não pode deixar a cortina para trás
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) {
        document.querySelectorAll(".oh-cortina").forEach((c) => c.remove());
      }
    });
  }

  /* ============================================================
     ARRANQUE
     ============================================================ */
  async function iniciar() {
    try {
      await carregarScript(CDN.gsap);
      await Promise.all([
        carregarScript(CDN.scrollTrigger),
        carregarScript(CDN.lenis).catch(() => null),
      ]);
    } catch (err) {
      console.warn("[oholo] GSAP não carregou; fica só o motion.js.", err);
      return;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("tem-gsap");

    iniciarScrollSuave(gsap, ScrollTrigger);
    headerReactivo(gsap, ScrollTrigger);
    entradaDaPagina(gsap);
    parallaxHero(gsap, ScrollTrigger);
    cascataDasGrelhas(gsap, ScrollTrigger);
    cursorPersonalizado(gsap);
    transicaoDePagina(gsap);

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
