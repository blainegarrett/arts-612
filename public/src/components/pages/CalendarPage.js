var React = require('react');
var PageMixin = require('./PageMixin');

var CalendarPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Calendar',
        'description': 'This is the calendar'
    },
    render: function() {
        return <div>Calendar</div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});

module.exports = CalendarPage;
