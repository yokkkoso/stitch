/** Плавные якоря, однократное появление элементов и фон на всей длине сайта. */
(() => {
  'use strict';
  let scrollFrame = 0;
  function stopScroll() { cancelAnimationFrame(scrollFrame); }
  function goTo(id, animate = true) {
    const target = document.getElementById(id);
    if (!target) return;
    stopScroll();
    const start = scrollY;
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const destination = Math.max(0, Math.min(target.getBoundingClientRect().top + start - headerHeight - 12, document.documentElement.scrollHeight - innerHeight));
    if (!animate) {
      scrollTo({ top: destination, behavior: 'instant' });
      return;
    }
    // Элементы проявляются через IntersectionObserver и при переходах из меню.
    const duration = Math.min(1600, 900 + Math.abs(destination - start) * .18);
    const started = performance.now();
    function step(now) {
      const t = Math.min(1, (now - started) / duration);
      const ease = (1 - Math.cos(Math.PI * t)) / 2;
      scrollTo({ top: start + (destination - start) * ease, behavior: 'instant' });
      if (t < 1) scrollFrame = requestAnimationFrame(step);
    }
    scrollFrame = requestAnimationFrame(step);
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    if (!document.getElementById(id)) return;
    event.preventDefault();
    history.pushState(null, '', url.hash);
    goTo(id);
  });
  addEventListener('wheel', stopScroll, { passive: true });
  addEventListener('touchstart', stopScroll, { passive: true });
  addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopScroll();
  });
  addEventListener('popstate', () => goTo(location.hash.slice(1) || 'home'));
  if (location.hash) requestAnimationFrame(() => goTo(location.hash.slice(1), false));

  // Однократное появление: сверху вниз, слева направо.
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).sort((a, b) => {
      const ar = a.boundingClientRect, br = b.boundingClientRect;
      return Math.abs(ar.top - br.top) < 24 ? ar.left - br.left : ar.top - br.top;
    }).forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 60}ms`);
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -64px 0px' });
  document.querySelectorAll('#portfolio > section, #portfolio > footer').forEach(section => {
    [...section.children].sort((a, b) => {
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      return Math.abs(ar.top - br.top) < 20 ? ar.left - br.left : ar.top - br.top;
    }).forEach(element => {
      const rect = element.getBoundingClientRect();
      if (!rect.height || rect.top < innerHeight) return;
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
  });
  document.addEventListener('focusin', event => event.target.closest('.scroll-reveal')?.classList.add('is-revealed'));

})();
