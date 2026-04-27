// js/projects.js

async function loadProjects() {
  // 1. fetch the list of project folders
  const index = await fetch('assets/projects/index.json').then(r => r.json());

  // 2. fetch each project's meta.json in parallel
  const projects = await Promise.all(
    index.map(slug =>
      fetch(`assets/projects/${slug}/meta.json`).then(r => r.json())
    )
  );

  // 3. render cards
  renderCards(projects);
}

function renderCards(projects) {
  const grid = document.getElementById('projects-grid');

  grid.innerHTML = projects.map((p, i) => `
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