'use strict';
/**
 * Created by David on 03.10.14.
 */


angular.module('exampleApp', ['ngPlacesAutocomplete'])
.controller('exampleController', function ($scope, $log) {
		$scope.paDetails = {};
		$scope.placesCallback = function (details) {
			$scope.paDetails = details;
		};
	});