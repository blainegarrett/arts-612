var React = require('react');
var moment = require('moment');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');
var TempExtras = require('../temp/TempExtras');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');


/* TODO: Switch this to a store and a rest api */

var post = {
    'title': 'A message from mplsart.com founder, Emma Berg',
    'slug': 'new_beginnings_for_mplsart',
    'content': '<p class="lead">It is with great pleasure that we introduce you to the new owners of mplsart.com, Katie and Blaine Garrett!</p><p> Kristoffer and I have spent the past few months talking with them about our experience with the site, why it came to be, and our love of artists and this arts scene. We\'ve talked about what makes the site and the scene work and what could make it better. From the first meeting, Katie and Blaine have voiced a true passion for digging in, supporting, and building upon what we started as a way to provide insight and guidance into this thing we call Minneapolis art. We were sold. We know they have the passion to make this work and we are happy to be handing over the keys. In the following months, they\'ll have much to share. And we\'ll be eagerly waiting to see what mplsart.com grows into.</p><p>As Kristoffer and I step aside, we ask that you welcome Katie and Blaine and continue to support the galleries and artists of Minneapolis and beyond. </p> <div><img src="http://cdn.mplsart.com/written/temp/animated_foursome.gif" class="img-thumbnail" style="width:100%" /></div>',
    'published_date': '2015-01-04T02:00:00Z',
    'author': {'firstname': 'Emma', 'lastname': 'Berg'},
    'primary_image': 'http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg',
    'summary': 'It is with great pleasure that we introduce you to the new owners of mplsart.com'
};

var FullArticle = React.createClass({
    getInitialState: function () {
        /* TODO: This should be defaulted to empty object */
        return {
            post: this.props.post
        };
    },
    render: function() {
        // Render the blog article
        p = this.state.post;
        
        published_date = moment(Date.parse(p.published_date)).format('MMMM, Do YYYY');
        
        return <div className="col-md-6" id="main-content-container">
            <h2>{ p.title }</h2>
            <p class="blog-post-meta">{ published_date } by { p.author.firstname }</p>

            <div class="article-content-container" dangerouslySetInnerHTML={{__html: p.content }}>            
            </div>
            <br />
            <br />
            <TempExtras />
        </div>
    }
});



var WrittenArticlePage = React.createClass({
    mixins: [PageMixin],

    // TODO: More logical defaults and match to server...
    default_meta: {
        'title': post.title,
        'description': post.summary,
        'image': post.primary_image
    },

    getInitialState: function () {
        /* TODO: This should be defaulted to empty object */
        return {
            post: post,
        };
    },

    componentDidMount: function () {
        /* TODO: Populate state via ajax call, on success call setMeta() */
        this.setMeta();
    },

    render: function() {
        var p = this.state.post;

        return <div id="HomePageWrapper">
            <GoodNewsBanner />
            
            <div className="row">
                <FullArticle post={this.state.post} />
                <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>
            
            <Footer />
        </div>;

    },
    componentDidMount: function() {
        this.setMeta();
    }
});
module.exports = WrittenArticlePage;
