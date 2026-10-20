(() => {
 const update = () => {
  const width = document.documentElement.clientWidth;
  const gutter = Math.min(64, Math.max(32, width / 30));
  const landscapePhone = matchMedia('(min-width: 600px) and (max-width: 999px) and (orientation: landscape)').matches;
  const phoneScale = Math.min(1.25, (width * .7) / 360);
  document.documentElement.style.setProperty('--phone-scale', landscapePhone ? phoneScale : 1);
  document.documentElement.style.setProperty('--desktop-scale', width >= 1000 ? (width - gutter * 2) / 1200 : 1);
 };
 update();
 window.addEventListener('resize', update);
})();
