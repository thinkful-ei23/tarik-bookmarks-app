'use strict';
/* global store, $ */

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/tarik';
  const getBookmarks = function(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createBookmarks = function(newEntry, onSuccess, onError) {
    const query = {
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newEntry,
      success: onSuccess,
      error: onError
    };
    $.ajax(query);
  };

  const updateBookmark = function(id, updateData, callback) {
    const query = {
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: updateData,
      success: callback,
    };
    $.ajax(query);
  };

  const deleteBookmark = function(id, callback) {
    const query = {
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callback
    };
    $.ajax(query);
  };

  return {
    getBookmarks,
    createBookmarks,
    updateBookmark,
    deleteBookmark
  };
}());