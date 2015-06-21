var React = require('react');
var BaseField = require('./BaseField');

GeoPtField = React.createClass({
    /* Value of Input can be a single point or multiple points
        
        eg: "(44.962121653328644, -93.23993053627015),(44.96288079295396, -93.23629531669616),(44.958880792953956, -93.23629531669616),(44.958880792953956, -93.24029531669618),(44.961032659825264, -93.24094977569581)"
        or "(44.962121653328644, -93.23993053627015)"
    */
    
    mixins: [BaseField],
    toResourceX: function(field_value) {
        /* Pull raw form date into a REST resource format */

        if (!field_value) {
            field_value = this.getValue();
        }
        if (!field_value) {
            return "";
        }

        console.log('----------');
        console.log(field_value);
        
        var count = field_value.match(/,/g).length;
        //if (count > 1) {
            pair_strs = field_value.split('),(');
            var return_vals = pair_strs.map(function(pair_str, i) {
                pair_str = pair_str.replace(')', '').replace('(', '');
                var vals = pair_str.split(',');
                return {lat: parseFloat(vals[0]), lon: parseFloat(vals[1])};
            });
            
            return return_vals;
        //}
        //else {
        //    alert(field_value)
        //}

        var field_value = field_value.replace(')', '').replace('(', '');
        var vals = field_value.split(',');
        return {lat: parseFloat(vals[0]), lon: parseFloat(vals[1])};
    },

    fromResourceX: function() {
        /* Push REST resource format into a Form value */

        var val = this.state.val;
        if (!val) {
            return '';
        }

        console.log('XXXXXXXXXXXXXXX');
        console.log(val);

        if (typeof(val.push) == 'function') { // ducktype array vs. dict
            
            var points =  val.map(function(pt, i) {
                return '(' + pt.lat + ',' + pt.lon + ')';
            });

            // (56.559482483762245,78.046875),(56.559482483762245,78.046875)

            return points.join(',')
        }

        // It is a dict ... we may not get here anymore with the polygon refactor
        return val.lat + ',' + val.lon;
    }
});

module.exports = GeoPtField;