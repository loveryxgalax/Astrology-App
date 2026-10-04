/* Kade Networks — page interactions */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('main-nav');
  var navToggle = document.getElementById('nav-toggle');
  function setNav(open) {
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navToggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  navToggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });

  /* ---------- Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var targets = links.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return id === 'top' ? document.body : document.getElementById(id);
  });
  function updateActive() {
    var y = window.scrollY + 120, current = 0;
    targets.forEach(function (el, i) { if (el && i > 0 && el.getBoundingClientRect().top + window.scrollY <= y) current = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = links.length - 1;
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ---------- Theme: OS -> Light -> Dark ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  var modes = ['os', 'light', 'dark'];
  function storedMode() { try { return localStorage.getItem('kade-theme') || 'os'; } catch (e) { return 'os'; } }
  function applyMode(mode) {
    if (mode === 'os') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', mode);
    var osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var label = mode === 'os' ? 'automatic (' + (osDark ? 'dark' : 'light') + ')' : mode;
    themeBtn.querySelector('use').setAttribute('href', mode === 'os' ? '#i-auto' : mode === 'dark' ? '#i-moon' : '#i-sun');
    themeBtn.setAttribute('aria-label', 'Colour theme: ' + label + '. Click to change.');
    try { mode === 'os' ? localStorage.removeItem('kade-theme') : localStorage.setItem('kade-theme', mode); } catch (e) {}
  }
  var mode = storedMode();
  applyMode(mode);
  themeBtn.addEventListener('click', function () {
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    applyMode(mode);
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { if (mode === 'os') applyMode('os'); });
  }

  /* ---------- Hotspot finder ---------- */
  var HOTSPOTS = [
    { name: 'Ikutha Market', keys: ['ikutha market', 'market'] },
    { name: 'Ikutha', keys: ['ikutha', 'ikutha town', 'kitui'] }
  ];
  var form = document.getElementById('hotspot-form');
  var input = document.getElementById('hotspot-q');
  var result = document.getElementById('hotspot-result');
  var chips = document.querySelectorAll('.chip');
  var contact = 'Call <a href="tel:+254710810790">0710 810790</a> or email <a href="mailto:support@kadenetworks.com?subject=Hotspot%20request">support@kadenetworks.com</a>';

  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function show(html) { result.innerHTML = html; result.classList.add('show'); }

  function search(q) {
    var term = q.trim().toLowerCase();
    chips.forEach(function (c) { c.classList.toggle('is-active', c.dataset.loc.toLowerCase() === term); });
    if (!term) { show('Type your area, estate or location to check for an active Kade WiFi hotspot.'); return; }
    var hit = null;
    HOTSPOTS.forEach(function (h) {
      if (!hit && h.keys.some(function (k) { return k.indexOf(term) !== -1 || term.indexOf(k) !== -1; })) hit = h;
    });
    if (hit) {
      show('✅ Kade WiFi is active at <strong>' + hit.name + '</strong>. Look for the “Kade WiFi Here” sign and connect to the Kade network.');
    } else {
      show('We don’t have an active hotspot listed for <strong>' + escapeHtml(q.trim()) + '</strong> yet. Share your location with our local team. ' + contact + '.');
    }
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); search(input.value); });
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.dataset.loc === 'other') {
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
        input.value = '';
        show('We’re expanding across Kitui County. Share your location with our local team to request a hotspot near you. ' + contact + '.');
        input.focus();
        return;
      }
      input.value = chip.dataset.loc;
      search(chip.dataset.loc);
    });
  });

  /* ---------- Loyalty: open the loyalty FAQ ---------- */
  document.getElementById('loyalty-link').addEventListener('click', function () {
    document.getElementById('faq-loyalty').open = true;
  });

  /* ---------- FAQs: "View All" opens / closes every answer ---------- */
  var faqAll = document.getElementById('faq-all');
  var faqs = document.querySelectorAll('.faq');
  faqAll.addEventListener('click', function () {
    var anyClosed = Array.prototype.some.call(faqs, function (d) { return !d.open; });
    faqs.forEach(function (d) { d.open = anyClosed; });
    faqAll.firstChild.nodeValue = anyClosed ? 'Collapse All FAQs ' : 'View All FAQs ';
  });
})();
