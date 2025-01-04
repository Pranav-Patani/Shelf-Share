import View from './View';
import sprite from 'url:../../img/sprite.svg';

class FooterView extends View {
  _parentElement = document.querySelector('.footer');

  _generateMarkup() {
    return `
   <footer class="footer">
   <div class="footer__logo">
    <svg class="footer__logo--book">
      <use xlink:href="${sprite}#icon-logo-book--white"></use>
    </svg>
     <svg class="footer__logo--text">
      <use xlink:href="${sprite}#icon-logo-text--white"></use>
    </svg>
   </div>

   <p class="paragraph footer__sub-text">Self Care with Shelf Share
    <svg class="footer__sub-text__svg">
      <use xlink:href="${sprite}#icon-winking-face"></use>
    </svg>
   </p>
   
    <a href="https://github.com/Pranav-Patani/Shelf-Share" target="_blank" class="footer__link">
      <div class="footer__link__text-box">
        <svg class="footer__link__text-box__svg">
          <use xlink:href="${sprite}#icon-github"></use>
        </svg>
        <p class="paragraph--big footer__link__text-box__text">
          Pranav-Patani/Shelf-Share
        </p>
      </div>
    </a>
   </footer>
    `;
  }
}

export default new FooterView();
