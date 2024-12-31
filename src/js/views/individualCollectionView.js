import View from './View';
import PreviewViewIndividual from './previewView';

class individualCollectionView extends View {
  _parentElement = document.querySelector(`.container`);
  _errorMessage = 'Collection is empty :(';
  _message = '';

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  addHandlerRemoveBook(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.remove-collection-btn');
      if (!btn) return;
      const bookId = btn.dataset.bookId;
      handler(bookId, this.id);
    });
  }

  addHandlerShare(handler) {
    const btn = document.querySelector('.section-collection__share-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      handler(this._data, true);
    });
  }

  addHandlerRenderShare(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkupCollectionCards(markupClass) {
    return this._data.books
      .map(bookmark =>
        PreviewViewIndividual.render(bookmark, false, markupClass),
      )
      .join('');
  }

  _generateMarkup(markupClass) {
    const collectionCards = this._generateMarkupCollectionCards(markupClass);
    this.id = this._data.id;

    return this._data.books
      ? `
      <section class="section-collection">
        
        ${
          markupClass === 'shared-view'
            ? ''
            : `
        <button class="btn-tertiary section-collection__share-btn" data-collection-id="${this._data.id}">Share</button>
          `
        }
        <h2 class="heading-3 section-collection__heading">${this._data.name}</h2>
        <div
          class="section-collection__content"
        >
          ${collectionCards}
        </div>
    
      </section>
    `
      : `<div class="center-element">This collection is empty :(</div>`;
  }
}

export default new individualCollectionView();
