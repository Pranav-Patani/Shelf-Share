import View from './View';
import sprite from 'url:../../img/sprite.svg';
import Router from '../router';
import poweredByImg from '../../img/poweredbygoogle.png';

class SearchView extends View {
  _parentElement = document.querySelector('.container');

  _getQuery() {
    if (this._parentElement.querySelector('.search-bar'))
      return this._parentElement.querySelector('.search-bar').value;
  }

  _getCategory() {
    let category = '';
    const btns = document.querySelectorAll(
      `.section-search__user-options__max-width-container__categories__btn`,
    );
    btns.forEach(btn => {
      if (
        btn.classList.contains(
          `section-search__user-options__max-width-container__categories__btn--active`,
        )
      ) {
        category = btn.textContent;
      }
    });
    return category;
  }

  _categorySearch = handler => {
    const btnContainer = document.querySelector(
      `.section-search__user-options__max-width-container__categories`,
    );
    const btns = document.querySelectorAll(
      `.section-search__user-options__max-width-container__categories__btn`,
    );

    btnContainer.addEventListener('click', e => {
      const btn = e.target.closest(
        `.section-search__user-options__max-width-container__categories__btn`,
      );
      if (!btn) return;

      if (
        btn.classList.contains(
          `section-search__user-options__max-width-container__categories__btn--active`,
        )
      ) {
        btn.classList.remove(
          `section-search__user-options__max-width-container__categories__btn--active`,
        );
        handler(this._getQuery(), '');
        return;
      }

      btns.forEach(btn =>
        btn.classList.remove(
          `section-search__user-options__max-width-container__categories__btn--active`,
        ),
      );

      btn.classList.add(
        `section-search__user-options__max-width-container__categories__btn--active`,
      );

      const category = btn.textContent;
      handler(this._getQuery(), category);
    });
  };

  addHandlerSearch(handler) {
    this._categorySearch(handler);
    const form = this._parentElement.querySelector(`.search-form`);
    const submitBtn = this._parentElement.querySelector(`.submit-btn`);
    const searchBar = this._parentElement.querySelector(`.search-bar`);

    const addFoucs = () => {
      form.classList.add('focused');
      searchBar.focus();
    };
    const removeFoucs = () => {
      form.classList.remove('focused');
      searchBar.blur();
    };

    searchBar.addEventListener('focus', addFoucs);
    searchBar.addEventListener('blur', removeFoucs);

    submitBtn.addEventListener('click', () => {
      const query = this._getQuery();
      if (!query) addFoucs();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const category = this._getCategory();
      const query = this._getQuery();
      if (query) {
        removeFoucs();
      }
      handler(query, category);
      this._closeSuggestions();
    });
  }

  addHandlerBookRoutes(handler) {
    const resultsContainer =
      this._parentElement.querySelector(`.results-container`);
    resultsContainer.addEventListener('click', e => {
      const card = e.target.closest('.book-link');
      if (!card) return;
      e.preventDefault();
      handler(card.dataset.route, card.dataset.id);
    });
  }

  addHandlerCreateCollection(handler) {
    const doneBtn = this._parentElement.querySelector(
      '.section-search__results__collection-controller__btn-container__btn-done',
    );
    if (!doneBtn) return;
    doneBtn.addEventListener('click', () => this._handlemodal(handler));
  }

  addHandlerResetSelections(handler) {
    const resetBtn = document.querySelector(
      `.section-search__results__collection-controller__btn-container__btn-reset`,
    );
    resetBtn.addEventListener(`click`, handler);
  }

  _handlemodal(handler) {
    const modal = this._parentElement.querySelector('.section-search__modal');
    const form = this._parentElement.querySelector('.modal-form');
    const msg = this._parentElement.querySelector('.modal-msg');
    const errMsg = this._parentElement.querySelector('.modal-err-msg');
    const input = this._parentElement.querySelector('#modal-input');
    const closeBtn = this._parentElement.querySelector(
      '.section-search__modal__content__close-btn',
    );
    const submitBn = this._parentElement.querySelector(
      `.section-search__modal__content__form__btn`,
    );
    const userChoice = this._parentElement.querySelector(
      `.section-search__modal__content__choice-container`,
    );
    const createBtn = this._parentElement.querySelector(`.btn-create`);
    const viewBtn = this._parentElement.querySelector(`.btn-view`);

    const handleSubmit = () => {
      submitBn.classList.add(
        `section-search__modal__content__form__btn--hidden`,
      );
      userChoice.classList.add(
        `section-search__modal__content__choice-container--active`,
      );
      createBtn.addEventListener('click', closeModal);
      viewBtn.addEventListener('click', () => {
        closeModal();
        Router.navigateTo('/collections');
      });
    };

    const openModal = () => {
      modal.classList.add('section-search__modal--active');
      submitBn.classList.remove(
        `section-search__modal__content__form__btn--hidden`,
      );
      setTimeout(() => input.focus(), 50);
      document.addEventListener('keydown', handleEscape);
    };

    const handleEscape = e => {
      if (e.key === 'Escape') closeModal();
    };

    const closeModal = () => {
      modal.classList.remove('section-search__modal--active');
      userChoice.classList.remove(
        `section-search__modal__content__choice-container--active`,
      );
      document.removeEventListener('keydown', handleEscape);
      errMsg.textContent = '';
      msg.textContent = '';
      input.value = '';
      input.blur();
    };

    openModal();

    closeBtn.addEventListener('click', closeModal);

    input.addEventListener('input', e => {
      const inputCounter = this._parentElement.querySelector(
        `.section-search__modal__content__form__input-count`,
      );
      if (e.target.value.length > 50) {
        errMsg.textContent = 'Name cannot be longer than 40 characters :(';
        input.value = input.value.slice(0, 50);
      } else {
        errMsg.textContent = '';
        inputCounter.textContent = `${input.value.length}/50`;
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = input.value;
      const selectedCount = document.querySelector(
        `.section-search__results__collection-controller__text-container__count-display--count`,
      ).textContent;
      if (!name.trim()) {
        errMsg.textContent = 'Name cannot be empty :(';
        input.value = '';
        input.focus();
        return;
      }
      errMsg.textContent = '';
      msg.textContent = 'Collection Created Successfully.';
      handler(name, selectedCount);
      handleSubmit();
    });
  }

  updateSelectedBooks(selectedBooks) {
    const selectedCount = document.querySelector(
      `.section-search__results__collection-controller__text-container__count-display--count`,
    );
    const doneBtn = this._parentElement.querySelector(
      '.section-search__results__collection-controller__btn-container__btn-done',
    );
    const resetBtn = this._parentElement.querySelector(
      `.section-search__results__collection-controller__btn-container__btn-reset`,
    );

    if (doneBtn && resetBtn) {
      if (selectedBooks.length === 0) {
        doneBtn.setAttribute('disabled', 'true');
        resetBtn.setAttribute('disabled', 'true');
        doneBtn.classList.add(
          'section-search__results__collection-controller__btn-container__btn-done--disabled',
        );
        resetBtn.classList.add(
          'section-search__results__collection-controller__btn-container__btn-reset--disabled',
        );
      } else {
        doneBtn.classList.remove(
          'section-search__results__collection-controller__btn-container__btn-done--disabled',
        );
        resetBtn.classList.remove(
          'section-search__results__collection-controller__btn-container__btn-reset--disabled',
        );
        doneBtn.removeAttribute('disabled');
        resetBtn.removeAttribute('disabled');
      }
    }

    selectedCount.textContent = selectedBooks.length;
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
        <div class="section-search__user-options__max-width-container">
          <div class="section-search__user-options__max-width-container__search">
            <form
              class="section-search__user-options__max-width-container__search__search-bar-container search-form"
            >
              <button class="submit-btn" type="submit">
               Search
              </button>
              <input
                type="text"
                class="search-bar"
                placeholder="Search Books"
                autocomplete="off"
              />
            </form>
           <a href="https://www.google.com" target="_blank" class="section-search__user-options__max-width-container__search__search-bar-container__powered-by">
              <img class="section-search__user-options__max-width-container__search__search-bar-container__powered-by--img" src=${poweredByImg} />
            </a>

            <div class="section-search__user-options__max-width-container__search__suggestions">
              ${this._generateSuggestionsContainerMarkup()} 
            </div>
          </div>
          <div class="section-search__user-options__max-width-container__categories">
           ${categories.map((category, id) => `<button key=${id} class="section-search__user-options__max-width-container__categories__btn">${category}</button>`).join('')}
          </div>
        </div>
        </div>
      
        <div class="section-search__results">
        <div class="${markupClass ? `section-search__results__collection-controller` : `section-search__results__collection-controller--hidden`}">
        <div class="section-search__results__collection-controller__text-container">
          <p class="paragraph section-search__results__collection-controller__text-container__count-display">Selected Books: <span class="section-search__results__collection-controller__text-container__count-display--count">0</span></p>
        </div>
          <div class="section-search__results__collection-controller__btn-container">
            <button class="btn-tertiary section-search__results__collection-controller__btn-container__btn-done">Done</button>
            <button class="btn-tertiary section-search__results__collection-controller__btn-container__btn-reset">Reset</button>
          </div>
        </div>
          <ul class="section-search__results__results-container results-container">
            ${` ${markupClass ? '<p class="paragraph--big center-element">Search books and select them to create a collection ;)</p>' : '<p class="paragraph--big center-element">Explore books by searching above ;)</p>'}
              `}
          </ul>
        </div>

        
        <div class="section-search__modal">
            <div class="section-search__modal__content">

            <button class="section-search__modal__content__close-btn">
              <svg class="section-search__modal__content__close-btn__svg">
                <use xlink:href="${sprite}#icon-cross"></use>
              </svg>
            </button>

            <h3 class="heading-3 section-search__modal__content__heading">Enter Collection's Name</h3>
                         
              <form class="section-search__modal__content__form modal-form">
                <input
                  type="text"
                  id="modal-input"
                  class="section-search__modal__content__form__input"
                  placeholder="collection name"
                  autocomplete="off"
                />
                <span class="section-search__modal__content__form__input-count">0/50</span>
                <button class="btn-tertiary section-search__modal__content__form__btn" type="submit">Create</button>
              </form>
            <p class="section-search__modal__content__msg modal-msg"></p>
            <p class="section-search__modal__content__err-msg modal-err-msg"></p>
            <div class="section-search__modal__content__choice-container">
              <button class="section-search__modal__content__choice-container__btn section-search__modal__content__choice-container__btn--create-more btn-create btn-tertiary">Create More</button>
              <button class="section-search__modal__content__choice-container__btn btn-view btn-tertiary">View Collections</button>
            </div>
            </div>
        </div>
      </section>
  `;
  }
}
export default new SearchView();
