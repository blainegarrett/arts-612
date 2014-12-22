var React = require('react');
var PageMixin = require('./PageMixin');

var HomePage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Welcome',
        'description': 'This is a page and it is totally super fly.'
    },
    render: function() {
        return <div>Home </div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});
module.exports = HomePage;
