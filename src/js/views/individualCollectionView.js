import View from './View';
import PreviewViewIndividual from './previewView';

class individualCollectionView extends View {
  _parentElement = document.querySelector(`.container`);
  _errorMessage = 'Collection is empty :(';
  _message = '';

  addHandlerRemoveBookmark(handler) {
    this._parentElement.removeEventListener('click', this._bookmarkHandler);

    this._bookmarkHandler = function (e) {
      const btn = e.target.closest('.remove-bookmark-btn');
      if (!btn) return;
      const bookId = btn.dataset.bookId;
      if (!bookId) {
        console.error('Book ID is missing from the bookmark button');
        return;
      }
      handler(bookId);
    };

    this._parentElement.addEventListener('click', this._bookmarkHandler);
  }

  addHandlerGoBack(handler) {
    const btn = document.querySelector(
      '.section-collection__container__back-btn',
    );
    btn.addEventListener('click', handler);
  }

  addHandlerShare(handler) {
    const btn = document.querySelector(
      '.section-collection__container__share-btn',
    );
    if (!btn) return;
    btn.addEventListener('click', () => {
      handler(this._data);
    });
    // const collectionId = btn.dataset.collectionId;
    // if(!collectionId) return;
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
    console.log('From collections View: ', markupClass);
    const collectionCards = this._generateMarkupCollectionCards(markupClass);

    return `
      <section class="section-collection">
        <div class="section-collection__container">
        ${
          markupClass === 'shared-view'
            ? ''
            : `
           <button class="btn-tertiary section-collection__container__back-btn">Go Back</button>
        <button class="btn-tertiary section-collection__container__share-btn" data-collection-id="${this._data.id}">Share</button>
          `
        }
        <h2 class="heading-3 section-collection__container__heading">${this._data.name}</h2>
          <div
            class="section-collection__container__content"
          >
            ${collectionCards}
          </div>
        </div>
      </section>
    `;
  }
}

export default new individualCollectionView();
