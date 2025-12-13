(() => {
  const sheenGradient = document.getElementById('sheenGradient');
  let rafId = 0;

  // регулировки
  const angleDeg = 35;

  // на мобилке уводим сильнее, чтобы не казалось “по центру”
  const mobile = {
    baseX: -700,
    baseY: -700,
    endPoint: 2600,
    skew: 0.8,
  };

  const desktop = {
    baseX: 0,
    baseY: 0,
    endPoint: 2500,
    skew: 0.8,
  };

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function updateSheen() {
    rafId = 0;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 768;

    const cfg = isMobile ? mobile : desktop;

    const maxScroll = Math.max(1, document.body.scrollHeight - h);
    const scrollPercentage = clamp(window.scrollY / maxScroll, 0, 1);

    const currentPos = scrollPercentage * cfg.endPoint;
    const tx = cfg.baseX + currentPos * cfg.skew;
    const ty = cfg.baseY + currentPos;

    sheenGradient.setAttribute(
      'gradientTransform',
      `translate(${tx} ${ty}) rotate(${angleDeg})`
    );
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(updateSheen);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateSheen);
  updateSheen();
})();
