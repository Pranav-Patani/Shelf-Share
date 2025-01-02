import View from './View';
import PreviewViewIndividual from './previewView';
import Router from '../router';

class BookmarksView extends View {
  _parentElement = document.querySelector(`.container`);
  _errorMessage = 'No bookmarks yet. Find a nice book and bookmark it ;)';
  _message = '';

  addHandlerBookRoutes(handler) {
    const resultsContainer = this._parentElement.querySelector(
      `.section-bookmarks__content`,
    );
    resultsContainer.addEventListener('click', e => {
      const card = e.target.closest('.router-link');
      if (!card) return;
      e.preventDefault();
      handler(card.dataset.route, card.dataset.id);
    });
  }

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

  addHandlerRemoveBookmark(handler) {
    const container = document.querySelector('.section-bookmarks__content');
    container.addEventListener('click', e => {
      const btn = e.target.closest('.remove-bookmark-btn');
      if (!btn) return;
      handler(btn.dataset.bookId);
    });
  }

  _generateMarkupBookmarkCards() {
    return this._data
      .map(bookmark =>
        PreviewViewIndividual.render(bookmark, false, 'remove-bookmark-btn'),
      )
      .join('');
  }

  _generateMarkup() {
    const bookmarkCards = this._generateMarkupBookmarkCards();
    return `
      <section class="section-bookmarks">
      <div class="section-bookmarks__header-bg"></div>
        <div class="section-bookmarks__tab-container">
        <a class="router-link section-bookmarks__tab-container__link" href="/bookmarks" data-route="/bookmarks">
                 <button
            class="section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--1 section-bookmarks__tab-container__tab--active"
            data-tab="1"
          >
            Books
          </button>
        </a>


        <a class="router-link section-bookmarks__tab-container__link" href="/collections" data-route="/collections">
          <button
              class="section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--2"
              data-tab="2"
            >
              Collections
            </button>
        </a>
         
          
        </div>
        <div class ="section-bookmarks__container">
          <div
              class="section-bookmarks__content section-bookmarks__content--active"
            >
              ${bookmarkCards ? bookmarkCards : '<div class="center-element">You did not bookmark any books yet :(</div>'}
          </div>
        </div>
      </section>
    `;
  }
}

export default new BookmarksView();
