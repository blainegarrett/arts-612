/* Article Display Components */
// TODO: Come up with a better name than Goober... trying 

var React = require('react');
var moment = require('moment');


var ArticleRendererMixin = {
    getInitialState: function () {
        return {
            resource_loaded: Boolean(this.props.resource),
            resource: this.props.resource,
            ed_filter: this.props.ed_filter
        }
    },    
}

var DefaultArticleRenderer = React.createClass({
    /* Default Article Renderer when none are given.
    TODO: We could probably do away with this... */

    mixins: [ArticleRendererMixin],

    render_empty: function () {
        return <li className="event ghost-load">
            <div className="event-info">
            	<div><a target="_blank"><span className="event-title">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</span></a></div>
                <div className="event-time">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632;</div>
                <div className="event-venue-name">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</div>
                <div className="event-address">&#9632;&#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632;&#9632;</div>
            </div>
        </li>;
    },

    render: function() {

        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var article = this.state.resource;
        published_date = moment(Date.parse(article.created_date)).format('MMMM, Do YYYY');

        // TODO: This needs to come from the api
        article.author = {firstname: 'Emma', lastname: 'Berg'};

        return <div>
            <h2>{ article.title }</h2>
            <p className="blog-post-meta">{ published_date }  by <a href="http://www.emmaberg.com/" target="_new">{ article.author.firstname } { article.author.lastname }</a></p>
            <div className="article-content-container" dangerouslySetInnerHTML={{__html: article.content }}></div>
        </div>;
    }
});


var ArticleGoober = React.createClass({
    /* Goober for Article - Handles listeners, etc */

    getDefaultProps: function() {
        return { renderer: DefaultArticleRenderer };
    },

    propTypes: {
        renderer: React.PropTypes.any, // A React Class to Render the Event
        resource: React.PropTypes.node // A Resource (object) from the store, etc or null
    },

    getInitialState: function () {
        return {
            renderer: this.props.renderer,
            resource: this.props.resource,
        }
    },

    render: function () {
        // Determine which ED we meant to show actually
        var props = {
            resource: this.state.resource, 
            ed_filter: this.state.ed_filter
        };

        return React.createElement(this.state.renderer, props);
    }    
});


module.exports = {
    ArticleGoober: ArticleGoober,
    DefaultArticleRenderer: DefaultArticleRenderer
};