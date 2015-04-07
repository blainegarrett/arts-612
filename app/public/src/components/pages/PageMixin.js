/* Page Mixin */
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var ReactRouter = require('flux-react-router');
var React = require('react');

var PageMixin = {
    setMeta: function() {
        AppDispatcher.handleSetMeta(this.default_meta);
        global.current_page = this;
    
        /* TODO: This is hacky... but our only current way to trigger the marquee to show or not */
        show_marquee(); // Decide to show the marquee or not..
    },

    getRoute: function (event) {
        global.routeTo(event)
    }
    
};

module.exports = PageMixin;