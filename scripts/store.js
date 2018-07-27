'use strict';

const store = (function() {
  const setError = function(error) {
    this.error = error;
  };
  const addBookmark = function(bookmark) {
    const storeObj = Object.assign({},bookmark, this.expandedMode);
    console.log(`Adding the following Bookmark: ${storeObj} status: expanded: ${storeObj.expandedMode}`);
    this.bookmarks.push(storeObj);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id);
  };

  const findAndUpdate = function(id, newData) {
    const item = this.findById(id);
    Object.assign(item, newData);
  };

  const toggleAddBookmark = function () {
    this.addBookmarkToggled = !this.addBookmarkToggled;
  };

  const changeMinRating = function (newRating) {
    this.minRating = newRating;
  };
  
  return {
    bookmarks: [],
    addBookmark,
    findById,
    findAndUpdate,
    addBookmarkToggled: false,
    expandedMode: {expanded: false},
    minRating: 0,
    toggleAddBookmark,
    changeMinRating,
    setError,
    error: null
  };
}());