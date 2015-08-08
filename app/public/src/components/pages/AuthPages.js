/* Pages For StyleGuides and Design Documentation */

var React = require('react');
var PageMixin = require('./PageMixin');
var ReactRouter = require('flux-react-router');
var AuthStore = require('../../stores/AuthStore');

var SignInPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Sign in',
        'description': 'Sign in'
    },

    pageDidMount: function () {
        // Set Default Page Meta
        this.setMeta();

    },

    signInHelper: function () {
        var promise = global.auth2.signIn();

        promise.then(function(profile) {
          // This was a successful login on the Google System
          // But Are they a member of our site?

          var id_token = profile.getAuthResponse().id_token;

            $.ajax('/api/auth/authenticate', {
                dataType: 'json',
                method:'post',
                data: {
                  google_auth_token: id_token
                },
                success: function (data) {
                  console.log(data);

                  if (!data.results.is_member) {
                    AuthStore.get_update_with_blork({is_logged_in: false, is_member:false})
                    alert('It looks like you do not currently have permission. Check back soon.');
                  }
                  else {
                    AuthStore.get_update_with_blork(data.results);
                    ReactRouter.goTo('/');

                  }

                },
                error: function() {
                  console.log(arguments);
                }
              });





        }, function(err){
          console.log('err?');
          console.log(err);
        });

        return false;
    },

    render: function() {
        return (
          <div>

          <h2>Sign In</h2>
          <p>If you have an account with mplsart.com, sign in. Otherwise, we will add you to the guest list for when we open the doors.</p>


          <form className="form-signin signIn mg-btm">
                <div className="social-box">

                  <div className="row">
                      <div className="col-md-12">
                          <a href="#" onClick={ this.signInHelper } title="Google" className="btn btn-block btn-social btn-lg btn-google-plus">
                              <i className="fa fa-google-plus"></i> Sign in with Google
                          </a>
                      </div>
                  </div>


                </div>
            </form>
          </div>
          )
    }
});



module.exports = {
    SignIn: SignInPage
};
