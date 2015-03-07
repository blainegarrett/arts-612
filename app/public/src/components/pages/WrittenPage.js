var React = require('react');
var ReactRouter = require('flux-react-router');
var moment = require('moment');

var PageMixin = require('./PageMixin');
var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');
var TempExtras = require('../temp/TempExtras');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');

var ArticleGoober = require('./../DataTypes/Article').ArticleGoober;
var ListArticleRenderer = require('./../DataTypes/Article').ListArticleRenderer;


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

        return <div id="HomePageWrapper">
            <GoodNewsBanner />
            
            <div className="row">

                <div className="col-md-6" id="main-content-container">
                    { articles }
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

    }
});
module.exports = WrittenPage;
