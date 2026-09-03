(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const targets = [
    ...document.querySelectorAll('.panel'),
    ...document.querySelectorAll('.project-hero, .chinook-hero, .unesa-hero, .majadigi-hero, .cert-hero')
  ];

  const uniqueTargets = [...new Set(targets)];

  function inferTheme(el) {
    if (el.classList.contains('hero')) return 'light';
    if (el.dataset.theme) return el.dataset.theme;
    if (el.classList.contains('cert-hero') || el.classList.contains('majadigi-hero')) return 'light';
    if (el.closest('.cert-page') || el.closest('.majadigi-page')) return 'light';
    return 'dark';
  }

  uniqueTargets.forEach((el, index) => {
    if (el.querySelector(':scope > .ambient-sky')) return;

    el.classList.add('has-ambient-sky');
    el.dataset.ambientTheme = inferTheme(el);
    el.style.setProperty('--ambient-seed', String(index % 5));

    const layer = document.createElement('div');
    layer.className = 'ambient-sky';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <div class="ambient-sky__field">
        <i class="ambient-sky__blob ambient-sky__blob--a"></i>
        <i class="ambient-sky__blob ambient-sky__blob--b"></i>
        <i class="ambient-sky__blob ambient-sky__blob--c"></i>
        <i class="ambient-sky__blob ambient-sky__blob--d"></i>
      </div>`;
    el.prepend(layer);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('ambient-active', entry.isIntersecting);
      });
    }, { rootMargin: '18% 0px', threshold: 0.01 });
    uniqueTargets.forEach((el) => observer.observe(el));
  } else {
    uniqueTargets.forEach((el) => el.classList.add('ambient-active'));
  }

  if (reducedMotion.matches || window.matchMedia('(pointer: coarse)').matches) return;

  let raf = 0;
  let nextX = 0;
  let nextY = 0;
  const root = document.documentElement;

  function commitPointer() {
    root.style.setProperty('--ambient-pointer-x', `${(nextX * 10).toFixed(2)}px`);
    root.style.setProperty('--ambient-pointer-y', `${(nextY * 7).toFixed(2)}px`);
    raf = 0;
  }

  window.addEventListener('pointermove', (event) => {
    nextX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    nextY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(commitPointer);
  }, { passive: true });
})();
