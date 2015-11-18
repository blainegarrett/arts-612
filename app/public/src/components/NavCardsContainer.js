var React = require('react');
var EventModule = require('./DataTypes/Event');
var WrittenModule = require('./DataTypes/Article');
var FeaturedEventsStore = require('./../stores/FeaturedContentStore');

var podComponentMap = {
    'Event': EventModule,
    'BlogPost': WrittenModule
};


var NavCardsContainer = React.createClass({
    /* Marquee Cards */

    _onChange: function() {
        /* Pick up signal for when featured content changes - typically async load */
        this.setState({results: FeaturedEventsStore.getRaw()});
    },
    componentDidMount: function() {
        // Subscribe to changes in the featured events
        FeaturedEventsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        // Un-Subscribe to changes in the featured events
      FeaturedEventsStore.removeChangeListener(this._onChange);
    },

    getInitialState: function () {
        /* Pull data from featured store shared with homepage */
        return { results: FeaturedEventsStore.getRaw() }
    },

    render: function () {
        var rendered_marquee_events;
        var rendered_bigcard_card;

        /* Tricky math for if we have fewer than 4 expected cards */
        var total_cards = this.state.results.length;

        if (total_cards == 0) {
            // Not loaded yet and/or error...
            return <div className="container"></div>
        }

        // Pop off the big card spot since we assume *something* will always be there...
        var event_resources = $.extend(true, [], this.state.results);
        var big_card_spot_resource = event_resources.pop();
        var total_cards = event_resources.length;

        var default_size = 2;
        if (total_cards == 2) { default_size = 4; }
        if (total_cards == 1) { default_size = 8; }


        // Big Featured Card
        var componentClass = podComponentMap[big_card_spot_resource.resource_type];

        if (!componentClass) {
            return <div className="card col-sm-2"></div>
        }

        var pod_props = {key: 'marquee-big', 'resource': big_card_spot_resource, renderer: componentClass.MarqueeRenderer };
        var rendered_bigcard_card = React.createElement(componentClass.Goober, pod_props);

        rendered_marquee_events = event_resources.map(function (resource, i) {
            var classes = 'item jive-card col-sm-';

            if (total_cards == 3 && i == 0) {
                classes += '4';
            }
            else {
                classes += default_size;
            }

            return <div key={'marquee-' + i} className={ classes }><EventModule.Goober
                resource={ resource }
                renderer={ EventModule.MarqueeRenderer } /></div>
        });


        return <div className="container hidden-xs">
    	    <div className="row">
    		    <div className="row-shim">{ rendered_marquee_events }</div>
    		    <div className="col-sm-4 item jive-card">
                    { rendered_bigcard_card }
    		    </div>
    		</div>
      	</div>
    }
});



show_marquee = function() {
    var featured_hero = $('#featured-hero-area');

    if (featured_hero.length) {
        // Page Has the featured hero section
        var threshhold = featured_hero.offset().top + featured_hero.height();

        $('#header_nav').toggleClass('show-nav', $(document).scrollTop() > threshhold - 100);
    }
    else {
        $('#header_nav').addClass('show-nav');
    }
}



module.exports = {
        NavCardsContainer: NavCardsContainer,
        show_marquee: show_marquee
}