class View {
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
    console.log(`parent cleared: ${this._parentElement}`);
  }

  render(data) {
    try {
      this._data = data;
      const markup = this._generateMarkup();
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    } catch (err) {
      console.error(err);
    }
  }
}

export default View;
