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
    if (!this._data) return `Sorry, No Results Match Your Search Query :(`;
    return this._data
      .map(result =>
        PreviewViewIndividual.render(result, false, 'add-bookmark-btn'),
      )
      .join('');
  }
}

export default new FindBooksView();
