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
            resource_url: '/api/posts'
        }
    },

    componentDidMount: function () {
        this.setMeta();

        var event_dates = [
            {start: 1.0, end: 2.5, type: 'timed'},
            {start: 3.0, end: 3.5, type: 'timed'},
            {start: 1.0, end: 1.5, type: 'timed'},

            {start:1, end: 4, type: 'reoccurring'}
        ];
        var event_dates_ordered = [];
        
        //console.log(event_dates);


        var target_ed;
        var reoccurring;
        var now = 3.75;
        var ed;

        function sort_helper(ed1, ed2) {
            console.log([ed1.start, ed2.start])
            return ed1.start - ed2.start
        }
        
        event_dates = event_dates.sort(sort_helper);

        for (i in event_dates) {
            ed = event_dates[i];
            if (ed.type == 'timed' && ed.start > now) {
                target_ed = ed;
                break;
            }
            if (ed.type == 'reoccurring') {
                reoccurring = ed;
            }

            console.log(ed);
        }
        
        if (!target_ed) {
            target_ed = reoccurring;
        }

        console.log('-----------------------');
        console.log(target_ed);


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
