'use strict';
/* global store, $, api */

const bookmarkList = (function() {

  function generateBookmarkElement(bookmark) {
    if (bookmark.expanded) {
      return `
      <li class="js-bookmark-list-item__expanded" data-bookmark-id="${bookmark.id}">
        <span class="bookmark-name">${bookmark.title}</span>
        <form id="update-bookmark-form">
          <input type="text" name="rating" class="bookmark-rating" value="${bookmark.rating}">
          <textarea name="desc" class="new-entry-des" cols="40" rows="3" placeholder="Enter new description...">${bookmark.desc}</textarea>
          <button type="submit" class="expanded-view-button js-update-button">Update</button>
        </form>
        <a href="${bookmark.url}" class="button">Visit Page</a>
        <button class="expanded-view-button js-collapse-button">Collapse</button>
        <button class="expanded-view-button js-delete-button">Delete</button>
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
    <form id="js-add-bookmark-form">
      <input type="text" name="title" class="js-new-entry-title" placeholder="Enter bookmark name">
      <input type="text" name="rating" class="js-set-rating" placeholder="Enter bookmark rating (1-5)">
      <input type="text" name="url" class="js-new-entry-url" placeholder="Enter bookmark url here (i.e. http://thinkful.com)">
      <textarea name="desc" class="new-entry-des" cols="40" rows="3" placeholder="Enter a description..."></textarea>
      <button type="submit">Submit</button>
    </form>
    `;
  }

  function render() {
    console.log('render ran!');
    //Render bookmark add form to the DOM if toggled
    if (store.addBookmarkToggled) {
      const html = generateAddBookmarkForm();
      $('.js-add-form').html(html);
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
        render();
      });
    });
  }

  function handleChangeMinimumRating() {
    $('.js-set-min').on('change', e => {
      console.log('handleChangeMinimumRating ran!');
      const newMinVal = parseInt($('.js-set-min').val());
      console.log(newMinVal);
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

  function bindEventHandlers() {
    handleAddBookmarkClicked();
    handleSubmitNewBookmark();
    handleChangeMinimumRating();
    handleExpandedBookmarkClick();
    handleCollapseClick();
    handleUpdateBookmark();
  }
  return {
    render: render,
    bindEventHandlers: bindEventHandlers
  };
}());