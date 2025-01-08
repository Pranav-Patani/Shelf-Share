import View from './View';
import PreviewViewIndividual from './previewView';

class FindBooksView extends View {
  get _parentElement() {
    return document.querySelector(`.results-container`);
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.add-bookmark-btn');
      if (!btn) return;
      const bookId = btn.dataset.bookId;
      if (!bookId) {
        console.error('Book ID is missing from the bookmark button and card');
        return;
      }
      handler(bookId);
    });
  }

  _generateMarkup() {
    const cards = this._data
      .map(result =>
        PreviewViewIndividual.render(result, false, 'add-bookmark-btn'),
      )
      .join('');
    if (!this._data) return `Sorry, No Results Match Your Search Query :(`;
    return `
        <div class="section-search__results__results-container__card-container">
        <p class="section-search__results__results-container__card-container__text">Google Books search results: <span class="section-search__results__results-container__card-container__text--count"> ${this._data.length} </span> books found</p>
        <div class="section-search__results__results-container__card-container__cards">
          ${cards}
        </div>
        </div>
        `;
  }
}

export default new FindBooksView();
