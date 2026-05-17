(function () {
  const root = document.documentElement;

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
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    let theme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', theme);
    setThemeIcon(button, theme);
    syncLinkedInBadge();

    button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      setThemeIcon(button, theme);
      setTimeout(syncLinkedInBadge, 50);
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
    const pre = button.closest('.code-block')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(() => {
      const original = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = original;
      }, 2000);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initScrollTop();
    initToc();
  });
})();
