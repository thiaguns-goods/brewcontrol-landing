/* BrewControl Landing — main.js */

// ---- Mobile menu toggle ----
const menuToggle = document.getElementById('menuToggle');
const navMobile  = document.getElementById('navMobile');
if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navMobile.setAttribute('aria-hidden', !isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  // Close on nav link click
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navMobile.setAttribute('aria-hidden', 'true');
    });
  });
}

// ---- Screenshot tabs ----
const tabs = document.querySelectorAll('.stab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('stab-active'));
    tab.classList.add('stab-active');
    document.querySelectorAll('.screenshot-container').forEach(c => c.style.display = 'none');
    if (target === 'producao') {
      const el = document.getElementById('tabProducao');
      if (el) el.style.display = '';
    } else if (target === 'comercial') {
      const el = document.getElementById('tabComercial');
      if (el) el.style.display = '';
    }
  });
});

// ---- Waitlist form ----
const form    = document.getElementById('waitlistForm');
const success = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const brewery = document.getElementById('formBrewery').value.trim();
    if (!name || !email || !brewery) {
      // Simple inline validation
      [document.getElementById('formName'), document.getElementById('formEmail'), document.getElementById('formBrewery')].forEach(inp => {
        if (inp && !inp.value.trim()) {
          inp.style.borderColor = 'rgba(200,100,80,0.5)';
          inp.addEventListener('input', () => inp.style.borderColor = '', { once: true });
        }
      });
      return;
    }
    // In production: send to backend / Firebase / Firestore
    form.style.display = 'none';
    if (success) success.style.display = 'flex';
    // Log entry (would be replaced by actual API call)
    console.log('Waitlist entry:', { name, email, brewery });
  });
}

// ---- Scroll-aware header ----
const header = document.getElementById('header');
let lastScroll = 0;
if (header) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.style.boxShadow = '0 1px 0 rgba(46,42,26,0.8)';
    } else {
      header.style.boxShadow = '';
    }
    lastScroll = current;
  }, { passive: true });
}

// ---- Intersection Observer for scroll-in animations ----
const animEls = document.querySelectorAll('.module-card, .problem-card');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach((el, i) => {
    el.classList.add('anim-ready');
    el.style.setProperty('--anim-delay', `${i * 0.04}s`);
    obs.observe(el);
  });
}
