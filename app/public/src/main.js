// React is global
var React = require('react');
var ReactRouter = require('flux-react-router');
var HomePage = require('./components/pages/HomePage');
var NewHomePage = require('./components/pages/NewHomePage');
var CalendarPage = require('./components/pages/CalendarPage');
var WrittenPage = require('./components/pages/WrittenPage');
var WrittenArticlePage = require('./components/pages/WrittenArticlePage');
var GalleryPage = require('./components/pages/GalleryPage');
var GalleryViewPage = require('./components/pages/GalleryViewPage');
var Error404Page = require('./components/pages/Error404Page');

var PageMeta = require('./components/pages/PageMeta');
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;
var PrimaryMenu = require('./components/pages/PrimaryMenu')

global.current_page = null; // This is set by PageMixin to the current page for use in widgets

/* Figure out what to do with Routes... This is fugly... */
ReactRouter.createRoute('/', function () {
    React.unmountComponentAtNode(document.getElementById('main_content'));
    React.render(<HomePage />, document.getElementById('main_content'));
});
ReactRouter.createRoute('/calendar', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<CalendarPage/>, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/galleries', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryPage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/galleries/{slug}', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<GalleryViewPage slug={params.slug} />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/home', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<NewHomePage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/written', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenPage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/written/{year}/{month}/{slug}', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<WrittenArticlePage year={params.year} month={params.month} slug={params.slug} />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<Error404Page />, document.getElementById('main_content'));    
});
ReactRouter.init();

/* Components outside of the main_content area*/
React.render(<PageMeta />, document.getElementById('page_meta'));
//React.render(<PageMeta />, document.getElementById('meta_debug'));
//React.render(<PrimaryMenu />, document.getElementById('navbar'));
React.render(<NavCardsContainer />, document.getElementById('header_nav_cards'));


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

global.toggleNav = function () {
    if ($('body').hasClass('show-menu')) {
        closeMenu();
    } 
    else {
        openMenu()
    }
}


/* OnChromeLoad Bindings */
$(function() {
    /* Anything run here must act only on the chrome since nothing else is loaded... */

	$('#site-menu').bind('swiperight', function(e) { toggleNav() });

	$('#side_nav_toggle').click(function() {
		// Calling a function in case you want to expand upon this.
		toggleNav();
	});
	
	$('.internal-link').bind('click tap', navigateTo)
	
	
});

global.navigateTo = function navigateTo (evt) {
    /* Click Handler for when outside of react components */
    current_page.getRoute(evt);
}

/* On Homepage - check if we should show the featured section */
/*
$(window).on("scroll touchmove", function () {
    var featured_hero = $('#featured-hero-area');
    
    if (featured_hero.length) {
        // Page Has the featured hero section
        var threshhold = featured_hero.offset().top + featured_hero.height();
        $('#header_nav').toggleClass('show-nav', $(document).scrollTop() > threshhold);
    }
    else{
        
    }
});
*/
