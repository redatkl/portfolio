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
  // collect all unique tags across all projects
  const tags = ['all', ...new Set(projects.flatMap(p => p.tags))];
  const bar  = document.querySelector('.filter-bar');

  bar.innerHTML = tags.map(tag => `
    <button class="filter-btn ${tag === 'all' ? 'active' : ''}" data-filter="${tag}">
      ${tag === 'all' ? 'All' : tag}
    </button>
  `).join('');

  // click handler
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const filtered = filter === 'all'
      ? allProjects
      : allProjects.filter(p => p.tags.includes(filter));

    renderCards(filtered);
  });
}

function renderCards(projects) {
  const grid = document.getElementById('projects-grid');

  if (projects.length === 0) {
    grid.innerHTML = `<p class="projects-empty-title">No projects match this filter.</p>`;
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