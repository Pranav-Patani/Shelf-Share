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
    console.log('RemoveBook Called');
    this._parentElement.addEventListener('click', e => {
      // Arrow function to preserve the "this" keyword of the class
      const btn = e.target.closest('.remove-collection-btn');
      if (!btn) return;
      const bookId = btn.dataset.bookId;
      console.log('bookId ', bookId);
      console.log('Id sent from view ', this.id);
      handler(bookId, this.id);
    });
  }

  addHandlerShare(handler) {
    const btn = document.querySelector(
      '.section-collection__container__share-btn',
    );
    if (!btn) return;
    btn.addEventListener('click', () => {
      handler(this._data, true);
    });
  }

  addHandlerRenderShare(handler) {
    window.addEventListener('load', handler);
  }

  renderAlter(message, error = false) {
    const alertBox = document.createElement('div');
    alertBox.className = error ? 'custom-alert-red' : 'custom-alert';
    alertBox.innerText = message;
    console.log('appending');
    document.body.appendChild(alertBox);

    alertBox.classList.add('show-alert');
    setTimeout(() => alertBox.classList.remove('show-alert'), 2000);
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
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
        <div class="section-collection__container">
        ${
          markupClass === 'shared-view'
            ? ''
            : `
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
    `
      : `<div class="center-element">This collection is empty :(</div>`;
  }
}

export default new individualCollectionView();
