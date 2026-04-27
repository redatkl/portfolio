// js/projects.js

let allProjects = [];

async function loadProjects() {
  try {
    const index = await fetch('assets/projects/index.json').then(r => r.json());

    allProjects = (await Promise.allSettled(
      index.map(slug =>
        fetch(`assets/projects/${slug}/meta.json`).then(r => r.json())
      )
    ))
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

    buildFilters(allProjects);
    renderCards(allProjects);
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

function buildFilters(projects) {
  const themes = [...new Set(projects.map(p => p.theme).filter(Boolean))];

  // build suggestion pool from all tags
  const allTags = [...new Set(projects.flatMap(p => p.tags || []))];

  const bar = document.querySelector('.filter-bar');

  bar.innerHTML = `
    <div class="filter-themes">
      <button class="filter-btn active" data-theme="all">All</button>
      ${themes.map(t => `
        <button class="filter-btn" data-theme="${t}">${t}</button>
      `).join('')}
    </div>
    <div class="filter-search-wrap">
      <div class="filter-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          id="filter-input"
          class="filter-input"
          placeholder="Search by keyword, tool..."
          autocomplete="off"
        />
      </div>
      <ul id="filter-suggestions" class="filter-suggestions"></ul>
    </div>
  `;

  let activeTheme = 'all';
  const input = document.getElementById('filter-input');
  const suggestionsList = document.getElementById('filter-suggestions');

  // ── Theme buttons ──
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTheme = btn.dataset.theme;
    applyFilters();
  });

  // ── Suggestions ──
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    suggestionsList.innerHTML = '';

    if (!query) {
      suggestionsList.classList.remove('open');
      applyFilters();
      return;
    }

    const matches = allTags.filter(tag => tag.toLowerCase().includes(query)).slice(0, 6);

    if (matches.length === 0) {
      suggestionsList.classList.remove('open');
    } else {
      matches.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'filter-suggestion-item';
        // highlight matching part
        const idx = tag.toLowerCase().indexOf(query);
        li.innerHTML =
          tag.slice(0, idx) +
          `<span class="filter-suggestion-match">${tag.slice(idx, idx + query.length)}</span>` +
          tag.slice(idx + query.length);

        li.addEventListener('mousedown', () => {
          input.value = tag;
          suggestionsList.classList.remove('open');
          applyFilters();
        });

        suggestionsList.appendChild(li);
      });
      suggestionsList.classList.add('open');
    }

    applyFilters();
  });

  // close suggestions on blur
  input.addEventListener('blur', () => {
    setTimeout(() => suggestionsList.classList.remove('open'), 150);
  });

  input.addEventListener('focus', () => {
    if (suggestionsList.children.length > 0) {
      suggestionsList.classList.add('open');
    }
  });

  function applyFilters() {
    const query = input.value.toLowerCase().trim();

    const filtered = allProjects.filter(p => {
      const matchTheme = activeTheme === 'all' || p.theme === activeTheme;
      const searchable = [p.title, p.description, ...(p.tags || [])].join(' ').toLowerCase();
      const matchQuery = !query || searchable.includes(query);
      return matchTheme && matchQuery;
    });

    renderCards(filtered);
  }
}

function renderCards(projects) {
  const grid = document.getElementById('projects-grid');

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        <div class="projects-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p class="projects-empty-title">No projects match</p>
        <p class="projects-empty-sub">Try a different theme or keyword.</p>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <a href="project.html?id=${p.slug}" class="project-card">
      <div class="project-thumb">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="project-info">
        <span class="project-year">${p.year}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </a>
  `).join('');
}

loadProjects();