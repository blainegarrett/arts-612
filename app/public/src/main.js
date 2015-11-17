// React is global
var React = require('react');
var ReactRouter = require('flux-react-router');
var moment = require('moment');
var NewHomePage = require('./components/pages/NewHomePage');
var CalendarPage = require('./components/pages/CalendarPage');
var EventPage = require('./components/pages/EventPage');
var WrittenPage = require('./components/pages/Written').WrittenPage;
var WrittenArticlePage = require('./components/pages/Written').WrittenArticlePage;
var WrittenCategoryPage = require('./components/pages/Written').WrittenCategoryPage;


var GalleryPages = require('./components/pages/GalleryPages');
var AboutPage = require('./components/pages/AboutPage');
var Error404Page = require('./components/pages/Error404Page');

var PageMeta = require('./components/pages/PageMeta');
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;
var PrimaryMenu = require('./components/pages/PrimaryMenu')

var analytics = require('./utils/analytics');


var SlideMenu = React.createClass({

    render: function() {
        return (
            <div id="site-menu">
                <ul className="list-unstyled main-menu">
                    <li><a href="/" data-ga-category="menu-link" className="internal-link">EVENTS<span className="icon"></span></a></li>
                    <li><a href="/about/" data-ga-category="menu-link" className="internal-link">ABOUT<span className="icon"></span></a></li>
                    <li><a href="/written/" data-ga-category="menu-link" className="internal-link">WRITTEN<span className="icon"></span></a></li>
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
                    &copy; 2015 MPLSART.COM
                </p>
            </div>

        );
    }
});


var HeaderNav = React.createClass({
    /* TODO: Bind this up to a store and event */

    /* Code For Sliding Navs and Featured Widget */
    closeMenu: function () {
        // Do things on Nav Close
        $('body').removeClass('show-menu');
        $(".modal-backdrop").remove();

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
            <div id="header_nav" className="navbar navbar-fixed-top navbar-inverse" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <a id="side_nav_toggle" className="pull-left" title="Show Menu" onClick={ this.toggleNav }><span></span></a>
                        <a className="navbar-brand internal-link" href="/" title="MPLSART.COM Home Page">MPLSART.COM</a>
                    </div>
                    <p className="navbar-text navbar-right"></p>
                </div>
                <div id="header_nav_cards"><NavCardsContainer /></div>
            </div>
        );
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



global.current_page = null; // This is set by PageMixin to the current page for use in widgets


var target_e = document.getElementById('root');
/* Figure out what to do with Routes... This is fugly... */
ReactRouter.createRoute('/', function () {
    React.unmountComponentAtNode(target_e);
    React.render(<App><NewHomePage /></App>, target_e);
});


ReactRouter.createRoute('/about/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<AboutPage />, target_e);
});


ReactRouter.createRoute('/events/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<EventPage slug={params.slug} />, target_e);
});

ReactRouter.createRoute('/calendar/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<CalendarPage/>, target_e);
});

ReactRouter.createRoute('/galleries/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<GalleryPages.GalleryIndexPage />, target_e);
});

ReactRouter.createRoute('/galleries/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<GalleryPages.GalleryViewPage slug={params.slug} />, target_e);
});

ReactRouter.createRoute('/written/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<WrittenPage />, target_e);
});


ReactRouter.createRoute('/written/{category_slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<WrittenCategoryPage category_slug={params.category_slug} />, target_e);
});


ReactRouter.createRoute('/written/{category_slug}/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<WrittenArticlePage category_slug={params.category_slug} slug={params.slug} />, target_e);
});





ReactRouter.createRoute('/written/{year}/{month}/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<WrittenArticlePage year={params.year} month={params.month} slug={params.slug} />, target_e);
});

ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<Error404Page />, target_e);
});

ReactRouter.init();

/* Establish Global end of "tonight" */
global.targed_tonight_end_date = moment().hour(9).minute(0).second(0);
global.targed_tonight_end_date = moment.utc(global.targed_tonight_end_date);





// navigateTo

/* OnChromeLoad Bindings */
$(function() {
    /* Anything run here must act only on the chrome since nothing else is loaded... */

	$('#site-menu').bind('swiperight', function(e) { toggleNav(e) });

	//$('#side_nav_toggle').click(function(e) {
	//	// Calling a function in case you want to expand upon this.
	//	toggleNav(e);
	//});

    // Important: Including 'tap' here will trigger both events and cause routing to dble load
    //  and cause invarient react errors. Also, page load analytics record twice.
	$('.internal-link').bind('click', routeTo);
});

global.routeTo = function (evt) {
    /* Global Helper to handle in-app click routing */
    // TODO: This only works on <a href="" ...> tags
    var anchor, $anchor, url;

    // Close open menus
    global.closeMenu()

    // Prevent Default for internal-links
    evt.preventDefault();

    // Resolve target action
    anchor = evt.currentTarget;
    $anchor = $(anchor);
    url = anchor.pathname; //https://gist.github.com/jlong/2428561

    // Record GA Event - This should be moved elsewhere?
    var ga_category = $anchor.data('ga-category');
    var ga_action = $anchor.data('ga-action');
    var ga_label = $anchor.data('ga-label');

    if (!ga_category) {
        ga_category = 'link';
    }
    if (!ga_action) {
        ga_action = url;
    }

    if (!ga_label) {
        ga_label = $(anchor).text();
    }

    $("html, body").animate({ scrollTop: 0 }, "slow");

    analytics.record_event(ga_category, ga_action, ga_label, 1);

    ReactRouter.goTo(url);

};

global.show_marquee = function() {
    var featured_hero = $('#featured-hero-area');

    if (featured_hero.length) {
        // Page Has the featured hero section
        var threshhold = featured_hero.offset().top + featured_hero.height();

        $('#header_nav').toggleClass('show-nav', $(document).scrollTop() > threshhold - 100);
    }
    else {
        $('#header_nav').addClass('show-nav');
    }
}


/* On Homepage - check if we should show the featured section */
$(window).on("scroll touchmove", function () {
    show_marquee();
});



/* Components outside of the main_content area*/
React.render(<PageMeta />, document.getElementById('page_meta'));