'use strict';

const works = [
  { src: 'img/portfolio/mixed/sunflower-bouquet.webp', title: 'Солнечный характер', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/floral-bust-art.webp', title: 'Цветочный арт-объект', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/blue-white-vertical-bouquet.webp', title: 'Бело-голубая вертикаль', category: 'mixed wedding', categoryLabel: 'Сборные / свадебные' },
  { src: 'img/portfolio/arrangements/garden-basket-arrangement.webp', title: 'Садовая корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/wedding/pastel-wedding-bouquet.webp', title: 'Нежная классика', category: 'wedding', categoryLabel: 'Свадебные букеты' },
  { src: 'img/portfolio/arrangements/pink-flower-bag.webp', title: 'Розовая сумочка', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/airy-branch-bouquet.webp', title: 'Воздух и движение', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/light-flower-bag.webp', title: 'Весенний свет', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/large-white-lilac-bouquet.webp', title: 'Большой бело-сиреневый букет', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/pastel-flower-basket.webp', title: 'Пастельная корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/open-stem-bouquet.webp', title: 'Открытая форма', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/asymmetric-planter-arrangement.webp', title: 'Асимметричная композиция', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/peach-green-bouquet.webp', title: 'Персик и зелень', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/white-green-basket.webp', title: 'Бело-зелёная корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/lilac-bouquet.webp', title: 'Сиреневое настроение', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/white-bust-arrangement.webp', title: 'Скульптурная композиция', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/powder-pink-bouquet.webp', title: 'Пудровая классика', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/mono/blue-hydrangea-mono.webp', title: 'Синяя гортензия', category: 'mono', categoryLabel: 'Монобукеты' },
  { src: 'img/portfolio/mixed/red-rose-bouquet.webp', title: 'Красные розы', category: 'mixed mono', categoryLabel: 'Сборные / монобукеты' }
];

const portfolioGrid = document.querySelector('#portfolio-grid');
const emptyMessage = document.querySelector('.portfolio-empty');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const categoryButtons = [...document.querySelectorAll('[data-filter-target]')];

function createPortfolio() {
  const fragment = document.createDocumentFragment();

  works.forEach((work, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portfolio-item reveal';
    button.dataset.categories = work.category;
    button.dataset.title = work.title;
    button.dataset.index = String(index);
    button.dataset.parallax = String(index % 3 === 0 ? -0.008 : index % 3 === 1 ? 0.007 : -0.004);
    button.setAttribute('aria-label', `Открыть фотографию: ${work.title}`);

    const image = document.createElement('img');
    image.src = work.src;
    image.alt = `${work.title}. ${work.categoryLabel}`;
    image.width = 1254;
    image.height = 1254;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.dataset.parallaxImage = String(index % 2 === 0 ? 0.035 : -0.03);

    button.append(image);
    fragment.append(button);
  });

  portfolioGrid.append(fragment);
}

createPortfolio();

function setFilter(filter) {
  let visibleCount = 0;

  document.querySelectorAll('.portfolio-item').forEach((item) => {
    const categories = item.dataset.categories.split(' ');
    const shouldShow = filter === 'all' || categories.includes(filter);
    item.classList.toggle('is-hidden', !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  emptyMessage.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filterTarget);
    document.querySelector('#portfolio').scrollIntoView({ behavior: 'smooth' });
  });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxCategory = document.querySelector('#lightbox-category');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');
let currentIndex = 0;

function getVisibleWorks() {
  return [...document.querySelectorAll('.portfolio-item:not(.is-hidden)')].map((item) => Number(item.dataset.index));
}

function showWork(index) {
  currentIndex = index;
  const work = works[index];
  lightboxImage.src = work.src;
  lightboxImage.alt = work.title;
  lightboxTitle.textContent = work.title;
  lightboxCategory.textContent = work.categoryLabel;
}

function openLightbox(index) {
  showWork(index);
  lightbox.showModal();
  document.body.classList.add('is-locked');
}

function closeLightbox() {
  lightbox.close();
  document.body.classList.remove('is-locked');
}

function moveLightbox(direction) {
  const visible = getVisibleWorks();
  const currentPosition = visible.indexOf(currentIndex);
  const nextPosition = (currentPosition + direction + visible.length) % visible.length;
  showWork(visible[nextPosition]);
}

portfolioGrid.addEventListener('click', (event) => {
  const item = event.target.closest('.portfolio-item');
  if (item) openLightbox(Number(item.dataset.index));
});

document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('click', () => {
    const index = works.findIndex((work) => work.src === card.dataset.image);
    if (index >= 0) openLightbox(index);
  });
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => moveLightbox(-1));
nextButton.addEventListener('click', () => moveLightbox(1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionFrame = 0;

function updateMotion() {
  const viewportCenter = window.innerHeight / 2;
  const compactViewport = window.innerWidth <= 820;
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  const imageItems = document.querySelectorAll('[data-parallax-image]');
  const ribbons = document.querySelectorAll('[data-scroll-track]');

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const distance = rect.top + rect.height / 2 - viewportCenter;

    if (compactViewport && item.classList.contains('contact-photo')) {
      item.style.translate = '0 0';
      return;
    }

    const max = compactViewport ? 9 : (item.classList.contains('hero-glow') ? 58 : 34);
    const effectiveSpeed = compactViewport ? speed * 0.18 : speed * 0.72;
    const offset = Math.max(-max, Math.min(max, distance * effectiveSpeed));
    item.style.translate = `0 ${offset}px`;
  });

  imageItems.forEach((image) => {
    const speed = Number(image.dataset.parallaxImage || 0);
    const rect = image.getBoundingClientRect();
    const distance = rect.top + rect.height / 2 - viewportCenter;
    const limit = compactViewport ? 6 : (image.closest('.hero-frame') ? 11 : 20);
    const effectiveSpeed = compactViewport ? speed * 0.16 : speed * 0.6;
    const shift = Math.max(-limit, Math.min(limit, distance * effectiveSpeed));
    image.style.setProperty('--image-shift', `${shift}px`);
  });

  ribbons.forEach((ribbon) => {
    const rect = ribbon.parentElement.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const normalized = Math.max(0, Math.min(1, progress));
    const distanceFactor = Number(ribbon.dataset.scrollDistance || 1);
    const direction = ribbon.dataset.scrollDirection === 'right' ? 'right' : 'left';
    const maxShift = compactViewport
      ? Math.min(window.innerWidth * 1.05, 390)
      : Math.min(window.innerWidth * .55, 720);
    const travel = maxShift * distanceFactor;
    const shift = direction === 'right'
      ? -travel + normalized * travel
      : -normalized * travel;
    ribbon.style.transform = `translate3d(${shift}px, 0, 0)`;
  });

  document.body.style.setProperty('--ambient-shift', `${Math.min(window.scrollY * .035, 110)}px`);
  motionFrame = 0;
}

function requestMotionUpdate() {
  if (!motionFrame) motionFrame = window.requestAnimationFrame(updateMotion);
}

if (!reduceMotion) {
  window.addEventListener('scroll', requestMotionUpdate, { passive: true });
  window.addEventListener('resize', requestMotionUpdate, { passive: true });
  updateMotion();

  const heroTiltZone = document.querySelector('[data-tilt-zone]');
  if (heroTiltZone && window.matchMedia('(pointer: fine)').matches) {
    heroTiltZone.addEventListener('pointermove', (event) => {
      const rect = heroTiltZone.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroTiltZone.style.setProperty('--tilt-y', `${x * 4.5}deg`);
      heroTiltZone.style.setProperty('--tilt-x', `${y * -4.5}deg`);
    });
    heroTiltZone.addEventListener('pointerleave', () => {
      heroTiltZone.style.setProperty('--tilt-y', '0deg');
      heroTiltZone.style.setProperty('--tilt-x', '0deg');
    });
  }

  document.querySelectorAll('[data-tilt-card]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--hover-x', `${x * 8}px`);
      card.style.setProperty('--hover-y', `${y * 8}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--hover-x', '0px');
      card.style.setProperty('--hover-y', '0px');
    });
  });
}

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  siteNav.classList.toggle('is-open', willOpen);
});

siteNav.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }
});

document.querySelector('#current-year').textContent = String(new Date().getFullYear());
