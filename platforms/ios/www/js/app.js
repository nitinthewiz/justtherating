// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.controller('MovieController', function($scope, $http, Movies)
{
	console.log("initialized");
	$scope.searchmovie = 'no';
	$scope.showloader = "no";
	// $scope.theinput.yoursearch = '';

	$scope.postDataChange = function(){
		console.log("here");
		console.log($scope.theinput.yoursearch.length);
		if ($scope.theinput.yoursearch.length >= 3){
			$scope.search();
		}
	};

	$scope.search = function(){
		$scope.showloader = "yes";
		//console.log('clicked');
		Movies.get($scope.theinput.yoursearch)
		 .success(function(data) {
			// console.log(data);
			
			var searchData = data['Search'];
			
			for ( var i = 0; i < data['Search'].length; i++) {
				// var obj = data['Search'][i];
				// console.log(obj);
				Movies.getDetails(data['Search'][i].imdbID)
				 .success(function(datum){
					// console.log(datum);
					for ( var i = 0; i < searchData.length; i++) {
						if (searchData[i].imdbID==datum['imdbID']){
							searchData[i].runtime = datum['Runtime'];
							searchData[i].imdbRating = datum['imdbRating'];
							searchData[i].genre = datum['Genre'];
							searchData[i].plot = datum['Plot'];
							searchData[i].votes = datum['imdbVotes']; 
						}
					}
				});
				// data['Search'][i].poop = "poop";
			}
			
			console.log("setting scope");
			$scope.searchmovie = 'yes';
			$scope.items = searchData;

			// $scope.title = data['Title'];
			// $scope.year = data['Year'];
			// $scope.runtime = data['Runtime'];
			// $scope.genre = data['Genre'];
			// $scope.imdbRating = data['imdbRating'];
			// $scope.director = data['Director'];
			// $scope.actors = data['Actors'];
			// $scope.language = data['Language'];
			// $scope.country = data['Country'];
			// $scope.awards = data['Awards'];
			// $scope.writer = data['Writer'];
			// $scope.plot = data['Plot'];
			// $scope.poster = data['Poster'];
			// $scope.response = data['Response'];
			// $scope.votes = data['imdbVotes'];  

				if(data['Response'] == 'False')
				{ 
					$scope.error = data['Error'];
				}
				
				$scope.showloader = "no";
		 }); 
	};

	$scope.resetText = function(){
		$scope.theinput.yoursearch='';
		$scope.searchmovie='no';
	}
})

.factory('Movies', function($http) {
	return {
		get: function(title) {
			return $http({
				url: "http://www.omdbapi.com?s="+title+"&r=json",
							method: "GET"
			}); 
		},
		getDetails: function(imdbID) {
			return $http({
				url: "http://www.omdbapi.com?i="+imdbID+"&r=json",
							method: "GET"
			}); 
		}
	}
});
