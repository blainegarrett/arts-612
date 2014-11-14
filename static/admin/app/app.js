/*
MPLS Art Angular App
*/
var mainApp = angular.module('mainApp', ['ngRoute']);

/* Routing */
mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/admin/partials/maixxxn.html'
      }).
      when('/galleries', {
        templateUrl: '/static/admin/partials/galleries.html',
        controller: 'GalleriesListCtrl'
      }).
      when('/calendar', {
        templateUrl: '/static/admin/partials/calendar.html',
        controller: 'EventListCtrl'
      }).
      when('/calendar/:event_id', {
        templateUrl: '/static/admin/partials/event.html',
        controller: 'EventDetailCtrl'
      }).
      when('/galleries/:slug', {
        templateUrl: '/static/admin/partials/gallery_detail.html',
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