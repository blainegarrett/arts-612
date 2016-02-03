var React = require('react');
var NavCardsContainer = require('./NavCardsContainer').NavCardsContainer;
var PageLink = require('./../linking').PageLink;
var analytics = require('./../utils/analytics');

var SlideMenu = React.createClass({

    render: function() {
        return (
            <div id="site-menu">
                <ul className="list-unstyled main-menu">
                    <li><PageLink activeClassName="active" to="/" data-ga-category="menu-link">EVENTS<span className="icon"></span></PageLink></li>
                    <li><PageLink activeClassName="active" to="/about/" data-ga-category="menu-link">ABOUT<span className="icon"></span></PageLink></li>
                    <li><PageLink activeClassName="active" to="/written/" data-ga-category="menu-link">WRITTEN<span className="icon"></span></PageLink></li>
                    <li><a href="mailto:calendar@mplsart.com" data-ga-category="menu-link">calendar@mplsart.com<span className="icon"></span></a></li>
                </ul>

                <p className="social-icons">
                    <a href="https://www.facebook.com/mplsart" target="_new">
                        <i className="fa fa-facebook"></i>
                    </a>

                    <a href="https://twitter.com/mplsart" target="_new">
                        <i className="fa fa-twitter"></i>
                    </a>

                    <a href="http://instagram.com/mplsart" target="_new">
                        <i className="fa fa-instagram"></i>
                    </a>
                </p>

                <p>Est. 2005<br />
                    We love art. We love you.<br />
                    &copy; 2016 MPLSART.COM
                </p>
            </div>
        );
    }
});


var HeaderNav = React.createClass({
    /* TODO: Bind this up to a store and event */

    /* Code For Sliding Navs and Featured Widget */
    closeMenu: function (e) {
        // Do things on Nav Close
        $('body').removeClass('show-menu');
        $(".modal-backdrop").remove();

        if (e) {
            e.preventDefault();
        }
        return false;
        // Emit event that menu closed
    },

    openMenu: function () {
        // Do things on Nav Open
        $('body').addClass('show-menu');
        var modal = $('<div class="modal-backdrop"></div>');

        modal.bind('click tap', this.closeMenu)
        modal.appendTo(document.body);

        // Emit event that menu opened
    },

    toggleNav: function (e) {

        var ga_category = 'menu-toggle';
        var ga_action = e.type;
        var ga_label;

        if ($('body').hasClass('show-menu')) {
            this.closeMenu();
            ga_label = 'close';
        }
        else {
            this.openMenu()
            ga_label = 'open';
        }

        analytics.record_event(ga_category, ga_action, ga_label, 1);
    },

    render: function () {
        return (
            <div id="header_nav" className="navbar-fixed" role="navigation">
                <div className="containerxx">

                    <div className="navbar-fixed">
                        <nav>
                            <div className="container">
                                <div className="nav-wrapper">
                                        <a id="side_nav_toggle" className="left" title="Show Menu" onClick={ this.toggleNav }><span></span></a>

                                        <PageLink className="brand-logo hide-on-med-and-down left" to="/" title="MPLSART.COM Home Page">MPLSART.COM</PageLink>

                                        <PageLink className="brand-logo center hide-on-large-only" to="/" title="MPLSART.COM Home Page">MPLSART.COM</PageLink>

                                        <ul className="right hide-on-med-and-down">
                                            <li>&nbsp;</li>
                                        </ul>
                                </div>
                            </div>

                            <div id="header_nav_cards"><NavCardsContainer /></div>

                        </nav>
                    </div>
            </div>
        </div>);
    }
});


var App = React.createClass({

    render: function(){
        return (
            <div>
                <SlideMenu />
                <HeaderNav />

                <div id="site-wrapper">
                    <div id="site-canvas">
                        <div className="container">
                            <div id="main_content">
                                { this.props.children }
                            </div>
                        </div>
                    </div>
                </div>

            </div>);
    }
});

module.exports = {
    App: App
};