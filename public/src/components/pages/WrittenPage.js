var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var WrittenPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },
    render: function() {
        return <div>
        <h2>Written</h2>
        
        <a onClick={ReactRouter.deferTo('/galleries')}>Galleries</a>
        <a onClick={ReactRouter.deferTo('/calendar')}>Calendar</a>
        <a onClick={ReactRouter.deferTo('/')}>Home</a>
        </div>;

    },
    componentDidMount: function() {
        this.setMeta();
    }
});
module.exports = WrittenPage;
