/* Page Mixin */
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var ReactRouter = require('flux-react-router');
var React = require('react');

var PageMixin = {
    setMeta: function() {
        AppDispatcher.handleSetMeta(this.default_meta);
    },
    getRoute: function (event) {
        // Helper to Emulate the click event to control rest routes
        // TODO: This only works on <a href="" ...> tags

        var anchor, url;
        event.preventDefault();

        anchor = event.target;
        url = anchor.pathname; //https://gist.github.com/jlong/2428561

        ReactRouter.goTo(url);
    }
    
};

module.exports = PageMixin;