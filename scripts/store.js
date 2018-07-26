'use strict';

const store = (function() {
  const addItem = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id);
  };

  const findAndUpdate = function(id, newData) {
    const item = this.findById(id);
    Object.assign(item, newData);
  };

  return {
    bookmarks: [],
    addItem,
    findById,
    findAndUpdate
  };
}());