/*
 * AuthStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'FEATURED_CHANGED';

var _featured_data = {
  is_logged_in: false
}; //global.featured_events.results;

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */


global.auth2; // The Google Auth Session



function set(payload) {
    /* TODO: Apply Defaults */

    alert('D NO use dis');
    _featured_data = payload;
}

var listener = function(is_logged_in) {
        /*
        Called when the login listener
        */

        if (is_logged_in) {
            //  Get Profile info
            var user = global.auth2.currentUser.get();
            var profile = user.getBasicProfile();

            console.log(profile.getId());

            _featured_data = {
              is_member: false,
              is_logged_in: true,
              name: profile.getName(),
              img_url: profile.getImageUrl(),
              email: profile.getEmail()
            };

            // Next see if they are a native user and get permissions, etc
            var id_token = user.getAuthResponse().id_token;

            $.ajax('/derp', {
                dataType: 'json',
                method:'post',
                data: {google_auth_token: id_token},
                success: function(data) {
                  console.log(data.results);
                  _featured_data['is_member'] = data.results.is_member;
                  AuthStore.emitChange();

                },
                error: function() {
                  console.log(arguments);
                }
              });







        }
        else {
          _featured_data = {
              is_logged_in: is_logged_in
          };
        }

        AuthStore.emitChange();
};




var AuthStore = assign({}, EventEmitter.prototype, {
    last_poll: null,





    get_from_server: function() {
        this.last_poll = Date.now() // TODO: This should maybe only be on success...

        global.gapi.load('auth2', function() {
          // Retrieve the singleton for the GoogleAuth library and set up the client.

          global.auth2 = global.gapi.auth2.init({
              client_id: '945216243808-b7mu8t6ejidit13uperfiv615lf3ridg.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
              // Request scopes in addition to 'profile' and 'email'
              //scope: 'additional_scope'
            });
          console.log('maybe loaded?');
          global.auth2.isSignedIn.listen(listener);
        });






        return;

        //global.auth2.isSignedIn.;



        $.ajax({
            url: '/api/featured',
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
      AuthStore.emitChange();
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = AuthStore;