/* =============================================================================
   Jillani SofTech, multi-page portfolio
   Shared behaviour for index / about / services / work / contact / 404
   ========================================================================== */
const RM = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const FINE = window.matchMedia('(pointer:fine)').matches;
const PAGE = document.body.dataset.page || 'index';

/* ---- toast ---------------------------------------------------------------- */
let _toastEl, _toastTimer;
function toast(msg, kind = 'good') {
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'toast';
    _toastEl.setAttribute('role', 'status');
    _toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = msg;
  _toastEl.className = 'toast ' + kind;
  requestAnimationFrame(() => _toastEl.classList.add('show'));
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => _toastEl.classList.remove('show'), 4200);
}

/* ---- preloader: full run once per session, instant on later pages ---------- */
(function () {
  const pre = document.getElementById('preload');
  if (!pre) return;
  if (sessionStorage.getItem('jsPreloaded')) {   // already seen this visit
    pre.style.transition = 'none';
    pre.classList.add('done');
    return;
  }
  const finish = () => {
    pre.classList.add('done');
    sessionStorage.setItem('jsPreloaded', '1');
  };
  window.addEventListener('load', () => setTimeout(finish, 650));
  setTimeout(finish, 2600);                      // safety net
})();

/* ---- active nav for the current page -------------------------------------- */
(function () {
  const map = { index: 'index.html', about: 'about.html', services: 'services.html', work: 'work.html', contact: 'contact.html' };
  const target = map[PAGE];
  if (!target) return;
  document.querySelectorAll('.nav-mid a').forEach(a => {
    if ((a.getAttribute('href') || '') === target) {
      a.classList.add('act');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* ---- duplicate marquee + testimonial rows for a seamless loop -------------- */
(function () {
  const mq = document.getElementById('mqTrack');
  if (mq) mq.innerHTML += mq.innerHTML;
  ['trow1', 'trow2'].forEach(id => { const r = document.getElementById(id); if (r) r.innerHTML += r.innerHTML; });
})();

/* ---- typing rotating headline (home only) --------------------------------- */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const lines = [
    'I Build Enterprise AI That Pays For Itself.',
    'RAG Systems. LLM Copilots. Real ROI.',
    'From Discovery to Production in Weeks.',
    '27+ Enterprises. 47% Efficiency Gains.'
  ];
  if (RM) { el.textContent = lines[0]; return; }
  let li = 0, ci = 0, del = false;
  (function tick() {
    const full = lines[li];
    el.textContent = full.slice(0, ci);
    if (!del) { ci++; if (ci > full.length) { del = true; setTimeout(tick, 1700); return; } }
    else { ci--; if (ci < 0) { del = false; li = (li + 1) % lines.length; ci = 0; } }
    setTimeout(tick, del ? 34 : 62);
  })();
})();

/* ---- particle network (hero) ---------------------------------------------- */
(function () {
  if (RM) return;
  const cv = document.getElementById('particles');
  const hero = document.getElementById('hero');
  if (!cv || !hero) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [], raf = null, running = true;
  function size() {
    W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight;
    const n = Math.min(Math.floor(W / 16), 85);
    pts = [];
    for (let i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283);
      ctx.fillStyle = 'rgba(56,189,248,.6)'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < 15000) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(56,189,248,' + (.16 * (1 - d / 15000)) + ')';
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    if (running) raf = requestAnimationFrame(draw);
  }
  size(); draw();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 150); });
  new IntersectionObserver(es => {
    running = es[0].isIntersecting;
    if (running && !raf) raf = requestAnimationFrame(draw);
    else if (!running) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 }).observe(hero);
})();

/* ---- scroll progress + nav state + floating buttons ----------------------- */
const nav = document.getElementById('topnav');
const prog = document.getElementById('progress');
const fab = document.getElementById('fab');
const totop = document.getElementById('totop');
function onScroll() {
  const st = window.scrollY || document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (prog) prog.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
  if (nav) nav.classList.toggle('scrolled', st > 30);
  if (fab) {
    fab.classList.toggle('show', st > window.innerHeight * .6);
    const ft = document.querySelector('footer');
    // tuck the floating button away once the footer is in view
    if (ft) fab.classList.toggle('tucked', ft.getBoundingClientRect().top < window.innerHeight - 40);
  }
  if (totop) totop.classList.toggle('show', st > window.innerHeight * .6);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- cursor spotlight ----------------------------------------------------- */
const glow = document.getElementById('cursorGlow');
if (FINE && glow) {
  window.addEventListener('mousemove', e => {
    glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ---- card spotlight ------------------------------------------------------- */
if (FINE) {
  document.querySelectorAll('.glass').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
}

/* ---- hero card 3D tilt ---------------------------------------------------- */
const hcard = document.getElementById('hcard');
if (hcard && FINE && !RM) {
  hcard.addEventListener('mousemove', e => {
    const r = hcard.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -6, ry = ((e.clientX - r.left) / r.width - .5) * 6;
    hcard.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  hcard.addEventListener('mouseleave', () => { hcard.style.transform = ''; });
}

/* ---- magnetic buttons ----------------------------------------------------- */
if (FINE && !RM) {
  document.querySelectorAll('.mag').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .32}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

/* ---- scroll reveal -------------------------------------------------------- */
const revObs = new IntersectionObserver(es => {
  es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('vis'); revObs.unobserve(x.target); } });
}, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.sr,.stagger').forEach(el => revObs.observe(el));
setTimeout(() => document.querySelectorAll('.sr:not(.vis),.stagger:not(.vis)').forEach(el => el.classList.add('vis')), 1500);

/* ---- skill bars ----------------------------------------------------------- */
const barObs = new IntersectionObserver(es => {
  es.forEach(x => { if (x.isIntersecting) { x.target.style.width = x.target.dataset.w + '%'; barObs.unobserve(x.target); } });
}, { threshold: .4 });
document.querySelectorAll('.ski-fill').forEach(b => barObs.observe(b));

/* ---- count-up (keeps prefix/suffix, e.g. "$100k+") ------------------------ */
function countEl(el) {
  const m = el.textContent.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return;
  const pre = m[1], numStr = m[2], suf = m[3], target = parseFloat(numStr);
  const dec = (numStr.split('.')[1] || '').length;
  let c = 0; const steps = 48, inc = target / steps;
  const t = setInterval(() => {
    c = Math.min(c + inc, target);
    el.textContent = pre + (dec ? c.toFixed(dec) : Math.round(c)) + suf;
    if (c >= target) clearInterval(t);
  }, 24);
}
const cntObs = new IntersectionObserver(es => {
  es.forEach(x => {
    if (x.isIntersecting && !x.target.dataset.done) {
      x.target.dataset.done = '1';
      if (!RM) countEl(x.target);
    }
  });
}, { threshold: .6 });
document.querySelectorAll('.count').forEach(el => cntObs.observe(el));

/* ---- portfolio filter (work page) ----------------------------------------- */
(function () {
  const btns = document.querySelectorAll('.pf-btn');
  if (!btns.length) return;
  const grid = document.getElementById('pgrid');
  btns.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('on') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true');
      const f = btn.dataset.f;
      let n = 0;
      document.querySelectorAll('.pc').forEach(c => {
        const show = f === 'all' || c.dataset.c === f;
        if (show) n++;
        c.style.transition = 'opacity .25s ease,transform .25s ease';
        if (show) { c.style.display = ''; c.style.opacity = '1'; c.style.transform = 'none'; }
        else { c.style.opacity = '0'; c.style.transform = 'scale(.96)'; setTimeout(() => { c.style.display = 'none'; }, 220); }
      });
      if (grid) {
        let msg = document.getElementById('pf-empty');
        if (!n && !msg) {
          msg = document.createElement('p');
          msg.id = 'pf-empty'; msg.className = 'ssub';
          msg.textContent = 'No projects in this category yet. Try another filter.';
          grid.parentNode.insertBefore(msg, grid.nextSibling);
        }
        if (msg) msg.style.display = n ? 'none' : 'block';
      }
    });
  });
})();

/* ---- section spy for the in-page jump bar --------------------------------- */
(function () {
  const links = document.querySelectorAll('.pbar-jump a[data-spy]');
  if (!links.length) return;
  const setOn = id => links.forEach(a => a.classList.toggle('on', a.dataset.spy === id));
  links.forEach(a => {
    const sec = document.getElementById(a.dataset.spy);
    if (!sec) return;
    new IntersectionObserver(e => { if (e[0].isIntersecting) setOn(a.dataset.spy); },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }).observe(sec);
  });
})();

/* ---- smooth scroll, including links written as page.html#section ----------
   Delegated so it also catches links whose href is rewritten later.
   A link to a section that lives on THIS page scrolls instead of reloading. */
const HERE = (location.pathname.split('/').pop() || 'index.html');

function inPageTarget(a) {
  const href = a.getAttribute('href') || '';
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || a.hasAttribute('download')) return null;
  if (/^[a-z]+:\/\//i.test(href)) return null;              // external
  if (a.target === '_blank') return null;
  const hash = href.indexOf('#');
  if (hash === -1) return null;
  const path = href.slice(0, hash);
  const id = href.slice(hash + 1);
  if (!id || id === 'main') return null;
  if (path && path !== HERE && !(HERE === 'index.html' && path === '')) return null;
  let el = null;
  try { el = document.getElementById(id); } catch (e) { return null; }
  return el;
}

document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  const t = inPageTarget(a);
  if (!t) return;
  e.preventDefault();
  t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#' + t.id);
  if (t.hasAttribute('tabindex')) t.focus({ preventScroll: true });
});

/* mark nav links that point at a section on this page, so hover/active read right */
document.querySelectorAll('.nav-mid a,.foot-col a').forEach(a => {
  if (inPageTarget(a)) a.dataset.samePage = '1';
});

/* ---- landing on another page's deep link (e.g. services.html#svc-rag) ----- */
window.addEventListener('load', () => {
  const h = location.hash;
  if (!h || h.length < 2) return;
  let t = null;
  try { t = document.querySelector(h); } catch (e) { return; }
  if (t) setTimeout(() => t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }), 400);
});

/* ---- mobile menu ---------------------------------------------------------- */
(function () {
  const btn = document.getElementById('navToggle'), menu = document.getElementById('navMenu');
  if (!btn || !menu) return;
  const setOpen = open => {
    menu.classList.toggle('show', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => setOpen(!menu.classList.contains('show')));
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('show')) { setOpen(false); btn.focus(); }
  });
  document.addEventListener('click', e => {
    if (menu.classList.contains('show') && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
})();

/* ---- FAQ accordion -------------------------------------------------------- */
(function () {
  const qs = document.querySelectorAll('.fitem .fq');
  if (!qs.length) return;
  qs.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const body = item.querySelector('.fa-body');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.fitem').forEach(it => {
        it.classList.remove('open');
        const b = it.querySelector('.fa-body'); if (b) b.style.maxHeight = '0px';
        const t = it.querySelector('.fq'); if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const open = document.querySelector('.fitem.open .fa-body');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    }, 150);
  });
})();

/* ---- back to top ---------------------------------------------------------- */
if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

/* ---- copy-to-clipboard buttons -------------------------------------------- */
document.querySelectorAll('[data-copy]').forEach(b => {
  b.addEventListener('click', async () => {
    const text = b.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      const orig = b.textContent;
      b.textContent = 'Copied';
      toast(text + ' copied to your clipboard', 'good');
      setTimeout(() => { b.textContent = orig; }, 2000);
    } catch (e) { toast('Copy failed. The address is ' + text, 'bad'); }
  });
});

/* ---- contact form --------------------------------------------------------- */
(function () {
  const form = document.getElementById('briefForm');
  if (!form) return;
  const btn = form.querySelector('.sbmt');
  const orig = btn.innerHTML;

  const setErr = (id, msg) => {
    const field = document.getElementById(id);
    const slot = document.getElementById('err-' + id);
    if (!field || !slot) return;
    field.closest('.fg').classList.toggle('bad', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    slot.textContent = msg || '';
  };

  const validate = () => {
    const em = document.getElementById('em').value.trim();
    const msg = document.getElementById('msg').value.trim();
    let first = null;
    setErr('em', ''); setErr('msg', '');
    if (!em) { setErr('em', 'Add an email address so I can reply.'); first = first || 'em'; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { setErr('em', 'That email address looks incomplete.'); first = first || 'em'; }
    if (msg.length < 20) { setErr('msg', 'Tell me a bit more. 20 characters or more helps me reply usefully.'); first = first || 'msg'; }
    return first;
  };

  ['em', 'msg'].forEach(id => {
    const f = document.getElementById(id);
    if (f) f.addEventListener('input', () => { if (f.closest('.fg').classList.contains('bad')) validate(); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = validate();
    if (bad) {
      document.getElementById(bad).focus();
      toast('Check the highlighted fields before sending.', 'bad');
      return;
    }
    const val = id => (document.getElementById(id).value || '').trim();
    const fn = val('fn'), co = val('co'), em = val('em'), sv = val('sv'), msg = val('msg');
    const sub = encodeURIComponent('Enterprise AI brief: ' + (co || fn || em));
    const body = encodeURIComponent(
      'Name: ' + fn + '\nCompany: ' + co + '\nEmail: ' + em + '\nSolution: ' + (sv || 'Not specified') + '\n\nProject:\n' + msg);

    window.location.href = 'mailto:m.g.jillani@jillanisoftech.com?subject=' + sub + '&body=' + body;

    btn.innerHTML = '<i class="fas fa-circle-check"></i> Brief ready in your email app';
    btn.classList.add('ok');
    btn.disabled = true;
    toast('Your email app should be opening. Nothing happened? Copy the address below.', 'good');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('ok'); btn.disabled = false; }, 6000);
  });
})();

/* ---- harden external links ------------------------------------------------ */
document.querySelectorAll('a[target="_blank"]').forEach(a => {
  const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
  if (!rel.includes('noopener')) rel.push('noopener');
  if (!rel.includes('noreferrer')) rel.push('noreferrer');
  a.setAttribute('rel', rel.join(' '));
});

/* ---- current year in the footer ------------------------------------------- */
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---- release the page-enter compositing layer -----------------------------
   animation-fill-mode kept <main> on a GPU layer, which forces grayscale
   antialiasing and renders all text at roughly half brightness. */
(function () {
  const m = document.getElementById('main');
  if (!m) return;
  const done = () => m.classList.add('entered');
  m.addEventListener('animationend', done, { once: true });
  setTimeout(done, 900);
})();

/* ---- brightness control ---------------------------------------------------
   Cycles the whole page between three levels and remembers the choice. */
(function () {
  // The three-level brightness switch was replaced by a single tuned palette.
  // This clears the attribute and key for anyone who stored a level previously.
  document.documentElement.removeAttribute('data-b');
  try { localStorage.removeItem('jsBright'); } catch (e) {}
})();
