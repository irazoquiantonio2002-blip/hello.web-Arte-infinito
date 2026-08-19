(function () {
  document.documentElement.classList.add("js");

  const body = document.body;
  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const loadingScreen = document.getElementById("loading-screen");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loadingScreen?.classList.add("is-hidden");
    }, 350);
  });

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeNav = () => {
    nav?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    header?.classList.remove("nav-active");
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", Boolean(isOpen));
    header?.classList.toggle("nav-active", Boolean(isOpen));
    body.classList.toggle("nav-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  const typewriter = document.getElementById("typewriter");
  const words = ["impresión", "diseño", "rotulación", "promocionales", "marca"];
  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const type = () => {
    if (!typewriter) return;

    const current = words[wordIndex];
    typewriter.textContent = current.slice(0, letterIndex);

    if (!deleting && letterIndex < current.length) {
      letterIndex += 1;
      window.setTimeout(type, 86);
      return;
    }

    if (!deleting && letterIndex === current.length) {
      deleting = true;
      window.setTimeout(type, 1250);
      return;
    }

    if (deleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(type, 44);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(type, 240);
  };

  type();

  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas?.getContext("2d");
  let particles = [];
  let animationId = null;

  const colors = ["#ff1f7a", "#ff8a18", "#21c9ff", "#8f49ff", "#39d98a", "#f6c85f"];

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createParticles = () => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const count = Math.max(34, Math.min(90, Math.floor(rect.width / 18)));

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      radius: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.55 + 0.2
    }));
  };

  const renderParticles = () => {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationId = window.requestAnimationFrame(renderParticles);
  };

  if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resizeCanvas();
    createParticles();
    renderParticles();

    window.addEventListener(
      "resize",
      () => {
        window.cancelAnimationFrame(animationId);
        resizeCanvas();
        createParticles();
        renderParticles();
      },
      { passive: true }
    );
  }
})();
