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
        return <div className="ghost-load">
            <h2>&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</h2>
            <p className="lead">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</p>
            <br />
            <div className="article-content-container">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</div>
            <br />
            <p className="blog-post-meta">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</p>
        </div>;
    },

    render: function() {

        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var article = this.state.resource;
        published_date = moment(Date.parse(article.created_date)).format('MMMM, Do YYYY');
        
        var image = null;
        var image_url = null;

        if (article.primary_image_resource) {
            image_url = article.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }
        

        return <div>
            <h2>{ article.title }</h2>
            <p className="lead">{ article.summary }</p>
            { image }
            <br />
            <div className="article-content-container" dangerouslySetInnerHTML={{__html: article.content }}></div>
            <br />
            <p className="blog-post-meta">--<br />Posted { published_date }  by <a href={article.author_resource.website} target="_new">{ article.author_resource.firstname } { article.author_resource.lastname }</a></p>
        </div>;
    }
});

var PodArticleRenderer = React.createClass({
    /* Pod Renderer */

    mixins: [ArticleRendererMixin],
    render: function() {

        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var article = this.state.resource;
        published_date = moment(Date.parse(article.created_date)).format('MMMM, Do YYYY');
        
        var image = null;
        var image_url = null;

        if (article.primary_image_resource) {
            image_url = article.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }

        // TODO: Case out if published or not...
        var m = moment(article.published_date);
        var date_slug = m.format('YYYY/MM/');

        return <div>
            <div className="card-image">
                <a href={article.permalink} title={article.title} onClick={global.routeTo }>{ image }</a>
            </div>

            <div className="card-content">
                <div className="card-title"><a href={ article.permalink } onClick={global.routeTo } target="_new">{article.title }</a></div>
                <div className="card-detail">{ article.summary } <b><a href={article.permalink} title={article.title} onClick={global.routeTo }>Read More...</a></b></div>
            </div>            
        </div>;

    }
    
});

var ListArticleRenderer = React.createClass({
    /* Simple Renderer for when displaying in a list */

    mixins: [ArticleRendererMixin],

    render_empty: function () {
        return <li className="article ghost-load">...</li>;
    },

    render: function() {

        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        console.log(article);
        
        

        var article = this.state.resource;
        published_date = moment(Date.parse(article.created_date)).format('MMMM, Do YYYY');
        
        var image = null;
        var image_url = null;

        if (article.primary_image_resource) {
            image_url = article.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }

        // TODO: Case out if published or not...
        var m = moment(article.published_date);
        var date_slug = m.format('YYYY/MM/');

        return <li key={article.resource_id} title={article.title}><a href={article.permalink} onClick={global.routeTo }>{article.title}</a>  {published_date} </li>;
    }
});


var MarqueeRenderer = React.createClass({
    mixins: [ArticleRendererMixin],

    render: function () {

        var resource = this.props.resource;

        // TODO: Need a default card image...
        var image_url = '';

        if (resource.primary_image_resource) {
            image_url = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        var styles = { 'backgroundImage' : 'url(' + image_url + ');'};

        // TODO: Case out if published or not...
        var m = moment(resource.published_date);
        var date_slug = m.format('YYYY/MM/');

        return <div className="jive-card-image">
            <a href={ resource.permalink } onClick={ global.routeTo } style={ styles }>
                <div className="jive-card-title">
                    <div className="date">{ resource.title }</div>
                </div>
            </a>
        </div>;
    }


});

var FeaturedHeroRenderer = React.createClass({
    mixins: [ArticleRendererMixin],
    render: function() {

        var resource = this.props.resource;

        // TODO: Need a default card image...
        var image_url = '';

        if (resource.primary_image_resource) {
            image_url = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        var styles = { 'backgroundImage' : 'url(' + image_url + ');'};

        // TODO: Case out if published or not...
        var m = moment(resource.published_date);
        var date_slug = m.format('YYYY/MM/');

        return <div className="jive-card">
            <div className="jive-card-image">
                <a href={ resource.permalink } onClick={ global.routeTo } style={ styles }>
                    <div className="jive-card-title">
                        <br />
                        <div className="date">New Post</div>
                        <div className="title">{ resource.title }</div>
                    </div>
                </a>
            </div>
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
    MarqueeRenderer: MarqueeRenderer,
    Goober: ArticleGoober,
    ArticleGoober: ArticleGoober,
    DefaultArticleRenderer: DefaultArticleRenderer,
    ListArticleRenderer: ListArticleRenderer,
    PodArticleRenderer: PodArticleRenderer,
    FeaturedHeroRenderer: FeaturedHeroRenderer
};