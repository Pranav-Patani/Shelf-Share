const header = document.querySelector('.header');
const navObs = new IntersectionObserver(
  entries => {
    header.classList.toggle('header__active', !entries[0].isIntersecting);
  },
  { threshold: 0.75 },
);

navObs.observe(document.querySelector('.hero'));
