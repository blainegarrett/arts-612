/*
 * AuthStore - storage and operations on page meta
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'FEATURED_CHANGED';

global.auth2; // The Google Auth Session

/* Default User payload data */
var _featured_data = {
  is_logged_in: false
};

google_api_client_id = global.settings['google_api_client_id'];


var google_auth_listener = function(is_logged_in) {
  /*
    Callback handler listening for changes in the Google Auth Login state
    Also, at the moment called on every hard page load...
  */

  // Default user_profile
  user_profile = {
    is_logged_in: false,
    is_member: false
  };

  // User was/is authenticated via Google Auth now...
  if (is_logged_in) {

    //  Get user and profile of user authenticated via google sign in
    //  Remember, this doesn't mean they're a member of our site nor authenticated against our sys

    var google_user = global.auth2.currentUser.get();
    var google_profile = google_user.getBasicProfile();

    // Populate some temporary data...?
    _featured_data = {
      is_member: false,
      is_logged_in: true,
      name: google_profile.getName(),
      img_url: google_profile.getImageUrl(),
      email: google_profile.getEmail()
    };

    // Next see if they are a native user and get permissions, etc
    var id_token = google_user.getAuthResponse().id_token;

    // TODO: We really need to make this a service with promises
    $.ajax('/api/auth/authenticate', {
      dataType: 'json',
      method:'post',
      data: {
        google_auth_token: id_token
      },
      success: function(data) {
        // Check to see if they're not valid for any reason
        // Not a member, etc

        // Catch any errors
        user_profile = _featured_data
        if (data.results.is_member) {
          user_profile['is_member'] = data.results.is_member;
          user_profile['is_logged_in'] = true;
          user_profile['name'] = google_profile.getName();
          user_profile['img_url'] = google_profile.getImageUrl();
          user_profile['email'] = google_profile.getEmail();
        }
        else {
          // Not authenticated... not a user of the system?
          user_profile = {
              is_logged_in: false,
              is_member: false
          };
        }

        // Update the store and emit change
        get_update_with_blork(user_profile)
      },

      error: function() {
        console.log(arguments);
      }
    }); // end of ajax call

  }
  else {
    user_profile = {
        is_logged_in: false,
        is_member: false
    };
  }

  // Update the store and emit change
  get_update_with_blork(user_profile)
};



function get_update_with_blork(data) {
  _featured_data = data;
  AuthStore.emitChange();
}


var AuthStore = assign({}, EventEmitter.prototype, {
    last_poll: null,


    get_update_with_blork: function (data) {
      /* Note this wrapper is only here for a public interface */
      console.log('BEFORE???');

      return get_update_with_blork(data)
    },


    get_from_server: function() {
      /*
        Fetch login state from the google auth service
      */
      this.last_poll = Date.now() // TODO: This should maybe only be on success...

        // TODO: How do we know to use google?
        global.gapi.load('auth2', function() {
          // Retrieve the singleton for the GoogleAuth library and set up the client.

          global.auth2 = global.gapi.auth2.init({
              client_id: google_api_client_id + '.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin',
              // Request scopes in addition to 'profile' and 'email'
              //scope: 'additional_scope'
            });

          global.auth2.isSignedIn.listen(google_auth_listener);
        });

        return;
    },


  getRaw: function() {
    /* Retrieve the Raw user profile */

    /* Check if last poll was greater than... */
    if (!this.last_poll) {
        // Call out to the server to load it up
        // TODO: This should be a promise?
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