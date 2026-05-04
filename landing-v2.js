// =========================================================
// BrewControl landing v2 — comportamento
// Animação de fábrica, contadores, tabs, formulário, tweaks
// =========================================================

(function () {
  'use strict';

  // -------- Reveal on scroll --------
  const reveal = (el, cb) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  };

  // -------- Counters --------
  document.querySelectorAll('[data-count]').forEach(el => {
    reveal(el, (node) => {
      const to = parseFloat(node.dataset.count);
      const suffix = node.dataset.suffix || '';
      const dur = 1600;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = to * eased;
        node.textContent = (to % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });

  // -------- Demo tabs --------
  const tabs = document.querySelectorAll('[data-demo-tab]');
  const panels = document.querySelectorAll('[data-demo-panel]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.demoTab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.demoPanel === key));
    });
  });

  // -------- Waitlist mock --------
  const form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      document.getElementById('formSuccess')?.classList.add('on');
    });
  }

  // -------- Bubbles generation --------
  const bubbleHosts = document.querySelectorAll('[data-bubbles]');
  bubbleHosts.forEach(host => {
    const count = parseInt(host.dataset.bubbles) || 18;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('i');
      const size = 3 + Math.random() * 7;
      b.style.width = b.style.height = size + 'px';
      b.style.left = (5 + Math.random() * 90) + '%';
      b.style.animationDuration = (3 + Math.random() * 4) + 's';
      b.style.animationDelay = (Math.random() * 5) + 's';
      b.style.setProperty('--dx', ((Math.random() - 0.5) * 20) + 'px');
      host.appendChild(b);
    }
  });

  // -------- Grains falling --------
  const grainHosts = document.querySelectorAll('[data-grains]');
  grainHosts.forEach(host => {
    const count = parseInt(host.dataset.grains) || 14;
    const h = host.clientHeight || 600;
    for (let i = 0; i < count; i++) {
      const g = document.createElement('i');
      g.style.left = (Math.random() * 100) + '%';
      g.style.animationDuration = (4 + Math.random() * 4) + 's';
      g.style.animationDelay = (Math.random() * 5) + 's';
      g.style.setProperty('--dx', ((Math.random() - 0.5) * 40) + 'px');
      g.style.setProperty('--fall', h + 'px');
      // variation in color: malt (amber) + hop (green)
      if (Math.random() > 0.7) g.style.background = 'oklch(0.76 0.13 130)';
      host.appendChild(g);
    }
  });

  // -------- Tweaks panel --------
  const panel = document.getElementById('tweaksPanel');
  const handleActivate = () => panel?.classList.add('open');
  const handleDeactivate = () => panel?.classList.remove('open');

  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') handleActivate();
    if (d.type === '__deactivate_edit_mode') handleDeactivate();
  });

  // Announce availability
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (_) {}

  // Local toggle for dev / if no host
  document.getElementById('tweaksOpen')?.addEventListener('click', handleActivate);
  document.getElementById('tweaksClose')?.addEventListener('click', handleDeactivate);

  // Apply defaults
  const DEFAULTS = window.__TWEAKS_DEFAULTS__ || { direction: 'balanced', intensity: 1, accent: 'copper' };
  const apply = (state) => {
    document.body.dataset.dir = state.direction;
    document.documentElement.style.setProperty('--fx-intensity', String(state.intensity));
    if (state.accent === 'amber') {
      document.documentElement.style.setProperty('--copper-400', 'oklch(0.80 0.16 75)');
      document.documentElement.style.setProperty('--copper-200', 'oklch(0.90 0.12 75)');
      document.documentElement.style.setProperty('--copper-600', 'oklch(0.62 0.14 68)');
      document.documentElement.style.setProperty('--copper-glow', 'oklch(0.80 0.16 75 / 0.35)');
    } else if (state.accent === 'steel') {
      document.documentElement.style.setProperty('--copper-400', 'oklch(0.78 0.05 230)');
      document.documentElement.style.setProperty('--copper-200', 'oklch(0.88 0.04 230)');
      document.documentElement.style.setProperty('--copper-600', 'oklch(0.60 0.06 230)');
      document.documentElement.style.setProperty('--copper-glow', 'oklch(0.78 0.05 230 / 0.3)');
    } else {
      // copper (default)
      document.documentElement.style.removeProperty('--copper-400');
      document.documentElement.style.removeProperty('--copper-200');
      document.documentElement.style.removeProperty('--copper-600');
      document.documentElement.style.removeProperty('--copper-glow');
    }
    // Update active tweak buttons
    document.querySelectorAll('[data-tweak]').forEach(btn => {
      const [k, v] = btn.dataset.tweak.split(':');
      btn.classList.toggle('active', String(state[k]) === v);
    });
  };
  const state = { ...DEFAULTS };
  apply(state);

  // Tweak buttons
  document.querySelectorAll('[data-tweak]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [k, v] = btn.dataset.tweak.split(':');
      state[k] = (k === 'intensity') ? parseFloat(v) : v;
      apply(state);
      try {
        const edits = {};
        edits[k] = state[k];
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
      } catch (_) {}
    });
  });

  // Intensity slider
  const intensity = document.getElementById('intensitySlider');
  if (intensity) {
    intensity.value = state.intensity;
    intensity.addEventListener('input', () => {
      state.intensity = parseFloat(intensity.value);
      apply(state);
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { intensity: state.intensity } }, '*');
      } catch (_) {}
    });
  }
})();
