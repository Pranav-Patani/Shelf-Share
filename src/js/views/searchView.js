import View from './View';
import sprite from 'url:../../img/sprite.svg';
import { throttle } from '../helpers';

class SearchView extends View {
  _parentElement = document.querySelector('.container');
  _currentFocus = -1;
  _getQuery() {
    if (this._parentElement.querySelector('#search-bar'))
      return this._parentElement.querySelector('#search-bar').value;
  }

  _getCategory() {
    let category = '';
    const btns = document.querySelectorAll(
      `.section-search__user-options__categories__btn`,
    );
    btns.forEach(btn => {
      if (
        btn.classList.contains(
          `section-search__user-options__categories__btn--active`,
        )
      ) {
        category = btn.textContent;
      }
    });
    return category;
  }

  _categorySearch = handler => {
    const btnContainer = document.querySelector(
      `.section-search__user-options__categories`,
    );
    const btns = document.querySelectorAll(
      `.section-search__user-options__categories__btn`,
    );

    btnContainer.addEventListener('click', e => {
      const btn = e.target.closest(
        `.section-search__user-options__categories__btn`,
      );
      if (!btn) return;

      if (
        btn.classList.contains(
          `section-search__user-options__categories__btn--active`,
        )
      ) {
        btn.classList.remove(
          `section-search__user-options__categories__btn--active`,
        );
        console.log('calling handler with no category');
        console.log(handler);
        handler(this._getQuery(), '');
        return;
      }

      btns.forEach(btn =>
        btn.classList.remove(
          `section-search__user-options__categories__btn--active`,
        ),
      );

      btn.classList.add(
        `section-search__user-options__categories__btn--active`,
      );

      const category = btn.textContent;
      handler(this._getQuery(), category);
    });
  };

  addHandlerSearch(handler) {
    this._categorySearch(handler);
    const form = this._parentElement.querySelector('.search-form');

    form.addEventListener('submit', e => {
      e.preventDefault();
      this._parentElement.querySelector('#search-bar').blur();
      const category = this._getCategory();
      console.log(category);
      const query = this._getQuery();
      handler(query, category);
    });
  }

  addHandlerDebounce(handler) {
    const searchBar = this._parentElement.querySelector('#search-bar');
    searchBar.addEventListener('input', () => {
      handler(searchBar.value);
      this._handleSuggestionContainer(searchBar.value);
    });
    searchBar.addEventListener(
      'keydown',
      throttle(e => this._handleCurrentSuggestion(e)),
    );
  }

  _handleSuggestionContainer = value => {
    const suggestionsContainer = this._parentElement.querySelector(
      `.section-search__user-options__search__suggestions`,
    );

    if (value) {
      suggestionsContainer.classList.add(
        `section-search__user-options__search__suggestions--active`,
      );
    } else {
      suggestionsContainer.classList.remove(
        `section-search__user-options__search__suggestions--active`,
      );
    }
  };

  _handleCurrentSuggestion = e => {
    const suggestionsContainer = this._parentElement.querySelector(
      `.section-search__user-options__search__suggestions`,
    );
    const suggestions = this._parentElement.querySelectorAll(
      `.section-search__user-options__search__suggestions__suggestion`,
    );
    const form = this._parentElement.querySelector(`.search-form`);

    if (e.key === `ArrowDown`) {
      e.preventDefault();
      this._currentFocus = (this._currentFocus + 1) % suggestions.length;
      console.log(this._currentFocus);
      this._setActiveSuggestion(suggestions);
    } else if (e.key === `ArrowUp`) {
      e.preventDefault();
      this._currentFocus =
        (this._currentFocus - 1 + suggestions.length) % suggestions.length;
      console.log(this._currentFocus);
      this._setActiveSuggestion(suggestions);
    } else if (e.key === `Enter`) {
      form.dispatchEvent(new Event('submit'));
      suggestionsContainer.classList.remove(
        `section-search__user-options__search__suggestions--active`,
      );
    }
  };

  _setActiveSuggestion(suggestions) {
    const searchBar = this._parentElement.querySelector(`#search-bar`);

    if (!suggestions) return;
    suggestions.forEach(suggestion =>
      suggestion.classList.remove(
        'section-search__user-options__search__suggestions__suggestion--active',
      ),
    );

    const activeSuggestion = suggestions[this._currentFocus];

    activeSuggestion.classList.add(
      `section-search__user-options__search__suggestions__suggestion--active`,
    );

    activeSuggestion.scrollIntoView({
      behaviour: 'smooth',
      block: 'nearest',
    });

    searchBar.value = suggestions[this._currentFocus].textContent;
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
      if (selectedBooks.length === 0) {
        doneBtn.setAttribute('disabled', 'true');
        doneBtn.classList.add('collection-btn__disabled');
      } else {
        doneBtn.classList.remove('collection-btn__disabled');
        doneBtn.setAttribute('disabled', 'false');
      }
    }
  }

  updateSuggestions(data) {
    this._data = data;
    const suggestionsContainer = this._parentElement.querySelector(
      '.section-search__user-options__search__suggestions',
    );
    if (!suggestionsContainer) return;

    suggestionsContainer.innerHTML = '';
    this._currentFocus = -1;
    if (data && data.length > 0) {
      const suggestionsMarkup = this._generateSuggestionsMarkup();
      suggestionsContainer.insertAdjacentHTML('afterbegin', suggestionsMarkup);
    }
  }

  _generateSuggestionsMarkup() {
    if (!this._data)
      return `<li class="section-search__user-options__search__suggestions__suggestion">Getting Suggestions...</li>`;
    return this._data
      .map(
        (title, id) =>
          `<li key=${id} class="section-search__user-options__search__suggestions__suggestion">${title}</li>`,
      )
      .join('');
  }

  _generateMarkup(markupClass) {
    const categories = [
      'Humorous',
      'Romance',
      'Action',
      'Drama',
      'Thriller',
      'Fiction',
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
            <ul class="section-search__user-options__search__suggestions">
              ${this._generateSuggestionsMarkup()} 
            </ul>
          </div>
          <div class="section-search__user-options__categories">
           ${categories.map((category, id) => `<button key=${id} class="section-search__user-options__categories__btn">${category}</button>`).join('')}
          </div>
        </div>
      
        <div class="section-search__results">
        <button class="btn-tertiary ${markupClass ? markupClass : 'collection-btn__disappear'}">Done</button>
          <ul class="section-search__results__results-container results-container">
            ${
              !this._getQuery()
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
