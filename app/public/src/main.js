// React is global
var React = require('react');
var Router = require('./router');
var moment = require('moment');

var PageMeta = require('./components/pages/PageMeta');
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;
var PrimaryMenu = require('./components/pages/PrimaryMenu')

var analytics = require('./utils/analytics');

/* Fire up Routing */
Router.start();

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

    global.router.transitionTo(url);

};

var show_marquee = function() {
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