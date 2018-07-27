'use strict';
/* global store, $, api */

const bookmarkList = (function() {

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateBookmarkElement(bookmark) {
    if (bookmark.expanded) {
      return `
      <li class="js-bookmark-list-item__expanded" data-bookmark-id="${bookmark.id}">
        <span class="bookmark-name">${bookmark.title}</span>
        <span class="current-rating">Bookmark rating: ${bookmark.rating}</span>
        <form id="update-bookmark-form">
          <p>Change your rating:</p>
          <div class="js-set-rating">
            <label for="1 star">1 Star</label>
            <input type="radio" name="rating" value="1" aria-label="1 stars">
            <label for="2 star">2 Stars</label>
            <input type="radio" name="rating" value="2" aria-label="2 stars">
            <label for="3 star">3 Stars</label>
            <input type="radio" name="rating" value="3" aria-label="3 stars">
            <label for="4 star">4 Stars</label>
            <input type="radio" name="rating" value="4" aria-label="4 stars">
            <label for="5 star">5 Stars</label>
            <input type="radio" name="rating" value="5" aria-label="5 stars">
          </div>
          <textarea name="desc" class="col-6 new-entry-des" cols="40" rows="3" placeholder="Enter new description..." aria-label="Update bookmark description" required>${bookmark.desc}</textarea>
          <br>
          <button type="submit" class="update-button" js-update-button">Update</button>
        </form>
        <a href="${bookmark.url}" class="button">Visit Page</a>
        <button class="collapse-button js-collapse-button">Collapse</button>
        <button class="delete-button js-delete-button">Delete</button>
      </li>
      `;
    }
    return `
    <li class="js-bookmark-list-item" data-bookmark-id="${bookmark.id}">
      <span class="bookmark-name">${bookmark.title}</span>
      <span class="bookmark-rating">${bookmark.rating} Stars</span>
    </li>
    `;
  }

  function generateBookmarkItemsString(bookmarkList) {
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  function generateAddBookmarkForm () {
    return `
    <form id="js-add-bookmark-form" class="add-bookmark-form">
      <input type="text" name="title" class="js-new-entry-title" placeholder="Enter bookmark name" aria-label="enter a title" required>
      <p>Rate your bookmark:</p>
      <div class="js-set-rating">
        <label for="1 star">1 Star</label>
        <input type="radio" name="rating" value="1" aria-label="1 stars">
        <label for="2 star">2 Stars</label>
        <input type="radio" name="rating" value="2" aria-label="2 stars">
        <label for="3 star">3 Stars</label>
        <input type="radio" name="rating" value="3" aria-label="3 stars">
        <label for="4 star">4 Stars</label>
        <input type="radio" name="rating" value="4" aria-label="4 stars">
        <label for="5 star">5 Stars</label>
        <input type="radio" name="rating" value="5" aria-label="5 stars">
      </div>
      <input type="text" name="url" class="new-entry-url js-new-entry-url" placeholder="Enter bookmark url here" aria-label="enter a url" required>
      <br>
      <textarea name="desc" class=" col-6 new-entry-des" cols="40" rows="3" placeholder="Enter a description..." aria-label="Enter a description"></textarea>
      <br>
      <button type="submit">Submit</button>
      <div class="error-container"></div>
    </form>
    `;
  }

  function render() {
    console.log('render ran!');
    //Render bookmark add form to the DOM if toggled

    if (store.addBookmarkToggled) {
      const html = generateAddBookmarkForm();
      $('.js-add-form').html(html);
      if (store.error) {
        const el = generateError(store.error);
        $('.error-container').html(el);
      } else {
        $('.error-container').empty();
      }
    } else {
      $('.js-add-form').html('');
    }
    
    let bookmarks = store.bookmarks;
    // Filter bookmark list based on minimum rating
    bookmarks = store.bookmarks.filter(bookmark => bookmark.rating > store.minRating);

    //Render bookmark list in the DOM
    const bookmarkListItemString = generateBookmarkItemsString(bookmarks);
    $('.js-bookmark-list').html(bookmarkListItemString);
  }

  function handleAddBookmarkClicked() {
    $('.js-add-bookmark').on('click', e => {
      console.log('handleAddBookmarkClicked ran!');
      //e.preventDefault();
      store.toggleAddBookmark();
      render();
    });
  }

  function handleSubmitNewBookmark() {
    $('.js-add-form').on('submit', '#js-add-bookmark-form', e => {
      console.log('handleSubmitNewBookmark ran!');
      e.preventDefault();
      const newEntry = $(e.target).serializeJson();
      $('#js-add-bookmark-form')[0].reset();
      console.log(`New bookmark item submitted: ${newEntry}`);
      api.createBookmarks(newEntry, function(newBookmark) {
        console.log(`New bookmark created: ${newBookmark}`);
        store.toggleAddBookmark();
        api.getBookmarks(function(bookmarks) {
          store.bookmarks = [];
          bookmarks.forEach(function(bookmark) {
            store.addBookmark(bookmark);
          });
          render();
        });
      }, function(error) {
        console.log(error);
        store.setError(error);
        render();
      });
    });
  }

  function handleChangeMinimumRating() {
    $('.js-set-min').on('change', e => {
      console.log('handleChangeMinimumRating ran!');
      const newMinVal = parseInt($('.js-set-min').val());
      store.changeMinRating(newMinVal);
      render();
    });
  }

  function getBookmarkIdFromElement(item) {
    return $(item)
      .closest('.js-bookmark-list-item')
      .data('bookmark-id');
  }

  function getBookmarkIdFromExpandedElem(item) {
    return $(item)
      .closest('.js-bookmark-list-item__expanded')
      .data('bookmark-id');
  }

  function handleExpandedBookmarkClick() {
    $('.js-bookmark-list').on('click', '.js-bookmark-list-item', e => {
      console.log('handleExpandedBookmarkClick ran!');
      const id = getBookmarkIdFromElement(e.currentTarget);
      const clickedBookmark = store.findById(id);
      const newExpandedVal = {
        expanded: !clickedBookmark.expanded
      };
      store.findAndUpdate(id, newExpandedVal);
      render();
    });
  }

  function handleCollapseClick() {
    $('.js-bookmark-list').on('click', '.js-collapse-button', e => {
      console.log('handleCollapseButton Ran!');
      const id = getBookmarkIdFromExpandedElem(e.currentTarget);
      const clickedBookmark = store.findById(id);
      const newExpandedVal = {
        expanded: !clickedBookmark.expanded
      };
      store.findAndUpdate(id, newExpandedVal);
      render();
    });
  }

  function handleUpdateBookmark() {
    $('.js-bookmark-list').on('submit', '#update-bookmark-form', e => {
      console.log('handleUpdateBookmark ran');
      e.preventDefault();
      const updateEntry = $(e.target).serializeJson();
      const id = getBookmarkIdFromExpandedElem(e.currentTarget);
      api.updateBookmark(id, updateEntry, function(){
        console.log('Update successful');
        api.getBookmarks(function(bookmarks) {
          store.bookmarks = [];
          bookmarks.forEach(function(bookmark) {
            store.addBookmark(bookmark);
          });
          const updatedBookmark = store.findById(id);
          updatedBookmark.expanded = !updatedBookmark.expanded;
          render();
        });
      });
    });
  }

  function handleDeleteBookmarkClick() {
    $('.js-bookmark-list').on('click', '.js-delete-button', e => {
      console.log('handleDeleteBookmarkClick ran!');
      const id = getBookmarkIdFromExpandedElem(e.currentTarget);
      api.deleteBookmark(id, function() {
        console.log('Deletion successful');
        api.getBookmarks(function(bookmarks) {
          store.bookmarks = [];
          bookmarks.forEach(function(bookmark) {
            store.addBookmark(bookmark);
          });
          render();
        });
      });
    });
  }

  function handleCloseError() {
    $('.js-add-form').on('click', '#cancel-error', e => {
      store.setError(null);
      render();
    });
  }

  function bindEventHandlers() {
    handleAddBookmarkClicked();
    handleSubmitNewBookmark();
    handleChangeMinimumRating();
    handleExpandedBookmarkClick();
    handleCollapseClick();
    handleUpdateBookmark();
    handleDeleteBookmarkClick();
    handleCloseError();
  }
  return {
    render: render,
    bindEventHandlers: bindEventHandlers
  };
}());