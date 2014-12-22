var React = require('react');
var PageMixin = require('./PageMixin');

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');

var GoodNewsBanner = React.createClass({
    render: function () {
        return <div className="row">
      	    <div className="col-md-12" id="welcome-header-container">
    			<h1 id="welcome-header">GOOD NEWS, MINNEAPOLIS</h1>
    		</div>
    	</div>;
    }
});

var Footer = React.createClass({
    render: function () {
        return <footer id="main-content-footer"><p>We love art. We love you. &copy; 2014 mplsart</p></footer>
    }
});


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


        	<div id="panel-signup">
        		<div className="panel-header">PRE-LAUNCH ACCESS</div>
        		<div className="panel-content">
            		<p>Enter your email address for exclusive access to the Beta calendar during its development.</p>
            		<form id="email-form" role="form" action="/beta/email/" method="GET">
            			<div className="input-group input-group-lg">
            				<input type="text" className="form-control" id="id_email" name="email" placeholder="Your email address" />

            				<span className="input-group-btn">
            					<button className="btn btn-default" type="submit">Go</button>
            				</span>

            			</div>
            		</form>

            	</div>
            </div>
        
            
            
            
            <div id="panel-contact">
            	<div className="panel-content"><a href="mailto:calendar@mplsart.com"><b>Contact us</b></a> with questions and to submit event listings.</div>
            </div>
            


            <div id="panel-social">
            	<div className="panel-content">
            		<a href="https://www.facebook.com/mplsart" id="fb-link" target="_new">
            			<span className="fa-stack fa-lg">
            				<i className="fa fa-square-o fa-stack-2x"></i>
            				<i className="fa fa-facebook fa-stack-1x"></i>
            			</span>
            		</a>

            		<a href="https://twitter.com/mplsart" id="twitter-link" target="_new">  
            			<span className="fa-stack fa-lg">
            				<i className="fa fa-square-o fa-stack-2x"></i>
            				<i className="fa fa-twitter fa-stack-1x"></i>
            			</span>
            		</a>
            		&nbsp;&nbsp;Stay Connected to mplsart during the rebuild.
            	</div>
            </div>


        
        
        </div>
        
    }
});


var HomePage = React.createClass({
    mixins: [PageMixin],

    default_meta: {
        'title': 'Welcome',
        'description': 'This is a page and it is totally super fly.'
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
module.exports = HomePage;
