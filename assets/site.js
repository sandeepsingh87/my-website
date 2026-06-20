(function () {
  const root = document.documentElement;
  const THEME_KEY = 'theme';
  const DEFAULT_THEME = 'light';

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // The current page still updates even when storage is unavailable.
    }
  }

  function applyTheme(theme) {
    const nextTheme = theme === 'dark' ? 'dark' : DEFAULT_THEME;
    root.setAttribute('data-theme', nextTheme);
    root.style.colorScheme = nextTheme;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => setThemeIcon(button, nextTheme));
    syncLinkedInBadge();
    return nextTheme;
  }

  function setThemeIcon(button, theme) {
    if (!button) return;
    button.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    button.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function syncLinkedInBadge() {
    const badge = document.querySelector('.LI-profile-badge');
    if (!badge) return;
    badge.setAttribute('data-theme', root.getAttribute('data-theme') || 'light');
    if (window.LIRenderAll) window.LIRenderAll();
  }

  function initThemeToggle() {
    let theme = applyTheme(getStoredTheme() || DEFAULT_THEME);
    const buttons = document.querySelectorAll('[data-theme-toggle]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        storeTheme(theme);
        applyTheme(theme);
        setTimeout(syncLinkedInBadge, 50);
      });
    });

    window.addEventListener('storage', (event) => {
      if (event.key !== THEME_KEY) return;
      theme = applyTheme(event.newValue || DEFAULT_THEME);
    });
  }

  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });

    window.closeMobile = function closeMobile() {
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };
  }

  function initScrollTop() {
    const button = document.getElementById('scroll-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
      button.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function initReadingProgress() {
    const bar = document.querySelector('[data-reading-progress-fill], #progFill');
    const label = document.querySelector('[data-reading-progress-label], #progPct');
    if (!bar && !label) return;

    function update() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percent = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100))) : 0;
      if (bar) bar.style.width = percent + '%';
      if (label) label.textContent = percent + '%';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initFeaturedPlaybook() {
    const container = document.querySelector('[data-featured-playbook]');
    if (!container) return;

    const catalog = Array.isArray(window.LIBRARY) ? window.LIBRARY : [];
    const featured = catalog
      .filter((entry) => entry.featured)
      .sort((a, b) => b.date.localeCompare(a.date));
    const count = document.querySelector('[data-featured-count]');

    if (count) count.textContent = String(featured.length);
    container.innerHTML = '';

    if (!featured.length) {
      const message = document.createElement('p');
      message.className = 'playbook-feature__item-body';
      message.textContent = 'New featured entries are coming soon.';
      container.appendChild(message);
      return;
    }

    featured.slice(0, 3).forEach((entry, index) => {
      const link = document.createElement('a');
      link.className = 'playbook-feature__item' + (index === 0 ? ' playbook-feature__item--primary' : '');
      link.href = entry.file;
      link.setAttribute('aria-label', 'Read ' + entry.title);

      const kicker = document.createElement('p');
      kicker.className = 'playbook-feature__item-kicker';
      kicker.textContent = entry.category + ' / ' + entry.duration;

      const title = document.createElement('h3');
      title.className = 'playbook-feature__item-title';
      title.textContent = entry.title;

      const body = document.createElement('p');
      body.className = 'playbook-feature__item-body';
      body.textContent = entry.description;

      link.append(kicker, title, body);
      container.appendChild(link);
    });
  }

  function initToc() {
    const headings = document.querySelectorAll('.prose h2[id]');
    const tocLinks = document.querySelectorAll('.toc__list a');
    if (!headings.length || !tocLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector('.toc__list a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-20% 0% -70% 0%' });

    headings.forEach((heading) => observer.observe(heading));
  }

  window.copyCode = function copyCode(button) {
    const pre = button.closest('.code-block, .code-wrap')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(() => {
      const original = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove('copied');
      }, 2000);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initScrollTop();
    initReadingProgress();
    initFeaturedPlaybook();
    initToc();
  });
})();
