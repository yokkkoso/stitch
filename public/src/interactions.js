/** Ссылки, фиксированный хедер, окна услуг и декоративное движение фона. */
(() => {
  'use strict';

  const config = window.PortfolioConfig;
  const canvas = document.getElementById('portfolio');
  const serviceDialog = document.getElementById('service-dialog');

  function setExternalLink(link, url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  document.querySelectorAll('[data-contact="telegram"]').forEach((link) => {
    setExternalLink(link, config.telegramUrl);
    link.classList.add('contact-button');
  });
  document.querySelectorAll('[data-social]').forEach((link) => {
    setExternalLink(link, config.socialLinks[link.dataset.social]);
  });

  const contactDialog = document.getElementById('contact-dialog');
  const contactContent = window.PortfolioContent.contact;
  contactDialog.querySelector('h2').textContent = contactContent.title;
  contactDialog.querySelector('#contact-description').textContent = contactContent.description;
  contactDialog.querySelectorAll('[data-social]').forEach(link => {
    link.querySelector('span').textContent = contactContent.messengerNames[link.dataset.social];
  });
  document.querySelectorAll('[data-action="contact"]').forEach((button) => {
    button.classList.add('contact-button');
    button.addEventListener('click', () => contactDialog.showModal());
  });
  contactDialog.querySelector('button').addEventListener('click', () => contactDialog.close());
  contactDialog.addEventListener('click', (event) => {
    const rect = contactDialog.getBoundingClientRect();
    if (event.target === contactDialog && (event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom)) contactDialog.close();
  });

  // Хедер находится вне масштабируемого canvas: иначе transform делает fixed локальным.
  const header = document.createElement('header');
  header.className = 'site-header';
  const headerInner = document.createElement('div');
  headerInner.className = 'site-header__inner';
  ['.hero__brand', '.hero__navigation', '.hero__button'].forEach((selector) => {
    headerInner.append(canvas.querySelector(selector));
  });
  const navigation = headerInner.querySelector('nav');
  navigation.id = 'site-navigation';
  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'site-header__menu';
  menuButton.innerHTML = '<span></span><span></span><span></span>';
  menuButton.setAttribute('aria-label', 'Открыть меню');
  menuButton.setAttribute('aria-controls', navigation.id);
  menuButton.setAttribute('aria-expanded', 'false');
  function closeMenu() {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  }
  menuButton.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  headerInner.append(menuButton);
  header.append(headerInner);
  document.body.prepend(header);

  const telegramButton = headerInner.querySelector('.hero__button');
  function updateHeaderLayout() {
    headerInner.style.transform = 'none';
    const mobile = matchMedia('(max-width: 999px)').matches;
    const landscapePhone = matchMedia('(min-width: 600px) and (max-width: 999px) and (orientation: landscape)').matches;
    const phone = matchMedia('(max-width: 599px)').matches || landscapePhone;
    const phoneScale = landscapePhone ? Math.min(1.25, document.documentElement.clientWidth * .7 / 360) : 1;
    document.documentElement.style.setProperty('--header-height', phone ? `${48 * phoneScale}px` : mobile ? '72px' : '60px');
    const target = mobile ? navigation : headerInner;
    if (telegramButton.parentElement !== target) target.append(telegramButton);
    if (!mobile) closeMenu();
  }
  updateHeaderLayout();
  window.addEventListener('resize', updateHeaderLayout);

  // Неразрывный пробел удерживает короткие предлоги и союзы со следующим словом.
  // Исходные тексты в content.js остаются удобными для редактирования.
  function typographServiceText(text) {
    return text.replace(/(^|[\s(«„])((?:из-за|из-под|без|для|при|про|под|над|обо|ото|через|перед|между|около|после|до|за|из|ко|на|об|от|по|со|во|в|к|о|с|у|и|а|но))[ \t]+(?=\S)/giu, '$1$2\u00a0');
  }

  function renderService(key) {
    const service = window.PortfolioContent.services[key];
    serviceDialog.querySelector('h2').textContent = typographServiceText(service.title);
    serviceDialog.querySelector('.service-dialog__eyebrow').textContent = typographServiceText(service.caption);
    const items = service.items.map((text) => {
      const item = document.createElement('li');
      const dash = document.createElement('span');
      dash.className = 'service-dialog__dash';
      dash.setAttribute('aria-hidden', 'true');
      dash.textContent = '—';
      item.append(dash, document.createTextNode(typographServiceText(text)));
      return item;
    });
    serviceDialog.querySelector('ul').replaceChildren(...items);
    serviceDialog.scrollTop = 0;
  }

  // Состав услуг открывается рядом с выбранной ссылкой без затемнения страницы.
  let activeTrigger = null;
  function closeService() {
    serviceDialog.hidden = true;
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger = null;
  }
  function positionService() {
    if (!activeTrigger) return;
    const rect = activeTrigger.getBoundingClientRect();
    const gap = 12;
    const width = serviceDialog.offsetWidth;
    const height = serviceDialog.offsetHeight;
    const left = Math.min(innerWidth - width - gap, Math.max(gap, rect.right - width));
    const below = rect.bottom + gap;
    const top = below + height < innerHeight - gap ? below : Math.max(header.offsetHeight + gap, rect.top - height - gap);
    serviceDialog.style.left = `${left}px`;
    serviceDialog.style.top = `${top}px`;
  }
  canvas.querySelectorAll('[data-action="service"]').forEach((button) => {
    button.classList.add('service-details');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'service-dialog');
    button.removeAttribute('aria-haspopup');
    button.addEventListener('click', () => {
      const same = activeTrigger === button;
      closeService();
      if (same) return;
      activeTrigger = button;
      renderService(button.dataset.service);
      serviceDialog.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      positionService();
    });
  });
  serviceDialog.querySelector('button').addEventListener('click', closeService);
  document.addEventListener('click', (event) => {
    if (!serviceDialog.contains(event.target) && !event.target.closest('[data-action="service"]')) closeService();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeTrigger) {
      activeTrigger.focus({ preventScroll: true });
      closeService();
    }
  });
  window.addEventListener('scroll', () => {
    if (!activeTrigger) return;
    const rect = activeTrigger.getBoundingClientRect();
    if (rect.bottom < header.offsetHeight || rect.top > innerHeight) closeService();
    else positionService();
  }, { passive: true });
  window.addEventListener('resize', closeService);
})();

/** Вне экрана волны приостанавливаются, чтобы не нагружать страницу. */
(() => {
  const section = document.getElementById('consultation');
  let visible = false;
  const update = () => section.classList.toggle('waves-visible', visible && !document.hidden);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }, { rootMargin: '80px' }).observe(section);
  document.addEventListener('visibilitychange', update);
})();
