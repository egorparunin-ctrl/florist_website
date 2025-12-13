(() => {
  const svg = document.getElementById('sheenSvg');
  const grad = document.getElementById('sheenGrad');
  const rect = document.getElementById('sheenRect');

  function resize(){
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  }

  // ======================
  // НАСТРОЙКИ (общие)
  // ======================
  const angleDeg = 65;   // угол луча
  const speed = 3.2;     // скорость “сползания” по скроллу

  let raf = 0;

  function update(){
    raf = 0;

    const s = window.scrollY || 0;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Мобильная логика: старт уводим дальше влево/вверх
    const isMobile = w <= 768;

    // Ширина луча: на телефоне чуть уже, чтобы “центр” не выглядел по центру
    const beamWidth = isMobile ? 1200 : 1700;

    // Старт центра луча:
    // На ПК было ок -0.10. На мобилке это слишком мало => уводим сильнее.
    const startX = isMobile ? -0.75 : -0.30;
    const startY = isMobile ? -0.95 : -0.78;

    const cx = w * startX;
    const cy = h * startY + s * speed;

    grad.setAttribute(
      'gradientTransform',
      `translate(${cx} ${cy}) rotate(${angleDeg}) scale(${beamWidth} 1)`
    );

    rect.setAttribute('x', cx - 7000);
    rect.setAttribute('y', cy - 7000);
  }

  function onScroll(){
    if (!raf) raf = requestAnimationFrame(update);
  }

  window.addEventListener('resize', () => { resize(); update(); });
  window.addEventListener('scroll', onScroll, { passive:true });

  resize();
  update();
})();
