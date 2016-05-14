var wv = angular.module('wikiViewer', ['ngRoute', 'ngResource']);

wv.config(function($routeProvider){    
    $routeProvider    
        .when('/',{
        templateUrl: 'pages/home.html',
        controller: 'homeController'
        })
        .when('/search',{
        templateUrl: 'pages/search.html',
        controller: 'searchController'
        })
        // I added this functionality so the page is going to return results when you put the string you wanna search as a parameter in the url
         .when('/search/:title',{
        templateUrl: 'pages/search.html',
        controller: 'searchController'
        })
        .otherwise({
            redirectTo: "/"
        })
});


wv.controller('mainController', ['$scope', function($scope){
    // Bump
}]);

wv.controller('homeController', ['$scope', '$location', function($scope, $location){
    // This function is called when we submit the form in our home template, it will redirect to the search page pasing the input content as a parameter in the url
    $scope.submit = function(){
        $location.path("/search/"+$scope.title);
    };
}]);

wv.controller('searchController', ['$scope', '$routeParams', 'resultsService', function($scope, $routeParams, resultsService){
    // We get our string from the url
	$scope.title = $routeParams.title;
    // And we make our query using wikipedia's API
    $scope.searchResult = resultsService.getResults($scope.title);
}]);

wv.service('resultsService', ['$resource', function($resource){

    //This service will set the conection to the API up and will return a query with the provided string
	this.getResults = function(string){
        // Theese parameters will get us the page id, an extract of the first sentence and the title
	 	var wikiAPI = $resource("https://en.wikipedia.org/w/api.php?action=query&generator=search&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max", {
	    	callback: "JSON_CALLBACK" }, {get: {method: "JSONP"}}); // So we don't get origin issues

	    return wikiAPI.get({format: "json", gsrsearch: string, utf8: 1}); // We return the query results
	};
}]);


// This directive contains the content of the entry (title and first sentence extract)
wv.directive("searchResult", function(){
   return {
       restrict: 'E',
       templateUrl: 'directives/searchResult.html',
       replace: true
    }
});
