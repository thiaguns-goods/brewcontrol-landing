(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
    }));
  }

  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -45px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('on'));
  }

  const stage = document.querySelector('.product-shell');
  if (stage && !reduce && window.matchMedia('(pointer:fine)').matches) {
    const host = stage.closest('.product-stage');
    host?.addEventListener('mousemove', (event) => {
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.transform = `rotateY(${(-4.5 + x * 4.5).toFixed(2)}deg) rotateX(${(1.7 - y * 3.5).toFixed(2)}deg)`;
    });
    host?.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateY(-4.5deg) rotateX(1.7deg)';
    });
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
      image.style.transition = 'opacity .75s ease';
    });
    setInterval(() => {
      images[active].style.opacity = '0';
      active = (active + 1) % images.length;
      images[active].style.opacity = '1';
    }, 3600);
  });
})();
