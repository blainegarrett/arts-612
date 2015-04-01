var React = require('react');
var GoogleMapsLoader = require('google-maps');

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
        return <div id="map-canvas" className="map-small"></div>
    }
});

module.exports = {
    MapComponent: MapComponent
}