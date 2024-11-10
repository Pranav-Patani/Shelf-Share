import View from './View';
import sprite from 'url:../../img/sprite.svg';

class FooterView extends View {
  _parentElement = document.querySelector('.footer');

  _generateMarkup() {
    return `
    <footer class="footer">
      <div class="footer__heading heading-2">Book Wise</div>
      <div class="footer__social-links">
        <div class="footer__social-links__author">
          <h4 class="heading-4--white">Connect with author</h4>
          <div class="footer__social-links__author__links">
            <a href="https://github.com/Pranav-Patani" target="_blank"
              ><svg>
                <use xlink:href="${sprite}#icon-github"></use></svg
            ></a>
            <a href="https://www.linkedin.com/in/pranavpatani/" target="_blank"
              ><svg>
                <use xlink:href="${sprite}#icon-linkedin"></use></svg
            ></a>
          </div>
        </div>

        <div class="footer__social-links__site">
          <h4 class="heading-4--white">Source Code</h4>
          <a href="https://github.com/Pranav-Patani/BookWise" target="_blank"
            ><svg>
              <use xlink:href="${sprite}#icon-github"></use></svg
          ></a>
        </div>
      </div>
      <div class="footer__text">BookWise &#169; 2024</div>
    </footer>
    `;
  }
}

export default new FooterView();
