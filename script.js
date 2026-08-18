/* ============================================================
   Casa Grande Terraza — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    const fill = loader.querySelector('.ld-fill');
    let pct = 0;
    const tick = setInterval(() => {
      pct += Math.random() * 18;
      if (pct >= 100) {
        pct = 100;
        clearInterval(tick);
        setTimeout(() => loader.classList.add('hide'), 250);
      }
      if (fill) fill.style.width = pct + '%';
    }, 140);
    window.addEventListener('load', () => {
      clearInterval(tick);
      if (fill) fill.style.width = '100%';
      setTimeout(() => loader.classList.add('hide'), 300);
    });
  }

  /* ---------- NAV scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
      ham.classList.toggle('active', open);
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revEls = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(el => io.observe(el));
  } else {
    revEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- COUNTERS (hero + about stats) ---------- */
  const animateCount = (el, target) => {
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const countTargets = document.querySelectorAll('[data-hero-count], [data-count]');
  if (countTargets.length) {
    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const n = el.getAttribute('data-hero-count') || el.getAttribute('data-count');
          if (n) animateCount(el, parseInt(n, 10));
          cIo.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    countTargets.forEach(el => cIo.observe(el));
  }

  /* ---------- ACCENT WORD CYCLE ---------- */
  const accent = document.getElementById('accentCycle');
  if (accent) {
    const words = ['Inolvidables', 'Familiares', 'Exclusivas', 'Empresariales'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      accent.style.opacity = '0';
      setTimeout(() => {
        accent.textContent = words[i];
        accent.style.opacity = '1';
      }, 300);
    }, 2600);
    accent.style.transition = 'opacity .3s ease';
  }

  /* ---------- CONTACT FORM -> WHATSAPP ---------- */
  const form = document.getElementById('cForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = data.get('nombre') || '';
      const telefono = data.get('telefono') || '';
      const fecha = data.get('fecha_evento') || '';
      const invitados = data.get('invitados') || '';
      const tipo = data.get('tipo') || '';
      const mensaje = data.get('mensaje') || '';

      const lines = [
        'Hola, quiero cotizar un evento en Casa Grande Terraza.',
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        fecha ? `Fecha del evento: ${fecha}` : null,
        invitados ? `Número de invitados: ${invitados}` : null,
        tipo ? `Tipo de evento: ${tipo}` : null,
        mensaje ? `Comentarios: ${mensaje}` : null
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/523321337487?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- HERO PARTICLES (rising bubbles) ---------- */
  const canvas = document.getElementById('pcanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, bubbles;
    const hero = document.getElementById('hero');

    const resize = () => {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    };

    const makeBubbles = (count) => {
      bubbles = [];
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: h + Math.random() * h,
          r: 1.5 + Math.random() * 3.5,
          speed: .3 + Math.random() * .8,
          drift: (Math.random() - 0.5) * .4,
          alpha: .12 + Math.random() * .25
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += b.drift;
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 240, 245, ${b.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      resize();
      makeBubbles(Math.min(50, Math.floor(w / 22)));
      draw();
      window.addEventListener('resize', () => { resize(); makeBubbles(Math.min(50, Math.floor(w / 22))); });
    }
  }

});
