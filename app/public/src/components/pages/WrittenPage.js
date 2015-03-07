var React = require('react');
var ReactRouter = require('flux-react-router');
var moment = require('moment');

var PageMixin = require('./PageMixin');
var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');

var ArticleGoober = require('./../DataTypes/Article').ArticleGoober;
var ListArticleRenderer = require('./../DataTypes/Article').ListArticleRenderer;


var WrittenPage2 = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function () {
        return <div>
        <h2>Written</h2>
        
            <p>Our collection of reviews, critiques, blogs, and other written content will be returning soon</p>

        </div>;

    },
    componentDidMount: function () {
        this.setMeta();
    }
});
module.exports = WrittenPage2;

var WrittenPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Written',
        'description': 'Articles and more'
    },

    getInitialState: function () {
        return {
            articles: [],
            resource_url: '/api/posts'
        }
    },

    componentDidMount: function () {
        this.setMeta();

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */
                this.setState({articles:data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },

    render: function () {
        
        var articles = []
        var rc = this;

        if (this.state.articles.results != undefined) {
            articles = this.state.articles.results.map(function (post) {
                return <ArticleGoober key={ post.resource_id } resource={ post } renderer={ ListArticleRenderer } />
            });
        }

        return <div className="row">
            <h2>Articles</h2>
            { articles }
        </div>;

    }
});
module.exports = WrittenPage;
