var React = require('react');
var moment = require('moment');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');
var TempExtras = require('../temp/TempExtras');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');

var ArticleGoober = require('./../DataTypes/Article').ArticleGoober;
var DefaultArticleRenderer = require('./../DataTypes/Article').DefaultArticleRenderer;


var WrittenArticlePage = React.createClass({
    mixins: [PageMixin],

    // TODO: More logical defaults and match to server...
    default_meta: {
        title: 'Article',
        description: 'Article Descripton',
        image: 'http://Default Article URL'
    },

    getInitialState: function () {
        /* TODO: This should be defaulted to empty object */

        return {
            resource_url: '/api/posts?get_by_slug=' + this.props.slug,
            content_loaded: false,
            content_not_found: false,
            results: null,
            data: null
        };
    },

    set_meta_for_resource: function() {
        // Set the Page Meta for this specific post

        post = this.state.results;

        this.default_meta =  {
            title: post.title,
            description: post.summary
        }
        
        if (post.primary_image_resource) {
            // TODO: Do better error checking...
            this.default_meta['image'] = post.primary_image_resource.versions.CARD_SMALL.url;
        }

        this.setMeta();
    },
    componentDidMount: function () {
        var rc = this;

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                this.setState({data:data, content_loaded:true, results:data.results});
                rc.set_meta_for_resource();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
                this.setState({content_not_found:true, content_loaded:true})
            }.bind(this)
            
        });
    },

    render: function() {
        var rendered_article;

        
        if (this.state.content_not_found) {
            rendered_article = (<div>
                <h2>Article Not Found</h2>
                <p>We were unable to find this article. If you are looking for an old article, they'll be returning in the next few months. </p>
            </div>);
        }
        else if (this.state.results != undefined) {
            var post = this.state.results
            rendered_article = <ArticleGoober key={ post.resource_id } resource={ post } renderer={ DefaultArticleRenderer } />
        }
        else {
            rendered_article = <ArticleGoober resource={ null } renderer={ DefaultArticleRenderer } />
        }

        return <div id="HomePageWrapper">
            <GoodNewsBanner />
            
            <div className="row">

                <div className="col-md-6" id="main-content-container">
                    { rendered_article }
                    <br />
                    <br />

                    <div id="panel-call-out">
                        <h2>CALL FOR CONTENT</h2>
                        <div className="panel-content">
                            <p>In order to build the best arts calendar in the Twin Cities, we’re looking for writers, art critics, photographers, Instagrammers, curators, and other tastemakers with a deep appreciation for the local art scene.</p>
                            <p>
                                To help promote local art, send a note of interest to: <br />
                                <span className="bigyo"><a href="mailto:contribute@mplsart.com">contribute@mplsart.com</a></span>
                            </p>
                        </div>
                    </div>

                    <TempExtras />

                </div>
                <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>
            
            <Footer />
        </div>;

    },

});
module.exports = WrittenArticlePage;
