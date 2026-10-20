/** Галерея авторских работ Digital Design. */
(() => {
  const imageVersion = 'digital-images-2';
  const imageUrl = path => `${path}?v=${imageVersion}`;
  const section = document.createElement('section');
  section.id = 'digital';
  section.className = 'digital-section';
  section.setAttribute('aria-label', 'Digital Design');
  section.innerHTML = `<div class="digital-banner"><div class="digital-banner__copy"><p class="digital-kicker">ВИЗУАЛЬНЫЕ ПРОЕКТЫ</p><h2>Digital Design</h2><p>Интерфейсы, авторские иконки, баннеры, афиши и оформление сообществ</p><button class="digital-button" type="button" aria-haspopup="dialog" aria-controls="digital-dialog">Смотреть работы</button></div><div class="digital-banner__preview" aria-hidden="true"><img src="${imageUrl('assets/digital/chill-profile/profile.webp')}" alt=""></div></div>`;
  document.getElementById('works').after(section);
  const dialog = document.createElement('dialog');
  dialog.id = 'digital-dialog';
  dialog.className = 'digital-dialog';
  dialog.setAttribute('aria-labelledby', 'digital-title');
  dialog.innerHTML = `<button class="digital-close" type="button" aria-label="Закрыть">×</button><p class="digital-kicker">ГАЛЕРЕЯ РАБОТ</p><h2 id="digital-title">Digital Design</h2><p class="digital-intro"><a href="#digital-profile">Chill Profile Elysium Creative</a>, <a href="#digital-dashboard">интерфейс Pixel School</a> и <a href="#digital-posters">афиши Turkistan Hub</a>.</p>`;
  const posters = [
    ['AI & FIGMA', 'ai-figma.webp'],
    ['Pizza Pitch', 'pizza-pitch.webp'],
    ['GenMedia Lab', 'genmedia-lab.webp'],
    ['AI FOR SMM', 'ai-for-smm.webp'],
  ];
  const posterSection = document.createElement('section');
  posterSection.className = 'digital-posters';
  posterSection.id = 'digital-posters';
  posterSection.innerHTML = `<h3>Афиши | Turkistan Hub</h3><div class="digital-posters__grid">${posters.map(([title, file]) => `<figure><img src="${imageUrl(`assets/digital/${file}`)}" alt="Афиша ${title}" loading="lazy" decoding="async"><figcaption>${title}</figcaption></figure>`).join('')}</div>`;
  dialog.append(posterSection);
  const dashboardSection = document.createElement('section');
  dashboardSection.className = 'digital-dashboard';
  dashboardSection.id = 'digital-dashboard';
  dashboardSection.innerHTML = `<h3>Dashboard | Pixel School</h3><p>Дизайн интерфейса аналитики образовательной платформы</p><img src="${imageUrl('assets/digital/pixel-school-dashboard.webp')}" alt="Дашборд Pixel School: успеваемость студентов, графики и показатели обучения" loading="lazy" decoding="async">`;
  posterSection.before(dashboardSection);
  const profileScreens = [
    { title: 'Профиль', file: 'profile.webp' },
    ...Array.from({ length: 9 }, (_, index) => ({ title: `Коллекция ${index + 1}`, file: `collection-${index + 1}.webp` })),
  ];
  const profileSection = document.createElement('section');
  profileSection.className = 'digital-dashboard digital-profile';
  profileSection.id = 'digital-profile';
  profileSection.innerHTML = `<h3>Chill Profile | Elysium Creative</h3><p>Профиль участника и коллекции персонажей</p><figure class="digital-profile__screen"><img src="${imageUrl('assets/digital/chill-profile/profile.webp')}" alt="Chill Profile — профиль участника" loading="lazy" decoding="async"><figcaption aria-live="polite">Профиль</figcaption></figure><div class="digital-profile__thumbnails" aria-label="Экраны Chill Profile">${profileScreens.map((screen, index) => `<button type="button" data-screen="${index}" aria-pressed="${index === 0}"><img src="${imageUrl(`assets/digital/chill-profile/${screen.file}`)}" alt="" loading="lazy" decoding="async"><span>${screen.title}</span></button>`).join('')}</div>`;
  const profileImage = profileSection.querySelector('.digital-profile__screen img');
  profileSection.querySelectorAll('[data-screen]').forEach(button => {
    button.addEventListener('click', () => {
      const screen = profileScreens[Number(button.dataset.screen)];
      profileImage.src = imageUrl(`assets/digital/chill-profile/${screen.file}`);
      profileImage.alt = `Chill Profile — ${screen.title}`;
      profileSection.querySelector('figcaption').textContent = screen.title;
      profileSection.querySelectorAll('[data-screen]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
  dashboardSection.before(profileSection);
  const emojiSection = document.createElement('section');
  emojiSection.className = 'digital-dashboard digital-emoji';
  emojiSection.innerHTML = '<h3>Custom Emoji</h3><img src="assets/digital/custom-emoji.webp?v=3" alt="Custom Emoji — коллекция из 14 авторских эмодзи" loading="lazy" decoding="async">';
  dashboardSection.before(emojiSection);
  // Общий компактный просмотрщик для серий баннеров.
  function createBannerCollection({ id, title, folder, banners }) {
    const block = document.createElement('section');
    block.id = id;
    block.className = 'digital-dashboard digital-banners';
    block.innerHTML = `<h3>${title}</h3><figure class="digital-banners__screen"><img src="${imageUrl(`${folder}/${banners[0].file}`)}" alt="${banners[0].title}" loading="lazy" decoding="async"><figcaption aria-live="polite">${banners[0].title}</figcaption></figure><div class="digital-banners__thumbnails" aria-label="Выбрать баннер">${banners.map((banner, index) => `<button type="button" aria-label="${banner.title}" aria-pressed="${index === 0}"><img src="${imageUrl(`${folder}/${banner.file}`)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>`;
    const image = block.querySelector('.digital-banners__screen img');
    block.querySelectorAll('button').forEach((button, index) => {
      button.addEventListener('click', () => {
        image.src = imageUrl(folder + '/' + banners[index].file);
        image.alt = banners[index].title;
        block.querySelector('figcaption').textContent = banners[index].title;
        block.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      });
    });
    return block;
  }
  const elysiumSection = createBannerCollection({
    id: 'digital-elysium', title: 'Баннеры Elysium', folder: 'assets/digital',
    banners: [
    {
        "title": "Правила VALORANT",
        "file": "elysium-gaming/valorant.webp"
    },
    {
        "title": "Регламенты работы",
        "file": "elysium-gaming/regulations.webp"
    },
    {
        "title": "Правила лобби",
        "file": "elysium-gaming/lobby.webp"
    },
    {
        "title": "Навигация | Игровая",
        "file": "elysium-gaming/navigation.webp"
    },
    {
        "title": "Правила Dota 2",
        "file": "elysium-gaming/dota-2.webp"
    },
    {
        "title": "Тиндер",
        "file": "elysium-tribunes/tinder-embed.webp"
    },
    {
        "title": "Сердца за любовь",
        "file": "elysium-tribunes/hearts-for-love-embed.webp"
    },
    {
        "title": "Две капли любви",
        "file": "elysium-tribunes/love-drops-embed.webp"
    },
    {
        "title": "Ночные свидания",
        "file": "elysium-tribunes/night-dating-embed.webp"
    },
    {
        "title": "Любовная лихорадка",
        "file": "elysium-tribunes/love-fever-embed.webp"
    },
    {
        "title": "Дебаты",
        "file": "elysium-tribunes/debates-embed.webp"
    },
    {
        "title": "Гадания",
        "file": "elysium-tribunes/fortune-telling-embed.webp"
    },
    {
        "title": "10 из 10, но",
        "file": "elysium-tribunes/ten-out-of-ten-embed.webp"
    },
    {
        "title": "Игры у костра",
        "file": "elysium-tribunes/campfire-games-embed.webp"
    },
    {
        "title": "Битва озвучки",
        "file": "elysium-tribunes/voice-battle-embed.webp"
    }
]
  });
  elysiumSection.classList.add('digital-elysium');
  const elysiumImage = elysiumSection.querySelector('.digital-banners__screen img');
  const elysiumCaption = elysiumSection.querySelector('figcaption');
  const resetElysium = () => {
    elysiumImage.src = imageUrl('assets/digital/elysium/room-challenge.webp');
    elysiumImage.alt = 'Room Challenge — конкурс личных комнат Elysium';
    elysiumCaption.textContent = '';
    elysiumSection.querySelectorAll('.digital-banners__thumbnails button').forEach(button => button.setAttribute('aria-pressed', 'false'));
  };
  resetElysium();
  elysiumSection.querySelectorAll('.digital-banners__thumbnails button').forEach(button => {
    button.addEventListener('click', () => {
      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'digital-elysium__reset';
      reset.textContent = 'Вернуть Room Challenge';
      reset.addEventListener('click', resetElysium);
      elysiumCaption.append(' · ', reset);
    });
  });
  const futuramaSection = createBannerCollection({
    id: 'digital-futurama',
    title: 'Баннеры для Futurama',
    folder: 'assets/digital/futurama',
    banners: [
    {
        "title": "Eventer",
        "file": "eventer.webp"
    },
    {
        "title": "Creative",
        "file": "creative.webp"
    },
    {
        "title": "Ad Maker",
        "file": "ad-maker.webp"
    },
    {
        "title": "Closemod",
        "file": "closemod.webp"
    },
    {
        "title": "Moderator",
        "file": "moderator.webp"
    },
    {
        "title": "Support",
        "file": "support.webp"
    },
    {
        "title": "Broadcaster",
        "file": "broadcaster.webp"
    },
    {
        "title": "Control",
        "file": "control.webp"
    }
],
  });
  dialog.append(posterSection, dashboardSection, profileSection, emojiSection, elysiumSection, futuramaSection);
  const intro = dialog.querySelector('.digital-intro');
  intro.innerHTML = '<a href="#digital-posters">Афиши</a> · <a href="#digital-dashboard">Dashboard</a> · <a href="#digital-profile">Chill Profile</a> · <a href="#digital-elysium">Работы Elysium</a> · <a href="#digital-futurama">Futurama</a>';
  dialog.querySelectorAll('.digital-intro a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const target = dialog.querySelector(link.getAttribute('href'));
      const top = target.getBoundingClientRect().top - dialog.getBoundingClientRect().top + dialog.scrollTop - 24;
      dialog.scrollTo({ top, behavior: 'smooth' });
    });
  });
  document.body.append(dialog);
  const openGallery = section.querySelector('button');
  const warmGallery = () => dialog.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  openGallery.addEventListener('pointerenter', warmGallery, { once: true });
  openGallery.addEventListener('focus', warmGallery, { once: true });
  openGallery.addEventListener('click', () => { warmGallery(); dialog.showModal(); });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
})();
