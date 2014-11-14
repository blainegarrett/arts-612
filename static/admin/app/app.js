/*
MPLS Art Angular App
*/

var mainApp = angular.module('mainApp', ['ngRoute']);

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
      when('/admin/galleries/:slug', {
        templateUrl: '/static/admin/partials/gallery_detail.html',
        controller: 'GalleryDetailCtrl'
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