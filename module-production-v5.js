(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const stage = document.querySelector('.product-window');

  if (menu && nav) {
    const closeMenu = () => {
      nav.classList.remove('mobile-open');
      nav.removeAttribute('style');
      nav.querySelectorAll('a').forEach((link) => link.removeAttribute('style'));
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Abrir menu');
      document.body.style.removeProperty('overflow');
    };
    const openMenu = () => {
      nav.classList.add('mobile-open');
      nav.style.cssText = 'display:flex;position:fixed;top:76px;left:14px;right:14px;z-index:120;flex-direction:column;align-items:stretch;gap:2px;padding:12px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(7,17,22,.98);box-shadow:0 24px 70px rgba(0,0,0,.45);';
      nav.querySelectorAll('a').forEach((link) => { link.style.cssText = 'display:block;padding:13px 12px;border-radius:11px;'; });
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', 'Fechar menu');
      document.body.style.overflow = 'hidden';
    };
    menu.addEventListener('click', () => nav.classList.contains('mobile-open') ? closeMenu() : openMenu());
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && nav.classList.contains('mobile-open')) closeMenu();
      if (window.innerWidth <= 720 && nav.classList.contains('mobile-open')) nav.style.top = '68px';
    }, { passive: true });
  }

  if (!reduce && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('on');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('on'));
  }

  if (stage && !reduce && !coarse) {
    let frame = 0;
    let pointer = null;
    const render = () => {
      frame = 0;
      if (!pointer) return;
      const rect = stage.getBoundingClientRect();
      const x = (pointer.clientX - rect.left) / rect.width - .5;
      const y = (pointer.clientY - rect.top) / rect.height - .5;
      stage.style.transform = `rotateY(${(-1.6 + x * 2.2).toFixed(2)}deg) rotateX(${(.45 - y * 1.5).toFixed(2)}deg)`;
    };
    stage.addEventListener('pointermove', (event) => {
      pointer = event;
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      pointer = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      stage.style.transform = 'rotateY(-2.2deg) rotateX(.7deg)';
    });
  }

  const demoHosts = Array.from(document.querySelectorAll('[data-demo-key]'));
  if (!demoHosts.length) return;

  fetch('media/demos/manifest.json', { cache: 'no-cache' })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('manifest unavailable')))
    .then((manifest) => {
      demoHosts.forEach((host) => {
        const key = host.dataset.demoKey;
        const demo = manifest?.demos?.[key];
        const video = host.querySelector('video');
        const badge = host.querySelector('.video-badge span');
        if (!demo || !demo.available || !video || reduce) {
          if (badge) badge.textContent = 'INTERFACE REAL';
          return;
        }

        video.innerHTML = '';
        const webm = document.createElement('source');
        webm.src = demo.webm;
        webm.type = 'video/webm';
        const mp4 = document.createElement('source');
        mp4.src = demo.mp4;
        mp4.type = 'video/mp4';
        video.append(webm, mp4);
        video.poster = demo.poster;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', demo.title || 'Demonstração do BrewControl');
        host.classList.add('video-ready');
        if (badge) badge.textContent = 'DEMO REAL · LOOP';

        const play = () => video.play().catch(() => {});
        const pause = () => video.pause();
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => entry.isIntersecting && !document.hidden ? play() : pause());
          }, { rootMargin: '120px 0px', threshold: 0.05 });
          observer.observe(host);
          document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
        } else {
          play();
        }
      });
    })
    .catch(() => {
      demoHosts.forEach((host) => {
        const badge = host.querySelector('.video-badge span');
        if (badge) badge.textContent = 'INTERFACE REAL';
      });
    });
})();
