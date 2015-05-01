var React = require('react');
var GoogleMapsLoader = require('google-maps');

global.googlemapapi = null;

GoogleMapsLoader.KEY = 'AIzaSyB4MkGj6-uAll42KklXe3QISTIbhRoJ1Ng';
GoogleMapsLoader.load(function(google) {
    global.googlemapapi = google;
});


var MapComponent2 = React.createClass({
    getInitialState: function() {

        var myLatlng;
        if (this.props.geo && this.props.geo.lat) {
            myLatlng = new global.googlemapapi.maps.LatLng(this.props.geo.lat, this.props.geo.lon)
        }
        else {
            myLatlng = new global.googlemapapi.maps.LatLng(44.95881500000001, -93.23813799999999);            
        }

        var marker = new global.googlemapapi.maps.Marker({
            position: myLatlng
        });

        return {
            mapDomId: 'map-canvas',
            mapObj: null,
            markers: [marker],
            center: myLatlng
        };
    },

    componentDidMount: function () {
        var rc = this;

        // Load the map

        // TODO: What if it isn't an array pair?
        var mapOptions = {
            zoom: 12,
            center: rc.state.center
        }
        var map = new global.googlemapapi.maps.Map(document.getElementById(rc.state.mapDomId), mapOptions);
        rc.setState({mapObj: map});

    },
    
    showOnlyMarker: function (marker) {

        for (i in this.state.markers) {
            this.state.markers[i].setMap(null);
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

    render: function(){
        
        if (this.state.markers) {
            var mapObj = this.state.mapObj;
            for (var i = 0; i < this.state.markers.length; i++ ) {
                this.state.markers[i].setMap(mapObj);
              }

        }
        return <div id={ this.state.mapDomId } className="map-large"></div>
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
        return <div id='map-canvas' className="map-small"></div>
    }
});

module.exports = {
    MapComponent: MapComponent,
    MapComponent2: MapComponent2
}