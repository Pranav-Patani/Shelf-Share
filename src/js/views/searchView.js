import View from './View';

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
    if (doneBtn) {
      doneBtn.addEventListener('click', handler);
    }
  }

  updateSelectedBooks(selectedBooks) {
    const selectedBooksContainer = this._parentElement.querySelector(
      '.selected-books-container',
    );
    if (selectedBooksContainer) {
      selectedBooksContainer.innerHTML =
        this._generateSelectedBooksMarkup(selectedBooks);
    }

    // Update the "Done" button state
    const doneBtn = this._parentElement.querySelector('.collection-btn');
    if (doneBtn) {
      doneBtn.classList.toggle(
        'collection-btn__disabled',
        selectedBooks.length === 0,
      );
    }
  }

  _generateMarkup(markupClass) {
    return `
          <section class="section-search">
        <div class="section-search__container">
          
          <div class="section-search__container__search-section">
            <form
              class="section-search__container__search-section__search-bar-container search-form"
            >
              <button type="submit">Search</button>
              <input
                type="text"
                id="search-bar"
                placeholder="Search for books here"
                autocomplete="off"
              />
            </form>
            <button class="btn-tertiary ${markupClass ? markupClass : 'collection-btn__disabled'}">Done</button>
            <ul
              class="section-search__container__search-section__search-results-container results-container"
            >
            ${
              !this._getQuery
                ? ` ${markupClass ? '<p class="paragraph--big center-element">Search books and select them to create a collection ;)</p>' : '<p class="paragraph--big center-element">Explore books by searching above ;)</p>'}
              `
                : ''
            }
            </ul>
          </div>
        </div>
      </section>
  `;
  }
}
export default new SearchView();

/*<div class="section-search__container__filters-section">
            <div class="section-search__container__filters-section__filters">
              <h4 class="heading-4">Filters</h4>
            </div>
          </div> */
