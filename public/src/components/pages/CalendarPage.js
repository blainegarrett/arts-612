var React = require('react');
var ReactRouter = require('flux-react-router');
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
        
        <a onClick={ReactRouter.deferTo('/galleries')}>Galleries</a>
        <a onClick={ReactRouter.deferTo('/written')}>Written</a>
        <a onClick={ReactRouter.deferTo('/')}>Home</a>
        </div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});

module.exports = CalendarPage;
