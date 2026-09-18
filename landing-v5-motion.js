(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  root.classList.add('motion-layer');

  const boot = () => {
    if (reduce) {
      root.classList.add('motion-booted');
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add('motion-booted'));
    });
  };

  /* ---------------- Hero ---------------- */
  boot();

  /* ---------------- Operation flow ---------------- */
  const ribbon = document.querySelector('.operation-ribbon');
  const flowSteps = ribbon ? Array.from(ribbon.querySelectorAll('.op-step')) : [];
  const eventLine = document.querySelector('.flow-section .event-line');

  if (ribbon && flowSteps.length) {
    ribbon.classList.add('motion-sequence');
    flowSteps.forEach((step, index) => step.style.setProperty('--motion-index', String(index)));
    eventLine?.classList.add('motion-event');

    let flowActivated = false;
    const activateFlow = () => {
      if (flowActivated) return;
      flowActivated = true;
      ribbon.classList.add('is-active');

      if (eventLine) {
        if (reduce) {
          eventLine.classList.add('is-live');
        } else {
          const delay = 260 + flowSteps.length * 95;
          window.setTimeout(() => eventLine.classList.add('is-live'), delay);
        }
      }
    };

    if (reduce || !('IntersectionObserver' in window)) {
      activateFlow();
    } else {
      const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activateFlow();
          flowObserver.disconnect();
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -8%' });
      flowObserver.observe(ribbon);
    }
  }

  /* ---------------- Header gliding indicator ---------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'))
      .filter((link) => {
        const target = link.getAttribute('href');
        return target && target.length > 1 && document.querySelector(target);
      });

    if (navLinks.length) {
      nav.classList.add('motion-nav');

      const indicator = document.createElement('span');
      indicator.className = 'nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      nav.appendChild(indicator);

      let activeLink = null;
      let hoverLink = null;
      let navFrame = 0;

      const placeIndicator = (link) => {
        if (!link || window.innerWidth <= 1120) {
          nav.style.setProperty('--nav-opacity', '0');
          return;
        }
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        nav.style.setProperty('--nav-x', `${(linkRect.left - navRect.left).toFixed(1)}px`);
        nav.style.setProperty('--nav-w', `${linkRect.width.toFixed(1)}px`);
        nav.style.setProperty('--nav-opacity', '1');
      };

      const resolveActiveLink = () => {
        const probe = window.scrollY + window.innerHeight * 0.34;
        let next = null;

        navLinks.forEach((link) => {
          const selector = link.getAttribute('href');
          const section = selector ? document.querySelector(selector) : null;
          if (!section) return;
          if (section.offsetTop <= probe) next = link;
        });

        activeLink = next;
        placeIndicator(hoverLink || activeLink);
      };

      const requestNavSync = () => {
        if (navFrame) return;
        navFrame = requestAnimationFrame(() => {
          navFrame = 0;
          resolveActiveLink();
        });
      };

      navLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
          hoverLink = link;
          placeIndicator(link);
        });
        link.addEventListener('focus', () => {
          hoverLink = link;
          placeIndicator(link);
        });
        link.addEventListener('blur', () => {
          hoverLink = null;
          placeIndicator(activeLink);
        });
      });

      nav.addEventListener('mouseleave', () => {
        hoverLink = null;
        placeIndicator(activeLink);
      });

      window.addEventListener('scroll', requestNavSync, { passive: true });
      window.addEventListener('resize', requestNavSync, { passive: true });
      resolveActiveLink();
    }
  }

  /* ---------------- Module card spotlight ---------------- */
  const moduleCards = Array.from(document.querySelectorAll('.module-card'));
  moduleCards.forEach((card) => card.classList.add('motion-spotlight'));

  if (!reduce && !coarse) {
    moduleCards.forEach((card) => {
      let pointerFrame = 0;
      let pointerEvent = null;

      const renderSpotlight = () => {
        pointerFrame = 0;
        if (!pointerEvent) return;
        const rect = card.getBoundingClientRect();
        const x = ((pointerEvent.clientX - rect.left) / rect.width) * 100;
        const y = ((pointerEvent.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--spot-x', `${Math.max(0, Math.min(100, x)).toFixed(1)}%`);
        card.style.setProperty('--spot-y', `${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
      };

      card.addEventListener('pointermove', (event) => {
        pointerEvent = event;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(renderSpotlight);
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        pointerEvent = null;
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
      }, { passive: true });
    });
  }

  /* ---------------- FAQ progressive accordion ---------------- */
  const answerList = document.querySelector('.answer-list');
  if (answerList && !answerList.classList.contains('motion-accordion')) {
    const articles = Array.from(answerList.querySelectorAll(':scope > article'));

    articles.forEach((article, index) => {
      const heading = article.querySelector('h3');
      const paragraph = article.querySelector('p');
      if (!heading || !paragraph) return;

      article.classList.add('answer-item');
      heading.classList.add('answer-heading');

      const button = document.createElement('button');
      const buttonId = `answer-toggle-${index + 1}`;
      const panelId = `answer-panel-${index + 1}`;

      button.type = 'button';
      button.className = 'answer-toggle';
      button.id = buttonId;
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

      const label = document.createElement('span');
      label.textContent = heading.textContent.trim();

      const mark = document.createElement('span');
      mark.className = 'answer-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = '+';

      button.append(label, mark);
      heading.textContent = '';
      heading.appendChild(button);

      const panel = document.createElement('div');
      panel.className = 'answer-panel';
      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', buttonId);
      panel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

      const inner = document.createElement('div');
      inner.className = 'answer-panel-inner';
      paragraph.replaceWith(panel);
      inner.appendChild(paragraph);
      panel.appendChild(inner);

      if (index === 0) article.classList.add('is-open');

      button.addEventListener('click', () => {
        const isOpen = article.classList.contains('is-open');

        articles.forEach((item) => {
          item.classList.remove('is-open');
          const itemButton = item.querySelector('.answer-toggle');
          const itemPanel = item.querySelector('.answer-panel');
          itemButton?.setAttribute('aria-expanded', 'false');
          itemPanel?.setAttribute('aria-hidden', 'true');
        });

        if (!isOpen) {
          article.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
    });

    answerList.classList.add('motion-accordion');
  }
})();
