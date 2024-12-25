import View from './View';
import sprite from 'url:../../img/sprite.svg';

class SearchView extends View {
  _parentElement = document.querySelector('.container');

  getQuery() {
    return this._parentElement.querySelector('#search-bar').value;
  }

  addHandlerSearch(handler) {
    const form = this._parentElement.querySelector('.search-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      this._parentElement.querySelector('#search-bar').blur();
      handler();
    });
  }

  addHandlerCreateCollection(handler) {
    const doneBtn = this._parentElement.querySelector('.collection-btn');
    if (!doneBtn) return;
    doneBtn.addEventListener('click', () => this._handleModel(handler));
  }

  _handleModel(handler) {
    const model = this._parentElement.querySelector('.section-search__model');
    const form = this._parentElement.querySelector('.model-form');
    const msg = this._parentElement.querySelector('.model-msg');
    const errMsg = this._parentElement.querySelector('.model-err-msg');
    const input = this._parentElement.querySelector('#model-input');
    const closeBtn = this._parentElement.querySelector(
      '.section-search__model__content__close-btn',
    );

    model.classList.add('section-search__model--active');

    closeBtn.addEventListener('click', () => {
      errMsg.textContent = '';
      msg.textContent = '';
      model.classList.remove('section-search__model--active');
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = input.value;
      if (!name.trim()) {
        errMsg.textContent = 'Name cannot be empty :(';
        input.value = '';
        return;
      }
      errMsg.textContent = '';
      msg.textContent = 'Collection Created Successfully.';
      handler(name);
      setTimeout(
        () => model.classList.remove('section-search__model--active'),
        2000,
      );
    });
  }

  updateSelectedBooks(selectedBooks) {
    const doneBtn = this._parentElement.querySelector('.collection-btn');
    if (doneBtn) {
      doneBtn.classList.toggle(
        'collection-btn__disabled',
        selectedBooks.length === 0,
      );
    }
  }

  _generateMarkup(markupClass) {
    const categories = [
      'Comedy',
      'Romance',
      'Action',
      'Drama',
      'Thriller',
      'Psycological',
      'Mystery',
      'Horror',
    ];
    return `
          <section class="section-search">
        <div class="section-search__user-options">
          <div class="section-search__user-options__search">
            <form
              class="section-search__user-options__search__search-bar-container search-form"
            >
              <button type="submit">
                <svg>
                  <use xlink:href="${sprite}#icon-magnifying-glass"></use>
                </svg>
              </button>
              <input
                type="text"
                id="search-bar"
                placeholder="Search for books here"
                autocomplete="off"
              />
            </form>
          </div>
          <div class="section-search__user-options__categories">
           ${categories.map((category, id) => `<button key=${id} class="section-search__user-options__categories__btn ${id == 2 ? `section-search__user-options__categories__btn--active` : ``}">${category}</button>`).join('')}
          </div>
        </div>
      
        <div class="section-search__results">
        <button class="btn-tertiary ${markupClass ? markupClass : 'collection-btn__disabled'}">Done</button>
          <ul class="section-search__results__results-container results-container">
            ${
              !this._getQuery
                ? ` ${markupClass ? '<p class="paragraph--big center-element">Search books and select them to create a collection ;)</p>' : '<p class="paragraph--big center-element">Explore books by searching above ;)</p>'}
              `
                : ''
            }
          </ul>
        </div>

        
        <div class="section-search__model">
            <div class="section-search__model__content">

            <button class="section-search__model__content__close-btn">X</button>

            <h3 class="heading-3 section-search__model__content__heading">Enter Collection's Name</h3>
                         
              <form class="section-search__model__content__form model-form">
                <input
                  type="text"
                  id="model-input"
                  class="section-search__model__content__form__input"
                  placeholder="collection name"
                  autocomplete="off"
                />
                <button class="btn-tertiary section-search__model__content__form__btn" type="submit">Create</button>
              </form>
            <p class="section-search__model__content__msg model-msg"></p>
            <p class="section-search__model__content__err-msg model-err-msg"></p>
            </div>
        </div>
      </section>
  `;
  }
}
export default new SearchView();
