const PROFILE_URLS = {
  email: 'rohanbharat5@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rohanbharat314/',
  github: 'https://github.com/rohanb-21',
  leetcode: 'https://leetcode.com/u/rohanb_03/'
};

const PROJECTS = {
  raksha: {
    kicker: 'PROJECT 01 / FINAL-YEAR PROJECT',
    title: 'RakshaPay — SIM Swap Detection & Prevention',
    description: 'A risk-based authentication backend that evaluates transaction context and returns ALLOW, CHALLENGE, or BLOCK decisions to help prevent SIM-swap fraud.',
    bullets: [
      'Built a FastAPI REST API backed by PostgreSQL and indexed queries for low-latency risk lookups.',
      'Combined an XGBoost classifier with a rule layer across signals such as SIM-swap recency, device fingerprint, IP reputation, and transaction velocity.',
      'Added JWT authentication, per-IP rate limiting, progressive account lockout, and ORM-based SQL-injection prevention.',
      'Tested authentication flows, fraud scenarios, and edge cases with pytest.'
    ],
    tags: ['Python', 'FastAPI', 'XGBoost', 'PostgreSQL', 'SQLAlchemy', 'JWT', 'pytest'],
    url: 'https://rakshapay-sim-swap-detection.onrender.com/'
  },
  intrusion: {
    kicker: 'PROJECT 02 / CYBERSECURITY + ML',
    title: 'AI-Powered Network Intrusion Detection System',
    description: 'A network-traffic classification pipeline and dashboard for identifying suspicious activity, including DoS, Probe, R2L, and U2R attack categories.',
    bullets: [
      'Used Scapy for packet capture and extracted 41 NSL-KDD features per flow.',
      'Trained a Random Forest classifier on 125K records, reporting 80.1% accuracy.',
      'Tested in an isolated network with real nmap scans and DoS traffic.',
      'Built a FastAPI and JavaScript dashboard with a live threat feed, attack timeline, and geo-intelligence view.'
    ],
    tags: ['Python', 'FastAPI', 'Random Forest', 'Scapy', 'scikit-learn'],
    url: 'https://network-intrusion-detection-ykh2.onrender.com/'
  },
  mindmap: {
    kicker: 'PROJECT 03 / GENERATIVE AI',
    title: 'Smart Notes — Auto Mind Map Generator',
    description: 'A Generative AI application that transforms notes into structured, interactive mind maps using an LLM-backed workflow and a custom SVG rendering engine.',
    bullets: [
      'Built a Flask REST backend connected to Groq API and LLaMA 3.3 70B.',
      'Used retrieval-augmented generation (RAG) to ground responses in users’ own notes.',
      'Created custom Radial, Tree, and Cluster layouts with zoom, pan, and export using vanilla JavaScript and SVG.',
      'Deployed the app with a GitHub CI/CD workflow.'
    ],
    tags: ['Python', 'Flask', 'Groq API', 'RAG', 'LLaMA 3.3', 'JavaScript', 'SVG'],
    url: 'https://smart-mind-map-generator.onrender.com/'
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Responsive navigation
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#navLinks a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Scroll progress indicator
const progress = $('#scrollProgress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Reveal content as it enters the viewport
const revealItems = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));

// Project category filters
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(item => item.classList.toggle('active', item === button));
  const filter = button.dataset.filter;
  $$('.project-card').forEach(card => {
    const categories = (card.dataset.categories || '').split(/\s+/);
    card.hidden = filter !== 'all' && !categories.includes(filter);
  });
}));

// Accessible project detail dialog
const modal = $('#projectModal');
function openProject(key) {
  const project = PROJECTS[key];
  if (!project || !modal) return;
  $('#modalKicker').textContent = project.kicker;
  $('#modalTitle').textContent = project.title;
  $('#modalDescription').textContent = project.description;
  const bullets = $('#modalBullets');
  bullets.replaceChildren(...project.bullets.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
  const tags = $('#modalTags');
  tags.replaceChildren(...project.tags.map(text => {
    const tag = document.createElement('span'); tag.textContent = text; return tag;
  }));
  let live = $('#modalLiveLink');
  if (!live) {
    live = document.createElement('a');
    live.id = 'modalLiveLink'; live.className = 'button button-primary';
    live.target = '_blank'; live.rel = 'noopener'; live.textContent = 'Open live project ↗';
    $('#modalTags').parentElement.after(live);
  }
  live.href = project.url;
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', '');
}
$$('.project-details').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
$('#modalClose')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });

// Click, hover, or keyboard-focus the monogram to rotate it
const orb = $('.orb-core-wrap');
function rotateOrb() {
  if (!orb) return;
  orb.classList.remove('is-rotating');
  void orb.offsetWidth;
  orb.classList.add('is-rotating');
  window.setTimeout(() => orb.classList.remove('is-rotating'), 1050);
}
orb?.addEventListener('click', rotateOrb);
orb?.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); rotateOrb(); }
});

// Draggable 3D learning cube: pointer movement tilts it; click/keyboard rotates it.
const cube = $('.journey-3d');
let cubeRotation = { x: -8, y: -18 };
let dragStart = null;
let didDrag = false;
function renderCube() { if (cube) cube.style.transform = `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`; }
cube?.addEventListener('pointerdown', event => {
  dragStart = { x: event.clientX, y: event.clientY, ...cubeRotation };
  didDrag = false;
  cube.classList.add('dragging');
  cube.setPointerCapture?.(event.pointerId);
});
cube?.addEventListener('pointermove', event => {
  if (!dragStart) return;
  if (Math.abs(event.clientX - dragStart.x) + Math.abs(event.clientY - dragStart.y) > 4) didDrag = true;
  cubeRotation.y = dragStart.y + (event.clientX - dragStart.x) * 0.65;
  cubeRotation.x = Math.max(-65, Math.min(65, dragStart.x - event.clientY + dragStart.x * 0 + (event.clientY - dragStart.y) * -0.5));
  renderCube();
});
function stopCubeDrag() { if (!dragStart) return; dragStart = null; cube.classList.remove('dragging'); }
cube?.addEventListener('pointerup', stopCubeDrag);
cube?.addEventListener('click', () => { if (!didDrag) { cubeRotation.y += 360; renderCube(); } });
cube?.addEventListener('pointercancel', stopCubeDrag);
cube?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') cubeRotation.y -= 15;
  else if (event.key === 'ArrowRight') cubeRotation.y += 15;
  else if (event.key === 'ArrowUp') cubeRotation.x -= 15;
  else if (event.key === 'ArrowDown') cubeRotation.x += 15;
  else if (event.key === 'Enter' || event.key === ' ') { cubeRotation.y += 90; }
  else return;
  event.preventDefault(); renderCube();
});

// Attach the supplied social profile URLs and open them in a new tab.
$$('[data-profile]').forEach(link => {
  const url = PROFILE_URLS[link.dataset.profile];
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; }
  else {
    link.href = '#contact';
    link.title = 'Add your profile URL in script.js';
    link.addEventListener('click', event => {
      event.preventDefault();
      const label = link.textContent.replace('↗', '').trim();
      alert(`Add your ${label} URL in PROFILE_URLS at the top of script.js to activate this link.`);
    });
  }
});
