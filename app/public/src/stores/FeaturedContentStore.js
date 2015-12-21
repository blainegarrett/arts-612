/*
 * FeaturedContentStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'FEATURED_CHANGED';

var _featured_data = []; //global.featured_events.results;

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */


function set(payload) {
    /* TODO: Apply Defaults */
    _featured_data = payload;
}

var FeaturedContentStore = assign({}, EventEmitter.prototype, {
    last_poll: null,
    get_from_server: function() {
        this.last_poll = Date.now() // TODO: This should maybe only be on success...

        $.ajax({
            url: 'http://api-module.arts-612.appspot.com/api/featured',
            dataType: 'json',
            success:  function (data) {
                _featured_data = data.results;
                this.emitChange();

            }.bind(this),
            error: function (xhr, status, err) {
                console.log('There was an error attempting to retrieve featured content. ');
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
        });
    },


  getRaw: function() {
    if (!this.last_poll) {
        this.get_from_server();
    }
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

  if (payload.action == CHANGE_EVENT) {
      _featured_data = payload; // set
      FeaturedContentStore.emitChange();
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = FeaturedContentStore;