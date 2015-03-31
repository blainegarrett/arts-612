var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var Error404Page = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Page Not Found',
        'description': 'Unable to find page, please check your url',
        'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
    },
    render: function() {
        return <div>
        <h2>Content Not Found</h2>
        
        <p>The Page you were looking for could not be found. Try returning to <a href="/" onClick={global.routeTo}>mplsart.com</a>.</p>
        </div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});

module.exports = Error404Page;
