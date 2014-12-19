mainApp.directive('socialMetaTags', function() {
    /* Simple */

  tpl = '<div>\
\n\
<!-- Place this data between the <head> tags of your website -->\n\
<meta name="description" content="{{ pagemeta.description }}" />\n\
<meta name="keywords" content="{{ pagemeta.keywords }} minneapolis art, minneapolis events, st. paul art, st. paul art openings" />\n\
\n\
<!-- Google Authorship and Publisher Markup -->\n\
<link rel="author" href="https://plus.google.com/[Google+_Profile]/posts"/>\n\
<link rel="publisher" href=”https://plus.google.com/[Google+_Page_Profile]"/>\n\
\n\
<!-- Schema.org markup for Google+ -->\n\
<meta itemprop="name" content="{{ pagemeta.title }} | mplsart.com">\n\
<meta itemprop="description" content="{{ pagemeta.description }}">\n\
<meta itemprop="image" content="{{ pagemeta.image }}">\n\
 \n\
<!-- Twitter Card data -->\n\
<meta name="twitter:card" content="summary_large_image">\n\
<meta name="twitter:site" content="@mplsart">\n\
<meta name="twitter:title" content="{{ pagemeta.title }} | mplsart.com">\n\
<meta name="twitter:description" content="{{ pagemeta.description }}">\n\
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


mainApp.controller('TempMainPageController', function($scope, $location, $http, $routeParams, $rootScope) {
    
    
    $rootScope.pagemeta = {
        title: 'returning soon ...',
        description: 'The Very Best Events and Gallery Listings for Minneapolis',
        keywords: 'minneapolis, twin cities, art, galleries, scene, painting, visual arts, drawing, purchase, coffee shop, shows, exhibition'
    }
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

    var ajax = $http.get('/api/galleries?get_by_slug=' + $routeParams.slug);
    ajax.success(function(payload) {
       $scope.gallery = payload.results;
       $scope.api_data = angular.toJson(payload, true);

       $rootScope.pagemeta = {
           title: $scope.gallery.name,
           description: $scope.gallery.name,
           keywords: 'some, key, words'
       }

     });

     ajax.error(function(payload){
       $scope.api_data = angular.toJson(payload, true);
     });


});


mainApp.controller('TempWrittenArticleController', function($scope, $location, $http, $routeParams, $rootScope) {
    // For now this only sets the content of the meta tags
    console.log($routeParams);
    
    $scope.hamburger = 'laptop';
    
    $rootScope.pagemeta = {
        title: 'Cheeseburger',
        description: 'This is a story, of a lovely lady...',
        keywords: 'some, key, words'
    }

});
