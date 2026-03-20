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

// ---- Waitlist form ----
const form = document.getElementById('waitlistForm');
const success = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

function showFormError(msg) {
  if (!formError) return;
  formError.textContent = msg;
  formError.hidden = false;
}

function clearFormError() {
  if (!formError) return;
  formError.textContent = '';
  formError.hidden = true;
}

function getWaitlistDb() {
  const cfg = window.BREWCONTROL_SITE && window.BREWCONTROL_SITE.firebase;
  if (!cfg || !cfg.apiKey || !cfg.projectId) return null;
  if (typeof firebase === 'undefined') return null;
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    return firebase.firestore();
  } catch (err) {
    console.error('Firebase init:', err);
    return null;
  }
}

function trackWaitlistLead() {
  if (typeof window.gtag === 'function' && window.BREWCONTROL_SITE && window.BREWCONTROL_SITE.ga4MeasurementId) {
    window.gtag('event', 'generate_lead', { currency: 'BRL', value: 1 });
  }
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError();
    const nameEl = document.getElementById('formName');
    const emailEl = document.getElementById('formEmail');
    const breweryEl = document.getElementById('formBrewery');
    const submitBtn = document.getElementById('waitlistSubmit');
    const name = nameEl?.value.trim() ?? '';
    const email = emailEl?.value.trim() ?? '';
    const brewery = breweryEl?.value.trim() ?? '';
    const missing = [];
    [nameEl, emailEl, breweryEl].forEach((inp) => {
      if (inp) {
        inp.removeAttribute('aria-invalid');
        inp.style.borderColor = '';
      }
    });
    if (!name) missing.push('nome');
    if (!email) missing.push('email');
    if (!brewery) missing.push('nome da cervejaria');
    if (missing.length) {
      showFormError(`Preencha: ${missing.join(', ')}.`);
      [nameEl, emailEl, breweryEl].forEach((inp) => {
        if (inp && !inp.value.trim()) {
          inp.setAttribute('aria-invalid', 'true');
          inp.style.borderColor = 'rgba(248,113,113,0.55)';
          inp.addEventListener('input', () => {
            inp.removeAttribute('aria-invalid');
            inp.style.borderColor = '';
            clearFormError();
          }, { once: true });
        }
      });
      formError?.focus();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showFormError('Digite um email válido.');
      emailEl?.setAttribute('aria-invalid', 'true');
      emailEl?.style.setProperty('border-color', 'rgba(248,113,113,0.55)');
      emailEl?.focus();
      return;
    }

    const db = getWaitlistDb();
    const labelSubmit = submitBtn ? submitBtn.textContent : '';

    if (db) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = 'Enviando…';
      }
      try {
        await db.collection('waitlist').add({
          name,
          email,
          brewery,
          emailLower: email.toLowerCase(),
          source: 'landing',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          userAgent: String(navigator.userAgent || '').slice(0, 240),
        });
        trackWaitlistLead();
        form.style.display = 'none';
        if (success) success.style.display = 'flex';
      } catch (err) {
        console.error('Waitlist Firestore:', err);
        showFormError('Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.');
        formError?.focus();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.textContent = labelSubmit;
        }
      }
      return;
    }

    trackWaitlistLead();
    console.warn('Waitlist: Firebase não configurado — lead só no console.');
    console.log('Waitlist entry:', { name, email, brewery });
    form.style.display = 'none';
    if (success) success.style.display = 'flex';
  });
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

setScreenshotTab('producao');
