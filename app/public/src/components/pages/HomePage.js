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
            <div className="row">
        
        
        
                <div id="panel-blurb" className="col-xs-12">
            	    <h2>We are re-building.</h2>
            	    <p>Look for a new calendar this Spring and keep submitting  your events to <a href="mailto:calendar@mplsart.com">calendar@mplsart.com</a></p>
                </div>

                <div className="card big-card col-xs-12">
                    <div className="card-image">
                        <a href="/written/2015/03/mplsart-com-launch-party-april-10th/" onClick={this.getRoute} title="MPLSART.COM Launch Party">
                            <img src="http://cdn.mplsart.com/file_container/RmlsZUNvbnRhaW5lch4fMjAwMDAwMQ/card_small.png" className="img-responsive" title="MPLSART.COM Launch Party" />
                        </a>
                    </div>
                    <div className="card-content">
                        <div className="card-title">
                            <a href="/written/2015/03/mplsart-com-launch-party-april-10th/" onClick={this.getRoute} target="_new">MPLSART.COM Launch Party</a>
                        </div>
                        <div className="card-detail event-time">Friday, April 10th</div>
                        <div className="card-detail event-venue-name">Public Functionary</div>
                        <div className="card-detail event-address">1400 12th Ave NE, Minneapolis</div>
                    </div>
                </div>

                <TempExtras />
                
                
            </div>
        </div>
    }
});


var HomePage = React.createClass({
    mixins: [PageMixin],
    
    default_meta: {
        'title': 'MPLSART.COM | Returning Spring 2015',
        'description': 'The best art events and gallery listings for Minneapolis and St. Paul',
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
