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

const stepsSlider = document.querySelector('.steps');
const stepSlides = [...document.querySelectorAll('.step')];
const previousStep = document.querySelector('.slider-control--prev');
const nextStep = document.querySelector('.slider-control--next');

const moveSlider = (direction) => {
  if (!stepsSlider || !stepSlides.length) return;

  const slideWidth = stepSlides[0].getBoundingClientRect().width;
  const currentSlide = Math.round(stepsSlider.scrollLeft / slideWidth);
  const targetSlide = Math.min(
    stepSlides.length - 1,
    Math.max(0, currentSlide + direction),
  );

  stepsSlider.scrollTo({
    left: targetSlide * slideWidth,
    behavior: 'smooth',
  });
};

previousStep?.addEventListener('click', () => moveSlider(-1));
nextStep?.addEventListener('click', () => moveSlider(1));

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
