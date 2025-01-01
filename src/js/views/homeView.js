import View from './View';
import Router from '../router';
import homeCreatePlansImg from 'url:../../img/home_create-plans.webp';
import homeSavePlansImg from 'url:../../img/home_save-plans.webp';
import homeSharePlansImg from 'url:../../img/home_share-plans.webp';
import sprite from 'url:../../img/sprite.svg';
class HomeView extends View {
  _parentElement = document.querySelector('.container');
  _count = 1;

  addHandlerCTALinks() {
    this._parentElement.addEventListener('click', e => {
      const link = e.target.closest('.router-link');
      if (!link) return;
      e.preventDefault();
      Router.navigateTo(link.dataset.route);
    });
  }

  addHandlerCarousel() {
    const carousel = this._parentElement.querySelector(
      `.section-collection-info__content`,
    );
    const textCards = carousel.querySelectorAll(
      `.section-collection-info__content__text__text-box`,
    );
    const imgCards = carousel.querySelectorAll(
      `.section-collection-info__content__img-container__img-box`,
    );

    const slideCounter = this._parentElement.querySelector(
      `.section-collection-info__progress__count__text`,
    );

    let counter = 0;

    const updateCarousel = () => {
      textCards.forEach(card => card.classList.remove('text-active'));
      imgCards.forEach((card, index) => {
        card.classList.remove(
          'section-collection-info__content__img-container__img-box--front',
          'section-collection-info__content__img-container__img-box--middle',
          'section-collection-info__content__img-container__img-box--back',
        );
        if (index === counter) {
          card.classList.add(
            'section-collection-info__content__img-container__img-box--front',
          );
        } else if (index === (counter + 1) % imgCards.length) {
          card.classList.add(
            'section-collection-info__content__img-container__img-box--back',
          );
        } else if (index === (counter + 2) % imgCards.length) {
          card.classList.add(
            'section-collection-info__content__img-container__img-box--middle',
          );
        }
      });

      slideCounter.textContent = `${counter + 1} / 3`;
      textCards[counter].classList.add('text-active');
      counter = (counter + 1) % imgCards.length;

      if (counter > 3) counter = 0;
    };

    setInterval(updateCarousel, 6000);
    updateCarousel();
  }

  addHandlerSearch(handler) {
    const searchBtn = this._parentElement.querySelector(
      `.hero__text__center-container__search-btn`,
    );

    searchBtn.addEventListener(`click`, () => this._handleModal(handler));
  }

  _getQuery() {
    const searchBar = this._parentElement.querySelector(`.search-bar`);
    if (!searchBar) return;
    return searchBar.value;
  }

  _handleModal(handler) {
    const modal = this._parentElement.querySelector(`.homepage__modal`);
    const searchBar = this._parentElement.querySelector(`.search-bar`);
    const form = this._parentElement.querySelector(`.search-form`);

    const closeModal = () => {
      const searchBar = this._parentElement.querySelector(`.search-bar`);
      modal.classList.remove('homepage__modal--active');
      searchBar.value = '';

      this._closeSuggestions();
    };

    modal.classList.add('homepage__modal--active');
    setTimeout(() => searchBar.focus(), 300);

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal();
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const query = this._getQuery();
      if (!query) {
        return;
      }
      handler(query);
    });

    searchBar.addEventListener('keydown', e => {
      if (!(e.key === 'Escape')) return;
      closeModal();
    });
  }

  _generateMarkup() {
    const suggestionsContainer = this._generateSuggestionsContainerMarkup();
    return `
          <div class="homepage">
            <section class="hero mb-hg">
              <div class="hero__text">
              <div class="hero__text__center-container">
                <div class="hero__text__center-container__heading">
                    <div class="heading-1 hero__text__center-container__heading--main"><span class="hero__text__center-container__heading--main__top">explore books,</span><span class="hero__text__heading--main__top">plan your reading journey</span></div>
                    <div class="heading-4 hero__text__heading--sub"><span class="hero__text__heading--sub__top">discover, organize, and share</span><span class="hero__text__heading--sub__top">a world of stories</span></div>
                </div>
                <button class="hero__text__center-container__search-btn">  
                  
                  <span class="hero__text__center-container__search-btn__text">Search for Books...</span>
                  <svg class="hero__text__center-container__search-btn__svg">
                      <use xlink:href="${sprite}#icon-magnifying-glass"></use>
                    </svg>
                </button>
              </div>
              </div>
              <div class="hero__img">
                <svg
                  class="hero__img__svg"
                >
                  <use
                    xlink:href="${sprite}#icon-hero"
                  ></use>
                </svg>
              </div>
            </section>

            <section class="section-collection-info mb-hg">
              <h2 class="heading-2 section-collection-info__heading">Create Collections</h2>
              <div class="section-collection-info__content">
                <div class="section-collection-info__content__text">
                  <ul>
                    <li class="section-collection-info__content__text__text-box text-active">
                      <h4 class="heading-4 section-collection-info__content__text__text-box__heading">Create Your Own Collection</h4>
                      <p class="paragraph--big section-collection-info__content__text__text-box__para">
                        Browse through our vast collection of a variety of books and
                        handpick them for your personalized collections.
                      </p>
                    </li>
                    <li class="section-collection-info__content__text__text-box">
                      <h4 class="heading-4 section-collection-info__content__text__text-box__heading">Save Your Collections</h4>
                      <p class="paragraph--big section-collection-info__content__text__text-box__para">
                        Bookmark your collections to access them in future.
                        Once you bookmark a collection or a book, you can access them under the Book Shelf.
                      </p>
                    </li>
                    <li class="section-collection-info__content__text__text-box">
                      <h4 class="heading-4 section-collection-info__content__text__text-box__heading">Share With Your Friends</h4>
                      <p class="paragraph--big section-collection-info__content__text__text-box__para">
                        You can use the share feature to share your collections
                        with your peers. You get a unique URL for each of your
                        collection that you can share with anyone!
                      </p>
                    </li>
                  </ul>
                  <div class="section-collection-info__progress">
                    <div class="section-collection-info__progress__count">
                      <p class="paragraph section-collection-info__progress__count__text"></p>
                    </div>
                    <div class="section-collection-info__progress__bar">
                      <span class="section-collection-info__progress__bar__fill"></span>
                    </div>
                  </div>
                </div>
                <ul class="section-collection-info__content__img-container">
                    <li class="section-collection-info__content__img-container__img-box section-collection-info__content__img-container__img-box--front">
                      <img class="section-collection-info__content__img-container__img-box__img" src="${homeCreatePlansImg}"/>
                    </li>
                    <li class="section-collection-info__content__img-container__img-box section-collection-info__content__img-container__img-box--middle">
                      <img class="section-collection-info__content__img-container__img-box__img" src="${homeSavePlansImg}"/>
                    </li>
                    <li class="section-collection-info__content__img-container__img-box section-collection-info__content__img-container__img-box--back">
                      <img class="section-collection-info__content__img-container__img-box__img" src="${homeSharePlansImg}"/>
                    </li>
                </ul>
              </div>

            </section>

            <section class="section-find-info">
              <h2 class="heading-2 mb-lg section-find-info__heading">Find Books</h2>
              
              <div class="section-find-info__content">
                <div class="section-find-info__content__info-box">
                  <div class="section-find-info__content__info-box__text-box section-find-info__content__info-box__text-box--1">
                    <svg class="section-find-info__content__info-box__text-box__svg">
                      <use xlink:href="${sprite}#icon-magnifying-glass"></use>
                    </svg>
                    <div class="section-find-info__content__info-box__text-box__text">search from a variety of books</div>
                  </div>
                  <div class="section-find-info__content__info-box__img-box">
                     <svg class="section-find-info__content__info-box__img-box__svg section-find-info__content__info-box__img-box__svg--1">
                        <use xlink:href="${sprite}#icon-right-facing"></use>
                    </svg>
                  </div>
                </div>
                
                <div class="section-find-info__content__info-box">
                  <div class="section-find-info__content__info-box__text-box section-find-info__content__info-box__text-box--2">
                   <svg class="section-find-info__content__info-box__text-box__svg">
                      <use xlink:href="${sprite}#icon-bookmark"></use>
                    </svg>
                    <div class="section-find-info__content__info-box__text-box__text">bookmark your favorite books</div>
                  </div>
                  <div class="section-find-info__content__info-box__img-box">
                     <svg class="section-find-info__content__info-box__img-box__svg section-find-info__content__info-box__img-box__svg--2">
                        <use xlink:href="${sprite}#icon-center-facing"></use>
                    </svg>
                  </div>
                </div>

                <div class="section-find-info__content__info-box">
                  <div class="section-find-info__content__info-box__text-box section-find-info__content__info-box__text-box--3">
                    <svg class="section-find-info__content__info-box__text-box__svg">
                      <use xlink:href="${sprite}#icon-share"></use>
                    </svg>
                    <div class="section-find-info__content__info-box__text-box__text">share a book with your friends</div>
                  </div>
                  <div class="section-find-info__content__info-box__img-box">
                     <svg class="section-find-info__content__info-box__img-box__svg section-find-info__content__info-box__img-box__svg--3">
                        <use xlink:href="${sprite}#icon-left-facing"></use>
                    </svg>
                  </div>
                </div>

              </div>
            </section>
            <div class="homepage__modal">
              <div class="homepage__modal__content">
                <form class="homepage__modal__content__search-form search-form">
                  <div class="homepage__modal__content__search-form__search-bar-container">
                    <input 
                    class="homepage__modal__content__search-form__search-bar-container__search-bar search-bar"
                    placeholder="Type 3 or more characters..."
                    autocomplete="off"
                    />
                    <button class="homepage__modal__content__search-form__search-bar-container__search-btn">
                    <svg class="homepage__modal__content__search-form__search-bar-container__search-btn__svg">
                      <use xlink:href="${sprite}#icon-magnifying-glass"></use>
                    </svg>
                    </button>
                  </div>
                </form>
                <div class="homepage__modal__content__suggestions">
                  ${suggestionsContainer}
                </div>
              </div>
            </div>
          </div>
    `;
  }
}

export default new HomeView();
