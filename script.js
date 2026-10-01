(function () {
  var root = document.documentElement;
  var body = document.body;

  // Keep the visitor's selected palette across visits.
  var themeToggle = document.getElementById('themeToggle');
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    var next = theme === 'light' ? 'dark' : 'light';
    if (themeToggle) {
      themeToggle.setAttribute('title', 'Switch to ' + next + ' mode');
      themeToggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    }
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#e2e2e2' : '#000000');
  }
  setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  if (themeToggle) themeToggle.addEventListener('click', function () {
    var theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(theme);
    try { localStorage.setItem('juni-theme', theme); } catch (e) {}
  });

  // Local time (Pacific)
  var fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
  } catch (e) { fmt = null; }
  function tick() {
    var s = fmt ? fmt.format(new Date()) + ' PT' : '';
    document.querySelectorAll('.js-time').forEach(function (el) { el.textContent = s; });
  }
  tick();
  setInterval(tick, 30000);

  // Accordion: one section open at a time
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var focusFrame = 0;
  var focusedSection = null;

  function stopSectionScroll() {
    cancelAnimationFrame(focusFrame);
    focusFrame = 0;
    root.classList.remove('is-focusing-section');
  }

  function stageOffset() {
    return Math.max(120, Math.min(180, window.innerHeight * 0.16));
  }

  // Short sections need enough room below them to reach the same position.
  function updateScrollSpace(target) {
    var oldSpace = parseFloat(root.style.getPropertyValue('--section-space')) || 0;
    var naturalHeight = root.scrollHeight - oldSpace;
    var needed = target.getBoundingClientRect().top + window.scrollY
      - stageOffset() + window.innerHeight - naturalHeight;
    root.style.setProperty('--section-space', Math.max(0, Math.ceil(needed)) + 'px');
  }

  function bringToStage(target, startingTop) {
    stopSectionScroll();
    root.classList.add('is-focusing-section');
    var started = performance.now();
    var duration = reducedMotion.matches ? 0 : 650;

    function move(now) {
      var progress = duration ? Math.min(1, (now - started) / duration) : 1;
      var eased = 1 - Math.pow(1 - progress, 3);
      var top = startingTop + (stageOffset() - startingTop) * eased;
      updateScrollSpace(target);
      // Follow the actual heading while any panel above it is collapsing.
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - top,
        behavior: 'instant'
      });
      if (progress < 1) focusFrame = requestAnimationFrame(move);
      else stopSectionScroll();
    }
    focusFrame = requestAnimationFrame(move);
  }

  // Give control back immediately when the visitor scrolls for themselves.
  window.addEventListener('wheel', stopSectionScroll, { passive: true });
  window.addEventListener('touchstart', stopSectionScroll, { passive: true });
  window.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Tab', ' '].indexOf(event.key) !== -1) {
      stopSectionScroll();
    }
  });

  function setOpen(target) {
    stopSectionScroll();
    var startingTop = target ? target.getBoundingClientRect().top : 0;
    focusedSection = target;
    sections.forEach(function (sec) {
      var on = sec === target;
      var btn = sec.querySelector('[data-toggle]');
      var panel = sec.querySelector('.panel');
      var sign = sec.querySelector('.sign');
      sec.classList.toggle('open', on);
      if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (panel) {
        panel.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      }
      if (sign) sign.textContent = on ? '\u2212' : '+';
    });
    body.classList.toggle('has-open', !!target);
    if (target) bringToStage(target, startingTop);
    else root.style.removeProperty('--section-space');
  }
  sections.forEach(function (sec) {
    var btn = sec.querySelector('[data-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      setOpen(sec.classList.contains('open') ? null : sec);
    });
  });

  // Keep the name fixed; tuck the social links away when reading a section.
  function updateHeaderLinks() {
    body.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', updateHeaderLinks, { passive: true });
  window.addEventListener('resize', function () {
    if (focusedSection) updateScrollSpace(focusedSection);
  });
  updateHeaderLinks();

  var toTop = document.getElementById('toTop');
  if (toTop) toTop.addEventListener('click', function (e) {
    e.preventDefault();
    stopSectionScroll();
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
})();
