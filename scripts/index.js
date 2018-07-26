'use strict';
/* global $, bookmarkList, store, api */

$(document).ready(function() {
  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    bookmarkList.render();
    bookmarkList.bindEventHandlers();
  });
});

