/* Event Display Components */
// TODO: Come up with a better name than Goober... trying 

var React = require('react');
var NiceDate = require('./../../utils/NiceDate');
var moment = require('moment');
var MapComponent = require('../maps/Map').MapComponent;
var LoadingSpinner = require('./../../utils/Layout').LoadingSpinner;


function sort_helper(ed1, ed2) {
    return moment(ed1.start) - moment(ed2.start)
}

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
        return <div className="ghost-load">
            <h1>&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632; &#9632; &#9632;&#9632; &#9632;</h1>
            <p className="lead">
                &#9632;&#9632;&#9632;&#9632; &#9632; &#9632;&#9632;&#9632; &#9632;&#9632; &#9632;&#9632;  &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; 
            </p>

            <div className="row">

                <div className="col-md-6">
                    <dl>
                        <div className="event-date">
                            <dt>&#9632;&#9632;&#9632;&#9632; &#9632;&#9632; &#9632; &#9632;&#9632; &#9632; &#9632;&#9632; &#9632; </dt>
                            <dd>&#9632;&#9632;&#9632;&#9632; &#9632;&#9632; &#9632;&#9632;&#9632; &#9632; </dd>
                        </div>
                    </dl>
                    <br />
                </div>

                <div className="col-md-6">
                    &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;<br />
                    &#9632;&#9632;&#9632;&#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632;<br />
                    &#9632;&#9632;&#9632;&#9632;&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; <br />
                    <br />
                </div>

            </div>
        </div>
    },
    render: function() {

        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var r = this.state.resource

        // Image
        var image = null;
        var image_url = null;

        if (r.primary_image_resource) {
            image_url = r.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }
        
        var eventDates = []

        eventDates = r.event_dates.map(function (ed, i) {
            return <div key={ 'event_date-' + i } className="event-date">
                <dt className="event-label">{ ed.label } </dt>
                <dd><NiceDate start={ ed.start } end={ ed.end } eventdate_type={ ed.type } /></dd>
            </div>
        });

        var rendered_venue;
        var venue_resource = r.event_dates[0].venue;
        var map_url = 'https://www.google.com/maps/place/' + encodeURIComponent(venue_resource.address).replace(/%20/g, "+") + ',+' + encodeURIComponent(venue_resource.city).replace(/%20/g, "+") + ',+MN'

        rendered_venue = <div>
            <b>{venue_resource.name }</b><br />
            <span>{venue_resource.address} </span>
            <span>{venue_resource.address2}</span><br />
            <span>{venue_resource.city }</span> <span>( <a href={ map_url } target="_new">map</a> )</span>
        </div>
        
        var rendered_more_url, big_link_button;
        if (r.url) {
            rendered_more_url = <span className="small"> <br /> <a href={ r.url } target="_new" title="More information on the event's website">Event Website </a> </span>
            big_link_button = <a href={ r.url } target="_new" className="btn btn-primary btn-lg btn-block"> More Information <span className="glyphicon glyphicon-new-window"></span></a>
        }

        return <div>
            <h1>{ r.name }</h1>
            <p className="lead">
                { r.summary }
                { rendered_more_url }
            </p>
            
            <div className="row">

                <div className="col-md-6">
                    <dl>{ eventDates }</dl>
                    <br />
                </div>

                <div className="col-md-6">
                    { rendered_venue }
                    <br />
                </div>

            </div>
            
            <div>{ image }</div>
            <br />
            <div className="hidden-xs"><MapComponent gallery={ venue_resource } /></div>
            <br />
            <div className="content" dangerouslySetInnerHTML={{__html: r.content}} />

            <br />
            <div className="hidden-lg">{ big_link_button }</div>
            <br />
        
        </div>
    }


});

var MarqueeRenderer = React.createClass({
    mixins: [EventRendererMixin],

    render: function () {

        var resource = this.props.resource;

        for (var i in resource.event_dates) {
            if (resource.event_dates[i].type == 'timed') {
                target_event_date = resource.event_dates[i];
                break
            }
        };

        // TODO: Need a default card image...
        var image_url = '';

        if (resource.primary_image_resource) {
            image_url = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        var styles = { 'backgroundImage' : 'url(' + image_url + ');'};

        var event_url = '/events/' + resource.slug;
        var rendered_date;

        start = moment(Date.parse(target_event_date.start));
        rendered_date = start.format("ddd, MMM Do");

        return <div className="jive-card-image">
            <a href={ event_url } onClick={ global.routeTo } style={ styles }>
                <div className="jive-card-title">
                    <div className="date">{ rendered_date }</div>
                </div>
            </a>
        </div>;
    }


});

var FeaturedHeroRenderer = React.createClass({
    mixins: [EventRendererMixin],
    render: function() {

        var resource = this.props.resource;

        for (var i in resource.event_dates) {
            if (resource.event_dates[i].type == 'timed') {
                target_event_date = resource.event_dates[i];
                break
            }
        };

        // TODO: Need a default card image...
        var image_url = '';

        if (resource.primary_image_resource) {
            image_url = resource.primary_image_resource.versions.CARD_SMALL.url;
        }

        var styles = { 'backgroundImage' : 'url(' + image_url + ');'};

        var event_url = '/events/' + resource.slug;
        var rendered_date;

        start = moment(Date.parse(target_event_date.start));
        rendered_date = start.format("ddd, MMM Do")

        return <div className="jive-card">
            <div className="jive-card-image">
                <a href={ event_url } onClick={ global.routeTo } style={ styles }>
                    <div className="jive-card-title">
                        <br />
                        <div className="date">{ rendered_date }</div>
                        <div className="title">{ resource.name }</div>
                    </div>
                </a>
            </div>
        </div>;

    }
});

var PodRenderer = React.createClass({
    /* Pod Renderer - for use in Masonry/Packery layouts */

    mixins: [EventRendererMixin],

    generate_image: function(img_resource, link_url, alt_text) {
        /* Generate "fixed" size image container to prevent resizing after images load */
        var w, h, styles;

        w = img_resource.width;
        h = img_resource.height;

        // Calculate % height to 2 decimal places
        scale_h = Math.floor(100 * h/w * 100.00) /100.00;

        styles = {'padding': scale_h + '% 0 0 0' };

        image_url = img_resource.url;
        image_container = <div className="card-image fixed-size">
            <a href={ link_url } data-ga-category="event-pod-click" data-ga-label="image" onClick={ global.routeTo } title={ alt_text } style={ styles }>
                <img src={image_url} className="img-responsive" title={alt_text} />
            </a>
        </div>

        return image_container;  
    },


    render_empty: function () {

        return <div className="ghost-load">
            <div className="card-content">
                <div className="card-title"><a href="#">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</a></div>

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

        var e = this.state.resource;
        var image = null;
        var image_url = null;

        // Figure out the best event Date to display
        var sorted_event_dates = e.event_dates.sort(sort_helper);

        var target_event_date = null;

        if (this.state.ed_filter) {
            for (var i in sorted_event_dates) {
                if (sorted_event_dates[i].type == this.state.ed_filter) {
                    target_event_date = sorted_event_dates[i];
                }
            };

            // This is mostly for debugging...
            if (!target_event_date) {
                target_event_date = e.event_dates[0];
                console.error('Warning: Failed to find an ed for the below event with a ed.type matching "' + this.state.ed_filter  + '". Defaulting to first found one. ');
                console.error(this.state);
            };
        }
        else {
            // No targeted date so lets find the soonest one that hasn't happened yet

            var reoccurring;
            var now = moment() // Maybe make this 2AM tomorrow...
            var ed;

            for (var i in sorted_event_dates) {
                ed = sorted_event_dates[i];
                if (ed.type == 'timed' && moment(ed.start) > now) {
                    target_event_date = ed;
                    break;
                }
                if (ed.type == 'reoccurring') {
                    reoccurring = ed;
                }
            }

            if (!target_event_date) {
                if (reoccurring) {
                    target_event_date = reoccurring;                    
                }
                else {
                    // Event is in the past and there are no reoccurring dates??
                    target_event_date = sorted_event_dates[0]
                }
            }


            //target_event_date = sorted_event_dates[0];
        }

        var post_url = '/events/' + e.slug; //e.url;

        if (e.primary_image_resource) {
            var img_resource = e.primary_image_resource.versions.CARD_SMALL;            
            image = this.generate_image(img_resource, post_url, e.name);
        }

        //<div className="card-title"><a href={post_url} onClick={global.routeTo }>{e.name}</a></div>

        return <div>
            { image }

            <div className="card-content">
                <div className="card-title"><a href={ post_url } data-ga-category="event-pod-click" onClick={global.current_page.getRoute }>{e.name }</a></div>

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
            	<div><a><span className="event-title">&#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</span></a></div>
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
                <a href={e.url} style={ img_style }>
                    <img src={im_resource.url} />
                </a>
            </div>;
        }

        return <li className="event">
            { image_node }
            <div className="event-info">
            	<div><a href={e.url}><span className="event-title">{e.name}</span></a></div>
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
    		<div><a href={this.props.url}><span className="event-title">{this.props.name}</span></a></div>
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
    FeaturedHeroRenderer: FeaturedHeroRenderer,
    MarqueeRenderer: MarqueeRenderer,
    FullEventRenderer: FullEventRenderer
};