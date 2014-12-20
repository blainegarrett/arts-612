/*
MPLS Art Angular App
*/
var mainApp = angular.module('mainApp', ['ngRoute', 'react']);

/* Routing */
mainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/partials/main.html',
        controller: 'TempMainPageController'
      }).
      otherwise({
        templateUrl: '/static/partials/main.html',
        controller: 'TempMainPageController'
      });
  }]);


  mainApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/galleries', {
          templateUrl: '/static/partials/galleries.html',
          controller: 'GalleriesListCtrl'
        }).
        when('/calendar', {
          templateUrl: '/static/partials/calendar.html'
        }).
        when('/galleries/:slug', {
          templateUrl: '/static/partials/gallery_detail.html',
          controller: 'GalleryDetailCtrl'
        })
    }]);



  mainApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
        when('/written/', {
          templateUrl: '/static/partials/written_home.html',
          controller: 'TempMainPageController'
        }).
        when('/written/:year/:month/:slug', {
          templateUrl: '/static/partials/written_article.html',
          controller: 'TempWrittenArticleController'
        })
    }]);






// Set HTML5 mode...
mainApp.config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
});