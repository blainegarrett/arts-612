/* Event Display Components */
// TODO: Come up with a better name than Goober... trying 

var React = require('react');
var NiceDate = require('./../../utils/NiceDate');
var MapComponent = require('../maps/Map').MapComponent

var EventRendererMixin = {
    getInitialState: function () {

        return {
            resource_loaded: resource_loaded = Boolean(this.props.resource),
            resource: this.props.resource,
            ed_filter: this.props.ed_filter
        }
    },    
};

var FullEventRenderer = React.createClass({
    /* Full Event Rendering */

    mixins: [EventRendererMixin],

    render_empty: function() {
        return <div><b>loading...</b></div>
    },
    render: function() {
        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        console.log(this.state);

        var r = this.state.resource

        // Image
        var image = null;
        var image_url = null;

        if (r.primary_image_resource) {
            image_url = r.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }


        var eventDates = []

        eventDates = r.event_dates.map(function (ed) {
            return <div className="event-date">
                <dt class="label">{ ed.label } </dt>
                <dd><NiceDate start={ ed.start } end={ ed.end } eventdate_type={ ed.type } /></dd>
            </div>
        });

        var rendered_venue;
        var venue_resource = r.event_dates[0].venue;

        rendered_venue = <div>
            <b>{venue_resource.name }</b><br />
            {venue_resource.address}
            {venue_resource.address2}<br />
            {venue_resource.city }
        </div>
        

        return <div>
            <div className="col-md-6">
                <h1>{ r.name }</h1>
                <p className="lead">{ r.summary }</p>

                <div className="row">

                    <div className="col-md-6">
                        { rendered_venue }

                        <b><a href="{ r.url }" target="_new">More details...</a></b>

                    </div>

                    <div className="col-md-6">
                        <dl>{ eventDates }</dl>

                    </div>
                </div>
                
            </div>

            <div className="col-md-6">{ image }</div>

            <div className="col-md-6">
                 <br />
                 <br />
                <MapComponent gallery={ venue_resource } />
            </div>            
            
            <div className="col-md-6">
                <br />
                <br />
                <div className="content" dangerouslySetInnerHTML={{__html: r.content}} />
            </div>
        
        
        </div>
    }


});

var PodRenderer = React.createClass({
    /* Pod Renderer */

    mixins: [EventRendererMixin],

    render_empty: function () {
        return <div className="ghost-load">
            <div className="card-content">
                <div className="card-title"><a href="#" target="_new">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</a></div>

                <div className="card-detail event-time">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;</div>
                <div className="card-detail event-venue-name">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;</div>
                <div className="card-detail event-address">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;</div>

            </div>            
        </div>
    },

    render: function() {
        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        console.log('dddddddddddddddddddddddd');

        var e = this.state.resource;
        var image = null;
        var image_url = null;

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


        if (e.primary_image_resource) {
            image_url = e.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" title={e.name} />
        }

        //<div className="card-title"><a href={post_url} onClick={global.routeTo }>{e.name}</a></div>

        var post_url = e.url;
        return <div>
            <div className="card-image">
                <a href={post_url} title={e.name}>{ image }</a>
            </div>

            <div className="card-content">
                <div className="card-title"><a href={ post_url } target="_new">{e.name }</a></div>

                <div className="card-detail event-time"><NiceDate start={ target_event_date.start } end={ target_event_date.end } eventdate_type={ target_event_date.type } /></div>
                <div className="card-detail event-venue-name">{target_event_date.venue.name}</div>
                <div className="card-detail event-address">{target_event_date.venue.address + ', ' + target_event_date.venue.city }</div>

            </div>            
        </div>;

    }
    
});



var AlphaEventRenderer = React.createClass({
    // Event Renderer for TempAlpha Site - pre April 2015 launch

    mixins: [EventRendererMixin],

    render_empty: function () {
        return <li className="event ghost-load">
            <div className="event-info">
            	<div><a target="_blank"><span className="event-title">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</span></a></div>
                <div className="event-time">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632;</div>
                <div className="event-venue-name">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</div>
                <div className="event-address">&#9632;&#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;&#9632;&#9632;</div>
            </div>
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

        var image_node;
        if (e.primary_image_resource && e.primary_image_resource.versions.CARD_SMALL) {
            var im_resource = e.primary_image_resource.versions.CARD_SMALL;

            padding_percent = parseFloat(im_resource.height)/parseFloat(im_resource.width) * 100;
            padding_percent += '%';

            var img_style = {paddingBottom: padding_percent};
            var image_node = <div className="event-image">
                <a href={e.url} style={ img_style } target="_blank">
                    <img src={im_resource.url} />
                </a>
            </div>;
        }

        return <li className="event">
            { image_node }
            <div className="event-info">
            	<div><a href={e.url} target="_blank"><span className="event-title">{e.name}</span></a></div>
                <div className="event-time"><NiceDate start={ target_event_date.start } end={ target_event_date.end } eventdate_type={ target_event_date.type } /></div>
                <div className="event-venue-name">{target_event_date.venue.name}</div>
                <div className="event-address">{target_event_date.venue.address + ', ' + target_event_date.venue.city }</div>
            </div>
        </li>;
    }

});

var DefaultRenderer = React.createClass({
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


var Goober = React.createClass({
    /* Goober for Events - Handles listeners, etc */

    getDefaultProps: function() {
        return { renderer: DefaultRenderer };
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
    Goober: Goober,
    AlphaEventRenderer: AlphaEventRenderer,
    DefaultRenderer: DefaultRenderer,
    PodRenderer: PodRenderer,
    FullEventRenderer: FullEventRenderer
};