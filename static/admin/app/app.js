/*
MPLS Art Angular App
*/


var admin_home_template = '<div class="col-md-12 panel"><h2>Hello!</h2><p> This is the super temporary admin page. It\'ll get better. I swear.</p><ul><li><a href="/admin/venues/">Manage Venues</a></li><li><a href="/admin/events/">Managed Events</a></li></ul></div>';

var edit_event_template = '<div class="col-md-12 panel"><react-component name="EventsForm" props="form_props" /></div>';

var edit_venue_template = '<div class="col-md-12 panel"><react-component name="VenuesForm" props="form_props" /></div>';
var create_venue_template = '<div class="col-md-12 panel"><react-component name="VenuesForm" props="form_props"  /></div>';
var list_venues_template = '<div class="col-md-12 panel"><react-component name="VenuesGrid" /></div>';

var list_calendar_template = '<div class="col-md-12 panel"><react-component name="EventsGrid" /></div>';

var mainApp = angular.module('mainApp', ['ngRoute', 'react']);

/* Routing */
mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/admin/', {
        template: admin_home_template
      }).
      when('/admin/galleries', {
        templateUrl: '/static/admin/partials/galleries.html',
        controller: 'GalleriesListCtrl'
      }).
      when('/admin/events', {
        template: list_calendar_template,
        controller: 'EventListCtrl'
      }).
      when('/admin/events/create', {
        template: edit_event_template,
        controller: 'EventCreateCtrl'
      }).
      when('/admin/events/:event_id/edit', {
        template: edit_event_template,
        controller: 'EventEditCtrl'
      }).
      when('/admin/venues/', {
        template: list_venues_template,
        controller: 'VenueListCtrl'
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