'use strict';
/**
 * Created by David on 03.10.14.
 */


angular.module('exampleApp', ['ngPlacesAutocomplete'])
.controller('exampleController', function ($scope, $log) {
		$scope.paDetails = {};
		$scope.placesCallback = function (error, details) {
			if(error){
				return console.error(error);
			}
			$scope.paDetails = details;
		};
	});