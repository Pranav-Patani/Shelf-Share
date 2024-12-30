import View from './View';
import Router from '../router';
import logo from 'url:../../img/logo.webp';
import sprite from 'url:../../img/sprite.svg';

class HeaderView extends View {
  _parentElement = document.querySelector('.navigation');

  addHandlerNavigationLinks() {
    const checkBtn = document.querySelector('.header__check');
    this._parentElement.addEventListener('click', e => {
      const link = e.target.closest('.router-link');
      if (!link) return;
      e.preventDefault();
      Router.navigateTo(link.dataset.route);
      checkBtn.checked = false;
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
        <a href="/" class="router-link header__logo-container__link" data-route="/">
          <svg class="header__logo-container__logo">
            <use xlink:href="${sprite}#icon-logo"></use>
          </svg>
        </a>
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
          
          <a href="/" class="header__btn-container__btn-link router-link" data-route="/">
            <button class="header__btn-container__btn-link__btn">Home</button>
          </a>
          
          <a href="/bookmarks" class="header__btn-container__btn-link router-link" data-route="/bookmarks">
            <button class="header__btn-container__btn-link__btn header__btn-container__btn-link__btn-bm">Book Shelf</button>
          </a>
        </div>
      </nav>
    `;
  }
}

export default new HeaderView();
`<img
src="${logo}"
alt="logo"
class="header__logo-container__img"
/>`;
