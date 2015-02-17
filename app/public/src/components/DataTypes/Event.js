/* Event Display Components */
// TODO: Come up with a better name than Goober... trying 

var React = require('react');
var NiceDate = require('./../../utils/NiceDate');


var EventRendererMixin = {
    getInitialState: function () {
        return {
            resource_loaded: resource_loaded = Boolean(this.props.resource),
            resource: this.props.resource,
            ed_filter: this.props.ed_filter
        }
    },    
}

var AlphaEventRenderer = React.createClass({
    // Event Renderer for TempAlpha Site - pre April 2015 launch

    mixins: [EventRendererMixin],

    render_empty: function () {
        return <li className="event">
        	<div><a target="_blank"><span className="event-title">Xxxxxxx Xxxxx Xxxxxxxx</span></a></div>
            <div className="event-time">Xxxx XXxxx - XXxxx</div>
            <div className="event-venue-name">Xxx xxx Xxxx Xxxx</div>
            <div className="event-address">XXXX X Xxx Xxxxx, Xxxxxx</div>
        </li>;
    },

    render: function() {
        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var e = this.state.resource;

        // Isolate the targeted event_date
        var target_event_date = null;

        for (var i in e.event_dates) {
            if (e.event_dates[i].type == this.state.ed_filter) {
                target_event_date = e.event_dates[i];
            }
        };

        // This is mostly for debugging...
        if (!target_event_date) {
            target_event_date = e.event_dates[0];
            console.error('Warning: Failed to find an ed for the below event with a ed.type matching "' + this.state.ed_filter  + '". Defaulting to first found one. ');
            console.error(this.state);
        };

        return <li className="event">
        	<div><a href={e.url} target="_blank"><span className="event-title">{e.name}</span></a></div>
            <div className="event-time"><NiceDate start={ target_event_date.start } end={ target_event_date.end } eventdate_type={ target_event_date.type } /></div>
            <div className="event-venue-name">{target_event_date.venue.name}</div>
            <div className="event-address">{target_event_date.venue.address + ', ' + target_event_date.venue.city }</div>
        </li>;
    }

});

var DefaultEventRenderer = React.createClass({
    /* Default Event Renderer when none are given.
    TODO: We could probably do away with this... */

    mixins: [EventRendererMixin],

    render: function() {
        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return <b>loading</b>;
        }
        var ed = false;

        for (i in this.props.event_dates){
            this.props.event_dates[i];
            if (this.props.event_dates[i].type == this.props.ed_filter) {
                ed = this.props.event_dates[i];
            }
        }
        
        if (!ed) {
            ed = this.props.event_dates[0];
            console.error('Warning: Failed to find an ed for the below event with a ed.type matching "' + this.props.ed_filter  + '". Defaulting to first found one. ');
            console.error(this.props);
        }        

        return (<li className="event">
    		<div><a href={this.props.url} target="_blank"><span className="event-title">{this.props.name}</span></a></div>
            <div className="event-time"><NiceDate start={ ed.start } end={ ed.end } eventdate_type={ ed.type } /></div>
            <div className="event-venue-name">{ed.venue.name}</div>
            <div className="event-address">{ed.venue.address + ', ' + ed.venue.city }</div>
    	</li>);
    }
});


var EventGoober = React.createClass({
    /* Goober for Events - Handles listeners, etc */

    getDefaultProps: function() {
        return { renderer: DefaultEventRenderer };
    },

    propTypes: {
        renderer: React.PropTypes.any, // A React Class to Render the Event
        resource: React.PropTypes.node, // A Resource (object) from the store, etc or null
        ed_filter: React.PropTypes.oneOf(['reoccurring', 'timed'])
    },

    getInitialState: function () {
        return {
            renderer: this.props.renderer,
            resource: this.props.resource,
            ed_filter: this.props.ed_filter
        }
    },
    render: function () {
        // Determine which ED we meant to show actually
        var props = {
            resource: this.state.resource, 
            ed_filter: this.state.ed_filter
        };

        return React.createElement(this.state.renderer, props);
    }    
});


module.exports = {
    EventGoober: EventGoober,
    AlphaEventRenderer: AlphaEventRenderer,
    DefaultEventRenderer: DefaultEventRenderer
};