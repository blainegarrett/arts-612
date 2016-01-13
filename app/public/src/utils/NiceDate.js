var React = require('react');
var moment = require('moment-timezone');
var constants = require('../constants');

var NiceDate = React.createClass({
    propTypes: {
        start: React.PropTypes.string,
        end: React.PropTypes.string,
        eventdate_type: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            start: this.props.start,
            end: this.props.end,
            eventdate_type: this.props.eventdate_type
        };
    },
    render: function () {
        var start, end, display_str, duration_hours, start_time_format, end_time_format, extra_minute;

        start = moment(Date.parse(this.state.start)).tz(constants.CENTRAL_TIMEZONE);
        end = moment(Date.parse(this.state.end)).tz(constants.CENTRAL_TIMEZONE);

        display_str = start.format("MMM Do") + ' - ' +  end.format("MMM Do");
        duration_hours = end.diff(start, 'hours');

        // this.state.eventdate_type == 'timed' might be a better indicator
        if (duration_hours < 15) {
            // Assumed to be a single timed event: Sat Nov 8th 7PM - 10:30PM

            start_time_format = 'hA';
            end_time_format = 'hA';

            if (start.minutes() > 0) {
                start_time_format = 'h:mmA';
            }

            if (end.minutes() > 0) {
                end_time_format = 'h:mmA';
            }

            extra_minute = ':mm';

            display_str = start.format("ddd MMM Do " + start_time_format);
            display_str += ' - ';
            display_str += end.format(end_time_format);

            if (!constants.IS_BROWSER_CENTRAL_TIMEZEZONE) {
                display_str += ' CST';
            }
        }

        return <span>{ display_str }</span>;
    }
});

module.exports = NiceDate;