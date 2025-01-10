import View from './View';
import Router from '../router';

class CollectionsView extends View {
  _parentElement = document.querySelector('.container');

  addHandlerLinks() {
    const links = document.querySelectorAll(
      '.section-bookmarks__tab-container__link',
    );
    links.forEach(link =>
      link.addEventListener('click', e => {
        e.preventDefault();
        Router.navigateTo(link.dataset.route);
      }),
    );
  }

  addHandlerViewCollection(handler) {
    const container = document.querySelector('.section-bookmarks__content');

    container.addEventListener('click', e => {
      const btn = e.target.closest('.card--2__text-container__btn--view');
      if (!btn) return;
      handler(btn.dataset.collectionId);
    });
  }

  addHandlerDeleteCollection(handler) {
    const container = document.querySelector('.section-bookmarks__content');

    container.addEventListener('click', e => {
      const btn = e.target.closest('.card--2__text-container__btn--delete');
      if (!btn) return;
      const collectionId = btn.dataset.collectionId;
      this._handleModal(handler, collectionId);
    });
  }

  _handleModal(handler, collectionId) {
    const modal = this._parentElement.querySelector(
      '.section-bookmarks__modal',
    );
    const btnContainer = this._parentElement.querySelector(
      '.section-bookmarks__modal__content__btn-container',
    );
    modal.classList.add('section-bookmarks__modal--active');

    const closeModal = () => {
      document.removeEventListener('keydown', handleKeypress);
      modal.classList.remove('section-bookmarks__modal--active');
    };

    btnContainer.addEventListener('click', e => {
      const btn = e.target.closest('.section-bookmarks__modal__content__btn');
      if (!btn) return;
      const choice = btn.dataset.choice;
      if (choice === 'yes') handler(collectionId);
      closeModal();
    });

    const handleKeypress = e => {
      e.preventDefault();
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeypress);
  }

  _generateMarkupCollectionCards() {
    return this._data
      .map(collection => {
        if (collection.books.length === 0) return;
        return `
      <li class="card card--2">
        <div class="card--2__img-container">
          ${collection.books
            .slice(0, 3)
            .map(
              (book, index) => `
            <img
              src="${book.image}"
              alt="${book.title}"
              class="card--2__img-container__img card--2__img-container__img--${index + 1}"
            />
          `,
            )
            .join('')}
        </div>
        <div class="card--2__text-container">

          <p class="paragraph--big card--2__text-container__title">${collection.collectionName.length <= 15 ? collection.collectionName : collection.collectionName.slice(0, 15) + '...'}</p>

          <p class="paragraph--big card--2__text-container__books">
            Total Books: ${collection.books.length}
          </p>
 
          <button class="btn-tertiary card--2__text-container__btn card--2__text-container__btn--view" data-collection-id="${collection.id}">
            View
          </button>
          <button class="btn-tertiary card--2__text-container__btn card--2__text-container__btn--delete" data-collection-id="${collection.id}">
            Delete
          </button>
        </div>
      </li>
    `;
      })
      .join('');
  }

  _generateMarkup() {
    const collectionCards = this._generateMarkupCollectionCards();
    return `
      <section class="section-bookmarks">
      <div class="section-bookmarks__header-bg"></div>
        <div class="section-bookmarks__tab-container">
        <a class="section-bookmarks__tab-container__link router-link" href="/bookmarks" data-route="/bookmarks">
                 <button
            class="section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--1"
            data-tab="1"
          >
            Books
          </button>
        </a>


        <a class="section-bookmarks__tab-container__link router-link" href="/collections" data-route="/collections">
          <button
              class="section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--2 section-bookmarks__tab-container__tab--active"
              data-tab="2"
            >
              Collections
            </button>
        </a>
        </div>

        <div class="section-bookmarks__container">
          <div
            class="section-bookmarks__content section-bookmarks__content--active"
          >
            ${collectionCards ? collectionCards : '<div class="center-element">You did not create any collections yet :(</div>'}
          </div>
        </div>       
  
        <div class="section-bookmarks__modal">
            <div class="section-bookmarks__modal__content">

            <h3 class="heading-3 section-bookmarks__modal__content__heading">Delete Collection ?</h3>
            <div class="section-bookmarks__modal__content__btn-container">
              <button class="btn-secondary section-bookmarks__modal__content__btn section-bookmarks__modal__content__btn--yes" data-choice="yes">Yes</button>
              <button class="btn-secondary section-bookmarks__modal__content__btn" data-choice="no">No</button>
            </div>
            </div>
        </div>
      </section>
    `;
  }
}

export default new CollectionsView();
