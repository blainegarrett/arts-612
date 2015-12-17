/* Public Facing Maps Components */

var React = require('react');
var GoogleMapsLoader = require('google-maps');
var linkTo = require('../../linking').linkTo;

var MapComponent = React.createClass({
    getInitialState: function () {
        return {
            gallery: this.props.gallery,
            geo: this.props.gallery.geo
        }
    },

    createPolygon: function (coords) {
        // Construct the polygon.

        var polygon = new google.maps.Polygon({
          paths: coords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#fff000',
          fillOpacity: 0.35,
          editable: false,
          draggable: false
        });

        // Attach the getBounds method since this is left of polys for Map API v3
        polygon.getBounds = function () {
            // http://stackoverflow.com/a/3082334
            var bounds = new google.maps.LatLngBounds();
            var vertices = this.getPath();

            // Iterate over the vertices.
             for (var i = 0; i < vertices.getLength(); i++) {
                 bounds.extend(vertices.getAt(i));
             }
            return bounds;
        }

        return polygon;
    },


    componentDidMount: function () {
        /* Construct Map */
        var c = this;

        /* TODO: Pull this from global settings */
        GoogleMapsLoader.KEY = 'AIzaSyB4MkGj6-uAll42KklXe3QISTIbhRoJ1Ng';
        GoogleMapsLoader.load(function(google) {
            var map, map_center, is_polygon, polygon_verticies, polygon;

            map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: { lat: 0, lng: 0},
                zoom: 15,
                scrollwheel: false
            });

            // Determine if this.state.geo is a point or polygon (list of points)
            is_polygon = false;

            if (c.state.geo && typeof(c.state.geo.push) == 'function') { // ducktype array vs. dict

                if (c.state.geo.length > 1) {
                    is_polygon = true;

                    // Create coordinates to construct the polygon
                    polygon_verticies = c.state.geo.map(function(pt, i){
                        return new google.maps.LatLng(pt.lat, pt.lon);
                    });

                    polygon = c.createPolygon(polygon_verticies); // Create polygon
                    polygon.setMap(map); // Attach Polygon to Map

                    // Center the Map based on the geometric center of the poly
                    map_center = polygon.getBounds().getCenter();
                    map.fitBounds(polygon.getBounds()); // Zoom to ensure that the bounds

                }
                else {
                    // The Coords are an array of vals but only contain one, so its really a point
                    c.state.geo = c.state.geo[0];
                }
            }

            if (!is_polygon) {
                // Switching to marker mode
                    var marker = new google.maps.Marker({
                          position: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                          map: map,
                          title: c.state.gallery.name
                });

                // Set center of map to the marker
                map_center = new google.maps.LatLng(c.state.geo.lat, c.state.geo.lon);
            }

            // Center Map
            map.setCenter(map_center);
        });
    },
    render: function () {

        return (
            <div className="map-component map-inline map-small map-overlay">
                <div className="map-canvas-container">
                    <div id="map-canvas" className="map-canvas"></div>
                </div>

                <div className="map-overlay-background">&nbsp;</div>

                <div className="map-overlay-controls-container single-overlap-action">
                    <a href={'http://maps.google.com/maps?q=' + this.state.geo[0].lat + ',' + this.state.geo[0].lon + '&zoom=14'}
                       target="_new"
                       onClick={linkTo} data-ga-category="map-interaction" data-ga-action="click" data-ga-label="open-external"
                    >
                        <div className="btn-group">Open Map <span className="fa fa-external-link"></span> </div>
                    </a>
                </div>
            </div>);
    }
    /*
    render: function () {

        return (
            <div className="map-component map-inline map-small map-overlay">
                <div className="map-canvas-container">
                    <div id="map-canvas" className="map-canvas"></div>
                </div>

                <div className="map-overlay-background">&nbsp;</div>

                <div className="map-overlay-controls-container">
                    <div className="btn-group">
                        <a href={'http://maps.google.com/maps?q=' + this.state.geo[0].lat + ',' + this.state.geo[0].lon + '&zoom=14'}
                           target="_new" className="btn btn-primary btn-lg btn-block"
                           onClick={linkTo} data-ga-category="map-interaction" data-ga-action="click" data-ga-label="open-external"
                        >Open Map</a>
                    </div>
                </div>
            </div>);
    }
    */
});

module.exports = {
    MapComponent: MapComponent
}