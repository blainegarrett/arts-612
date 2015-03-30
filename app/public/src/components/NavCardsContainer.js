var React = require('react');
var EventModule = require('./DataTypes/Event');
var FeaturedEventsStore = require('./../stores/FeaturedContentStore');


var MarqueeCardSet = React.createClass({

    getInitialState: function () {
        /* TODO: This is using some mocked out data... work on this more */
        return { results: FeaturedEventsStore.getRaw() }
    },

    render: function () {
        var rendered_marquee_events;

        var rendered_marquee_events = this.state.results.map(function (resource, i) {
            return <EventModule.Goober key={'marquee-' + i}resource={ resource } renderer={ EventModule.MarqueeRenderer } />
        });

        return <div className="row-shim">
            { rendered_marquee_events }
        </div>;
        
    }
});

var CoolSideCard = React.createClass({
    render: function () {
        var styles = {
            'backgroundImage' : 'url(http://placehold.it/500x500);'
        };
        
        return <div className="card">
            <a href="#" style={ styles }>
                <span>derp</span>
            </a>
        </div>        
    }
});


var NavCardsContainer = React.createClass({
    /* Marquee Cards */
    render: function () {
        return <div className="container">
    	    <div className="row">
    		    <MarqueeCardSet />
    		    <div className="col-sm-4 sidecard">
    		        <CoolSideCard />
    		    </div>
    		</div>
      	</div>
    }
});

module.exports = {
        NavCardsContainer: NavCardsContainer,
        MarqueeCardSet: MarqueeCardSet
}