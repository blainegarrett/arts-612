var React = require('react');
var BaseField = require('./BaseField');

GeoPtField = React.createClass({
    mixins: [BaseField],
    toResourceX: function(field_value) {
        /* Pull raw form date into a REST resource format */
        if (!field_value) {
            field_value = this.getValue();
        }
        if (!field_value) {
            return "";
        }
        var vals = field_value.split(',');
        return {lat: vals[0], lon: vals[1]};
    },

    fromResourceX: function() {
        /* Push REST resource format into a Form value */

        var val = this.state.val;
        if (!val) {
            return '';
        }

        return val.lat + ',' + val.lon;
    }
});

module.exports = GeoPtField;