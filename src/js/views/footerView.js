import View from './View';
import sprite from 'url:../../img/sprite.svg';
import logo from 'url:../../img/logo.webp';

class FooterView extends View {
  _parentElement = document.querySelector('.footer');

  _generateMarkup() {
    return `
   <footer class="footer">
    <img class="footer__logo" src="${logo}" alt="bookwise" />
    <h2 class="heading-2--white footer__heading">BookWise</h2>
    <a href="https://github.com/Pranav-Patani/BookWise" target="_blank" class="footer__link">
      <div class="footer__link__text-box">
        <svg class="footer__link__text-box__svg">
          <use xlink:href="${sprite}#icon-github"></use>
        </svg>
        <p class="paragraph--big footer__link__text-box__text">
          Pranav-Patani/BookWise
        </p>
      </div>
    </a>
   </footer>
    `;
  }
}

export default new FooterView();
