/** Настоящие отзывы берутся только из config.reviews. Уведомление не включает трекеры. */
(() => {
  'use strict';
  const dialog = document.getElementById('reviews-dialog');
  const list = dialog.querySelector('.reviews-list');
  const reviews = window.PortfolioConfig.reviews;
  const typography = text => text.replace(
    /(^|[^\p{L}\p{N}_])(в|во|на|к|ко|с|со|у|о|об|обо|от|ото|до|по|из|из-за|из-под|за|для|без|безо|при|про|под|подо|над|надо|перед|передо|через|между|и|а|но|не|ни)[ \t]+(?=\S)/giu,
    '$1$2\u00a0'
  );
  const preview = document.getElementById('review-preview');
  const previewImage = preview.querySelector('img');
  preview.querySelector('button').addEventListener('click', () => preview.close());
  preview.addEventListener('click', event => {
    if (event.target !== preview) return;
    const rect = preview.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) preview.close();
  });
  if (!reviews.length) {
    const empty = document.createElement('p');
    empty.className = 'reviews-empty';
    empty.textContent = 'Отзывы скоро появятся здесь.';
    list.append(empty);
  }
  reviews.forEach(review => {
    const card = document.createElement('article');
    card.className = 'review-card';
    const header = document.createElement('header');
    header.className = 'review-card__header';
    const identity = document.createElement('div');
    identity.className = 'review-card__identity';
    const title = document.createElement('h3');
    title.textContent = review.name;
    identity.append(title);
    if (review.username || review.role) {
      const author = document.createElement('p');
      author.className = 'review-card__author';
      author.textContent = typography([review.username, review.role].filter(Boolean).join(' · '));
      identity.append(author);
    }
    const quote = document.createElement('blockquote');
    quote.textContent = typography(review.text);
    const link = document.createElement(review.image ? 'button' : 'span');
    link.className = 'review-card__screenshot';
    link.textContent = 'Посмотреть скриншот';
    if (review.image) {
      link.type = 'button';
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', 'review-preview');
      link.setAttribute('aria-label', `Посмотреть скриншот отзыва: ${review.name}`);
      link.addEventListener('click', () => {
        previewImage.src = review.image;
        previewImage.alt = review.imageAlt || `Скриншот отзыва: ${review.name}`;
        preview.showModal();
      });
    } else {
      link.setAttribute('aria-disabled', 'true');
      link.title = 'Скриншот скоро появится';
    }
    header.append(identity, link);
    card.append(header, quote);
    list.append(card);
  });
  document.querySelector('[data-action="reviews"]').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  const notice = document.querySelector('.cookie-notice');
  const key = 'portfolio-storage-notice-v1';
  let acknowledged = false;
  try { acknowledged = localStorage.getItem(key) === 'acknowledged'; } catch { /* Хранилище может быть запрещено в браузере. */ }
  notice.hidden = acknowledged;
  notice.querySelector('button').addEventListener('click', () => {
    try { localStorage.setItem(key, 'acknowledged'); } catch { /* Закрываем и без постоянного хранения. */ }
    notice.hidden = true;
  });
})();
