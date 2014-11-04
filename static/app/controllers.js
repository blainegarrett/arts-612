mainApp.controller('BeerCounter', function($scope, $locale) {
  $scope.beers = [0, 1, 2, 3, 4, 5, 6];
  if ($locale.id == 'en-us') {
    $scope.beerForms = {
      0: 'no beers',
      one: '{} beer',
      other: '{} beers'
    };
  } else {
    $scope.beerForms = {
      0: 'žiadne pivo',
      one: '{} pivo',
      few: '{} pivá',
      other: '{} pív'
    };
  }
});



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
 //'<textarea style="width:100%; height:500px;"><h3>{{ pagemeta.title }}</h3>'
  //return {
//      restrict: 'AE',
//      replace: 'true',
//      template: tpl
//  };
});


/* Gallery Listing Controller */
mainApp.controller('GalleriesListCtrl', function($scope, $location, $http) {
    
    // Attempt to load a listing of galleries
    var ajax = $http.get('/api/galleries');
    ajax.success(function(payload) {
       $scope.galleries = payload.results;
       $scope.api_data = angular.toJson(payload, true);
     });
     ajax.error(function(){
       $scope.api_data = angular.toJson(payload, true);
     });
    
    /*
    $scope.galleries = [
        {name:'Abstracted Gallery', slug: 'abstracted'},
        {name:'Soap Factory', slug: 'soap-factory'},
        {name:'Gallery 13', slug: 'gallery13'},
        {name:'Public Functionary', slug: 'public-functionary'},
        {name:'Shoebox Gallery', slug: 'shoebox-gallery'}
    ];
    */

    $scope.show_gallery = function ( path ) {
        console.log('setting route to ' + path);
        $location.url( path );
        return false;
    };
});


/* Gallery Details Controller */

mainApp.controller('GalleryDetailCtrl', function($scope, $location, $http, $routeParams, $rootScope) {

    console.log($routeParams.slug);

    var ajax = $http.get('/api/galleries/' + $routeParams.slug);
    ajax.success(function(payload) {
       $scope.gallery = payload.results;
       $scope.api_data = angular.toJson(payload, true);
     });

     ajax.error(function(payload){
       $scope.api_data = angular.toJson(payload, true);
     });

    /*$scope.gallery = {
        name:'Abstracted Gallery', slug: 'abstracted', 'description': 'This place is rad as shit...'
    };
    */

})