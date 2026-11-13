const heroNavigation = document.querySelector('.hero .nav');
const menuToggle = heroNavigation?.querySelector('.nav__toggle');
const menuLinks = heroNavigation?.querySelector('.nav__links');

const setMenuOpen = (isOpen) => {
  heroNavigation?.classList.toggle('is-open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
};

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuLinks?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a')) {
    setMenuOpen(false);
  }
});

document.addEventListener('click', (event) => {
  if (!heroNavigation?.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
    menuToggle?.focus();
  }
});

window.matchMedia('(min-width: 601px)').addEventListener('change', () => {
  setMenuOpen(false);
});

const form = document.querySelector('.signup__form');
const status = document.querySelector('.form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = 'Введи корректный e-mail.';
    return;
  }

  status.textContent = 'Спасибо! Форма пока работает в демонстрационном режиме.';
  form.reset();
});

const audienceOptions = [...document.querySelectorAll('.audience__option')];
const audienceImage = document.querySelector('.audience__preview img');

audienceOptions.forEach((option) => {
  const image = new Image();
  image.src = option.dataset.image;

  option.addEventListener('click', () => {
    audienceOptions.forEach((item) => {
      const isActive = item === option;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    if (audienceImage) {
      audienceImage.src = option.dataset.image;
      audienceImage.alt = option.dataset.alt;
    }
  });
});

const stepsSlider = document.querySelector('.steps');
const stepSlides = [...document.querySelectorAll('.step')];
const previousStep = document.querySelector('.slider-control--prev');
const nextStep = document.querySelector('.slider-control--next');

const getCurrentStepIndex = () => {
  if (!stepsSlider || !stepSlides.length) return 0;

  const sliderCenter = stepsSlider.scrollLeft + stepsSlider.clientWidth / 2;

  return stepSlides.reduce((closestIndex, slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const closestSlide = stepSlides[closestIndex];
    const closestCenter = closestSlide.offsetLeft + closestSlide.offsetWidth / 2;

    return Math.abs(slideCenter - sliderCenter) <
      Math.abs(closestCenter - sliderCenter)
      ? index
      : closestIndex;
  }, 0);
};

const updateStepOpacity = () => {
  const currentStep = getCurrentStepIndex();

  stepSlides.forEach((slide, index) => {
    slide.classList.toggle('is-upcoming', index > currentStep);
  });
};

const moveSlider = (direction) => {
  if (!stepsSlider || !stepSlides.length) return;

  const currentSlide = getCurrentStepIndex();
  const targetSlide = Math.min(
    stepSlides.length - 1,
    Math.max(0, currentSlide + direction),
  );
  const target = stepSlides[targetSlide];
  const targetLeft =
    target.offsetLeft + target.offsetWidth / 2 - stepsSlider.clientWidth / 2;

  stepsSlider.scrollTo({
    left: targetLeft,
    behavior: 'smooth',
  });
};

previousStep?.addEventListener('click', () => moveSlider(-1));
nextStep?.addEventListener('click', () => moveSlider(1));

let stepsScrollFrame;

stepsSlider?.addEventListener('scroll', () => {
  cancelAnimationFrame(stepsScrollFrame);
  stepsScrollFrame = requestAnimationFrame(updateStepOpacity);
}, { passive: true });

updateStepOpacity();

stepsSlider?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveSlider(-1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveSlider(1);
  }
});

const pricesSlider = document.querySelector('.prices');
const priceSlides = [...document.querySelectorAll('#pricing .prices article')];
const previousPrice = document.querySelector('.pricing-control--prev');
const nextPrice = document.querySelector('.pricing-control--next');

const movePricesSlider = (direction) => {
  if (!pricesSlider || !priceSlides.length) return;

  const slideWidth = priceSlides[0].getBoundingClientRect().width;
  const currentSlide = Math.round(pricesSlider.scrollLeft / slideWidth);
  const targetSlide = Math.min(
    priceSlides.length - 1,
    Math.max(0, currentSlide + direction),
  );

  pricesSlider.scrollTo({
    left: targetSlide * slideWidth,
    behavior: 'smooth',
  });
};

previousPrice?.addEventListener('click', () => movePricesSlider(-1));
nextPrice?.addEventListener('click', () => movePricesSlider(1));

pricesSlider?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    movePricesSlider(-1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    movePricesSlider(1);
  }
});
