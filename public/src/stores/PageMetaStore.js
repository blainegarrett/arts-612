/*
 * PageMetaStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
//var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _page_meta = {
    'title': 'mplsart.com',
    'description': 'blorf'
};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */

function set(payload) {
    /* TODO: Apply Defaults */
    _page_meta = payload;
}

var PageMetaStore = assign({}, EventEmitter.prototype, {
  getRaw: function() {
    return _page_meta;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});




// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  console.log(payload);
  _page_meta = payload; // set
  PageMetaStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PageMetaStore;