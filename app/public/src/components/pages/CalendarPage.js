var React = require('react');
var PageMixin = require('./PageMixin');

var CalendarPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Calendar',
        'description': 'This is the calendar'
    },
    render: function() {
        return <div>
        <h2>Calendar</h2>
        <p>Returning soon</p>
        </div>;
    },
    pageDidMount: function() {
        this.setMeta();
    }
});

module.exports = CalendarPage;
