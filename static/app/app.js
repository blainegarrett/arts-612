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

// Set HTML5 mode...
mainApp.config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
});