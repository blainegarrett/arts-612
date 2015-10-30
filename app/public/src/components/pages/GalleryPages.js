var React = require('react');
var Reflux = require('reflux');
var VenueStores = require('../../modules/venues/stores');
var VenueActions = require('../../modules/venues/actions').VenueActions;
var PageMixin = require('./PageMixin');
var GoogleMapsLoader = require('google-maps');

var Gallery404Page = React.createClass({
    mixins: [PageMixin, Reflux.ListenerMixin],

    default_meta: {
        'title': 'Gallery Not Found!',
        'description': 'The Gallery You Are Looking for Could Not Be Found.'
    },
    pageDidMount: function () {
        this.setMeta();
    },
    render: function() {
        return (
            <div>
                <h2>Gallery not found...</h2>
                <br /><br/>
            </div>
        );
    }
});


var GalleryViewPage = React.createClass({
    mixins: [PageMixin, Reflux.ListenerMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'Galleries in Minneapolis and St. Paul'
    },

    getInitialState: function () {
        return {
            resource_loaded: false,
            resource_not_found: false,
            resource: null
        }
    },

    /* React Life Cycle Methods */
    pageDidMount: function () {
        // Subscribe to desired actions
        this.listenTo(VenueStores.VenueSlugStore, this.onRequestResource);

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
        //VenueActions.requestResourceBySlug(slug); // Action based pattern

        VenueStores.VenueSlugStore.get(slug).then(function (payload) {
            // success
            this.setState({
                resource_not_found:false,
                resource_loaded: true,
                resource: payload}
            );
        }.bind(this),
        function (payload) {
            // success
            this.setState({
                resource_not_found:true,
                resource_loaded: true,
                resource: payload}
            );

        }.bind(this)

        );

    },

    onRequestResource: function(payload) {
        // Handle

        this.setState({
            resource_not_found:false,
            resource_loaded: true,
            resource: payload}
        );
    },

    render: function() {

        // If no data loaded
        if (!this.state.resource_loaded) {
            // TODO: Render a shell of what the page will look like
            return (<div>loading gallery...</div>);
        }

        if (this.state.resource_not_found) {
            return (<Gallery404Page />)
        }

        // If gallery not found by slug
        var g = this.state.resource;

        var image = null;
        var image_url = null;

        if (g.primary_image_resource) {
            image_url = g.primary_image_resource.versions.CARD_SMALL.url;
            image = <img src={image_url} className="img-responsive" />
        }

        return <div className="row">
            <div className="col-md-6">

            { image }
            <br />

                <div className="row">
                    <div className="col-md-4">
                        <img src="http://placehold.it/350x350" className="img-responsive" />
                    </div>
                    <div className="col-md-8">




                        <p>Type: { g.category }</p>


                        <p>{ g.content }</p>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <br />
                        { /* <MapComponent gallery={g} /> */ }
                        <pre>{ JSON.stringify(g) }</pre>
                    </div>
                </div>
            </div>
            <div className="col-md-6">

                <h2>{g.name}</h2>
                <p>{ g.address } { g.address2 } -  { g.city }</p>

                <p>{ g.summary }</p>

                <h3>Upcoming Events</h3>
                <ul>
                    <li>Event 1</li>
                    <li>Event 2</li>
                </ul>
                ..Previous Events

                <h3>Hours</h3>
                <p>
                  From 10:00 to 18:00
                </p>
                <h3>Contact</h3>
                <p>Phone: { g.phone }</p>
                <p>Email: { g.email }</p>
                <p>Website: { g.website }</p>


            </div>
        </div>;

    }
});


var GalleryPage = React.createClass({
    mixins: [PageMixin, Reflux.ListenerMixin],

    default_meta: {
        'title': 'Galleries',
        'description': 'Galleries in Minneapolis and St. Paul'
    },


    /* React Life Cycle Methods */
    getInitialState: function () {
        return {
            galleries: [],
        }
    },

    pageDidMount: function () {
        // Subscribe to desired actions
        this.listenTo(VenueStores.VenueStore, this.onRequestAll);

        // Trigger the load action to set the intial data for the page
        this.requestPageContent();
    },

    /* Flux Store Listener Callbacks */
    requestPageContent: function() {
        /* Render a fresh page based on url params.
            For now, this just means getting a new event.
            Tell the Actions you need the Event from the store */
        /* This is called pageDidMount and componentWillReceiveProps */

        // Trigger the load action
        VenueActions.requestAll();
    },

    onRequestAll: function(payload) {
        // EventStore triggered a new event coming in

        var state_venues = [];

        // payload is a map of updated venues, so we ignore if we want or not
        for (var resource_id in payload) {
            state_venues.push(payload[resource_id]);
        }

        this.setState({galleries: state_venues});
    },

    render: function() {

        var rendered_galleries = [];
        var rc = this;

        if (this.state.galleries != undefined) {
            rendered_galleries = this.state.galleries.map(function (g) {
                return (
                    <li key={g.resource_id} name={g.name}>
                        <a href={'/galleries/' + g.slug} onClick={rc.getRoute}>{g.name}</a>
                    </li>
                );
            });
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <h2>Twin Cities Galleries</h2>
                    <br />
                    { rendered_galleries }
                    <li>
                        <a href="/galleries/does_not_exist" onClick={rc.getRoute}>Does Not Exist..</a>
                    </li>
                </div>
            </div>
        );

    }
});







var MapComponent = React.createClass({
    getInitialState: function () {
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
                zoom: 17
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
        return <div id="map-canvas" className="map-large"></div>
    }
});












module.exports = {
    GalleryPage: GalleryPage,
    GalleryViewPage: GalleryViewPage
};
