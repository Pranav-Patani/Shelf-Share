import View from './View';
import Router from '../router';
import logo from 'url:../../img/logo.webp';

class HeaderView extends View {
  _parentElement = document.querySelector('.navigation');

  addHandlerNavigationLinks() {
    const checkBtn = document.querySelector('.header__check');
    const container = document.querySelector('.header__btn-container');
    container.addEventListener('click', e => {
      const link = e.target.closest('.router-link');
      if (!link) return;
      e.preventDefault();
      Router.navigateTo(link.dataset.route);
      checkBtn.checked = false;
    });
  }

  addHandlerActiveLink() {
    const container = document.querySelector('.header__btn-container');
    const links = document.querySelectorAll('.router-link');
    container.addEventListener('click', function (e) {
      const clicked = e.target.closest('.router-link');
      if (!clicked) return;
      links.forEach(link => link.classList.remove('nav-active'));
      clicked.classList.add('nav-active');
    });
  }

  addHandlerNavbarPosition() {
    const header = this._parentElement.querySelector(`.header`);
    const observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle('header--scrolled', !entry.isIntersecting);
    }, {});
    observer.observe(this._parentElement);
  }

  _generateMarkup() {
    return `
     <nav class="header">
        <div class="header__logo-container">
          <img
            src="${logo}"
            alt="logo"
            class="header__logo-container__img"
          />
        </div>
        
        <input type="checkbox" class="header__check" id="header-check" />
        <label for="header-check" class="header__hamburger-container">
          <div class="header__hamburger-container__hamburger"></div>
        </label>
        <div class="header__btn-container">
          <a href="/findBooks" class="header__btn-container__btn-link router-link" data-route="/findBooks">
            <button class="header__btn-container__btn-link__btn">Find Books</button>
          </a>
          
          <a href="/createCollections" class="header__btn-container__btn-link router-link" data-route="/createCollections">
            <button class="header__btn-container__btn-link__btn">Create Collections</button>
          </a>
          
          <a href="/" class="nav-active header__btn-container__btn-link router-link" data-route="/">
            <button class="header__btn-container__btn-link__btn">Home</button>
          </a>
          
          <a href="/bookmarks" class="header__btn-container__btn-link router-link" data-route="/bookmarks">
            <button class="header__btn-container__btn-link__btn header__btn-container__btn-link__btn-bm">Bookmarks</button>
          </a>
        </div>
      </nav>
    `;
  }
}

export default new HeaderView();
