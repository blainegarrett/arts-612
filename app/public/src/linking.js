var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require('react-router').IndexLink;
var analytics = require('./utils/analytics');


pageChangeRouteTasks = function(e) {
    /*  Route Handler Operations to perform for internal links that open a new "Page"
        If you use a Link, PageLink, etc component, use this as the callback()
        If you have a raw link you need to use to change the page, use routeTo
    */
    var anchor, $anchor, url;

    // Close open menus

    // TODO: This will be duplicated until we get event listners...
    // TODO: trigger action "closeMenu"
    $('body').removeClass('show-menu');
    $(".modal-backdrop").remove();

    // TODO: React Router transitions should do this
    $("html, body").animate({ scrollTop: 0 }, "slow");

    // Resolve target action
    anchor = e.currentTarget;
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

    analytics.record_event(ga_category, ga_action, ga_label, 1);
}

routeTo = function (e) {
    // Deprecated handler for binding with jQuery, etc
    // This will actually change the route

    var anchor, $anchor, url;

    // Prevent default browser action - TODO: This is preventing SHIFT CLICK
    e.preventDefault();

    // Peform transition animations and record analytics
    pageChangeRouteTasks(e);

    // Determine url to route to
    anchor = e.currentTarget;
    $anchor = $(anchor);
    url = anchor.pathname; //https://gist.github.com/jlong/2428561

    // Tell the ReactRouter's history object to change route
    history.replaceState(null, url);
    console.log('Deprecated routeTo action called for ' + url);
};

var PageLink = React.createClass({
    /* A React component to handle our flavor of ReactRoute changes */
    render: function() {
        return (<Link {...this.props} onClick={ pageChangeRouteTasks } />)
    }
});

module.exports = {
   PageLink: PageLink,
   routeTo: routeTo
}