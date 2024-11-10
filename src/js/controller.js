const header = document.querySelector('.header');
const navObs = new IntersectionObserver(
  entries => {
    header.classList.toggle('header__active', !entries[0].isIntersecting);
  },
  { threshold: 0.75 },
);

navObs.observe(document.querySelector('.hero'));

// Below code will be shifted to router.js later

const links = document.querySelectorAll('.router-link');
links.forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(link => link.classList.remove('nav-active'));
    a.classList.add('nav-active');
  }),
);
