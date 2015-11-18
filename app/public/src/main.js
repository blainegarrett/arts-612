var React = require('react');

var NavCardsContainer = require('./components/NavCardsContainer');
var PageMeta = require('./components/pages/PageMeta');

var Routing = require('./routing');


// Initialize the ReactRouter
Routing.init(document.getElementById('root'));

/* OnChromeLoad Bindings */
$(function() {
    /* Anything run here must act only on the chrome since nothing else is loaded... */

	//$('#site-menu').bind('swiperight', function(e) { toggleNav(e) });

    // Important: Including 'tap' here will trigger both events and cause routing to dble load
    //  and cause invarient react errors. Also, page load analytics record twice.
    $(document).on('click', '.internal-link', routeTo);
});






/* On Homepage - check if we should show the featured section */
$(window).on("scroll touchmove", function () {
    NavCardsContainer.show_marquee();
});



/* Components outside of the main_content area*/
React.render(<PageMeta />, document.getElementById('page_meta'));