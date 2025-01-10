import View from './View';
import PreviewViewIndividual from './previewView';

class CreateCollectionsView extends View {
  get _parentElement() {
    return document.querySelector(`.results-container`);
  }

  addHandlerAddBook(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.add-collection-btn');
      if (!btn) return;
      const bookId = btn.dataset.bookId;
      handler(bookId);
    });
  }

  _generateMarkupCards() {
    if (!this._data) return `Sorry, No Results Match Your Search Query :(`;
    return this._data
      .map(result =>
        PreviewViewIndividual.render(result, false, 'add-collection-btn'),
      )
      .join('');
  }

  _generateMarkup() {
    const cards = this._generateMarkupCards();
    return `
    <div class="section-search__results__results-container__card-container">
      <p class="section-search__results__results-container__card-container__text">Google Books search results: <span class="section-search__results__results-container__card-container__text--count"> ${this._data.length} </span> books</p>
      <div class="collection-cards-container">
          ${cards}
      </div>
    </div
    `;
  }
}

export default new CreateCollectionsView();
