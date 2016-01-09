var React = require('react');
var GoogleMapsLoader = require('google-maps');

global.googlemapapi = null;

GoogleMapsLoader.KEY = 'AIzaSyB4MkGj6-uAll42KklXe3QISTIbhRoJ1Ng';
GoogleMapsLoader.load(function(google) {
    global.googlemapapi = google;
});


var MapComponent2 = React.createClass({

    addPolygon: function (coords) {
        // Construct the polygon.
        bermudaTriangle = new google.maps.Polygon({
          paths: coords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#fff000',
          fillOpacity: 0.35,
          editable: true,
          draggable:false
        });


        bermudaTriangle.getBounds = function() {
            // http://stackoverflow.com/a/3082334
            var bounds = new global.googlemapapi.maps.LatLngBounds();

            var i;
            for (i = 0; i < coords.length; i++) {
              bounds.extend(coords[i]);
            }


            return bounds;
        }


        // Bind Event Handlers
        var rc = this;
        global.googlemapapi.maps.event.addListener(bermudaTriangle, 'click', function (e) {
            var map = rc.state.mapObj;
            rc.state.click_callback(e.latLng)
            map.setCenter(e.latLng);
        });

        global.googlemapapi.maps.event.addListener(bermudaTriangle, 'mouseup', function (e) {
            // Set the state
            var map = rc.state.mapObj;

            rc.state.click_callback(this.getPath().getArray());
        });

        //map.setCenter(e.latLng);
        //bermudaTriangle.setMap(map);
        //rc.showOnlyMarker(bermudaTriangle);
        return bermudaTriangle;
    },

    getInitialState: function() {

        var myLatlng;
        var markers = [];
        var polygons = [];

        var address_mode = true;

        if (this.props.geo && typeof(this.props.geo.push) == 'function') { // ducktype array vs. dict
            if (this.props.geo.length > 1) {
                address_mode = false;


                var triangleCoords = this.props.geo.map(function(pt, i){
                    return new global.googlemapapi.maps.LatLng(pt.lat, pt.lon);
                })

                bermudaTriangle = this.addPolygon(triangleCoords);

                var myLatlng = bermudaTriangle.getBounds().getCenter(); // Should be geometric center

                markers = [];
                polygons = [bermudaTriangle];
            }
            else {
                // Assume it is a single point
                myLatlng = new global.googlemapapi.maps.LatLng(this.props.geo[0].lat, this.props.geo[0].lon);
                var marker = new global.googlemapapi.maps.Marker({
                    position: myLatlng
                });

                markers = [marker];
                polygons = [];
            }

        }
        else {

            if (this.props.geo && this.props.geo.lat) {
                myLatlng = new global.googlemapapi.maps.LatLng(this.props.geo.lat, this.props.geo.lon)
            }
            else {
                myLatlng = new global.googlemapapi.maps.LatLng(44.95881500000001, -93.23813799999999);
            }

            var marker = new global.googlemapapi.maps.Marker({
                position: myLatlng
            });

            markers = [marker];
        }

        return {
            address_mode: address_mode,
            click_callback: this.props.click_callback,
            mapDomId: 'map-canvas',
            mapObj: null,
            markers: markers,
            polygons: polygons,
            center: myLatlng
        };
    },

    componentDidMount: function () {
        var rc = this;

        // Load the map

        // TODO: What if it isn't an array pair?

        var mapOptions = { zoom: 16, center: rc.state.center };
        var map = new global.googlemapapi.maps.Map(document.getElementById(rc.state.mapDomId), mapOptions);
        rc.setState({mapObj: map});

        // Map Event Handlers
        global.googlemapapi.maps.event.addListener(map, 'click', function (e) {
            /* Is there already something on the map */


            // If in address mode, lets set a marker and be done with it...
            if (rc.state.address_mode) {
                rc.state.click_callback(e.latLng)
                var marker = new google.maps.Marker({
                    position: e.latLng,
                });

                rc.showOnlyMarker(marker);
            }
            else {

                // Area Mode

                // Add a min polygon to the map

                var clicked_latlng = e.latLng;
                var clicked_lat = e.latLng.lat();
                var clicked_lng = e.latLng.lng();
                var thresh = 0.001; // This might be based on zoom?

                var triangleCoords = [
                  new google.maps.LatLng(clicked_lat + thresh, clicked_lng - thresh), //TL
                  new google.maps.LatLng(clicked_lat + thresh, clicked_lng + thresh), //TR
                  new google.maps.LatLng(clicked_lat - thresh, clicked_lng + thresh), //BR
                  new google.maps.LatLng(clicked_lat - thresh, clicked_lng - thresh), //BL
                ];

                var bermudaTriangle = rc.addPolygon(triangleCoords);

                map.setCenter(e.latLng);
                bermudaTriangle.setMap(map);
                rc.showOnlyMarker(bermudaTriangle);

                rc.state.click_callback(e.latLng);

                // TODO: Show only this polygon

            }

        })
    },
    mode_change_handler: function(e) {


        for (i in this.state.markers) {
            this.state.markers[i].setMap(null);
        };

        var address_mode = !(e.target.value == 'area');
        this.setState({address_mode: address_mode, markers: []});

    },
    showOnlyPolygon: function(polygon) {
        for (i in this.state.markers) {
            this.state.markers[i].setMap(null);
        };
        for (i in this.state.polygons) {
            this.state.polygons[i].setMap(null);
        };

        this.setState({polygons: [polygon]});
    },

    showOnlyMarker: function (marker) {

        for (i in this.state.markers) {
            this.state.markers[i].setMap(null);
        };

        for (i in this.state.polygons) {
            this.state.polygons[i].setMap(null);
        };

        this.setState({markers: [marker]});
    },

    search_by_address: function (search_address, callback) {

        var rc = this;

        var geocoder = new global.googlemapapi.maps.Geocoder();

        geocoder.geocode( { 'address': search_address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var geo = results[0].geometry.location;
                var raw_geo_str = geo.toString()

                raw_geo_str = raw_geo_str.replace(')', '').replace('(', '')

                //rc.refs['field.geo'].setValue(raw_geo_str);

                rc.state.mapObj.setCenter(results[0].geometry.location);

                var marker = new google.maps.Marker({
                    position: results[0].geometry.location
                });

                rc.showOnlyMarker(marker)

                callback(results[0].geometry.location);
            }
            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });


    },

    render: function() {

        var mapObj = this.state.mapObj;
        if (this.state.markers) {
            for (var i = 0; i < this.state.markers.length; i++ ) {
                this.state.markers[i].setMap(mapObj);
              }
        }

        if (this.state.polygons) {
            for (var i = 0; i < this.state.polygons.length; i++ ) {
                this.state.polygons[i].setMap(mapObj);
              }
        }

        var address_mode_classes = 'btn';
        var area_mode_classes = 'btn';

        if (this.state.address_mode){
            address_mode_classes +=' active';
        }
        else {
            area_mode_classes += ' active';
        }


        return <div>
        <div className="btn-group" data-toggle="buttons">
          <label className={address_mode_classes}>
            <input type="radio" name="map_mode" id="option1" value="address" autoComplete="off" checked={this.state.address_mode} onChange={ this.mode_change_handler} />
            <span className="glyphicon glyphicon-map-marker"></span>
             Address
          </label>
          <label className={area_mode_classes}>
            <input type="radio" name="map_mode" id="option2" value="area" autoComplete="off" checked={!this.state.address_mode} onChange={ this.mode_change_handler}/>
            <span className="glyphicon glyphicon-screenshot"></span>
            Area
          </label>

        </div>




            <div className="map-component map-inline map-large map-overlay">
                <div className="map-canvas-container">
                    <div id={ this.state.mapDomId } className="map-canvas">

                    </div>
                </div>
            </div>




        </div>
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
                zoom: 15
            });

            var marker = new google.maps.Marker({
                  position: { lat: c.state.geo.lat, lng: c.state.geo.lon},
                  map: map,
                  title: c.state.gallery.name
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
              //infowindow.open(map, marker);



        });
    },
    render: function () {
        // This is deprecated: remove eventually...
        return (
            <div className="map-component map-inline map-small map-overlay">
                <div className="map-canvas-container">
                    <div id="map-canvas" className="map-canvas">

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = {
    MapComponent: MapComponent,
    MapComponent2: MapComponent2
}