/* ─────────────────────────────────────────
   Reda portfolio — Main Script
   File: js/main.js
───────────────────────────────────────── */

/**
 * Navbar — active link highlighting
 * Marks the nav link whose target section is currently in view.
 */
(function () {
  const links = document.querySelectorAll('.nav-links a');

  // Set active link by matching href to current hash or section in view
  function setActive(id) {
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === id);
    });
  }

  // Intersection Observer: watch each section
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
      rootMargin: `-${getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height').trim()} 0px -60% 0px`,
      threshold: 0
    }
    );
    sections.forEach(section => observer.observe(section));

    // Contact popup
  const overlay = document.getElementById('contact-overlay');
  const openBtn = document.getElementById('contact-btn');
  const closeBtn = document.getElementById('contact-close');

  openBtn.addEventListener('click', e => {
    e.preventDefault();
    overlay.classList.add('open');
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
  
})();