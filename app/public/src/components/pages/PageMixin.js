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
        global.routeTo(event)
    }
    
};

module.exports = PageMixin;