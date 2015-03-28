var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');
var GoogleMapsLoader = require('google-maps');

var Event404Page = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Event Not Found',
        'description': 'The Event You Are Looking for Could Not Be Found.'
    },
    componentDidMount: function () {
        this.setMeta();
    },
    render: function() {
        return <div>
        <h2>Event not found...</h2>
        
        <br /><br/>
        <a onClick={ReactRouter.deferTo('/calendar')}>Return to Calendar</a>
        </div>
    }
});


var MapComponent = React.createClass({
    getInitialState: function () {
        console.log(this.props);
        return {
            gallery: this.props.gallery,
            geo: this.props.gallery.geo
        }
    },

    componentDidMount: function () {
        var c = this;

        GoogleMapsLoader.KEY = 'AIzaSyB4MkGj6-uAll42KklXe3QISTIbhRoJ1Ng';
        GoogleMapsLoader.load(function(google) {

            var map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                zoom: 30
            });

            var marker = new google.maps.Marker({
                  position: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                  map: map,
                  title: 'Uluru (Ayers Rock)'
              });

              var infowindow = new google.maps.InfoWindow({
                   content: '<div id="content">'+
                         '<div id="siteNotice">'+
                         '</div>'+
                         '<h1 id="firstHeading" class="firstHeading">' + c.state.gallery.name + '</h1>'+
                         '<div id="bodyContent">'+
                         '<p>' + c.state.gallery.summary +  '</p>'+
                         //'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                         //'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                         //'(last visited June 22, 2009).</p>'+
                         '</div>'+
                         '</div>'
               });
              infowindow.open(map, marker); 
            
        });        
    },
    render: function () {
        return <div id="map-canvas" className="map-small"></div>
    }
});

var EventPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Events',
        'description': 'EVents in Minneapolis and St. Paul'
    },
    getInitialState: function () {
        console.log(this.props);
        return {
            event: null,
            slug: this.props.slug,
            not_found: false,
            resource_url: '/api/events?get_by_slug=' + this.props.slug
            
        }
    },
    componentDidMount: function () {
        console.log(this.state);

        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function (data) {
                
                /* Have the store do this... */
                console.log('setting state');
                console.log(data.results);

                
                /* TODO: Add image and description */
                this.default_meta = {
                    title: data.results.name,
                    description: data.results.summary
                }


                this.setMeta();
                this.setState({event: data.results});
                

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());

                this.default_meta = {
                    title: 'event not found',
                    description: 'This event could not be found'
                }

                this.setMeta();
                this.setState({not_found: true, event:true});
                
            }.bind(this)
            
        });
    },

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function() {
        console.log('rendering the event?');
        console.log(this.state);

        // If no data loaded
        if (!(this.state.event) == true) {
            // TODO: Render a shell of what the page will look like
            return <div>loading event...</div>
        }
        
        if (this.state.not_found) {
            return <Event404Page slug={ this.state.slug } />
        }
        
        // If event not found by slug
        var artEvent = this.state.event;

        var eventDates = []

        eventDates = artEvent.event_dates.map(function (eventDate) {
            return <div className="event-date">
                <span class="label">{ eventDate.label }</span>
                <h2>{ eventDate.start } - { eventDate.end }</h2>
            </div>
        });

        var venue = artEvent.event_dates[0].venue;
        
        var image = null;
        var image_url = null;

        if (artEvent.primary_image_resource) {
            image_url = artEvent.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }

        return <div className="row">
            <div className="col-md-6">
                <div className="row">
                    <h1>{ artEvent.name }</h1>
                    <div className="summary">{ artEvent.summary }</div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        { eventDates }
                    </div>
                    <div className="col-md-6">
                        <h2><a href="{ venue.website }" _target="new">{venue.name}</a></h2>
                        <p>{ venue.address } { venue.address2 } -  { venue.city }</p>
                        <MapComponent gallery={venue} />
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                { image }
                <div className="content" dangerouslySetInnerHTML={{__html: artEvent.content}} />
            </div>
        </div>;

    }
});
module.exports = EventPage;
