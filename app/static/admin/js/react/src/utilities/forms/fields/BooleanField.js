var React = require('react');
var BaseField = require('./BaseField');

// This is not in use and doesn't currently work...

BooleanField = React.createClass({
    mixins: [BaseField],
    toResourceX: function(field_value) {
        
        console.log('TO RESOURCE:')
        console.log(field_value)
        /* Pull raw form date into a REST resource format */
        if (!field_value) {
            field_value = this.getValue();
        }
        
        console.log(field_value)
        
        if (!field_value) {
            return false;
        }
        return true
    },

    fromResourceX: function() {
        /* Push REST resource format into a Form value */

        console.log('FROM RESOURCE:')
        console.log(this.state.val)

        var val = this.state.val;
        if (!val) {
            return false;
        }
        return true
    }
});

module.exports = BooleanField;