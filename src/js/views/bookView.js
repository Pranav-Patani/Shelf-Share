import View from './View';
import sprite from 'url:../../img/sprite.svg';

class BookView extends View {
  _parentElement = document.querySelector(`.container`);

  _generateDate() {
    const date = new Date(this._data.publishedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  _generateLanguage() {
    const language = new Intl.DisplayNames(['en'], { type: 'language' });
    return language.of(this._data.language);
  }

  _generateCategories() {
    const categories = this._data.categories;
    const uniqueCategories = [
      ...new Set(
        categories.flatMap(category =>
          category.split('/').map(cur => cur.trim()),
        ),
      ),
    ];
    return uniqueCategories;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerTabHandler() {
    const tabContainer = document.querySelector(
      `.section-book-view__overview__tab-container`,
    );
    tabContainer.addEventListener('click', e => {
      const tab = e.target.closest(
        'section-book-view__overview__tab-container__tab',
      );
      if (!tab) return;

      tab.classList.add(
        'section-book-view__overview__tab-container__tab--active',
      );
    });
  }

  _generateMarkup() {
    return `
      <section class="section-book-view">
      <div class="section-book-view__temp"></div>
          <div class="section-book-view__main-info-container">
            <figure class="section-book-view__main-info-container__img">
              <img
                src="${this._data.image}" alt="${this._data.title}"
              />
            </figure>
            <div class="section-book-view__main-info-container__text">
              <div class="section-book-view__main-info-container__text--up">
                <h2
                  class="section-book-view__main-info-container__text--up__title heading-2"
                >
                  ${this._data.title} 
                </h2>
                <h3
                  class="section-book-view__main-info-container__text--up__author heading-3"
                >
                  ${this._data.authors?.join(', ')} 
                </h3>
                <p
                  class="section-book-view__main-info-container__text--up__rating paragraph--big"
                >
                  Rating: ${this._data.rating} &#9733;
                </p>
              </div>
              <div class="section-book-view__main-info-container__text--down">
                <h4
                  class="section-book-view__main-info-container__text--down__category-heding heading-4"
                >
                  Category
                </h4>
                ${this._generateCategories()
                  ?.map(
                    cur => `                <p
                  class="section-book-view__main-info-container__text--down__category-text paragraph"
                >
                  ${cur} 
                </p>`,
                  )
                  .join('')}
              </div>
            <div class="section-book-view__main-info-container__text--button-container">
            <a
                href="${this._data.previewLink}"
                target="_blank"
                class="section-book-view__main-info-container__text--button btn-secondary"
              >
                Open in Google Books
              </a>
              <button class="section-book-view__main-info-container__text--button-bookmark btn--bookmark">
               <svg class="${this._data.bookmarked ? 'svg-fill' : 'svg-empty'}">
                  <use xlink:href="${sprite}#icon-bookmark"></use>
              </svg>
              </button>
            </div>
            </div>
          </div>
        
        <div class="section-book-view__overview">
        
          <div class="section-book-view__overview__tab-container">
            <button class="section-book-view__overview__tab-container__tab section-book-view__overview__tab-container__tab--1 section-book-view__overview__tab-container__tab--active">
                  Description
            </button>
            <button class="section-book-view__overview__tab-container__tab section-book-view__overview__tab-container__tab--2">
                  Details
            </button>
          </div>
          <div class="section-book-view__overview__content section-book-view__overview__content--1 section-book-view__overview__content--active">
            <h3 class="section-book-view__overview__content--1__heading heading-3">
              Description
            </h3>
            <p class="section-book-view__overview__content--1__text paragraph">
             ${this._data.description}
            </p>
          </div>

          <div class="section-book-view__overview__content section-book-view__overview__content--2">
            <h3 class="section-book-view__overview__content--2__heading heading-3">Details</h3>
            <table class="section-book-view__overview__content--2__table">
              <tbody>
                <tr>
                  <th>Publisher</th>
                  <td>${this._data.publisher} </td>
                </tr>
                <tr>
                  <th>Published</th>
                  <td>${this._generateDate()} </td>
                </tr>
                <tr>
                  <th>Pages</th>
                  <td>${this._data.pageCount}</td>
                </tr>
                <tr>
                  <th>Language</th>
                  <td>${this._generateLanguage()}</td>
                </tr>
                <tr>
                  <th>ISBN</th>
                  <td>${this._data.isbn} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
        `;
  }
}

export default new BookView();
