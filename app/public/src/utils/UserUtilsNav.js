var React = require('react');
var AuthStore = require('../stores/AuthStore');


UserUtilsNav = React.createClass({

    _onChange: function() {
        /* Pick up signal for when featured content changes - typically async load */

        this.setState(AuthStore.getRaw());
    },
    componentDidMount: function() {
        // Subscribe to changes in the featured events
        AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        // Un-Subscribe to changes in the featured events
      AuthStore.removeChangeListener(this._onChange);
    },

    getInitialState: function () {
        /* Pull data from featured store shared with homepage */
        return AuthStore.getRaw();
    },


    maybeSignin: function() {
        // TODO: These return promises
        global.auth2.signIn();
        return false;
    },
    maybeSignout: function() {
        // TODO: These return promises
        global.auth2.signOut();
        return false;
    },

    render: function () {
        if (!this.state.is_logged_in) {
            return (<ul id="nav_utils_menu"></ul>);

            return (
                <ul id="nav_utils_menu">
                    <li className="user">
                        <div onClick={ this.maybeSignin }>NOT LOGGED IN!!!!!</div>
                    </li>
                </ul>);
        }

        return (<ul id="nav_utils_menu">
                <li className="user">
                    <a className="dropdown-toggle" href="#!" data-toggle="dropdown" aria-expanded="false">
                    <img src={ this.state.img_url } height="20px" width="20px" alt={ this.state.name } className="img-circle" />{ this.state.name }<i className="caret"></i>
                </a>

                <ul className="dropdown-menu" role="menu">

                    {/*
                    <li>
                        <a href="page-profile.html"><i className="fa fa-user"></i> Profile</a>
                    </li>

                    <li><a href="mail-inbox.html">
                        <i className="fa fa-envelope"></i> Messages <span className="badge new">2</span>
                    </a>
                    </li>
                        <li><a href="#!"><i className="fa fa-cogs"></i> Settings</a>
                    </li>
                    <li className="divider"></li>
                */ }
                    <li>
                        <a href="#" onClick={this.maybeSignout}><i className="fa fa-sign-out"></i> Logout</a>
                    </li>
                </ul>


                </li>
            </ul>

        )
    }
});


module.exports = UserUtilsNav;