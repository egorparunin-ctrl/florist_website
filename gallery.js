(() => {
  const thumbs = Array.from(document.querySelectorAll('.gallery a.shot'));
  if (!thumbs.length) return;

  // Создаём лайтбокс один раз
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-backdrop" data-close="1"></div>
    <div class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Просмотр фото">
      <img class="lightbox-img" alt="Фото букета" />
      <div class="lightbox-ui">
        <div class="lightbox-counter"></div>
        <button class="lightbox-btn" type="button" data-close="1">Закрыть ✕</button>
      </div>
      <div class="lightbox-nav" aria-hidden="true">
        <button class="lightbox-arrow" type="button" data-prev="1">‹</button>
        <button class="lightbox-arrow" type="button" data-next="1">›</button>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const imgEl = lb.querySelector('.lightbox-img');
  const counterEl = lb.querySelector('.lightbox-counter');

  let index = 0;

  // Берём крупную картинку из href, если нет — из img src
  const sources = thumbs.map(a => a.getAttribute('href') || a.querySelector('img')?.src).filter(Boolean);

  function openAt(i){
    index = (i + sources.length) % sources.length;
    imgEl.src = sources[index];
    counterEl.textContent = `${index + 1} / ${sources.length}`;
    lb.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }

  function close(){
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    // разгрузить память на мобиле
    setTimeout(() => { imgEl.src = ''; }, 120);
  }

  function next(){ openAt(index + 1); }
  function prev(){ openAt(index - 1); }

  // Клик по превью
  thumbs.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openAt(i);
    });
  });

  // Кнопки
  lb.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) close();
    if (t && t.dataset && t.dataset.next) next();
    if (t && t.dataset && t.dataset.prev) prev();
  });

  // Клавиатура
  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Свайп (моб)
  let touchX = 0;
  let touchY = 0;
  lb.addEventListener('touchstart', (e) => {
    if (!lb.classList.contains('is-open')) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    if (!lb.classList.contains('is-open')) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;

    // если вертикальный жест сильнее — не листаем
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx < -40) next();
    if (dx > 40) prev();
  }, { passive: true });
})();
