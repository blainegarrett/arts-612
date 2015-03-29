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
var PodArticleRenderer = require('./../DataTypes/Article').PodArticleRenderer;


var AboutPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'About MPLSART.COM and Our Mission',
        'description': 'This is our mission.',
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
                return <div className="card" key={ post.resource_id }><ArticleGoober key={ post.resource_id } resource={ post } renderer={ PodArticleRenderer } /></div>
            });
        }

        return <div id="HomePageWrapper">
            <GoodNewsBanner />
            
            <div className="row">

                <div className="col-md-6" id="main-content-container">
                    
                    <h2>About</h2>
                    <p>Lorem Ipsum...</p>
                    <br />

                    <div className="row">
                        <TempExtras />
                    </div>

                </div>
                <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>
            
            <Footer />
        </div>;

    }
});
module.exports = AboutPage;
