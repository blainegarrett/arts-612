var React = require('react');
var moment = require('moment');

DateTimeField = React.createClass({
    mixins: [BaseField],

    processInitialValue: function(val) {
       /* This is called when rendering form inputs */

       if (val && val != '') {
           return moment(val)
       }

       return moment('12:00 AM', 'HH:mm A');
        
    },
    toResourceX: function(field_value) {
        if (!field_value) {
            field_value = this.refs.widget.toResourceX();
        }

        field_value = field_value.trim();

        if (!field_value || field_value == '') {
            return null;
        }

        date_obj = moment(field_value, 'YYYY-MM-DD HH:mm A'); // string is local format
        date_obj.local().utc() //2014-11-15T01:00:00Z

        return date_obj.format('YYYY-MM-DD[T]HH:mm:ss[Z]')

    },

    fromResourceX: function() {
        // convert to local time for display...
        if (this.state.val != '' && this.state.val != null) {
            var date_obj = moment(new Date(this.state.val));
            return date_obj.format('lll');
        }

        return ''
    },    

});

module.exports = DateTimeField;