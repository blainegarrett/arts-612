/*
 * FeaturedContentStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _featured_data = global.featured_events.results;

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */

function set(payload) {
    /* TODO: Apply Defaults */
    _featured_data = payload;
}

var FeaturedContentStore = assign({}, EventEmitter.prototype, {
  getRaw: function() {
    return _featured_data;
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

  //console.log(payload);
  _featured_data = payload; // set
  FeaturedContentStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FeaturedContentStore;