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

  updateSelectedCount(count) {
    const countElement = this._parentElement.querySelector(
      '.selected-books-count',
    );
    if (countElement) {
      countElement.textContent = `Selected Books: ${count}`;
    }
  }

  _generateMarkupCards() {
    return this._data
      .map(result =>
        PreviewViewIndividual.render(result, false, 'add-collection-btn'),
      )
      .join('');
  }

  _generateMarkup() {
    const cards = this._generateMarkupCards();
    return `
      <p class="paragraph selected-books-count">
      Selected Books: ${this._data.filter(book => book.selected).length}
    </p>
    <div class="collection-cards-container">
        ${cards}
    </div>
    `;
  }
}

export default new CreateCollectionsView();
