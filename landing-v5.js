(() => {
  'use strict';

  /* Small override sheet kept separate so the visual/performance pass is easy to review or revert. */
  if (!document.querySelector('link[data-v5-performance]')) {
    const perfStyles = document.createElement('link');
    perfStyles.rel = 'stylesheet';
    perfStyles.href = 'landing-v5-performance.css?v=20260906b';
    perfStyles.dataset.v5Performance = 'true';
    document.head.appendChild(perfStyles);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');

  /* Keep Home labels aligned with the current module truth while the static root copy is under the pre-merge truth gate. */
  const fiscalCard = document.querySelector('a.module-card[href="modulo-fiscal.html"]');
  const pdvMobileCard = document.querySelector('a.module-card[href="modulo-pdv-mobile.html"]');
  if (fiscalCard) {
    const copy = fiscalCard.querySelector('p');
    if (copy) copy.textContent = 'Infraestrutura de NF-e e NFC-e em hardening e homologação.';
  }
  if (pdvMobileCard) {
    const copy = pdvMobileCard.querySelector('p');
    if (copy) copy.textContent = 'Ponto parceiro: pedidos, recebimento e barris no cliente.';
  }

  /* Header state is rAF-throttled instead of doing DOM work on every scroll event. */
  let headerTicking = false;
  const setHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    headerTicking = false;
  };
  const requestHeader = () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(setHeader);
  };
  setHeader();
  window.addEventListener('scroll', requestHeader, { passive: true });

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
      nav.style.cssText = 'display:flex;position:fixed;top:76px;left:14px;right:14px;z-index:120;flex-direction:column;align-items:stretch;gap:2px;padding:12px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:rgba(7,17,22,.97);box-shadow:0 24px 70px rgba(0,0,0,.45);';
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
    }, { threshold: 0.08, rootMargin: '0px 0px -36px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('on'));
  }

  /* Ambient hero effects only animate while the hero is actually on screen. */
  if (hero) {
    if (reduce || !('IntersectionObserver' in window)) {
      hero.classList.add('hero-active');
    } else {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => hero.classList.toggle('hero-active', entry.isIntersecting && !document.hidden));
      }, { rootMargin: '80px 0px 80px', threshold: 0.01 });
      heroObserver.observe(hero);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) hero.classList.remove('hero-active');
      });
    }
  }

  /* Crossfades start only when their media block is close to the viewport and stop after it leaves. */
  const cycleControllers = [];
  document.querySelectorAll('[data-demo-cycle]').forEach((media) => {
    const images = Array.from(media.querySelectorAll('img[data-cycle]'));
    if (images.length < 2 || reduce) return;

    media.style.position = 'relative';
    let active = 0;
    let timer = null;

    images.forEach((image, index) => {
      image.style.position = 'absolute';
      image.style.inset = '0';
      image.style.opacity = index ? '0' : '1';
      image.style.transition = 'opacity .55s ease';
    });

    const step = () => {
      images[active].style.opacity = '0';
      active = (active + 1) % images.length;
      images[active].style.opacity = '1';
    };
    const start = () => {
      if (timer || document.hidden) return;
      timer = window.setInterval(step, 4300);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    cycleControllers.push({ media, start, stop });
  });

  if (cycleControllers.length) {
    if ('IntersectionObserver' in window) {
      const mediaObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const controller = cycleControllers.find((item) => item.media === entry.target);
          if (!controller) return;
          entry.isIntersecting ? controller.start() : controller.stop();
        });
      }, { rootMargin: '180px 0px', threshold: 0.01 });
      cycleControllers.forEach((controller) => mediaObserver.observe(controller.media));
    } else {
      cycleControllers.forEach((controller) => controller.start());
    }

    document.addEventListener('visibilitychange', () => {
      cycleControllers.forEach((controller) => {
        if (document.hidden) controller.stop();
        else {
          const rect = controller.media.getBoundingClientRect();
          if (rect.bottom > -180 && rect.top < window.innerHeight + 180) controller.start();
        }
      });
    });
  }

  /*
   * Real mini-demos are progressive: the landing keeps its screenshot fallback until an
   * entry is explicitly enabled in media/demos/manifest.json. This prevents 404s and
   * lets each workflow ship independently.
   */
  const loadRealDemos = async () => {
    if (reduce) return;

    try {
      const response = await fetch('media/demos/manifest.json', { cache: 'no-store' });
      if (!response.ok) return;

      const manifest = await response.json();
      const keys = ['production', 'assets', 'commercial', 'brewpub'];
      const mediaBlocks = Array.from(document.querySelectorAll('[data-demo-cycle]')).slice(0, keys.length);

      mediaBlocks.forEach((media, index) => {
        const demo = manifest?.demos?.[keys[index]];
        if (!demo?.available || (!demo.webm && !demo.mp4)) return;

        const controller = cycleControllers.find((item) => item.media === media);
        controller?.stop();

        const images = Array.from(media.querySelectorAll('img[data-cycle]'));
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('aria-label', demo.title || 'Demonstração do BrewControl em funcionamento');
        video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:inherit;opacity:0;transition:opacity .35s ease;z-index:3;background:#071014;';
        if (demo.poster) video.poster = demo.poster;

        if (demo.webm) {
          const source = document.createElement('source');
          source.src = demo.webm;
          source.type = 'video/webm';
          video.appendChild(source);
        }
        if (demo.mp4) {
          const source = document.createElement('source');
          source.src = demo.mp4;
          source.type = 'video/mp4';
          video.appendChild(source);
        }

        const restoreFallback = () => {
          video.remove();
          images.forEach((image, imageIndex) => { image.style.opacity = imageIndex ? '0' : '1'; });
          controller?.start();
        };

        video.addEventListener('loadeddata', () => {
          images.forEach((image) => { image.style.opacity = '0'; });
          video.style.opacity = '1';
        }, { once: true });
        video.addEventListener('error', restoreFallback, { once: true });
        media.appendChild(video);

        const play = () => {
          if (document.hidden) return;
          const promise = video.play();
          promise?.catch?.(() => {});
        };
        const pause = () => video.pause();

        if ('IntersectionObserver' in window) {
          const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => entry.isIntersecting ? play() : pause());
          }, { rootMargin: '120px 0px', threshold: 0.08 });
          videoObserver.observe(media);
        } else {
          play();
        }

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) pause();
          else {
            const rect = media.getBoundingClientRect();
            if (rect.bottom > -120 && rect.top < window.innerHeight + 120) play();
          }
        });
      });
    } catch (_) {
      /* Screenshot fallback remains authoritative when media metadata cannot be loaded. */
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadRealDemos, { timeout: 1400 });
  } else {
    window.setTimeout(loadRealDemos, 600);
  }

  /* The dashboard keeps subtle depth on pointer devices, but updates at most once per animation frame. */
  const stage = document.querySelector('.product-stage');
  const shell = document.querySelector('.product-shell');
  if (stage && shell && !reduce && !coarse) {
    let tiltFrame = 0;
    let lastEvent = null;
    const renderTilt = () => {
      tiltFrame = 0;
      if (!lastEvent) return;
      const rect = stage.getBoundingClientRect();
      const x = (lastEvent.clientX - rect.left) / rect.width - .5;
      const y = (lastEvent.clientY - rect.top) / rect.height - .5;
      shell.style.transform = `rotateY(${(-2.4 + x * 2.8).toFixed(2)}deg) rotateX(${(.8 - y * 2).toFixed(2)}deg)`;
    };
    stage.addEventListener('mousemove', (event) => {
      lastEvent = event;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(renderTilt);
    }, { passive: true });
    stage.addEventListener('mouseleave', () => {
      lastEvent = null;
      if (tiltFrame) cancelAnimationFrame(tiltFrame);
      tiltFrame = 0;
      shell.style.transform = 'rotateY(-2.4deg) rotateX(.8deg)';
    });
  }

  /* Pointer light follows the cursor only; there is intentionally no scroll-linked parallax anymore. */
  if (hero && !reduce && !coarse) {
    let pointerFrame = 0;
    let pointerEvent = null;
    const renderPointerLight = () => {
      pointerFrame = 0;
      if (!pointerEvent) return;
      const rect = hero.getBoundingClientRect();
      const x = (pointerEvent.clientX - rect.left) / rect.width;
      const y = (pointerEvent.clientY - rect.top) / rect.height;
      hero.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    };
    hero.addEventListener('pointermove', (event) => {
      pointerEvent = event;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointerLight);
    }, { passive: true });
  }
})();
