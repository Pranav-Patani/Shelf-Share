import View from './View';

class MainView extends View {
  _parentElement = document.querySelector(`.main`);

  _generateMarkup() {
    console.log(this._parentElement);
    return `
              <nav class="header">
        <div class="header__logo-container">
          <img
            src="./src/img/logo.png"
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
            <a class="router-link" data-route="/findBooks" href="/findBooks"
              >Find Books</a
            >
          </li>
          <li class="header__btn-container__btn">
            <a
              class="router-link"
              data-route="/createCollections"
              href="/createCollections"
              >Create Collections</a
            >
          </li>

          <li class="header__btn-container__btn">
            <a class="router-link nav-active" data-route="/" href="/">Home</a>
          </li>
          <li class="header__btn-container__btn header__btn-container__btn-bk">
            <a class="router-link" data-route="/bookmarks" href="/bookmarks">
              Bookmarks
            </a>
          </li>
          <li class="header__btn-container__btn">
            <a class="router-link" data-route="/bookmarks" href="/bookmarks">
              <svg class="header__btn-container__btn__svg">
                <use xlink:href="./src/img/sprite.svg#icon-bookmark"></use></svg
            ></a>
          </li>
        </ul>
      </nav>
      <div class="container">
        <!-- HTML renders through Javascript -->
      </div>
      <footer class="footer">
        <div class="footer__heading heading-2">Book Wise</div>
        <div class="footer__social-links">
          <div class="footer__social-links__author">
            <h4 class="heading-4--white">Connect with author</h4>
            <div class="footer__social-links__author__links">
              <a href="https://github.com/Pranav-Patani" target="_blank"
                ><svg>
                  <use xlink:href="./src/img/sprite.svg#icon-github"></use></svg
              ></a>
              <a
                href="https://www.linkedin.com/in/pranavpatani/"
                target="_blank"
                ><svg>
                  <use
                    xlink:href="./src/img/sprite.svg#icon-linkedin"
                  ></use></svg
              ></a>
            </div>
          </div>

          <div class="footer__social-links__site">
            <h4 class="heading-4--white">Source Code</h4>
            <a href="https://github.com/Pranav-Patani/BookWise" target="_blank"
              ><svg>
                <use xlink:href="./src/img/sprite.svg#icon-github"></use></svg
            ></a>
          </div>
        </div>
        <div class="footer__text">BookWise &#169; 2024</div>
      </footer>
        `;
  }
}

export default new MainView();
