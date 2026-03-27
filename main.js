/* BrewControl Landing — main.js */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---- Mobile menu toggle ----
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navMobile.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navMobile.setAttribute('aria-hidden', 'true');
    });
  });
}

// ---- Screenshot tabs ----
const screenshotPanels = document.querySelectorAll('.screenshot-wrap [data-panel]');
const stabButtons = document.querySelectorAll('.screenshots-tabs [role="tab"]');

function setScreenshotTab(id) {
  screenshotPanels.forEach((panel) => {
    panel.hidden = panel.getAttribute('data-panel') !== id;
  });
  stabButtons.forEach((btn) => {
    const active = btn.dataset.tab === id;
    btn.classList.toggle('stab-active', active);
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;
  });
}

stabButtons.forEach((tab) => {
  tab.addEventListener('click', () => {
    setScreenshotTab(tab.dataset.tab);
  });
});

const tablist = document.querySelector('.screenshots-tabs[role="tablist"]');
if (tablist) {
  tablist.addEventListener('keydown', (e) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const tabs = Array.from(stabButtons);
    const i = tabs.findIndex((t) => t.classList.contains('stab-active'));
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'End') {
      next = e.key === 'End' ? tabs.length - 1 : (i + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'Home') {
      next = e.key === 'Home' ? 0 : (i - 1 + tabs.length) % tabs.length;
    }
    const t = tabs[next];
    if (t) {
      t.focus();
      setScreenshotTab(t.dataset.tab);
    }
  });
}

// ---- Image fallbacks (missing screenshots / photo) ----
function insertScreenshotPlaceholder(img) {
  const label = img.getAttribute('data-fallback-label') || 'Tela do produto';
  const frame = img.closest('.screenshot-frame');
  if (!frame || frame.querySelector('.screenshot-placeholder')) return;
  img.style.display = 'none';
  const ph = document.createElement('div');
  ph.className = 'screenshot-placeholder';
  const strong = document.createElement('strong');
  strong.textContent = 'Preview';
  const hint = document.createElement('p');
  hint.style.margin = '0.35rem 0 0';
  hint.style.fontSize = '0.9em';
  hint.appendChild(document.createTextNode('Adicione o arquivo: '));
  const code = document.createElement('code');
  code.style.fontSize = '0.88em';
  code.style.opacity = '0.9';
  code.textContent = img.getAttribute('src') || '';
  hint.appendChild(code);
  const cap = document.createElement('p');
  cap.style.margin = '0.75rem 0 0';
  cap.style.color = 'var(--color-text-muted)';
  cap.textContent = label;
  ph.appendChild(strong);
  ph.appendChild(hint);
  ph.appendChild(cap);
  frame.appendChild(ph);
}

document.querySelectorAll('.screenshot-img').forEach((img) => {
  img.addEventListener(
    'error',
    () => {
      insertScreenshotPlaceholder(img);
    },
    { once: true }
  );
  if (img.complete && img.naturalWidth === 0 && img.src) {
    insertScreenshotPlaceholder(img);
  }
});

const founderPhoto = document.querySelector('.founder-photo');
const founderAvatar = document.getElementById('founderAvatar');
if (founderPhoto && founderAvatar) {
  founderPhoto.addEventListener(
    'error',
    () => {
      founderAvatar.classList.add('is-photo-missing');
      founderPhoto.classList.add('is-hidden');
    },
    { once: true }
  );
  if (founderPhoto.complete && founderPhoto.naturalWidth === 0 && founderPhoto.src) {
    founderAvatar.classList.add('is-photo-missing');
    founderPhoto.classList.add('is-hidden');
  }
}

// ---- Scroll-aware header ----
const header = document.getElementById('header');
if (header) {
  window.addEventListener(
    'scroll',
    () => {
      const current = window.scrollY;
      if (current > 80) {
        header.style.boxShadow = '0 1px 0 rgba(46,42,26,0.8)';
      } else {
        header.style.boxShadow = '';
      }
    },
    { passive: true }
  );
}

// ---- Intersection Observer for scroll-in animations ----
const animSelector = '.module-card, .problem-card, .diff-item, .pricing-card, .founder-grid';
const animEls = document.querySelectorAll(animSelector);
if ('IntersectionObserver' in window && animEls.length && !prefersReducedMotion()) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  animEls.forEach((el, i) => {
    el.classList.add('anim-ready');
    el.style.setProperty('--anim-delay', `${Math.min(i, 12) * 0.04}s`);
    obs.observe(el);
  });
} else {
  animEls.forEach((el) => el.classList.add('is-visible'));
}

setScreenshotTab('dashboard');
