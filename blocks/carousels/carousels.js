/* eslint-disable max-len */
/* eslint-disable radix */
import { mobileViewService } from '../../scripts/aem.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  if (mobileViewService().isMobile()) {
    const indicators = block.querySelectorAll('.carousel-slide-indicator');
    indicators.forEach((indicator, idx) => {
      if (idx !== slideIndex) {
        indicator.querySelector('button').removeAttribute('disabled');
      } else {
        indicator.querySelector('button').setAttribute('disabled', 'true');
      }
    });
  }
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: mobileViewService().isMobile() ? activeSlide.offsetLeft : activeSlide.offsetWidth * slideIndex,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const indicators = block.querySelectorAll('.carousel-slide-indicator');
      const slideIndicator = e.currentTarget.parentElement;

      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));

      if (!mobileViewService().isMobile()) {
        indicators.forEach((indicator) => {
          indicator.querySelector('button').removeAttribute('disabled');
        });

        slideIndicator.querySelector('button').setAttribute('disabled', 'true');
      }
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column) => {
    column.classList.add('carousel-slide-content');
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  const { hostname } = window.location;
  if (!hostname.includes('adobeaemcloud.com')) {
    block.className = 'carousel';

    carouselId += 1;
    block.setAttribute('id', `carousel-${carouselId}`);
    const rows = block.querySelectorAll(':scope > div');
    const isSingleSlide = rows.length < 2;
    const placeholders = await fetchPlaceholders();

    block.setAttribute('role', 'region');
    block.setAttribute('aria-roledescription', placeholders?.carousel || 'Carousel');

    const container = document.createElement('div');
    container.classList.add('carousel-slides-container');

    const slidesWrapper = document.createElement('ul');
    slidesWrapper.classList.add('carousel-slides');
    block.prepend(slidesWrapper);

    let slideIndicators;
    if (!isSingleSlide) {
      const slideIndicatorsNav = document.createElement('nav');
      slideIndicatorsNav.setAttribute('aria-label', placeholders?.carouselSlideControls || 'Carousel Slide Controls');
      slideIndicators = document.createElement('ol');
      slideIndicators.classList.add('carousel-slide-indicators');
      slideIndicatorsNav.append(slideIndicators);
      block.append(slideIndicatorsNav);

      const slideNavButtons = document.createElement('div');
      slideNavButtons.classList.add('carousel-navigation-buttons');
      slideNavButtons.innerHTML = `
        <button type="button" class= "slide-prev" aria-label="${placeholders?.previousSlide || 'Previous Slide'}"></button>
        <button type="button" class="slide-next" aria-label="${placeholders?.nextSlide || 'Next Slide'}"></button>
      `;

      container.append(slideNavButtons);
    }

    rows.forEach((row, idx) => {
      const slide = createSlide(row, idx, carouselId);
      slidesWrapper.append(slide);
      row.remove();
    });

    setTimeout(() => {
      const slides = block.querySelectorAll('.carousel-slide');
      const slidesLength = slides.length;
      const slidesWidth = slides[0].offsetWidth;
      const slidesWidthAll = slidesWidth * slidesLength;

      const blockWidth = block.offsetWidth;

      if (slidesWidthAll > blockWidth) {
        const bulletsLength = Math.ceil((slidesWidthAll - blockWidth) / slidesWidth) + 1;

        [...Array(bulletsLength)].forEach((_, idx) => {
          if (slideIndicators) {
            const indicator = document.createElement('li');
            indicator.classList.add('carousel-slide-indicator');
            indicator.dataset.targetSlide = idx;
            if (idx <= 0) {
              indicator.innerHTML = `<button disabled type="button" aria-label="${placeholders?.showSlide || 'Show Slide'} ${idx + 1} ${placeholders?.of || 'of'} ${rows.length}"></button>`;
            } else {
              indicator.innerHTML = `<button type="button" aria-label="${placeholders?.showSlide || 'Show Slide'} ${idx + 1} ${placeholders?.of || 'of'} ${rows.length}"></button>`;
            }
            slideIndicators.append(indicator);
          }
        });

        if (!isSingleSlide) {
          bindEvents(block);
        }
      }
    }, 100);

    container.append(slidesWrapper);
    block.prepend(container);
  }
}
