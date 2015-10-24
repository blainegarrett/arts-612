var React = require('react');
var FeaturedEventsStore = require('./../stores/FeaturedContentStore');
var EventModule = require('./DataTypes/Event');
var WrittenModule = require('./DataTypes/Article');


var podComponentMap = {
    'Event': EventModule,
    'BlogPost': WrittenModule
};


var FeaturedHeroPanel = React.createClass({
    /* Homepage Specific Widget for showing featured Content in top Hero space */

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
        /* Note: This logic is basically duplicated from NavCardsContainer*/
        var rendered_marquee_events;
        var rendered_big_card;

        var total_cards = this.state.results.length;

        if (total_cards == 0) {
            // Not loaded yet and/or error...
            return <div className="row" id="featured-hero-area"></div>
        }

        // Pop off the big card spot since we assume *something* will always be there...
        var event_resources = $.extend(true, [], this.state.results);
        var big_card_spot_resource = event_resources.pop();
        var total_cards = event_resources.length;


        // Big Featured Card
        var componentClass = podComponentMap[big_card_spot_resource.resource_type];

        if (!componentClass) {
            return <div className="card col-sm-2"></div>
        }

        var pod_props = {key: 'hero-event-big',  'resource': big_card_spot_resource, renderer: componentClass.FeaturedHeroRenderer };
        var rendered_big_card = React.createElement(componentClass.Goober, pod_props);


        // The other cards
        var rendered_marquee_events = event_resources.map(function (resource, i) {
            var colspan = 6

            if (total_cards < 3) {
                colspan = 12
            }
            return <div key={ 'hero-event-' + i } className={ 'card col-sm-' + colspan }>
                <EventModule.Goober resource={ resource } renderer={ EventModule.FeaturedHeroRenderer } />
            </div>
        });

        return <div className="row" id="featured-hero-area">
            <div className="col-sm-6">
               <div className="row featured-events-wrapper">
                    { rendered_marquee_events }
               </div>
            </div>

            <div className="featured-events-wrapper col-sm-6 card large-card">{ rendered_big_card }</div>
        </div>;
    }
});


module.exports = FeaturedHeroPanel