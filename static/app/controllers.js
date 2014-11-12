mainApp.controller('TempMainPageController', function($scope, $location, $http) {
    
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
mainApp.controller('GalleryDetailCtrl', function($scope, $location, $http, $routeParams) {
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