/* ─────────────────────────────────────────
   project.js — case study detail page
───────────────────────────────────────── */

(async function () {
  const params  = new URLSearchParams(window.location.search);
  const slug    = params.get('id');
  const article = document.getElementById('project-article');

  if (!slug) { window.location.href = 'projects.html'; return; }

  try {
    const p = await fetch(`assets/projects/${slug}/meta.json`).then(r => r.json());
    document.title = `Reda TRANKIL — ${p.title}`;

    article.innerHTML = `

      <!-- ── HERO ── -->
      <div class="cs-hero">
        <div class="cs-hero-content">
          <a href="projects.html" class="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            All projects
          </a>

          <div class="cs-hero-meta">
            ${p.client   ? `<span class="cs-meta-pill">${p.client}</span>` : ''}
            ${p.theme    ? `<span class="cs-meta-pill cs-meta-pill--dim">${p.theme}</span>` : ''}
            <span class="cs-meta-pill cs-meta-pill--dim">${p.year}</span>
          </div>

          <h1 class="cs-title">${p.title}</h1>
          <p class="cs-lead">${p.description}</p>

          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="cs-body">

        <!-- left: case study sections -->
        <div class="cs-content">

          ${p.challenge ? `
          <div class="cs-section">
            <div class="cs-section-label">
              <span class="cs-section-num">01</span>
              <span>Challenge</span>
            </div>
            <div class="cs-section-body">
              <p>${p.challenge}</p>
            </div>
          </div>` : ''}

          ${p.approach ? `
          <div class="cs-section">
            <div class="cs-section-label">
              <span class="cs-section-num">02</span>
              <span>Data &amp; Approach</span>
            </div>
            <div class="cs-section-body">
              <p>${p.approach}</p>
            </div>
          </div>` : ''}

          ${p.results ? `
          <div class="cs-section">
            <div class="cs-section-label">
              <span class="cs-section-num">03</span>
              <span>Results</span>
            </div>
            <div class="cs-section-body">
              <p>${p.results}</p>
            </div>
          </div>` : ''}

          ${p.impact ? `
          <div class="cs-section cs-section--accent">
            <div class="cs-section-label">
              <span class="cs-section-num">04</span>
              <span>Impact</span>
            </div>
            <div class="cs-section-body">
              <p>${p.impact}</p>
            </div>
          </div>` : ''}

          ${p.images && p.images.length ? `
          <div class="cs-section">
            <div class="cs-section-label">
              <span class="cs-section-num">05</span>
              <span>Maps &amp; Visuals</span>
            </div>
            <div class="cs-section-body">
              <div class="cs-images">
                ${p.images.map(img => `<img src="${img}" alt="${p.title}" loading="lazy" />`).join('')}
              </div>
            </div>
          </div>` : ''}

        </div>

        <!-- right: sidebar -->
        <aside class="cs-sidebar">

          ${p.tools && p.tools.length ? `
          <div class="cs-sidebar-block">
            <h3 class="cs-sidebar-label">Tools used</h3>
            <ul class="cs-sidebar-list">
              ${p.tools.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>` : ''}

          ${p.client ? `
          <div class="cs-sidebar-block">
            <h3 class="cs-sidebar-label">Client / Context</h3>
            <p class="cs-sidebar-value">${p.client}</p>
          </div>` : ''}

          <div class="cs-sidebar-block">
            <h3 class="cs-sidebar-label">Year</h3>
            <p class="cs-sidebar-value">${p.year}</p>
          </div>

          ${p.theme ? `
          <div class="cs-sidebar-block">
            <h3 class="cs-sidebar-label">Theme</h3>
            <p class="cs-sidebar-value">${p.theme}</p>
          </div>` : ''}

          <div class="cs-sidebar-cta">
            <p>Interested in similar work?</p>
            <a href="#" id="contact-btn-cs" class="btn-primary" style="display:inline-block; margin-top:12px;">
              Get in touch
            </a>
          </div>

        </aside>
      </div>
    `;

    // wire the inline contact button to the popup
    const inlineBtn = document.getElementById('contact-btn-cs');
    const overlay   = document.getElementById('contact-overlay');
    if (inlineBtn && overlay) {
      inlineBtn.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('open');
      });
    }

  } catch (err) {
    article.innerHTML = `
      <div class="cs-hero-content" style="padding: 60px;">
        <a href="projects.html" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All projects
        </a>
        <p style="color:var(--text-dim); margin-top:40px;">Project not found.</p>
      </div>`;
    console.error('Failed to load project:', err);
  }
})();