/* V30 — high-refresh shared scroll blur for detail pages
   requestAnimationFrame automatically follows the display refresh rate.
   Only elements currently near the viewport receive the filter, so the
   visual language stays the same without repainting the whole document. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [];
  const add = selector => document.querySelectorAll(selector).forEach(el => {
    if (!el.classList.contains('subpage-blur-target')) {
      el.classList.add('subpage-blur-target');
      targets.push(el);
    }
  });

  add('.project-heading, .project-intro, .project-meta, .project-back');
  add('.chinook-heading, .chinook-intro, .chinook-meta, .chinook-back, .chinook-dashboard-head, .chinook-facts, .chinook-takeaway');
  add('.unesa-heading, .unesa-intro, .unesa-meta, .unesa-back, .unesa-section-head, .unesa-copy, .unesa-result-copy, .unesa-quote, .unesa-award, .unesa-final, .unesa-pub');
  add('.mbg-section-head, .mbg-copy, .method-line, .method-note, .metric-list, .mbg-stat-strip, .final-line, .final-note');
  add('.cert-heading, .cert-meta, .cert-back, .cert-index, .cert-scroll, .cert-intro-grid, .cert-name, .cert-footer-copy, .cert-footer h2');
  add('.majadigi-heading, .majadigi-meta, .majadigi-back, .majadigi-intro, .majadigi-section-head, .majadigi-copy, .majadigi-pipeline, .majadigi-final');

  if (!targets.length) return;

  // Filter only content close to the viewport. This avoids maintaining GPU
  // filter layers for dozens of off-screen certificate cards and case-study rows.
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('subpage-inview', entry.isIntersecting));
    }, { rootMargin: '35% 0px 35% 0px', threshold: 0 });
    targets.forEach(el => visibility.observe(el));
  } else {
    targets.forEach(el => el.classList.add('subpage-inview'));
  }

  let lastY = window.scrollY || 0;
  let lastT = performance.now();
  let current = 0;
  let target = 0;
  let raf = 0;
  let stopTimer = 0;
  const root = document.documentElement;
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));

  function frame(now){
    const y = window.scrollY || 0;
    const dt = Math.max(6, now-lastT);
    const speed = Math.abs(y-lastY)/dt;
    target = Math.max(target * .72, clamp(speed * 34, 0, 8));
    current += (target-current) * .32;
    target *= .78;

    const next = current < .035 ? 0 : current;
    root.style.setProperty('--subpage-scroll-blur', next.toFixed(2)+'px');
    root.classList.toggle('perf-scrolling', next > .05);

    lastY=y;
    lastT=now;

    if (next > .02 || target > .02) raf=requestAnimationFrame(frame);
    else { raf=0; current=0; target=0; root.style.setProperty('--subpage-scroll-blur','0px'); root.classList.remove('perf-scrolling'); }
  }

  function request(){ if(!raf) raf=requestAnimationFrame(frame); }

  addEventListener('scroll', () => {
    request();
    clearTimeout(stopTimer);
    stopTimer=setTimeout(() => { target=0; request(); }, 70);
  }, {passive:true});
})();

/* V33 — shared subpage interaction parity.
   Keeps the floating Spotify control and magnetic micro-interactions working
   consistently on case-study and certificate pages. */
(() => {
  const player = document.getElementById('spotifyPlayer');
  const triggers = document.querySelectorAll('.music-trigger');
  const close = document.querySelector('.spotify-close');
  if (player && triggers.length && !player.dataset.controlsBound) {
    player.dataset.controlsBound = '1';
    const setOpen = open => {
      player.classList.toggle('is-open', open);
      player.setAttribute('aria-hidden', String(!open));
      triggers.forEach(btn => btn.setAttribute('aria-expanded', String(open)));
    };
    triggers.forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      setOpen(!player.classList.contains('is-open'));
    }));
    close?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  if (!matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      if (el.dataset.magneticBound) return;
      el.dataset.magneticBound = '1';
      let rect = null;
      el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); }, { passive: true });
      el.addEventListener('pointermove', e => {
        const r = rect || el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${dx * .10}px,${dy * .10}px,0)`;
      }, { passive: true });
      el.addEventListener('pointerleave', () => { rect = null; el.style.transform = ''; });
    });
  }
})();
