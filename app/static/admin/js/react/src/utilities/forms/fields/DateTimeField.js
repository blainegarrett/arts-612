var React = require('react');
var moment = require('moment');

DateTimeField = React.createClass({
    mixins: [BaseField],

    _getValue: function(){
      return 'zorpdorp';
    },

    toResourceX: function(field_value) {
        if (!field_value) {

            console.log('-------------jesus party------------------');
            field_value = this.refs.widget.toResourceX();

            console.log(field_value);

            console.log('------------------------------------------');

            //field_value = 'zebradicks';
        }

        field_value = field_value.trim();

        if (!field_value || field_value == '') {
            return null;
        }



        date_obj = moment(field_value); // string is local format
        date_obj.local().utc() //2014-11-15T01:00:00Z
        
        return date_obj.format('YYYY-MM-DD[T]HH:mm:ss[Z]')

    },

    fromResourceX: function() {
        // convert to local time for display...
        if (this.state.val != '') {
            var date_obj = moment(this.state.val);
            return date_obj.format('lll');
        }

        return ''
    },    

});

module.exports = DateTimeField;