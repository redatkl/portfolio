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
  const sections = document.querySelectorAll('main [id]');

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(section => observer.observe(section));
  }

  // Fallback: highlight on click
  links.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').replace('#', '');
      setActive(id);
    });
  });
})();