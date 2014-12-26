var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');

var WrittenPage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function() {
        return <div>
        <h2>Written</h2>
        
            <p>Our collection of reviews, critiques, blogs, and other written content will be returning soon</p>

        </div>;

    },
    componentDidMount: function() {
        this.setMeta();
    }
});
module.exports = WrittenPage;
