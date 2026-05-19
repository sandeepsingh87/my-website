/**
 * Shared search / filter / card renderer for library.html and qe-repository.html.
 * Expects a global array on window[config.dataKey], e.g. LIBRARY or QE_REPOSITORY.
 */
window.initResourceCatalog = function initResourceCatalog(config) {
  const entries = window[config.dataKey];
  if (!Array.isArray(entries)) {
    console.error('Catalog data not found:', config.dataKey);
    return;
  }

  const entryLabel = config.entryLabel || 'entries';
  const featuredLabel = config.featuredLabel || '⭐ Featured';
  const allLabelDefault = config.allLabelDefault || 'All Entries';

  let activeFilter = 'all';
  let searchQuery = '';
  let sortOrder = 'newest';

  function fmtDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  function catSlug(c) {
    return c.toLowerCase().replace(/\s+/g, '-');
  }

  function buildCard(entry, featured) {
    const a = document.createElement('a');
    a.href = entry.file;
    a.className = 'lib-card' + (featured ? ' lib-card--featured' : '');
    a.setAttribute('data-id', entry.id);
    a.setAttribute('data-category', entry.category.toLowerCase());
    a.setAttribute('data-tags', entry.tags.join(' ').toLowerCase());
    a.setAttribute('data-title', entry.title.toLowerCase());
    a.setAttribute('data-desc', entry.description.toLowerCase());
    a.setAttribute('data-date', entry.date);

    const slug = catSlug(entry.category);
    const duration = entry.duration
      ? `<span class="card-duration">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${entry.duration}
        </span>`
      : '';

    a.innerHTML = `
      <div class="card-top">
        <div class="card-badges">
          <span class="cat-pill cat-pill--${slug}">${entry.category}</span>
          ${featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <svg class="card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
      </div>
      <h2 class="card-title">${entry.title}</h2>
      <p class="card-desc">${entry.description}</p>
      <div class="card-footer">
        <div class="card-meta">
          <span class="card-date">${fmtDate(entry.date)}</span>
          ${duration}
        </div>
        <div class="card-tags">
          ${entry.tags.map((t) => `<span class="card-tag">${t}</span>`).join('')}
        </div>
      </div>`;
    return a;
  }

  function buildChips() {
    const cats = [...new Set(entries.map((e) => e.category))].sort();
    const wrap = document.getElementById('filter-chips');
    cats.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = cat;
      btn.setAttribute('data-filter', cat.toLowerCase());
      btn.addEventListener('click', () => setFilter(cat.toLowerCase()));
      wrap.appendChild(btn);
    });
  }

  function setFilter(val) {
    activeFilter = val;
    document.querySelectorAll('.chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.filter === val);
    });
    render();
  }

  function clearAll() {
    document.getElementById('search-input').value = '';
    searchQuery = '';
    setFilter('all');
  }
  window.clearAll = clearAll;

  function sortList(arr) {
    return [...arr].sort((a, b) => {
      if (sortOrder === 'newest') return b.date.localeCompare(a.date);
      if (sortOrder === 'oldest') return a.date.localeCompare(b.date);
      if (sortOrder === 'az') return a.title.localeCompare(b.title);
      if (sortOrder === 'za') return b.title.localeCompare(a.title);
      return 0;
    });
  }

  function matches(entry) {
    const catOk = activeFilter === 'all' || entry.category.toLowerCase() === activeFilter;
    if (!catOk) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  function render() {
    const filteredAll = sortList(entries.filter(matches));
    const featuredEntries = filteredAll.filter((e) => e.featured);
    const otherEntries = filteredAll.filter((e) => !e.featured);

    const fGrid = document.getElementById('featured-grid');
    const aGrid = document.getElementById('all-grid');
    const fSec = document.getElementById('featured-section');
    const aSec = document.getElementById('all-section');
    const empty = document.getElementById('empty-state');
    const countEl = document.getElementById('results-count');

    fGrid.innerHTML = '';
    aGrid.innerHTML = '';

    const noFilter = activeFilter === 'all' && !searchQuery;

    const featuredLabelEl = document.querySelector('.featured-label');
    if (featuredLabelEl) featuredLabelEl.textContent = featuredLabel;

    if (noFilter && featuredEntries.length) {
      fSec.hidden = false;
      featuredEntries.forEach((e) => fGrid.appendChild(buildCard(e, true)));
    } else {
      fSec.hidden = true;
    }

    const toList = noFilter ? otherEntries : filteredAll;
    if (toList.length) {
      aSec.hidden = false;
      document.getElementById('all-label').textContent = noFilter
        ? allLabelDefault
        : `${filteredAll.length} result${filteredAll.length !== 1 ? 's' : ''}`;
      toList.forEach((e) => aGrid.appendChild(buildCard(e, false)));
    } else {
      aSec.hidden = true;
    }

    const totalShown = noFilter
      ? featuredEntries.length + otherEntries.length
      : filteredAll.length;
    empty.classList.toggle('visible', totalShown === 0);

    countEl.innerHTML =
      totalShown === 0
        ? ''
        : `Showing <strong>${totalShown}</strong> of <strong>${entries.length}</strong> ${entryLabel}`;
  }

  function updateStats() {
    document.getElementById('total-count').textContent = entries.length;
    const cats = new Set(entries.map((e) => e.category));
    document.getElementById('category-count').textContent = cats.size;
    const latest = entries.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    document.getElementById('latest-date').textContent = latest ? fmtDate(latest.date) : '—';
  }

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    render();
  });
  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortOrder = e.target.value;
    render();
  });

  buildChips();
  updateStats();
  render();
};
