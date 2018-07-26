'use strict';
/* global store, $, api */

const bookmarkList = (function() {

  function generateBookmarkElement(bookmark) {
    if (bookmark.expanded) {
      return `
      <li class="js-bookmark-list-item" data-bookmark-id="${bookmark.id}">
        <span class="bookmark-name">${bookmark.title}</span>
        <span class="bookmark-rating">${bookmark.rating}</span>
        <textarea name="new-entry-des" class="new-entry-des" cols="40" rows="3" placeholder="Enter new description...">
          ${bookmark.desc}
        </textarea>
        <a href="${bookmark.url}" class="button">Visit Page</a>
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
      <input type="text" name="new-entry-name" class="js-new-entry-name" placeholder="Enter bookmark name">  
      <select class="js-set-rating">
        <option value="1-star">1 Star</option>
        <option value="2-star">2 Star</option>
        <option value="3-star">3 Star</option>
        <option value="4-star">4 Star</option>
        <option value="4-star">5 Star</option>
      </select>
      <input type="text" name="new-entry-url" class="js-new-entry-url" placeholder="Enter bookmark url here (i.e. http://thinkful.com)">
      <textarea name="new-entry-des" class="new-entry-des" cols="40" rows="3" placeholder="Enter a description...">
      </textarea>
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

  function bindEventHandlers() {
    handleAddBookmarkClicked();
    handleSubmitNewBookmark();
    handleChangeMinimumRating();
  }
  return {
    render: render,
    bindEventHandlers: bindEventHandlers
  };
}());