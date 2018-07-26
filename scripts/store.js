'use strict';

const store = (function() {
  const addBookmark = function(bookmark) {
    Object.assign(bookmark, expandedMode);
    console.log(`Adding the following object: ${bookmark}`);
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id);
  };

  const findAndUpdate = function(id, newData) {
    const item = this.findById(id);
    Object.assign(item, newData);
  };

  const toggleAddBookmark = function () {
    this.addBookMarkToggled = !this.addBookmarkToggled;
  };

  const changeMinRating = function (newRating) {
    this.minRating = newRating;
  };

  const addBookmarkToggled = false;

  const expandedMode = {
    expanded: false
  };

  const minRating = 0;
  
  return {
    bookmarks: [],
    addBookmark,
    findById,
    findAndUpdate,
    addBookmarkToggled,
    expandedMode,
    minRating,
    toggleAddBookmark,
    changeMinRating
  };
}());