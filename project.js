
// Selected-work routing: project 02 opens the dedicated Chinook case study.
const projectId = new URLSearchParams(window.location.search).get('project');
if (projectId === '02') {
  window.location.replace('chinook.html');
} else if (projectId === '03') {
  window.location.replace('unesa.html');
} else if (projectId === '04') {
  window.location.replace('majadigi.html');
}
const cursor = document.querySelector('#cursor');
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
const current = { x: mouse.x, y: mouse.y };

if (cursor) {
  let cursorRaf = 0;
  function tick() {
    const dx = mouse.x - current.x;
    const dy = mouse.y - current.y;
    current.x += dx * 0.22;
    current.y += dy * 0.22;
    cursor.style.transform = `translate3d(${current.x}px,${current.y}px,0)`;
    if (Math.abs(dx) > .08 || Math.abs(dy) > .08) cursorRaf = requestAnimationFrame(tick);
    else cursorRaf = 0;
  }
  addEventListener('pointermove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!cursorRaf) cursorRaf = requestAnimationFrame(tick);
  }, { passive: true });

  document.querySelectorAll('a, .mbg-phase-card, .mbg-figure, .method-line span').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

// Lightweight scroll reveals: IntersectionObserver avoids a continuous scroll handler,
// keeping the page responsive even with many research figures.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-visible'));
}

// Smooth native anchor behaviour without hijacking the wheel/touch scroll.
document.documentElement.style.scrollBehavior = 'smooth';

// Keep the reveal system intentionally one-shot: no scroll-position polling,
// so large figures remain smooth while the browser handles native scrolling.

