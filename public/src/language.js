/** Local RU/EN translation. No requests, image changes or external services. */
(() => {
  'use strict';
  const dictionary = window.PortfolioTranslations;
  const normalise = value => value.replace(/\s+/g, ' ').trim();
  const originals = new WeakMap();
  const key = 'portfolio-language';
  let language = 'ru';
  try { if (localStorage.getItem(key) === 'en') language = 'en'; } catch {}
  const attributes = ['alt', 'aria-label', 'title', 'placeholder'];
  function translate(value) {
    const source = normalise(value);
    const translated = dictionary[source];
    if (!translated) return value;
    return value.match(/^\s*/)[0] + translated + value.match(/\s*$/)[0];
  }
  function update(node, property, current, write) {
    let state = originals.get(node);
    if (!state) { state = {}; originals.set(node, state); }
    let entry = state[property];
    // A renderer may replace a caption or an accessible label after initial translation.
    if (!entry || current !== entry.rendered) entry = state[property] = { source: current };
    const next = language === 'en' ? translate(entry.source) : entry.source;
    entry.rendered = next;
    if (next !== current) write(next);
  }
  function visit(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (!root.parentElement?.closest('script, style, noscript, [data-no-translate]')) {
        update(root, 'text', root.nodeValue, value => { root.nodeValue = value; });
      }
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches('script, style, noscript, [data-no-translate]')) return;
    attributes.forEach(attribute => {
      if (root.hasAttribute(attribute)) update(root, attribute, root.getAttribute(attribute), value => root.setAttribute(attribute, value));
    });
    if (root.matches('meta[name="description"]')) update(root, 'content', root.content, value => { root.content = value; });
    root.childNodes.forEach(visit);
  }
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'language-switch';
  control.dataset.noTranslate = '';
  control.addEventListener('click', () => setLanguage(language === 'ru' ? 'en' : 'ru'));
  document.body.append(control);
  const notice = document.querySelector('.cookie-notice');
  function positionControl() {
    control.style.removeProperty('bottom');
    if (!notice || notice.hidden) return;
    const box = notice.getBoundingClientRect();
    const buttonBox = control.getBoundingClientRect();
    if (box.right > buttonBox.left && box.left < buttonBox.right) {
      control.style.bottom = Math.max(16, innerHeight - box.top + 12) + 'px';
    }
  }
  if (notice) {
    new ResizeObserver(positionControl).observe(notice);
    new MutationObserver(positionControl).observe(notice, { attributes: true, attributeFilter: ['hidden'] });
  }
  window.addEventListener('resize', positionControl);
  function setLanguage(code) {
    language = code;
    document.documentElement.lang = code;
    control.textContent = code.toUpperCase();
    control.setAttribute('aria-label', code === 'en' ? 'Current language: English. Switch to Russian' : 'Текущий язык: русский. Переключить на английский');
    control.title = code === 'en' ? 'Switch to Russian' : 'Переключить на английский';
    visit(document.head);
    visit(document.body);
    try { localStorage.setItem(key, code); } catch {}
    window.dispatchEvent(new Event('resize'));
  }
  setLanguage(language);
  new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'childList') record.addedNodes.forEach(visit);
      else visit(record.target);
    });
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
  window.PortfolioLanguage = { set: setLanguage, get: () => language };
})();
