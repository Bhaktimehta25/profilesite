// Nav shadow on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

document.getElementById('yr').textContent = new Date().getFullYear();

// Accordion timeline (first role starts open)
document.querySelectorAll('.job').forEach((job, i) => {
  const head = job.querySelector('.job-head');
  if (i === 0) job.classList.add('open');
  head.addEventListener('click', () => {
    const open = job.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
  });
});

// Filters
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.f;
    document.querySelectorAll('.job').forEach(job => {
      job.classList.toggle('hidden', f !== 'all' && !job.dataset.tags.split(' ').includes(f));
    });
  });
});

// Count-up numbers
const countUp = el => {
  const target = parseFloat(el.dataset.count);
  const dec = +el.dataset.dec || 0;
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1400;
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + (target * eased).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// Reveal on scroll
document.querySelectorAll('.stat, .story-grid, .job, .step, .mentor, .quote, .card, .contact .wrap')
  .forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    const num = e.target.querySelector('[data-count]');
    if (num) countUp(num);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Theme toggle (light by default, remembered per visitor)
(() => {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const sync = () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  sync();
  btn.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    if (dark) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
    sync();
  });
})();
