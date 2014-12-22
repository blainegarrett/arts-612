var React = require('react');
var PageMixin = require('./PageMixin');

var GalleryPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },
    render: function() {
        return <div>Gallery</div>;
    },
    componentDidMount: function() {
        this.setMeta();
    }
});
module.exports = GalleryPage;
