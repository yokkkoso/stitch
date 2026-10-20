/** Запуск сайта: композиция блоков, контент и ссылки. */
(() => {
  'use strict';

  const config = window.PortfolioConfig;
  const sections = window.PortfolioSections;
  const canvas = document.getElementById('portfolio');

  function renderSections() {
    canvas.innerHTML = config.sectionOrder
      .map((name) => sections[name]())
      .join('\n');
  }

  function configureLinks() {
    canvas.querySelectorAll('[data-action="project"]').forEach(link => {
      if (!link.getAttribute('href')) link.href = config.projectUrl;
    });
    if (config.telegramUrl) {
      const telegram = [...canvas.querySelectorAll('a')]
        .find((link) => link.textContent.includes('Telegram'));
      if (telegram) telegram.href = config.telegramUrl;
    }

    // Ссылка на отзывы появляется после того, как владелец укажет адрес.
    const reviews = canvas.querySelector('[data-node-id="6495:444"]');
    if (reviews && config.reviewsUrl) {
      const link = document.createElement('a');
      link.className = reviews.className;
      link.href = config.reviewsUrl;
      link.replaceChildren(...reviews.childNodes);
      reviews.replaceWith(link);
    }
  }

  renderSections();
  const legalFooter = document.createElement('div');
  legalFooter.className = 'legal-footer';
  legalFooter.innerHTML = '<nav aria-label="Правовая информация"><a href="privacy.html">Политика обработки персональных данных</a><a href="agreement.html">Согласие на обработку персональных данных</a></nav>';
  canvas.append(legalFooter);
  canvas.querySelectorAll('.faq__item').forEach((item, index) => {
    const content = window.PortfolioContent.faq[index];
    item.querySelector('summary > span:last-child').textContent = content.question;
    item.querySelector('.faq__answer').textContent = content.answer;
    const summary = item.querySelector('summary');
    let animation = null;
    let expanded = item.open;
    summary.addEventListener('click', event => {
      event.preventDefault();
      expanded = !expanded;
      const startHeight = item.offsetHeight;
      animation?.cancel();
      // Измеряем естественную высоту, затем плавно меняем её в обе стороны.
      item.open = expanded;
      const endHeight = item.offsetHeight;
      item.open = true;
      item.style.overflow = 'hidden';
      animation = item.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 650, easing: 'cubic-bezier(.45, 0, .25, 1)' }
      );
      animation.onfinish = () => {
        item.open = expanded;
        item.style.overflow = '';
        animation = null;
      };
    });
  });
  configureLinks();

})();
