const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const FALLBACK_DATA = {
  name: "DAFFA FAZLY RASHIDAN",
  headline: "DAFFA FAZLY",
  subheadline: "Data Science / Analytics / Information Design",
  location: "Surabaya, East Java",
  availability: "Available for opportunities",
  email: "zle.rshdn@gmail.com",
  linkedin: "https://www.linkedin.com/in/daffa-fazly-rashidan-67aa472b0",
  about: "Fresh graduate in Data Science from Universitas Negeri Surabaya. I work at the intersection of data, technology, and visual communication — from raw datasets and analytics to machine learning, business intelligence, and decision-ready insights.",
  work: [
    ["01","PUBLIC SENTIMENT","Makan Bergizi Gratis","IndoBERTweet · 126K+ posts","85.50% accuracy · 0.8563 weighted F1"],
    ["02","CHINOOK","Sales & Performance Analytics","SQL · Tableau · Power BI","Business Intelligence Dashboard"],
    ["03","UNESA MOBILE","IEEE International Publication","Usability Testing · UX Research","2024"],
    ["04","MAJADIGI","Executive Dashboard Dataset","PostgreSQL · Pentaho · ETL","Public Sector Analytics"]
  ],
  experience: [
    ["2025","SEAL — DISKOMINFO JAWA TIMUR","Data Analyst Intern","ETL pipelines, government data integration, data quality, centralized data mart, and executive dashboard datasets."],
    ["2024","CELERATES ACCELERATION PROGRAM","Data Analyst & Business Intelligence","Pentaho ETL, PostgreSQL, SQL, Tableau, Power BI, and business analytics case studies."],
    ["2022—2026","UNIVERSITAS NEGERI SURABAYA","Bachelor of Data Science · GPA 3.68 / 4.00","Machine Learning, Data Analytics, Data Engineering, Artificial Intelligence, Business Intelligence."]
  ],
  skills: ["Python","SQL","PostgreSQL","Pandas","NumPy","Scikit-learn","PyTorch","TensorFlow","Tableau","Power BI","Pentaho","Git","GitHub","NLP","Machine Learning","Deep Learning","ETL","Business Intelligence"],
  phone: "083135364504"
};

const ICONS = {
  Python:"assets/icons/python.png", SQL:"assets/icons/sql.png", PostgreSQL:"assets/icons/postgresql.png",
  Pandas:"assets/icons/pandas.png", NumPy:"assets/icons/numpy.png", "Scikit-learn":"assets/icons/scikit-learn.png",
  PyTorch:"assets/icons/pytorch.png", TensorFlow:"assets/icons/tensorflow.png",
  Tableau:"assets/icons/tableau-fallback.png", "Power BI":"assets/icons/power-bi-fallback.png",
  Pentaho:"assets/icons/pentaho-fallback.png", Git:"assets/icons/git.png", GitHub:"assets/icons/github.png",
  NLP:"assets/icons/nlp.png", "Machine Learning":"assets/icons/machine-learning.png",
  "Deep Learning":"assets/icons/deep-learning.png", ETL:"assets/icons/etl.png",
  "Business Intelligence":"assets/icons/business-intelligence.png"
};

async function loadData() {
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(response.status);
    return await response.json();
  } catch {
    return FALLBACK_DATA;
  }
}

function render(data) {
  $("#availability").textContent = data.availability;
  $("#location").textContent = data.location;
  $("#aboutText").textContent = data.about;

  const email = $("#email");
  email.textContent = `${data.email} ↗`;
  email.href = `mailto:${data.email}`;
  const contactCta = $("#contactCta");
  if (contactCta) contactCta.href = `mailto:${data.email}`;
  $("#linkedin").href = data.linkedin;
  $("#phone").textContent = data.phone;

  $("#workStage").innerHTML = data.work.map(project => `
    <a class="work-item cursor-view" href="project.html?project=${project[0]}" aria-label="Open ${project[1]} project">
      <span class="work-num">${project[0]}</span>
      <div class="work-title">${project[1]}</div>
      <div class="work-info">${project[2]}<br>${project[3]}<br>${project[4]}</div>
    </a>`).join("");

  $("#experienceList").innerHTML = data.experience.map(exp => `
    <article class="exp">
      <div class="exp-date">${exp[0]}</div>
      <div><div class="exp-company">${exp[1]}</div><div class="exp-role">${exp[2]}</div></div>
      <div class="exp-text">${exp[3]}</div>
    </article>`).join("");

  $("#skillCloud").innerHTML = data.skills.map(skill => {
    const src = ICONS[skill] || "assets/icons/sql.png";
    return `<span class="skill" title="${skill}">
      <span class="skill-icon"><img src="${src}" alt="" loading="lazy" decoding="async"></span>
      <span class="skill-name">${skill}</span>
    </span>`;
  }).join("");
}

function setupPreloader() {
  const preloader = $("#preloader");
  if (!preloader) return;
  const counter = preloader.querySelector(".counter");
  const bar = preloader.querySelector(".line i");
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + 8 + Math.random() * 12);
    counter.textContent = String(Math.floor(progress)).padStart(3, "0");
    bar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => preloader.classList.add("hide"), 180);
    }
  }, 55);
}

function setupCursor() {
  const cursor = $("#cursor"), trail = $("#trail");
  if (!cursor) return;

  // Direct pointer tracking: no lerp/interpolation, so the custom cursor
  // stays locked to the real pointer position without perceptible lag.
  const moveCursor = e => {
    const x = e.clientX;
    const y = e.clientY;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (trail) {
      trail.style.transform = `translate3d(${x - 7}px,${y - 7}px,0)`;
    }
  };

  addEventListener("pointermove", moveCursor, { passive: true });

  const bindHover = () => {
    $$(".cursor-view").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("view");
        const word = cursor.querySelector(".cursor-word");
        if (word) word.textContent = "OPEN";
      });
      el.addEventListener("mouseleave", () => cursor.classList.remove("view"));
    });
    $$("a, .magnetic, .skill").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  };
  bindHover();
}

function setupMagnetics() {
  if (matchMedia("(pointer: coarse)").matches) return;
  $$(".magnetic").forEach(el => {
    let rect = null;
    el.addEventListener("pointerenter", () => { rect = el.getBoundingClientRect(); }, { passive: true });
    el.addEventListener("pointermove", e => {
      const r = rect || el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${dx * .12}px,${dy * .12}px,0)`;
    }, { passive: true });
    el.addEventListener("pointerleave", () => { rect = null; el.style.transform = ""; });
  });
}

function renderHero(viewportHeight, currentScrollY = window.scrollY || window.pageYOffset) {
  const hero = $(".hero");
  if (!hero) return;

  const progress = Math.min(1, Math.max(0, currentScrollY / Math.max(1, viewportHeight)));
  const smoothProgress = progress * progress * (3 - 2 * progress);
  const blur = Math.min(7, smoothProgress * 7);
  const prev = hero.dataset.motionProgress;
  const stamp = smoothProgress.toFixed(4);
  if (prev === stamp) return;
  hero.dataset.motionProgress = stamp;

  hero.style.setProperty("--hero-progress", stamp);
  hero.style.setProperty("--hero-blur", `${blur.toFixed(2)}px`);
  hero.style.setProperty("--hero-reveal", `${Math.min(100, progress * 100).toFixed(2)}%`);
  hero.classList.toggle("is-scrolling", progress > 0.03);

  // V23 intentionally keeps the hero name stable, so no redundant transform
  // writes are performed here. The portrait motion remains unchanged.
  const portrait = $(".hero-portrait");
  if (portrait) {
    portrait.style.setProperty("--portrait-y", `${(-smoothProgress * 3.5).toFixed(2)}vh`);
    portrait.style.setProperty("--portrait-scale", (1 + smoothProgress * 0.018).toFixed(4));
    portrait.style.setProperty("--portrait-opacity", (1 - smoothProgress * 0.12).toFixed(3));
  }
}

function setupScroll() {
  const progress = $(".scroll-progress i");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  let raf = 0;
  let lastFrameY = window.scrollY || 0;
  let latestY = lastFrameY;
  let lastTime = performance.now();
  let velocity = 0;
  let targetVelocity = 0;
  let metrics = [];
  const activeSections = new Set();

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

  function measure() {
    metrics = [
      document.querySelector("#about"),
      document.querySelector("#work"),
      document.querySelector(".experience"),
      document.querySelector("#stack"),
      document.querySelector("#certifications"),
      document.querySelector("#contact")
    ].filter(Boolean).map(el => ({
      el,
      top: el.getBoundingClientRect().top + window.scrollY,
      height: el.offsetHeight || window.innerHeight
    }));
  }

  function updateActiveSections(y, vh) {
    const pad = vh * .35;
    metrics.forEach(item => {
      const visible = item.top < y + vh + pad && item.top + item.height > y - pad;
      if (visible) {
        activeSections.add(item.el);
        item.el.classList.add("scroll-motion-active");
      } else if (activeSections.has(item.el)) {
        activeSections.delete(item.el);
        item.el.classList.remove("scroll-motion-active");
        item.el.style.setProperty("--scroll-velocity", "0");
        item.el.style.setProperty("--scroll-blur", "0px");
      }
    });
  }

  function setSectionMotion(el, motion) {
    const intensity = clamp(Math.abs(motion), 0, 2.8);
    el.style.setProperty("--scroll-velocity", motion.toFixed(4));
    el.style.setProperty("--scroll-skew", "0deg");
    el.style.setProperty("--scroll-blur", `${Math.min(12, intensity * 4.5).toFixed(2)}px`);
    el.style.setProperty("--scroll-stretch", "1");
  }

  function frame(now) {
    const y = latestY;
    const vh = window.innerHeight;
    const dt = Math.max(6, now - lastTime);
    const delta = y - lastFrameY;

    targetVelocity = Math.abs(delta) > .01
      ? clamp((delta / dt) * 16, -2.8, 2.8)
      : targetVelocity * .74;
    velocity += (targetVelocity - velocity) * .24;
    targetVelocity *= .76;
    lastFrameY = y;
    lastTime = now;

    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    if (progress) progress.style.height = `${clamp(y / max) * 100}%`;

    if (!reduced.matches) {
      // Hero writes stop once its progress is unchanged, so scrolling deep in the
      // page does not keep invalidating the first viewport.
      renderHero(vh, y);
      updateActiveSections(y, vh);
      activeSections.forEach(el => setSectionMotion(el, velocity));
      root.classList.toggle("perf-scrolling", Math.abs(velocity) > .035);
    } else {
      renderHero(vh, 0);
    }

    if (Math.abs(velocity) > 0.008 || Math.abs(targetVelocity) > 0.008 || Math.abs(window.scrollY - latestY) > .5) {
      latestY = window.scrollY || 0;
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      velocity = 0;
      targetVelocity = 0;
      activeSections.forEach(el => setSectionMotion(el, 0));
      root.classList.remove("perf-scrolling");
    }
  }

  function request() {
    latestY = window.scrollY || 0;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  measure();
  updateActiveSections(latestY, window.innerHeight);

  document.querySelectorAll(".intro, .work, .experience, .stack, .certifications-home, .contact")
    .forEach(section => section.classList.add("scroll-visible"));

  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", () => { measure(); request(); }, { passive: true });

  request();
}

function setupAnchors() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

(async function boot() {
  const data = await loadData();
  render(data);
  setupPreloader();
  setupCursor();
  setupMagnetics();
  setupScroll();
  setupAnchors();
})();


/* V23_HERO_STABILITY handled entirely in CSS — no per-scroll style writes. */


/* V23_FAST_WORK_HOVER */
(function V23_FAST_WORK_HOVER(){
  const workTargets = document.querySelectorAll(
    '.selected-work a, .selected-work .work-item, .selected-work .project-item, ' +
    '.work-list a, .work-list .work-item, .work-list .project-item'
  );
  const cursor = document.querySelector('#cursor, .cursor, .custom-cursor');
  if (!cursor || !workTargets.length) return;

  workTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transition = 'transform .10s ease, opacity .10s ease, width .10s ease, height .10s ease';
      cursor.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transition = 'transform .10s ease, opacity .10s ease, width .10s ease, height .10s ease';
      cursor.classList.remove('active');
    });
  });
})();

/* SPOTIFY_PLAYLIST_PLAYER */
(function setupSpotifyPlayer(){
  const player = document.getElementById('spotifyPlayer');
  const triggers = document.querySelectorAll('.music-trigger');
  const close = document.querySelector('.spotify-close');
  if (!player || !triggers.length) return;

  function setOpen(open){
    player.classList.toggle('is-open', open);
    player.setAttribute('aria-hidden', String(!open));
    triggers.forEach(btn => btn.setAttribute('aria-expanded', String(open)));
  }

  triggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!player.classList.contains('is-open'));
  }));

  close?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });
})();
