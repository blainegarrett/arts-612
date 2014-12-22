/* Page Mixin */
var AppDispatcher = require('../../dispatcher/AppDispatcher')
var React = require('react');

var PageMixin = {
    doit: function() {
        alert('I am cool thing');
    },
    setMeta: function() {
        AppDispatcher.handleSetMeta(this.default_meta);
    }
};

module.exports = PageMixin;