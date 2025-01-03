import View from './View';
import Router from '../router';
import sprite from 'url:../../img/sprite.svg';

class HeaderView extends View {
  _parentElement = document.querySelector('.navigation');

  addHandlerCloseMenu() {
    const checkBtn = document.querySelector(
      '.header__max-width-container__check',
    );
    const container = document.querySelector(`.container`);

    container.addEventListener('click', () => (checkBtn.checked = false));

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
      <div class="header__max-width-container">
        <div class="header__max-width-container__logo-container">
          <a href="/" class="router-link header__max-width-container__logo-container__link" data-route="/">
            <svg class="header__max-width-container__logo-container__link__logo">
              <use xlink:href="${sprite}#icon-logo"></use>
            </svg>
          </a>
        </div>
          
          <input type="checkbox" class="header__max-width-container__check" id="header-check" />
          <label for="header-check" class="header__max-width-container__hamburger-container">
            <div class="header__max-width-container__hamburger-container__hamburger"></div>
          </label>
          <div class="header__max-width-container__btn-container">
            <a href="/find-books" class="header__max-width-container__btn-container__btn-link router-link" data-route="/find-books">
              <button class="header__max-width-container__btn-container__btn-link__btn">Find Books</button>
            </a>
            
            <a href="/create-collections" class="header__max-width-container__btn-container__btn-link router-link" data-route="/create-collections">
              <button class="header__max-width-container__btn-container__btn-link__btn">Create Collections</button>
            </a>
            
            <a href="/" class="header__max-width-container__btn-container__btn-link router-link" data-route="/">
              <button class="header__max-width-container__btn-container__btn-link__btn">Home</button>
            </a>
            
            <a href="/bookmarks" class="header__max-width-container__btn-container__btn-link router-link" data-route="/bookmarks">
              <button class="header__max-width-container__btn-container__btn-link__btn header__max-width-container__btn-container__btn-link__btn-bm">Book Shelf</button>
            </a>
          </div>
      </div>
    </nav>
    `;
  }
}

export default new HeaderView();
