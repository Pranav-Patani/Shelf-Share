import View from './View';
import PreviewViewIndividual from './previewView';
import Router from '../router';

class BookmarksView extends View {
  _parentElement = document.querySelector(`.container`);
  _errorMessage = 'No bookmarks yet. Find a nice book and bookmark it ;)';
  _message = '';

  addHandlerTabs() {
    const tabs = document.querySelectorAll(
      `.section-bookmarks__tab-container__tab`,
    );
    const tabsContainer = document.querySelector(
      `.section-bookmarks__tab-container`,
    );

    tabsContainer.addEventListener('click', e => {
      const tab = e.target.closest('.section-bookmarks__tab-container__tab');
      if (!tab) return;
      tabs.forEach(tab =>
        tab.classList.remove('section-bookmarks__tab-container__tab--active'),
      );
      tab.classList.add('section-bookmarks__tab-container__tab--active');
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
        <div class="section-bookmarks__tab-container">
        <a class="router-link section-bookmarks__tab-container__link" href="/bookmarks" data-route="/bookmarks">
                 <button
            class="btn-secondary section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--1 section-bookmarks__tab-container__tab--active"
            data-tab="1"
          >
            Books
          </button>
        </a>


        <a class="router-link section-bookmarks__tab-container__link" href="/collections" data-route="/collections">
          <button
              class="btn-secondary section-bookmarks__tab-container__tab section-bookmarks__tab-container__tab--2"
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
            ${bookmarkCards ? bookmarkCards : '<div class="center-element">You did not bookmark any books yet :(</div>'}
          </div>
        </div>
      </section>
    `;
  }
}

export default new BookmarksView();
