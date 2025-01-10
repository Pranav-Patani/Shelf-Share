import View from './View';
import sprite from 'url:../../img/sprite.svg';

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup(markupClass) {
    return `<li class="card card--1">
              <a href="" data-route="/book" data-id="${this._data.id}" class="card--1__link book-link">
                <div class="card--1__link__img-container">
                  <img
                   src="${this._data.image}"
                    alt="${this._data.title}"
                    class="card--1__link__img-container__img"
                  />
                  <div class="card--1__link__img-container__shadow">
                    <span>View Details</span>
                  </div>
                </div>
            
             
              <div class="card--1__link__text-container">
                <p
                  class="paragraph--big card--1__link__text-container__title"
                >
                  ${this._data.title?.length <= 12 ? this._data.title : this._data.title?.substring(0, 12) + '...'}
                </p>
                <p
                  class="paragraph card--1__link__text-container__author"
                >
                  ${this._data.authors?.join(', ').length <= 20 ? this._data.authors?.join(', ') : this._data.authors?.join(', ')?.substring(0, 20) + '...'}
                </p>
                <p
                  class="paragraph card--1__link__text-container__rating"
                >
                    ${
                      this._data.rating
                        ? `<span class="card--1__link__text-container__rating__text">${this._data.rating} </span>
                          <svg class="card--1__link__text-container__rating__svg">
                            <use xlink:href="${sprite}#icon-star"></use>
                          </svg>
                        `
                        : ``
                    } 
                </p>
              </div>
            </a>

              <button class="card--1__btn ${markupClass}" data-book-id="${this._data.id}">
                ${
                  markupClass === 'add-collection-btn'
                    ? `<svg class="${this._data.selected ? 'svg-fill' : 'svg-gray'}">
                    <use xlink:href="${sprite}#icon-circle-with-${this._data.selected ? 'minus' : 'plus'}"></use>
                  </svg>
                    `
                    : markupClass === 'remove-collection-btn'
                      ? `<svg class="svg-fill">
                    <use xlink:href="${sprite}#icon-circle-with-minus"></use>
                  </svg>`
                      : markupClass === 'shared-view'
                        ? ''
                        : markupClass === 'no-button'
                          ? ``
                          : `<svg class="${this._data.bookmarked ? 'svg-fill' : 'svg-empty'}">
                    <use xlink:href="${sprite}#icon-bookmark"></use>
                  </svg>`
                }
              </button>
            </li>
    `;
  }
}

export default new PreviewView();
