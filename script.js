(function () {
  // Barcode dividers, generated from a seed so each one is stable
  document.querySelectorAll('.barcode').forEach(function (el) {
    var seed = el.getAttribute('data-seed') || 'x', h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0; }
    h = h || 1;
    function rnd() { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }
    var x = 0, W = 600, bars = '';
    while (x < W) {
      var w = 1 + Math.floor(rnd() * 5), gap = 1 + Math.floor(rnd() * 4);
      bars += '<rect x="' + x + '" y="0" width="' + w + '" height="40" fill="currentColor"/>';
      x += w + gap;
    }
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + bars + '</svg>';
  });

  var ids = ['home', 'about', 'contact', 'others'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menu = document.getElementById('menu');
  var toggle = document.getElementById('navToggle');
  var menuLinks = Array.prototype.slice.call(menu.querySelectorAll('a'));

  function setActive(id) {
    menuLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
    });
  }
  function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }

  // Smooth scroll for every in-page link
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', '#' + id); } catch (err) {}
      setActive(id);
      closeMenu();
    });
  });

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Highlight the section in view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { setActive(en.target.id); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) { var s = document.getElementById(id); if (s) { io.observe(s); } });
  }
  setActive('home');

  // Open at a section if the link carries one
  var start = (location.hash || '').slice(1);
  if (ids.indexOf(start) > -1) {
    var t = document.getElementById(start);
    if (t) { t.scrollIntoView({ behavior: 'auto', block: 'start' }); setActive(start); }
  }

  // Copy buttons, with a fallback that selects the text
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.getAttribute('data-copy'));
      if (!src) { return; }
      var text = src.textContent.trim();
      function done() { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); }
      function select() {
        var r = document.createRange(); r.selectNodeContents(src);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Selected';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, select);
      } else { select(); }
    });
  });
})();
