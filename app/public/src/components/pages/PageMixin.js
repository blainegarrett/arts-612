/* Page Mixin */
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var ReactRouter = require('flux-react-router');
var React = require('react');

var PageMixin = {
    setMeta: function() {
        AppDispatcher.handleSetMeta(this.default_meta);
        global.current_page = this;
    },
    getRoute: function (event) {
        // Helper to Emulate the click event to control rest routes
        // TODO: This only works on <a href="" ...> tags

        // Close open menus
        global.closeMenu()

        var anchor, url;
        event.preventDefault();

        anchor = event.currentTarget;
        
        console.log(event);

        url = anchor.pathname; //https://gist.github.com/jlong/2428561

        ReactRouter.goTo(url);
    }
    
};

module.exports = PageMixin;