import { throttle } from '../helpers';
import sprite from 'url:../../img/sprite.svg';
class View {
  _data;
  _currentFocus = -1;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  render(data, render = true, markupClass = '') {
    this._data = data;
    const markup = this._generateMarkup(markupClass);
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="absolute-center message">
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderToast(message, error) {
    const alertBox = document.createElement('div');
    alertBox.className = error ? 'custom-alert-red' : 'custom-alert';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    alertBox.classList.add('show-alert');
    setTimeout(() => alertBox.classList.remove('show-alert'), 2000);
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  }

  renderLoader() {
    const markup = `
      <div class="loader">
        <svg class="loader__svg loader__svg--1">
          <use xlink:href="${sprite}#icon-loader-book-2"></use>
        </svg>
        <svg class="loader__svg loader__svg--2">
          <use xlink:href="${sprite}#icon-loader-book-4"></use>
        </svg>        
        <svg class="loader__svg loader__svg--3">
          <use xlink:href="${sprite}#icon-loader-book-3"></use>
        </svg>       
        <svg class="loader__svg loader__svg--4">
          <use xlink:href="${sprite}#icon-loader-book-1"></use>
        </svg> 
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return 'error';
    try {
      this._data = data;
      const newMarkup = this._generateMarkup();
      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];

        if (
          !newEl.isEqualNode(curEl) &&
          newEl.firstChild?.nodeValue.trim() !== ''
        ) {
          curEl.textContent = newEl.textContent;
        }

        if (!newEl.isEqualNode(curEl)) {
          Array.from(newEl.attributes).forEach(attr =>
            curEl.setAttribute(attr.name, attr.value),
          );
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  addHandlerDebounce(handler) {
    const searchBar = this._parentElement.querySelector('.search-bar');
    const suggestionsContainer =
      this._parentElement.querySelector('.suggestions');
    const form = this._parentElement.querySelector(`.search-form`);

    searchBar.addEventListener('input', () => {
      const value = searchBar.value.trim();

      if (!value || value.length < 3) {
        this._closeSuggestions();
        return;
      }

      handler(value);
      this._handleSuggestionContainer(value);
    });

    searchBar.addEventListener(
      'keydown',
      throttle(e => this._handleCurrentSuggestion(e)),
    );

    suggestionsContainer.addEventListener('click', e => {
      const suggestion = e.target.closest(`.suggestions__suggestion`);
      if (!suggestion) return;

      searchBar.value = suggestion.textContent;
      form.dispatchEvent(new Event('submit'));
      this._closeSuggestions();
    });

    this._parentElement.addEventListener('click', e => {
      if (e.target.closest(`.suggestions`) || e.target.closest(`.suggestion`))
        return;
      this._closeSuggestions();
    });
  }

  _closeSuggestions() {
    const suggestionsContainer =
      this._parentElement.querySelector(`.suggestions`);
    if (!suggestionsContainer) return;
    suggestionsContainer.classList.remove(`suggestions--active`);
    this._data = '';
    this._currentFocus = -1;
    suggestionsContainer.innerHTML = '';
  }

  _handleSuggestionContainer = value => {
    const suggestionsContainer =
      this._parentElement.querySelector(`.suggestions`);

    if (value) {
      suggestionsContainer.classList.add(`suggestions--active`);
    } else {
      this._closeSuggestions();
    }
  };

  _handleCurrentSuggestion = e => {
    const suggestions = this._parentElement.querySelectorAll(
      `.suggestions__suggestion`,
    );
    const form = this._parentElement.querySelector(`.search-form`);

    if (e.key === `ArrowDown`) {
      e.preventDefault();
      this._currentFocus = (this._currentFocus + 1) % suggestions.length;
      this._setActiveSuggestion(suggestions);
    } else if (e.key === `ArrowUp`) {
      e.preventDefault();
      this._currentFocus =
        (this._currentFocus - 1 + suggestions.length) % suggestions.length;
      this._setActiveSuggestion(suggestions);
    } else if (e.key === `Enter`) {
      form.dispatchEvent(new Event('submit'));
      this._closeSuggestions();
    }
  };

  _setActiveSuggestion(suggestions) {
    if (!suggestions || suggestions.length === 0) return;
    const searchBar = this._parentElement.querySelector(`.search-bar`);

    if (!suggestions) return;
    suggestions.forEach(suggestion =>
      suggestion.classList.remove('suggestions__suggestion--active'),
    );

    const activeSuggestion = suggestions[this._currentFocus];

    activeSuggestion.classList.add(`suggestions__suggestion--active`);

    activeSuggestion.scrollIntoView({
      behaviour: 'smooth',
      block: 'nearest',
    });

    searchBar.value = suggestions[this._currentFocus].textContent;
  }

  updateSuggestions(data) {
    this._data = data;
    const suggestionsContainer =
      this._parentElement.querySelector('.suggestions');
    const searchBar = this._parentElement.querySelector('.search-bar');

    if (!suggestionsContainer) return;
    if (!searchBar.value.trim()) {
      this._closeSuggestions();
      return;
    }

    suggestionsContainer.innerHTML = '';
    this._currentFocus = -1;
    if (data && data.length > 0) {
      const suggestionsMarkup = this._generateSuggestionsMarkup();
      suggestionsContainer.insertAdjacentHTML('afterbegin', suggestionsMarkup);
    }
  }

  _generateSuggestionsContainerMarkup() {
    return `
    <ul class="suggestions">
     ${this._generateSuggestionsMarkup()}
    </ul>
  `;
  }

  _generateSuggestionsMarkup() {
    return `${
      this._data
        ? this._data
            .map(
              (title, id) =>
                `<li key=${id} class="suggestions__suggestion">${title}</li>`,
            )
            .join('')
        : ``
    }`;
  }
}

export default View;
