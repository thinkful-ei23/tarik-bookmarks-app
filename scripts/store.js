'use strict';

const store = (function() {
  const addBookmark = function(bookmark) {
    Object.assign(bookmark, this.expandedMode);
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
    console.log(this.addBookmarkToggled);
    this.addBookmarkToggled = !this.addBookmarkToggled;
    console.log(this.addBookmarkToggled);
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
    changeMinRating
  };
}());