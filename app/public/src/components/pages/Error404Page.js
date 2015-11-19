var React = require('react');
var PageMixin = require('./PageMixin');
var PageLink = require('../../linking').PageLink;

var Error404Page = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Page Not Found',
        'description': 'Unable to find page, please check your url',
        'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
    },
    render: function() {
        return (
            <div>
                <h2>Content Not Found</h2>
                <p>The Page you were looking for could not be found. Try returning to <PageLink to="/">mplsart.com</PageLink>.</p>
            </div>);
    },

    pageDidMount: function() {
        this.setMeta();
    }
});

module.exports = Error404Page;
