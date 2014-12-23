var React = require('react');
var ReactRouter = require('flux-react-router');
var PageMixin = require('./PageMixin');
var GoogleMapsLoader = require('google-maps');

var Gallery404Page = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Gallery Not Found',
        'description': 'The Gallery You Are Looking for Could Not Be Found.'
    },
    componentDidMount: function () {
        this.setMeta();
    },
    render: function() {
        return <div>
        <h2>Gallery not found...</h2>
        
        <br /><br/>
        <a onClick={ReactRouter.deferTo('/galleries')}>Return to Galleries Listing</a>
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
                zoom: 15
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
                         '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae porttitor felis. Cras sit amet interdum dolor.</p>'+
                         //'<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                         //'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                         //'(last visited June 22, 2009).</p>'+
                         '</div>'+
                         '</div>'
               });
              infowindow.open(map,marker); 
            
        });        
    },
    render: function () {
        return <div id="map-canvas"></div>
    }
});

var GalleryViewPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Galleries',
        'description': 'Galleries in Minneapolis and St. Paul'
    },
    getInitialState: function () {
        console.log(this.props);
        return {
            gallery: null,
            slug: this.props.slug,
            not_found: false,
            resource_url: '/api/galleries?get_by_slug=' + this.props.slug
            
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
                    description: 'A super awesome gallery in mpls'
                }


                this.setMeta();
                this.setState({gallery: data.results});
                

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());

                this.default_meta = {
                    title: 'gallery not found',
                    description: 'This gallery could not be found'
                }

                this.setMeta();
                this.setState({not_found: true, gallery:true});
                
            }.bind(this)
            
        });
    },

    default_meta: {
        'title': 'Galleries',
        'description': 'These are some galleries.'
    },

    render: function() {
        console.log('rendering the gallery?');
        console.log(this.state);

        // If no data loaded
        if (!(this.state.gallery) == true) {
            // TODO: Render a shell of what the page will look like
            return <div>loading gallery...</div>
        }
        
        if (this.state.not_found) {
            return <Gallery404Page slug={ this.state.slug } />
        }
        
        // If gallery not found by slug
        var g = this.state.gallery;

        return <div className="row">
            <div className="col-md-8 panel-events">
                <div className="row">
                    <div className="col-md-4">
                        <img src="http://placehold.it/350x350" className="img-responsive" />
                    </div>
                    <div className="col-md-8">
                        <h2>{g.name}</h2>
                        <p>{ g.address } { g.address2 } -  { g.city }</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae porttitor felis. Cras sit amet interdum dolor. Integer ut condimentum nibh. Praesent tristique tincidunt molestie. Aenean et justo placerat, suscipit mauris nec, lobortis mauris. Cras pulvina eget varius lectus commodo et. Donec iaculis orci quis sapien venenatis finibus.</p>

                        <p>Type: { g.category }</p>

                    </div>
                </div>
                
                <div className="row">
                    <div className="col-md-12">
                        <br />
                        <MapComponent gallery={g} />
                        <pre>{ JSON.stringify(g) }</pre>
                    </div>
                </div>
            </div>
            <div className="col-md-4 panel-events">
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
                
                
                <h3>Photos</h3>
                <img src="http://placehold.it/350x350" className="img-responsive" />
                <img src="http://placehold.it/350x350" className="img-responsive" />
                <img src="http://placehold.it/350x350" className="img-responsive" />
                <img src="http://placehold.it/350x350" className="img-responsive" />                
            </div>
        </div>;

    }
});
module.exports = GalleryViewPage;
