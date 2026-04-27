/* ─────────────────────────────────────────
   project.js — loads a single project
   from ?id=slug and renders the article
───────────────────────────────────────── */

(async function () {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('id');
  const article = document.getElementById('project-article');

  // no slug → redirect back
  if (!slug) {
    window.location.href = 'projects.html';
    return;
  }

  try {
    const p = await fetch(`assets/projects/${slug}/meta.json`).then(r => r.json());

    // update page title
    document.title = `Reda TRANKIL — ${p.title}`;

    // render
    article.innerHTML = `

      <!-- header -->
      <div class="project-detail-header">
        <a href="projects.html" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All projects
        </a>

        <div class="project-detail-meta">
          <span class="project-year">${p.year}</span>
          <span class="project-detail-theme">${p.theme || ''}</span>
        </div>

        <h1 class="project-detail-title">${p.title}</h1>
        <p class="project-detail-desc">${p.description}</p>

        <div class="project-tags" style="margin-top: 16px;">
          ${p.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>

      <!-- hero thumbnail -->
      <div class="project-detail-thumb">
        <img src="${p.thumbnail}" alt="${p.title}" />
      </div>

      <!-- two-col body -->
      <div class="project-detail-body">

        <!-- left: content -->
        <div class="project-detail-content">
          ${p.context ? `
            <div class="project-detail-block">
              <h2 class="project-detail-block-title">Context</h2>
              <p>${p.context}</p>
            </div>` : ''}

          ${p.content ? `
            <div class="project-detail-block">
              <h2 class="project-detail-block-title">Project overview</h2>
              <p>${p.content}</p>
            </div>` : ''}

          ${p.images && p.images.length ? `
            <div class="project-detail-block">
              <h2 class="project-detail-block-title">Maps &amp; visuals</h2>
              <div class="project-detail-images">
                ${p.images.map(img => `
                  <img src="${img}" alt="${p.title}" loading="lazy" />
                `).join('')}
              </div>
            </div>` : ''}
        </div>

        <!-- right: sidebar -->
        <aside class="project-detail-sidebar">

          ${p.tools && p.tools.length ? `
            <div class="project-sidebar-block">
              <h3 class="project-sidebar-title">Tools used</h3>
              <ul class="project-sidebar-list">
                ${p.tools.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>` : ''}

          <div class="project-sidebar-block">
            <h3 class="project-sidebar-title">Year</h3>
            <p class="project-sidebar-value">${p.year}</p>
          </div>

          ${p.theme ? `
            <div class="project-sidebar-block">
              <h3 class="project-sidebar-title">Theme</h3>
              <p class="project-sidebar-value">${p.theme}</p>
            </div>` : ''}

        </aside>
      </div>
    `;

  } catch (err) {
    article.innerHTML = `
      <div class="project-detail-header">
        <a href="projects.html" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All projects
        </a>
        <p style="color: var(--text-dim); margin-top: 40px;">Project not found.</p>
      </div>
    `;
    console.error('Failed to load project:', err);
  }
})();