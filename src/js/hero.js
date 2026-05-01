import Swiper from 'swiper';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/bundle';

const API_URL = 'https://tasty-treats-backend.p.goit.global/api/events';

// Modal
const modalOverlay = document.querySelector('[data-modal-id="order-now"]');
const openBtn = document.querySelector('[data-modal-open="order-now"]');
const closeBtn = document.querySelector('[data-modal-close]');

if (modalOverlay && openBtn && closeBtn) {
  const openModal = () => {
    modalOverlay.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modalOverlay.classList.add('is-hidden');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('is-hidden')) closeModal();
  });
}

// Hero Slider
async function initHeroSlider() {

  const wrapperEl = document.querySelector(".swiper-wrapper");

  let events;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return;
    events = await response.json();
  } catch {
    return;
  }

  if (!Array.isArray(events) || events.length === 0) return;

  const slideWidth = window.innerWidth >= 768 ? 889 : 515;

  wrapperEl.innerHTML = events
    .map(
      (event, i) => `
      <li class="swiper-slide hero-slide hero-slide--${i}">
        <div class="hero-slide-inner">
          <div class="hero-card--chef" style="background-image: url('${event.cook.imgUrl}')"></div>
          <div class="hero-card--food-sm">
            <div class="hero-card-preview" style="background-image: url('${event.topic.previewUrl}')"></div>
            <p class="hero-card-caption-title">${event.topic.name}</p>
            <p class="hero-card-caption-sub">${event.topic.area}</p>
          </div>
          <div class="hero-card--food-lg" style="background-image: url('${event.topic.previewUrl}')"></div>
        </div>
      </li>
    `
    )
    .join('');

  const swiper = new Swiper('.hero-swiper', {
    modules: [Pagination, Autoplay],
    spaceBetween: 16,
    slidesPerView: 'auto',
    allowSlideNext: true,
    pagination: {
      el: '.hero-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    speed: 800,
    loop: true,
  });

}

initHeroSlider();
