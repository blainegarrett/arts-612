/*
Temporary Events widget for Alpha Version of the site. We can easily delete theis after the April Launch
Along with: TempEventHelpers, TempEvents, TempUpcoming
*/

var React = require('react');
var moment = require('moment');
var TempEventsListMixin = require('./TempEventHelpers').TempEventsListMixin;

var TempUpcoming = React.createClass({
    mixins: [TempEventsListMixin],

    get_target_end_date: function () {
      // 3AM CST "today"
      date = moment().hour(9).minute(0).second(0);
      date = moment.utc(date);

      //date = moment().utc().hour(9).minute(0).second(0)
      return date;  
    },
    getInitialState: function() {

        var target_end_date = this.get_target_end_date();
        target_end_date = target_end_date.format('YYYY-MM-DD[T]HH:mm:ss[Z]');

        return {
            ed_filter: 'timed',
            col_name: 'OPENINGS & EVENTS',
            event_data: [], 
            resource_url: '/api/events/upcoming?sort=start&category=performance,reception,sale&end=' + target_end_date
        };
    },

    render: function () {
        return this.render_templatexxx()
    }
});

module.exports = TempUpcoming