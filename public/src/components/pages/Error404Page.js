var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var Error404Page = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Error...',
        'description': 'This is the calendar'
    },
    render: function() {
        return <div>
        <h2>Content Not Found</h2>
        
        <p>The Page you were looking for could not be found. Try returning to <a href="/">mplsart.com</a>.</p>
        </div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});

module.exports = Error404Page;
