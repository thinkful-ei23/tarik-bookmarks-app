'use strict';
/* global $*/

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => {
      if (name === 'rating') {
        return o[name] = parseInt(val);
      }
      return o[name] = val;
    });
    return JSON.stringify(o);
  }
});