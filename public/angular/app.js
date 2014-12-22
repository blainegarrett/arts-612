/*
MPLS Art Angular App
*/

var mainApp = angular.module('mainApp', ['ngRoute', 'react']);

/* Routing */
mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/app', {
        template: '<react-component name="HomePage" />'
      }).
      when('/app/galleries', {
        template: '<react-component name="GalleryPage" />'
      }).
      when('/app/calendar', {
        template: '<react-component name="CalendarPage" />'
      }).
      when('/app/calendar/:event_id', {
        templateUrl: '/static/partials/event.html',
        controller: 'EventDetailCtrl'
      }).
      when('/app/galleries/:slug', {
        templateUrl: '/static/partials/gallery_detail.html',
        controller: 'GalleryDetailCtrl'
      }).
      otherwise({
        templateUrl: '/static/partials/main.html'
        //redirectTo: '/'
      });
  }]);

// Set HTML5 mode...
mainApp.config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
});