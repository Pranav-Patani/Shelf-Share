import View from './View';
import errorGif from 'url:../../img/error.gif';

class ErrorView extends View {
  _parentElement = document.querySelector(`.container`);
  _generateMarkup() {
    return `
        <section class="error-view">
        <div class="error-view__content">
        <div class="error-view__content__gif-container">
            <img class="error-view__content__gif-container__gif" src=${errorGif} alt="error"/>
        </div>
            <h4 class="heading-4 error-view__content__alert-message">Opps! Something went wrong.
             <p class="error-view__content__alert-message--sub">We are working on it, please check back later.</p>
            </h4>
            <p class=error-view__content__alert-message__contact>If required, please contact us on <a href="mailto: connectshelfshare@gmail.com" class="error-view__content__alert-message__contact--link">connectshelfshare@gmail.com</a></p>
        </div>
        </section>
    `;
  }
}

export default new ErrorView();
