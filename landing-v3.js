(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  const closeMenu = () => {
    if (!menu || !nav) return;
    nav.classList.remove('mobile-open');
    menu.setAttribute('aria-expanded', 'false');
  };

  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) closeMenu();
    });
  }

  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('on'));
  }

  const stage = document.querySelector('.product-shell');
  if (stage && !reduce && window.matchMedia('(pointer:fine)').matches) {
    const host = stage.closest('.product-stage');
    host?.addEventListener('mousemove', (e) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      stage.style.transform = `rotateY(${(-5 + x * 5).toFixed(2)}deg) rotateX(${(2 - y * 4).toFixed(2)}deg)`;
    });
    host?.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateY(-5deg) rotateX(2deg)';
    });
  }

  document.querySelectorAll('[data-demo-cycle]').forEach((media) => {
    const imgs = Array.from(media.querySelectorAll('img[data-cycle]'));
    if (imgs.length < 2 || reduce) return;
    let active = 0;
    imgs.forEach((img, index) => {
      img.style.position = 'absolute';
      img.style.inset = '0';
      img.style.opacity = index ? '0' : '1';
      img.style.transition = 'opacity .75s ease';
    });
    window.setInterval(() => {
      imgs[active].style.opacity = '0';
      active = (active + 1) % imgs.length;
      imgs[active].style.opacity = '1';
    }, 3500);
  });
})();
