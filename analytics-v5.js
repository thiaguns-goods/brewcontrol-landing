(() => {
  'use strict';

  const send = (eventName, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  };

  const path = window.location.pathname;
  const fileName = path.split('/').pop() || '';
  const moduleMap = {
    'modulo-producao.html': 'producao',
    'modulo-almoxarifado.html': 'almoxarifado',
    'modulo-ativos.html': 'ativos_barris',
    'modulo-comercial.html': 'comercial',
    'modulo-logistica.html': 'logistica',
    'modulo-financeiro.html': 'financeiro',
    'modulo-brewpub.html': 'brewpub',
    'modulo-fiscal.html': 'fiscal',
    'modulo-pdv-mobile.html': 'pdv_mobile'
  };

  const moduleName = moduleMap[fileName];
  if (moduleName) {
    send('module_open', {
      module_name: moduleName,
      page_type: 'module'
    });
  }

  const getLocation = (anchor) => {
    if (anchor.closest('.header, .prod-header')) return 'header';
    if (anchor.closest('.pricing, .price')) return 'pricing';
    if (anchor.closest('.final-cta')) return 'final_cta';
    if (anchor.closest('.story-section, .story')) return 'product_story';
    if (anchor.closest('.modules, .modules-grid')) return 'modules_grid';
    if (anchor.closest('footer, .footer')) return 'footer';
    return moduleName ? 'module_body' : 'page_body';
  };

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    const location = getLocation(anchor);

    if (/^https:\/\/app\.brewcontrol\.app\.br\/?/i.test(href)) {
      const priceCard = anchor.closest('.price');
      const planName = priceCard?.querySelector('h3')?.textContent?.trim().toLowerCase() || undefined;

      send('app_open', {
        cta_location: location,
        page_type: moduleName ? 'module' : 'home',
        ...(moduleName ? { module_name: moduleName } : {}),
        ...(planName ? { plan_name: planName } : {})
      });

      if (planName) {
        send('pricing_cta_click', {
          plan_name: planName,
          cta_location: 'pricing'
        });
      }
      return;
    }

    if (/^https:\/\/wa\.me\/5527981848184/i.test(href) && anchor.closest('.final-cta')) {
      send('founder_program_click', {
        cta_location: 'final_cta'
      });
    }
  }, { capture: true });

  const observedVideos = new WeakSet();
  const watchDemo = (video, demoKey) => {
    if (!video || observedVideos.has(video)) return;
    observedVideos.add(video);
    let sent = false;

    const mark = () => {
      if (sent || video.paused || video.currentTime < 0.5) return;
      sent = true;
      send('demo_video_view', {
        demo_key: demoKey || 'unknown',
        page_type: moduleName ? 'module' : 'home',
        ...(moduleName ? { module_name: moduleName } : {})
      });
    };

    video.addEventListener('timeupdate', mark, { passive: true });
  };

  const scanRealDemos = () => {
    document.querySelectorAll('[data-demo-key] video').forEach((video) => {
      const host = video.closest('[data-demo-key]');
      if (host?.classList.contains('video-ready')) watchDemo(video, host.dataset.demoKey);
    });

    document.querySelectorAll('[data-demo-cycle] video').forEach((video, index) => {
      watchDemo(video, ['production', 'assets', 'commercial', 'brewpub'][index] || 'unknown');
    });
  };

  scanRealDemos();
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(scanRealDemos);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }
})();
