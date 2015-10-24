/* Page Mixin */
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var ReactRouter = require('flux-react-router');
var React = require('react');
var analytics = require('../../utils/analytics');
var NavCardsContainer = require('../NavCardsContainer');

var PageMixin = {
    contextTypes: {
        router: React.PropTypes.func
    },

    componentDidMount: function () {
        /* Initialize the Page */

        this.setMeta(); // Set default meta - might be overridden later

        analytics.record('pageView', { title: global.document.title });

        // Fire callback so that the child Page can do initialization bits
        if (typeof(this.pageDidMount) == 'function') {
            this.pageDidMount();
        }

        // Decide to show the marquee or not..
        NavCardsContainer.show_marquee();

        return
    },

    componentWillUnmount: function() {
        if (typeof(this.pageWillUnmount) == 'function'){
            this.pageWillUnmount();
        }
    },

    setMeta: function() {
        AppDispatcher.handleSetMeta(this.default_meta);
    },

    getRoute: function (event) {
        global.routeTo(event);
    }

};

module.exports = PageMixin;