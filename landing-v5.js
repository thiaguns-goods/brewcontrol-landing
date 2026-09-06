(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menu && nav) {
    const closeMenu = () => {
      nav.classList.remove('mobile-open');
      nav.removeAttribute('style');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
      document.body.style.removeProperty('overflow');
    };
    const openMenu = () => {
      nav.classList.add('mobile-open');
      nav.style.cssText = 'display:flex;position:fixed;top:76px;left:14px;right:14px;z-index:120;flex-direction:column;align-items:stretch;gap:2px;padding:12px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(7,17,22,.94);backdrop-filter:blur(22px) saturate(125%);box-shadow:0 24px 70px rgba(0,0,0,.45);';
      nav.querySelectorAll('a').forEach((link) => {
        link.style.cssText = 'display:block;padding:13px 12px;border-radius:11px;';
      });
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', 'Fechar menu');
      document.body.style.overflow = 'hidden';
    };
    menu.addEventListener('click', () => {
      nav.classList.contains('mobile-open') ? closeMenu() : openMenu();
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && nav.classList.contains('mobile-open')) closeMenu();
      if (window.innerWidth <= 700 && nav.classList.contains('mobile-open')) nav.style.top = '68px';
    }, { passive: true });
  }

  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -45px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('on'));
  }

  document.querySelectorAll('[data-demo-cycle]').forEach((media) => {
    const images = Array.from(media.querySelectorAll('img[data-cycle]'));
    if (images.length < 2 || reduce) return;
    media.style.position = 'relative';
    let active = 0;
    images.forEach((image, index) => {
      image.style.position = 'absolute';
      image.style.inset = '0';
      image.style.opacity = index ? '0' : '1';
      image.style.transition = 'opacity .8s ease, transform 4s ease';
      if (!index) image.style.transform = 'scale(1.015)';
    });
    setInterval(() => {
      images[active].style.opacity = '0';
      images[active].style.transform = 'scale(1.04)';
      active = (active + 1) % images.length;
      images[active].style.opacity = '1';
      images[active].style.transform = 'scale(1.015)';
    }, 3900);
  });

  const stage = document.querySelector('.product-stage');
  const shell = document.querySelector('.product-shell');
  if (stage && shell && !reduce && !coarse) {
    stage.addEventListener('mousemove', (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      shell.style.transform = `rotateY(${(-4 + x * 4.6).toFixed(2)}deg) rotateX(${(1.5 - y * 3.4).toFixed(2)}deg) translateY(${(-Math.abs(x) * 2).toFixed(1)}px)`;
      stage.querySelectorAll('.float-card').forEach((card, i) => {
        const depth = 7 + i * 2;
        card.style.translate = `${(x * depth).toFixed(1)}px ${(y * depth).toFixed(1)}px`;
      });
    });
    stage.addEventListener('mouseleave', () => {
      shell.style.transform = 'rotateY(-4deg) rotateX(1.5deg)';
      stage.querySelectorAll('.float-card').forEach((card) => { card.style.translate = ''; });
    });
  }

  if (!reduce) {
    const parallax = Array.from(document.querySelectorAll('[data-parallax]'));
    let ticking = false;
    const updateParallax = () => {
      const viewport = window.innerHeight || 1;
      parallax.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewport + 120) return;
        const speed = Number(el.dataset.parallax || .08);
        const offset = ((rect.top + rect.height / 2) - viewport / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const requestParallax = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    requestParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax, { passive: true });
  }

  const hero = document.querySelector('.hero');
  if (hero && !reduce && !coarse) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      hero.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    }, { passive: true });
  }
})();
