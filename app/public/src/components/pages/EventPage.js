/* Main Renderer for Event Page/View */

var React = require('react');
var Reflux = require('reflux');
var PageMixin = require('./PageMixin');
var EventModule = require('./../DataTypes/Event');
var EventGoober = EventModule.Goober;
var FullEventRenderer = EventModule.FullEventRenderer;
var Separator = require('../../utils/Layout').Separator;

var TempUpcoming = require('../calendar/TempUpcoming');
var TempEvents = require('../calendar/TempEvents');
var Footer = require('../temp/Footer');

var EventStore = require('../../modules/events/stores').EventStore;
var EventActions = require('../../modules/events/actions').EventActions;


var EventPage = React. createClass({
    mixins: [PageMixin, Reflux.ListenerMixin],

    default_meta: {
        'title': 'View Event',
        'description': 'Events in Minneapolis and St. Paul'
    },

    /* React Life Cycle Methods */
    getInitialState: function () {
        /* TODO: This is the state for most resource 'view' Pages/Views ... Refactor to mixin? */
        return {
            content_loaded: false,
            content_not_found: false,
            resource: null
        };
    },

    pageDidMount: function () {
        // Set default meta prior to content loading. TODO: Move to PageMixin ?
        this.setMeta();

        // Subscribe to desired actions
        this.listenTo(EventStore, this.onLoad);

        // Trigger the load action to set the intial data for the page
        this.requestPageContent();
    },

    componentWillReceiveProps: function() {
        /* Page was navigated to with different url params, so we need to manually request event */
        // Called on react-router transition

        this.requestPageContent();
        return true;
    },


    /* Flux Store Listener Callbacks */
    requestPageContent: function() {
        /* Render a fresh page based on url params.
            For now, this just means getting a new event.
            Tell the Actions you need the Event from the store */
        /* This is called pageDidMount and componentWillReceiveProps */

        // Trigger the load action
        var slug = this.context.router.getCurrentParams().slug;
        EventActions.load(slug);
    },

    onLoad: function(payload) {
        // EventStore triggered a new event coming in
        var slug = this.context.router.getCurrentParams().slug;
        if (payload == 'NOPE') {
            /* Failed to Load Resouce from Store */
            this.setState({
                content_not_found:true,
                content_loaded:true,
                resource: null
                }
            );
        }
        else {
            this.setState({
                content_not_found:false,
                content_loaded: true,
                resource: payload}
            );
        }
    },


    set_meta_for_resource: function() {
        // Set the Page Meta for this specific post

        var resource = this.state.resource;

        this.default_meta =  {
            title: resource.name,
            description: resource.summary
        }

        if (resource.primary_image_resource) {
            // TODO: Do better error checking...
            this.default_meta['image'] = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        this.setMeta();
    },

    render: function() {

        var rendered_content;

        if (this.state.content_not_found) {
            // TODO: We may be able to render the 404 page for this Route used by react-router ?
            rendered_content = (
                <div>
                    <h2>Event Not Found</h2>
                    <p>We were unable to find the requested event. </p>
                </div>
            );
        }
        else if (this.state.resource != null) {
            // Render the event
            resource = this.state.resource;

            rendered_content = <EventGoober key={ resource.resource_id } resource={ resource } renderer={ FullEventRenderer } />
        }
        else {
            // Ghost load content
            rendered_content = <EventGoober resource={ null } renderer={ FullEventRenderer } />
        }

        return (
            <div id="HomePageWrapper">
                <div className="row">
                    <div className="col-md-6">
                        { rendered_content }
                        <Separator />
                    </div>

                    <div className="col-md-3 panel-events"><TempUpcoming col_name="'Upcoming" /></div>
                    <div className="col-md-3 panel-events"><TempEvents col_name="'Now Showing'"  /></div>
                </div>
                <Footer />
            </div>
        );

    }
});

module.exports = {
    EventPage: EventPage
};
