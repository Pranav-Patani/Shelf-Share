class View {
  _data;

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

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="container">
    <div class="message-container">
        <div class="message-container__content">
       <p class="paragraph--big">${message}</p>
        </div>
      </div>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            
          </svg>
        </div>
        <p>${message}</p>
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
}

export default View;
