mainApp.directive('socialMetaTags', function() {
    /* Simple */

  tpl = '<div>\
  \
<h1 title="MPLS Art |  {{ pagemeta.title }}">MPLSART | Welcome</h1>\n\
\n\
<!-- Place this data between the <head> tags of your website -->\n\
<title>{{ pagemeta.title }}</title>\n\
<meta name="description" content="{{ pagemeta.description }}" />\n\
\n\
<!-- Google Authorship and Publisher Markup -->\n\
<link rel="author" href="https://plus.google.com/[Google+_Profile]/posts"/>\n\
<link rel="publisher" href=”https://plus.google.com/[Google+_Page_Profile]"/>\n\
\n\
<!-- Schema.org markup for Google+ -->\n\
<meta itemprop="name" content="{{ pagemeta.title }}">\n\
<meta itemprop="description" content="{{ pagemeta.description }}">\n\
<meta itemprop="image" content="{{ pagemeta.image }}">\n\
 \n\
<!-- Twitter Card data -->\n\
<meta name="twitter:card" content="summary_large_image">\n\
<meta name="twitter:site" content="@mplsart">\n\
<meta name="twitter:title" content="{{ pagemetal.title }}">\n\
<meta name="twitter:description" content="{{ pagemetal.description }}">\n\
<meta name="twitter:creator" content="@mplsart">\n\
<!-- Twitter summary card with large image must be at least 280x150px -->\n\
<meta name="twitter:image:src" content="{{ pagemeta.image }}">\n\
\n\
<!-- Open Graph data -->\n\
<meta property="og:title" content="Title Here" />\n\
<meta property="og:type" content="article" />\n\
<meta property="og:url" content="http://www.example.com/" />\n\
<meta property="og:image" content="http://example.com/image.jpg" />\n\
<meta property="og:description" content="Description Here" />\n\
<meta property="og:site_name" content="Site Name, i.e. Moz" />\n\
<meta property="article:published_time" content="2013-09-17T05:59:00+01:00" />\n\
<meta property="article:modified_time" content="2013-09-16T19:08:47+01:00" />\n\
<meta property="article:section" content="Article Section" />\n\
<meta property="article:tag" content="Article Tag" />\n\
<meta property="fb:admins" content="Facebook numberic ID" />\n\
\n\
\n\
  </div>';

  return {
      restrict: 'AE',
      replace: 'true',
      template: tpl
  };
});

/*
mainApp.directive('restDateRender', function() {
    // Note: This does not totally work yet... 

  return {
      scope: '@',

      template: function(elem, attr) {
          date = attr.xval;          
          console.log(date);
      }
  };
});
*/



mainApp.controller('EventListCtrl', function($scope, $location, $http) { });

mainApp.controller('EventEditCtrl', function($scope, $location, $http, $routeParams, $rootScope) {
    /* Controller for Editing a Events */
    var save_callback = function(){
      $location.path( "/admin/events/" ); 
    };

    $scope.resource_id = $routeParams.event_id;
    $scope.resource_url = '/api/events/' + $routeParams.event_id;
    $scope.form_props = { resource_url: $scope.resource_url, fname: 'Clark', lname: 'Kent', 'is_edit': true, 'save_callback': save_callback};

});


mainApp.controller('EventCreateCtrl', function($scope, $location, $http, $routeParams, $rootScope) {
    /* Controller for Creating an Event */

    var save_callback = function(){
      $location.path( "/admin/events" ); 
    };

    $scope.resource_url = '/api/events';
    $scope.form_props = { resource_url: $scope.resource_url, fname: 'Clark', lname: 'Kent', 'is_edit': false, 'save_callback': save_callback};
});




mainApp.controller('EventDetailCtrl', function($scope, $location, $http, $routeParams, $rootScope) {

    console.log($routeParams.event_id);

    var ajax = $http.get('/api/events/' + $routeParams.event_id);
    ajax.success(function(payload) {
       $scope.event = payload.results;
       $scope.api_data = angular.toJson(payload, true);

       $rootScope.pagemeta = {};
       $rootScope.pagemeta.title = $scope.event.name;
       $rootScope.pagemeta.description = 'Sweet Short Title';
       $rootScope.pagemeta.image = 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'
     });

     ajax.error(function(payload){
       $scope.api_data = angular.toJson(payload, true);
     });
});

/* Venue Details Controller */

mainApp.controller('VenueListCtrl', function($scope, $location, $http, $routeParams, $rootScope) {
    /* Controller for Listing Venues */
});

mainApp.controller('VenueEditCtrl', function($scope, $location, $http, $routeParams, $rootScope) {
    /* Controller for Editing a Venue */
    var save_callback = function(){
      $location.path( "/admin" ); 
    };

    $scope.resource_id = $routeParams.slug
    $scope.resource_url = '/api/galleries/' + $routeParams.slug;
    $scope.form_props = { resource_url: $scope.resource_url, fname: 'Clark', lname: 'Kent', 'is_edit': true, 'save_callback': save_callback};

});


mainApp.controller('VenueCreateCtrl', function($scope, $location, $http, $routeParams, $rootScope) {
    /* Controller for Creating a Venue */

    var save_callback = function(){
      $location.path( "/admin" ); 
    };
    $scope.resource_url = '/api/galleries';
    $scope.form_props = { resource_url: $scope.resource_url, fname: 'Clark', lname: 'Kent', 'is_edit': false, 'save_callback': save_callback};
});