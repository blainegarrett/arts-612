var React = require('react');

var PageMixin = require('./PageMixin');

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var TempExtras = require('../temp/TempExtras');


/* TODO: Potentially break these into separate components */
var PrimaryJive = React.createClass({
    render: function() {
        return <div className="col-md-6" id="main-content-container">
            <div id="panel-blurb">
        	    <h2>mplsart is returning!</h2>
        	    <p>
        	    We are delighted to say that we’ve met a lovely pair who love art &amp; mpls as much as we do.  We are handing over the keys and are thrilled that they will be re-launching mplsart. Look for a new calendar this Spring and keep submitting your events to <a href="mailto:calendar@mplsart.com">calendar@mplsart.com</a>
        	    </p>
                
        	    <p className="blurb-signature"><br />XO,<br />Emma Berg &amp; Kristoffer Knutson</p>
            </div>

            <TempExtras />
        </div>
    }
});


var NewHomePage = React.createClass({
    mixins: [PageMixin],
    
    default_meta: {
        'title': 'mplsart.com | Returning Spring 2015',
        'description': 'The Very Best Events and Gallery Listings for Minneapolis and St. Paul',
        'image': 'http://mplsart.com/static/themes/v0/mplsart_fbimg.jpg'
    },
    render: function() {
        return <div id="HomePageWrapper">
            <GoodNewsBanner />
            
            <div className="row">
                <PrimaryJive />
                <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
            </div>
            
            <Footer />
        </div>;
    },
    componentDidMount: function () {
        this.setMeta();
    }
});
module.exports = NewHomePage;
