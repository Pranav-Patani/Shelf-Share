import View from './View';
import logo from 'url:../../img/logo.png';
import sprite from 'url:../../img/sprite.svg';

class NavigationView extends View {
  _parentElement = document.querySelector('.navigation');

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
        <ul class="header__btn-container">
          <li class="header__btn-container__btn">
            <a class="header__btn-container__btn__link router-link" data-route="/findBooks" href="/findBooks"
              >Find Books</a
            >
          </li>
          <li class="header__btn-container__btn">
            <a
              class="header__btn-container__btn__link router-link"
              data-route="/createCollections"
              href="/createCollections"
              >Create Collections</a
            >
          </li>

          <li class="nav-active header__btn-container__btn">
            <a class="nav-active header__btn-container__btn__link router-link" data-route="/" href="/">Home</a>
          </li>
          <li class="header__btn-container__btn header__btn-container__btn-bk">
            <a class="header__btn-container__btn__link router-link" data-route="/bookmarks" href="/bookmarks">
              Bookmarks
            </a>
          </li>
          <li class="header__btn-container__btn">
            <a class="header__btn-container__btn__link router-link" data-route="/bookmarks" href="/bookmarks">
              <svg class="header__btn-container__btn__svg">
                <use xlink:href="${sprite}#icon-bookmark"></use></svg
            ></a>
          </li>
        </ul>
      </nav>
    `;
  }
}

export default new NavigationView();
