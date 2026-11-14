const heroNavigation = document.querySelector('.hero .nav');
const menuToggle = heroNavigation?.querySelector('.nav__toggle');
const menuLinks = heroNavigation?.querySelector('.nav__links');
const menuCta = heroNavigation?.querySelector('.nav__cta');
const compactLogo = document.querySelector('.compact-logo');

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

menuCta?.addEventListener('click', () => setMenuOpen(false));

document.addEventListener('click', (event) => {
  if (!heroNavigation?.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
    menuToggle?.focus();
  }
});

const desktopMenuQuery = window.matchMedia('(min-width: 601px)');
const secondScreen = document.querySelector('#about');
let isCompactMenu = false;
let compactMenuReadyFrame = 0;

const updateDesktopMenu = () => {
  const shouldBeCompact =
    desktopMenuQuery.matches &&
    secondScreen &&
    secondScreen.getBoundingClientRect().top <= 24;

  if (shouldBeCompact === isCompactMenu) return;

  isCompactMenu = shouldBeCompact;
  setMenuOpen(false);

  if (compactMenuReadyFrame) {
    cancelAnimationFrame(compactMenuReadyFrame);
    compactMenuReadyFrame = 0;
  }

  heroNavigation?.classList.remove('is-menu-ready');
  heroNavigation?.classList.toggle('is-compact', shouldBeCompact);
  compactLogo?.classList.toggle('is-visible', shouldBeCompact);

  if (shouldBeCompact) {
    compactMenuReadyFrame = requestAnimationFrame(() => {
      compactMenuReadyFrame = requestAnimationFrame(() => {
        compactMenuReadyFrame = 0;
        if (heroNavigation?.classList.contains('is-compact')) {
          heroNavigation.classList.add('is-menu-ready');
        }
      });
    });
  }
};

desktopMenuQuery.addEventListener('change', () => {
  setMenuOpen(false);
  updateDesktopMenu();
});

window.addEventListener('scroll', updateDesktopMenu, { passive: true });
window.addEventListener('resize', updateDesktopMenu);
updateDesktopMenu();

const customCursor = document.querySelector('.custom-cursor');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
let cursorX = -100;
let cursorY = -100;
let cursorFrame = 0;

const renderCustomCursor = () => {
  cursorFrame = 0;
  customCursor?.style.setProperty('--cursor-x', `${cursorX}px`);
  customCursor?.style.setProperty('--cursor-y', `${cursorY}px`);
};

const requestCursorRender = () => {
  if (cursorFrame) return;
  cursorFrame = requestAnimationFrame(renderCustomCursor);
};

document.addEventListener('mousemove', (event) => {
  if (!finePointerQuery.matches) return;

  cursorX = event.clientX;
  cursorY = event.clientY;
  document.documentElement.classList.add('custom-cursor-active');
  customCursor?.classList.add('is-visible');
  requestCursorRender();
}, { passive: true });

document.addEventListener('mousedown', () => {
  customCursor?.classList.add('is-down');
});

document.addEventListener('mouseup', () => {
  customCursor?.classList.remove('is-down');
});

document.addEventListener('mouseout', (event) => {
  if (!event.relatedTarget) customCursor?.classList.remove('is-visible', 'is-down');
});

window.addEventListener('blur', () => {
  document.documentElement.classList.remove('custom-cursor-active');
  customCursor?.classList.remove('is-visible', 'is-down');
});

finePointerQuery.addEventListener('change', () => {
  document.documentElement.classList.remove('custom-cursor-active');
  customCursor?.classList.remove('is-visible', 'is-down');
});

const form = document.querySelector('.signup__form');
const status = document.querySelector('.form-status');
const submitButton = form?.querySelector('button[type="submit"]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = 'Введи корректный e-mail.';
    form.reportValidity();
    return;
  }

  status.textContent = 'Отправляем…';
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Formspree returned ${response.status}`);
    }

    status.textContent = 'Спасибо! Заявка отправлена.';
    window.ym?.(114247548, 'reachGoal', 'lead_sent');
    form.reset();
  } catch (error) {
    console.error('Не удалось отправить форму:', error);
    status.textContent = 'Не получилось отправить. Попробуй ещё раз.';
  } finally {
    submitButton.disabled = false;
    form.removeAttribute('aria-busy');
  }
});

const audienceOptions = [...document.querySelectorAll('.audience__option')];
const audienceSection = document.querySelector('#audience');
const audienceContent = document.querySelector('.audience__content');
const audiencePreview = document.querySelector('.audience__preview');
const audienceImage = document.querySelector('.audience__preview img');
const benefitsSection = document.querySelector('#benefits');
const benefitItems = [...document.querySelectorAll('#benefits .feature')];
let currentAudienceOption = null;
let scrollPhotoFrame = 0;

const positionAudiencePreview = (option) => {
  if (!option || !audienceContent || !audiencePreview) return;

  if (window.matchMedia('(max-width: 600px)').matches) {
    audienceContent.style.removeProperty('--audience-preview-top');
    return;
  }

  const contentRect = audienceContent.getBoundingClientRect();
  const optionRect = option.getBoundingClientRect();
  const top =
    optionRect.top -
    contentRect.top +
    (optionRect.height - audiencePreview.offsetHeight) / 2;

  audienceContent.style.setProperty('--audience-preview-top', `${top}px`);
};

const showAudienceOption = (option) => {
  if (!option) return;

  if (currentAudienceOption === option) {
    positionAudiencePreview(option);
    return;
  }

  currentAudienceOption = option;
  audiencePreview?.classList.remove('is-visible');

  audienceOptions.forEach((item) => {
    item.classList.toggle('is-active', item === option);
  });

  if (audienceImage) {
    audienceImage.src = option.dataset.image;
    audienceImage.alt = option.dataset.alt;
  }

  positionAudiencePreview(option);
  requestAnimationFrame(() => {
    if (currentAudienceOption === option) {
      audiencePreview?.classList.add('is-visible');
    }
  });
};

const hideAudiencePreview = () => {
  currentAudienceOption = null;
  audienceOptions.forEach((item) => item.classList.remove('is-active'));
  audiencePreview?.classList.remove('is-visible');
};

audienceOptions.forEach((option) => {
  const image = new Image();
  image.src = option.dataset.image;
});

const getClosestScrollItem = (section, items) => {
  if (!section || !items.length) return null;

  const sectionRect = section.getBoundingClientRect();
  if (sectionRect.bottom <= 0 || sectionRect.top >= window.innerHeight) return null;

  const viewportAnchor = window.innerHeight * 0.56;

  return items.reduce((closest, item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.top + itemRect.height / 2;
    const closestRect = closest.getBoundingClientRect();
    const closestCenter = closestRect.top + closestRect.height / 2;

    return Math.abs(itemCenter - viewportAnchor) <
      Math.abs(closestCenter - viewportAnchor)
      ? item
      : closest;
  });
};

const updateScrollPhotoScenes = () => {
  scrollPhotoFrame = 0;

  const activeBenefit = getClosestScrollItem(benefitsSection, benefitItems);
  benefitItems.forEach((item) => {
    item.classList.toggle('is-active', item === activeBenefit);
  });

  const activeAudienceOption = getClosestScrollItem(
    audienceSection,
    audienceOptions,
  );

  if (activeAudienceOption) {
    showAudienceOption(activeAudienceOption);
  } else {
    hideAudiencePreview();
  }
};

const requestScrollPhotoUpdate = () => {
  if (scrollPhotoFrame) return;
  scrollPhotoFrame = requestAnimationFrame(updateScrollPhotoScenes);
};

window.addEventListener('resize', () => {
  if (currentAudienceOption) positionAudiencePreview(currentAudienceOption);
  requestScrollPhotoUpdate();
});

window.addEventListener('scroll', requestScrollPhotoUpdate, { passive: true });
requestScrollPhotoUpdate();

const problemSection = document.querySelector('.problem');
const problemImages = [...document.querySelectorAll('.problem__media img')];
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let problemAnimationFrame = 0;

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const setProblemImage = (index) => {
  problemImages.forEach((image, imageIndex) => {
    image.classList.toggle('is-current', imageIndex === index);
  });
};

const updateProblemAnimation = () => {
  problemAnimationFrame = 0;
  if (!problemSection) return;

  const rect = problemSection.getBoundingClientRect();
  const scrollDistance = Math.max(1, problemSection.offsetHeight - window.innerHeight);
  const rawProgress = reduceMotionQuery.matches
    ? 1
    : clamp(-rect.top / scrollDistance);
  const wordProgress = easeOutCubic(clamp((rawProgress - 0.02) / 0.62));
  const mediaProgress = easeOutCubic(clamp((rawProgress - 0.04) / 0.7));
  const copyProgress = easeOutCubic(clamp((rawProgress - 0.34) / 0.36));

  problemSection.style.setProperty(
    '--problem-left-x',
    `${-62 * (1 - wordProgress)}vw`,
  );
  problemSection.style.setProperty(
    '--problem-right-x',
    `${62 * (1 - wordProgress)}vw`,
  );
  problemSection.style.setProperty(
    '--problem-media-inset-y',
    `${44 * (1 - mediaProgress)}%`,
  );
  problemSection.style.setProperty(
    '--problem-media-inset-x',
    `${46 * (1 - mediaProgress)}%`,
  );
  problemSection.style.setProperty(
    '--problem-media-scale',
    String(0.82 + 0.18 * mediaProgress),
  );
  problemSection.style.setProperty(
    '--problem-media-y',
    `${48 * (1 - mediaProgress)}vh`,
  );
  problemSection.style.setProperty('--problem-copy-opacity', String(copyProgress));
  problemSection.style.setProperty(
    '--problem-copy-y',
    `${3 * (1 - copyProgress)}vw`,
  );

  const imageIndex = reduceMotionQuery.matches
    ? problemImages.length - 1
    : Math.min(problemImages.length - 1, Math.floor(rawProgress * 6));
  setProblemImage(imageIndex);
};

const requestProblemAnimationUpdate = () => {
  if (problemAnimationFrame) return;
  problemAnimationFrame = requestAnimationFrame(updateProblemAnimation);
};

window.addEventListener('scroll', requestProblemAnimationUpdate, { passive: true });
window.addEventListener('resize', requestProblemAnimationUpdate);
reduceMotionQuery.addEventListener('change', requestProblemAnimationUpdate);
requestProblemAnimationUpdate();

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
