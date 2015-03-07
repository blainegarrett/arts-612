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
        /*
        title: post.title,
        description: post.summary,
        image: post.primary_image
        */
    },

    getInitialState: function () {
        /* TODO: This should be defaulted to empty object */

        return {
            resource_url: '/api/posts?get_by_slug=' + this.props.slug,
            content_loaded: false,
            results: null,
            data: null
        };
    },

    componentDidMount: function () {

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                this.setState({data:data, content_loaded:true, results:data.results});
                console.log(data);

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },

    render: function() {
        var rendered_article;

        if (this.state.results != undefined) {
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
