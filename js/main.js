'use strict';

// Здесь находится список всех работ.
// Чтобы позже добавить новую фотографию, достаточно добавить ещё один объект
// по такому же образцу и положить файл в указанную папку.
const works = [
  { src: 'img/portfolio/mixed/sunflower-bouquet.png', title: 'Солнечный характер', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/floral-bust-art.png', title: 'Цветочный арт-объект', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/blue-white-vertical-bouquet.png', title: 'Бело-голубая вертикаль', category: 'mixed wedding', categoryLabel: 'Сборные / свадебные' },
  { src: 'img/portfolio/arrangements/garden-basket-arrangement.png', title: 'Садовая корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/wedding/pastel-wedding-bouquet.png', title: 'Нежная классика', category: 'wedding', categoryLabel: 'Свадебные букеты' },
  { src: 'img/portfolio/arrangements/pink-flower-bag.png', title: 'Розовая сумочка', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/airy-branch-bouquet.png', title: 'Воздух и движение', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/light-flower-bag.png', title: 'Весенний свет', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/large-white-lilac-bouquet.png', title: 'Большой бело-сиреневый букет', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/pastel-flower-basket.png', title: 'Пастельная корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/open-stem-bouquet.png', title: 'Открытая форма', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/asymmetric-planter-arrangement.png', title: 'Асимметричная композиция', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/peach-green-bouquet.png', title: 'Персик и зелень', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/white-green-basket.png', title: 'Бело-зелёная корзина', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/lilac-bouquet.png', title: 'Сиреневое настроение', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/arrangements/white-bust-arrangement.png', title: 'Скульптурная композиция', category: 'arrangements', categoryLabel: 'Композиции' },
  { src: 'img/portfolio/mixed/powder-pink-bouquet.png', title: 'Пудровая классика', category: 'mixed', categoryLabel: 'Сборные букеты' },
  { src: 'img/portfolio/mono/blue-hydrangea-mono.png', title: 'Синяя гортензия', category: 'mono', categoryLabel: 'Монобукеты' },
  { src: 'img/portfolio/mixed/red-rose-bouquet.png', title: 'Красные розы', category: 'mixed mono', categoryLabel: 'Сборные / монобукеты' }
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
    button.setAttribute('aria-label', `Открыть фотографию: ${work.title}`);

    const image = document.createElement('img');
    image.src = work.src;
    image.alt = `${work.title}. ${work.categoryLabel}`;
    image.width = 1254;
    image.height = 1254;
    image.loading = 'lazy';

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

// Просмотр фотографии на весь экран.
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

// Плавное появление блоков.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Лёгкий параллакс. На слабых устройствах и при включённом уменьшении
// анимации этот эффект автоматически отключается.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
    const offset = Math.max(-45, Math.min(45, distanceFromCenter * speed));
    item.style.translate = `0 ${offset}px`;
  });
  ticking = false;
}

if (!reduceMotion && window.innerWidth > 700) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();
}

// Мобильное меню.
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

// Текущий год в подвале.
document.querySelector('#current-year').textContent = String(new Date().getFullYear());
