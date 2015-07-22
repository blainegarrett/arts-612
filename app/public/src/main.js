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
var GalleryPage = require('./components/pages/GalleryPage');
var GalleryViewPage = require('./components/pages/GalleryViewPage');
var Error404Page = require('./components/pages/Error404Page');
var AboutPage = require('./components/pages/AboutPage');

var StyleGuide = require('./components/pages/StyleGuide');



var PageMeta = require('./components/pages/PageMeta');
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;
var PrimaryMenu = require('./components/pages/PrimaryMenu')

var analytics = require('./utils/analytics');

global.current_page = null; // This is set by PageMixin to the current page for use in widgets


UserUtilsNav = React.createClass({
    render: function () {
        return (

			<ul id="nav_utils_menu">
				<li className="user">
				    <a className="dropdown-toggle" href="#!" data-toggle="dropdown" aria-expanded="false">
				    <img src="http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fMjA0MDAwMg/card_small.png" height="20px" width="20px" alt="John Doe" className="img-circle" />John Doe<i className="caret"></i>
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
    				    <a href="page-sign-in.html"><i className="fa fa-sign-out"></i> Logout</a>
    				</li>
				</ul>


				</li>
			</ul>

        )
    }
});




/* Figure out what to do with Routes... This is fugly... */
ReactRouter.createRoute('/', function () {
    React.unmountComponentAtNode(document.getElementById('main_content'));
    React.render(<NewHomePage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/styleguide', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<StyleGuide.Index />, document.getElementById('main_content'));
});
ReactRouter.createRoute('/styleguide/forms', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<StyleGuide.Forms />, document.getElementById('main_content'));
});

/*
ReactRouter.createRoute('/home', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<HomePage />, document.getElementById('main_content'));
});
*/

ReactRouter.createRoute('/about/', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<AboutPage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/events/{slug}/', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventPage slug={params.slug} />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/calendar/', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<CalendarPage/>, document.getElementById('main_content'));
});

ReactRouter.createRoute('/galleries/', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryPage />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/galleries/{slug}/', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryViewPage slug={params.slug} />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/written/', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenPage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/written/{category_slug}/', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenCategoryPage category_slug={params.category_slug} />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/written/{category_slug}/{slug}/', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenArticlePage category_slug={params.category_slug} slug={params.slug} />, document.getElementById('main_content'));
});





ReactRouter.createRoute('/written/{year}/{month}/{slug}/', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenArticlePage year={params.year} month={params.month} slug={params.slug} />, document.getElementById('main_content'));
});

ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<Error404Page />, document.getElementById('main_content'));
});

ReactRouter.init();

/* Establish Global end of "tonight" */
global.targed_tonight_end_date = moment().hour(9).minute(0).second(0);
global.targed_tonight_end_date = moment.utc(global.targed_tonight_end_date);


/* Code For Sliding Navs and Featured Widget */
global.closeMenu = function () {
    // Do things on Nav Close
    $('body').removeClass('show-menu');
	$(".modal-backdrop").remove();
}

global.openMenu = function () {
    // Do things on Nav Open
    $('body').addClass('show-menu');
	var modal = $('<div class="modal-backdrop"></div>');

	modal.bind('click tap', closeMenu)
	modal.appendTo(document.body);
}

global.toggleNav = function (e) {

    var ga_category = 'menu-toggle';
    var ga_action = e.type;
    var ga_label;

    if ($('body').hasClass('show-menu')) {
        closeMenu();
        ga_label = 'close';
    }
    else {
        openMenu()
        ga_label = 'open';
    }

    analytics.record_event(ga_category, ga_action, ga_label, 1);
}


// navigateTo

/* OnChromeLoad Bindings */
$(function() {
    /* Anything run here must act only on the chrome since nothing else is loaded... */

	$('#site-menu').bind('swiperight', function(e) { toggleNav(e) });

	$('#side_nav_toggle').click(function(e) {
		// Calling a function in case you want to expand upon this.
		toggleNav(e);
	});

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
//React.render(<PageMeta />, document.getElementById('meta_debug'));
//React.render(<PrimaryMenu />, document.getElementById('navbar'));
React.render(<NavCardsContainer />, document.getElementById('header_nav_cards'));
React.render(<UserUtilsNav />, document.getElementById('nav_utils_container'));
