'use strict';
/**
 * Created by David on 03.10.14.
 */


angular.module('exampleApp', ['ngPlacesAutocomplete'])
	.controller('exampleController', function ($scope, $log) {
		$scope.query = "";
		$scope.paOptions = {
			updateModel : true
		};
		$scope.paTrigger = {};
		$scope.paDetails = {};
		$scope.placesCallback = function (error, details) {
            console.log($scope.query);
			if (error) {
				return console.error(error);
			}
			$scope.paDetails = details;
		};
	});