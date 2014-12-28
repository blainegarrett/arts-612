var React = require('react');
var PageMixin = require('./PageMixin');
var ReactRouter = require('flux-react-router');

var Footer = require('../temp/Footer');
var GoodNewsBanner = require('../temp/GoodNewsBanner');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var TempExtras = require('../temp/TempExtras');


/* TODO: Potentially break these into separate components */
var PrimaryJive = React.createClass({
    getInitialState: function () {
        /* TODO: This should be defaulted to empty object */
        return {
            page: this.props.page,
        }
    },

    render: function() {
        return <div className="col-md-6" id="main-content-container">
            <div id="panel-blurb">
        	    <h2>mplsart is returning!</h2>
        	    <p>Look for a new calendar this Spring and keep submitting  your events to  <a href="mailto:calendar@mplsart.com">calendar@mplsart.com</a></p>
            </div>

            <div id="panel-closet">
            	<div className="panel-content">
                    <div className="row">
                        <div className="pod">
                        	<div className="col-sm-4">
                        	    <a href="/written/2014/12/new_beginnings_for_mplsart" onClick={this.state.page.getRoute} title="A message from mplsart.com founder, Emma Berg">
                        	        <img src="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" className="img-responsive" />
                        	    </a>
                        	</div>
                            <div className="col-sm-8">
                                <h2 className="pod-title">A message from mplsart.com founder, Emma Berg:</h2>
                                <p className="pod-descr">It is with great pleasure that we introduce you to the new owners of mplsart.com</p>
                                <p className="pod-readmore"><a href="/written/2014/12/new_beginnings_for_mplsart" onClick={this.getRoute} title="A message from mplsart.com founder, Emma Berg">Read More ...</a></p>                
                            </div>
                        </div>
                    </div>
            	</div>
            </div>

            <TempExtras p/>
        </div>
    }
});


var HomePage = React.createClass({
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
                <PrimaryJive page={this} />
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
module.exports = HomePage;
