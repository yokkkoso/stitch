/** Звёздное небо: выразительные боковые поля и мягкий мелкий слой под содержимым. */
(() => {
  'use strict';
  const background = document.createElement('div');
  background.className = 'ambient-background';
  background.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas');
  canvas.className = 'cosmos-canvas';
  background.append(canvas);
  document.body.prepend(background);
  const context = canvas.getContext('2d');
  if (!context) return;

  // Три спрайта рисуются один раз. В кадрах — только drawImage, без градиентов и контуров.
  function createSprite(kind) {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const paint = sprite.getContext('2d');
    const center = 32;
    const radius = kind === 'inner' ? 8 : 10;
    const extent = kind === 'inner' ? 4 : 3;
    const glow = paint.createRadialGradient(center, center, 0, center, center, radius * extent);
    glow.addColorStop(0, kind === 'inner' ? 'rgb(200, 182, 236)' : 'rgb(210, 195, 245)');
    if (kind !== 'inner') glow.addColorStop(.25, 'rgba(185, 154, 255, .55)');
    glow.addColorStop(1, 'rgba(185, 154, 255, 0)');
    paint.fillStyle = glow;
    paint.fillRect(0, 0, 64, 64);
    if (kind === 'sparkle') {
      paint.translate(center, center);
      paint.fillStyle = 'rgba(210, 195, 245, .65)';
      paint.beginPath();
      paint.moveTo(0, -radius * 1.8);
      paint.quadraticCurveTo(radius * .18, -radius * .18, radius * 1.3, 0);
      paint.quadraticCurveTo(radius * .18, radius * .18, 0, radius * 1.8);
      paint.quadraticCurveTo(-radius * .18, radius * .18, -radius * 1.3, 0);
      paint.quadraticCurveTo(-radius * .18, -radius * .18, 0, -radius * 1.8);
      paint.fill();
    }
    return sprite;
  }
  const sprites = { point: createSprite('point'), sparkle: createSprite('sparkle'), inner: createSprite('inner') };
  function paintStar(sprite, x, y, radius, alpha, baseRadius) {
    const size = radius * 64 / baseRadius;
    context.globalAlpha = alpha;
    context.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  }

  let seed = 7429;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  const stars = Array.from({ length: 140 }, (_, index) => ({
    side: index % 2, x: random(), y: random(),
    radius: index < 2 ? 6.5 : index % 7 === 0 ? 3.5 + random() * 2 : .8 + random() * 1.5,
    alpha: .3 + random() * .3,
    phase: random() * Math.PI * 2,
    period: 7000 + random() * 5000,
    depth: .12 + random() * .18,
    floatPeriod: 12000 + random() * 10000,
    floatX: 5 + random() * 9,
    floatY: 10 + random() * 16,
  }));
  // Отдельный набор после боковых звёзд сохраняет их исходный рисунок и движение.
  const innerStars = Array.from({ length: 150 }, () => ({
    x: random(), y: random(), radius: .7 + random() * 1.1,
    alpha: .14 + random() * .14, phase: random() * Math.PI * 2,
    period: 9000 + random() * 7000, depth: .06 + random() * .08,
  }));
  let width = 0, height = 0, gutter = 0, sideOverlap = 0, frame = 0, lastPaint = 0;

  function draw(time) {
    context.clearRect(0, 0, width, height);
    drawInnerStars(time);
    context.save();
    // Боковые звёзды заходят на 60 CSS-пикселей внутрь десктопного макета.
    context.beginPath();
    context.rect(0, 0, gutter, height);
    context.rect(width - gutter, 0, gutter, height);
    context.clip();
    const count = gutter > 0 ? Math.min(stars.length, Math.max(30, Math.round((gutter - sideOverlap) / 2)) * 2) : 0;
    for (let index = 0; index < count; index++) {
      const star = stars[index];
      const pulse = (Math.sin(time / star.period * Math.PI * 2 + star.phase) + 1) / 2;
      const radius = star.radius * (.65 + pulse * .85);
      const alpha = star.alpha * (.65 + pulse * .35);
      // Постоянное парение независимо от скролла, с отдельным ритмом для каждой звезды.
      const floatPhase = time / star.floatPeriod * Math.PI * 2 + star.phase;
      const driftX = Math.sin(floatPhase) * Math.min(star.floatX, gutter * .08);
      const driftY = Math.cos(floatPhase * .83) * star.floatY;
      // Максимум плотности немного отступает от края; к контенту звёзды затухают.
      // Четыре полосы от края: 70 → 100 → 70 → 50 по плотности.
      const weights = [70, 100, 70, 50];
      let position = star.x * 290;
      let band = 0;
      while (band < 3 && position > weights[band]) position -= weights[band++];
      const spread = (band + position / weights[band]) / 4;
      const distance = 8 + spread * Math.max(0, gutter - 8) + driftX;
      const x = star.side ? width - distance : distance;
      const t = Math.max(0, Math.min(1, (distance - gutter * .55) / (gutter * .45)));
      const fade = 1 - t * t * (3 - 2 * t);
      const fieldHeight = height + 80;
      const y = ((star.y * fieldHeight + driftY - scrollY * star.depth) % fieldHeight + fieldHeight) % fieldHeight - 40;
      paintStar(star.radius > 3 ? sprites.sparkle : sprites.point, x, y, radius, alpha * fade, 10);
    }
    context.restore();
  }
  function drawInnerStars(time) {
    const innerWidth = width;
    context.save();
    context.beginPath();
    context.rect(0, 0, innerWidth, height);
    context.clip();
    // Радиальный градиент даёт мягкое размытие без дорогого canvas-фильтра на каждом кадре.
    innerStars.forEach(star => {
      const phase = time / star.period * Math.PI * 2 + star.phase;
      const pulse = (Math.sin(phase) + 1) / 2;
      const radius = star.radius * (.8 + pulse * .4);
      const x = star.x * innerWidth + Math.sin(phase * .6) * 8;
      const fieldHeight = height + 40;
      const y = ((star.y * fieldHeight + Math.cos(phase * .7) * 14 - scrollY * star.depth) % fieldHeight + fieldHeight) % fieldHeight - 20;
      // На телефоне звёзды остаются живыми, но не конкурируют с мелким текстом.
      const mobileDim = width < 600 || (width < 1200 && width > height) ? .22 + .23 * Math.max(0, 1 - scrollY / 400) : 1;
      paintStar(sprites.inner, x, y, radius, star.alpha * (.7 + pulse * .3) * mobileDim, 8);
    });
    context.restore();
  }
  function tick(time) {
    if (time - lastPaint >= 50) { draw(time); lastPaint = time; }
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }
  function restart() {
    cancelAnimationFrame(frame);
    draw(performance.now());
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    sideOverlap = width >= 1200 ? 60 : 0;
    gutter = Math.max(0, (width - document.querySelector('.site-viewport').getBoundingClientRect().width) / 2) + sideOverlap;
    // Для размытого фона достаточно одного пикселя на CSS-пиксель, даже на Retina.
    const ratio = 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    restart();
  }
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', restart);
  resize();
})();

