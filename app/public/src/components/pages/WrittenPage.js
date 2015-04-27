var React = require('react');
var ReactRouter = require('flux-react-router');
var moment = require('moment');

var PageMixin = require('./PageMixin');
var Footer = require('../temp/Footer');
var TempExtras = require('../temp/TempExtras');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');

var ArticleGoober = require('./../DataTypes/Article').ArticleGoober;
var PodArticleRenderer = require('./../DataTypes/Article').PodArticleRenderer;

var moment = require('moment');


var WrittenPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Written',
        'description': 'Writing and Crtique'
    },

    getInitialState: function () {
        return {
            articles: [],
            resource_url: '/api/posts?limit=25&is_published=true'
        };
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

    load_more: function (e) {

        $.ajax({
            url: this.state.resource_url + '&cursor=' + this.state.articles.cursor,
            dataType: 'json',
            success:  function (data) {
                /* Have the store do this... */
                this.setState({articles:data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });


        return false;  
    },
    render: function () {
        
        var articles = []
        var rc = this;

        if (this.state.articles.results != undefined) {
            articles = this.state.articles.results.map(function (post) {
                return <div className="card" key={ post.resource_id }><ArticleGoober key={ post.resource_id } resource={ post } renderer={ PodArticleRenderer } /></div>
            });
        }

        // if there is more, show 
        var more_button;
        if (this.state.articles.more) {
            more_button = <a className="btn" onClick={ this.load_more } href="#">load more...</a>
        }

        more_button = null; //Not prod ready yet

        return <div id="HomePageWrapper">
            <div className="row">

                <div className="col-md-6" id="main-content-container">
                    
                    <h2>Written</h2>
                    
                    <div className="alert alert-warning">Our Written section is returing soon including the archives from the old site. Stay tuned and enjoy these articles.</div>
                    
                    { articles }


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
module.exports = WrittenPage;
