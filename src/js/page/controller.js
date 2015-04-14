var debounce = require('debounce');

class Controller {
  constructor() {
    this.toolbarView = new (require('./views/toolbar'));
    this.searchResultsView = new (require('./views/search-results'));

    this.wikipedia = new (require('./wikipedia'));

    this.lastSearchId = 0;

    var debouncedSearch = debounce(e => this.onSearchInput(e), 150);
    
    this.toolbarView.on('searchInput', event => {
      if (!event.value) {
        this.onSearchInput(event);
        return;
      }
      debouncedSearch(event)
    });
  }

  onSearchInput({value}) {
    var id = ++this.lastSearchId;

    if (!value) {
      this.searchResultsView.hide();
      return;
    }

    this.wikipedia.search(value).then(results => {
      requestAnimationFrame(_ => {
        if (id != this.lastSearchId) return;
        this.searchResultsView.update(results);
      });
    });
  }
}

module.exports = Controller;