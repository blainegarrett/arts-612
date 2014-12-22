/*
MPLS Art Angular App
*/



var edit_venue_template = '<div class="col-md-12 panel"><react-component name="VenuesForm" props="person" /></div>';
var create_venue_template = '<div class="col-md-12 panel"><react-component name="VenuesForm" props="person"  /></div>';

var mainApp = angular.module('mainApp', ['ngRoute', 'react']);

/* Routing */
mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/admin/', {
        templateUrl: '/static/admin/partials/main.html'
      }).
      when('/admin/galleries', {
        templateUrl: '/static/admin/partials/galleries.html',
        controller: 'GalleriesListCtrl'
      }).
      when('/admin/calendar', {
        templateUrl: '/static/admin/partials/calendar.html',
        controller: 'EventListCtrl'
      }).
      when('/admin/calendar/:event_id', {
        templateUrl: '/static/admin/partials/event.html',
        controller: 'EventDetailCtrl'
      }).
      when('/admin/venues/create', {
        template: edit_venue_template,
        controller: 'VenueCreateCtrl'
      }).
      when('/admin/venues/:slug/edit', {
        template: edit_venue_template,
        controller: 'VenueEditCtrl'
      }).
      otherwise({
        templateUrl: '/static/admin/partials/404.html'
        //redirectTo: '/'
      });
  }]);

// Set HTML5 mode...
mainApp.config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
});