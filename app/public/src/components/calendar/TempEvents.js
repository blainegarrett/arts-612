/*
Temporary Events widget for Alpha Version of the site. We can easily delete theis after the April Launch
Along with: TempEventHelpers, TempEvents, TempUpcoming
*/

var React = require('react');
var moment = require('moment');
var TempEventsListMixin = require('./TempEventHelpers').TempEventsListMixin;

var TempEvents = React.createClass({
    mixins: [TempEventsListMixin],

    get_target_end_date: function () {
      // Today - not this yields a time of 6AM UTC at the moment due to CST time diff...
      date = moment().hour(0).minute(0).second(0);
      date = moment.utc(date);

     //date = moment.utc().hour(0).minute(0).second(0);

      return date;  
    },

    getInitialState: function() {

        var target_end_date = this.get_target_end_date();
        target_end_date = target_end_date.format('YYYY-MM-DD[T]HH:mm:ss[Z]');

        return {
            ed_filter: 'reoccurring',
            col_name: 'NOW SHOWING',
            event_data: [],
            resource_url: '/api/events/upcoming?sort=end&category=ongoing&end=' + target_end_date + '&start=' + target_end_date
        };
    },

    render: function () {
        return this.render_templatexxx()
    }
});

module.exports = TempEvents