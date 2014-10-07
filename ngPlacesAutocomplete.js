'use strict';
/**
 * Created by David on 03.10.14.
 */


angular.module('ngPlacesAutocomplete', [])
	.directive('ngPlacesAutocomplete', function () {
		var moduleString = '[ngPlacesAutocomplete] - ' // ModuleString is used for Errors for better identification
			// We dont give the options object but use the functions to be more flexible
			, optionNameToFunc = {
				'bounds'                : 'setBounds',
				'types'                 : 'setTypes',
				'componentRestrictions' : 'setComponentRestrictions'
//				'bindTo'                : 'bindTo'
			}
			, defaultOptions = {
				'bounds'                : null,
				'types'                 : [],
				'componentRestrictions' : null,
				'bindTo'                : null
			};


		return {
			restrict   : 'A',
			scope      : {
				ngModel        : '=', // Query-Model
				paOnPlaceReady : '=',  // Callback for ready Details
				paOptions      : '=?' // Options for autocomplete
			},
			controller : function ($scope) {
				if (!angular.isFunction($scope.paOnPlaceReady)) {
					throw new Error(moduleString + 'paOnPlaceReady needs to be a function!');
				}

				// Check if google maps is set
				if (!google.maps || !google.maps.places) {
					throw new Error(moduleString + 'Google Places Service not found!');
				}

				var acService = new google.maps.places.AutocompleteService(),
					// we need a dummy div since the placesService needs an HTML Element (usually a map) to be instantiated
					dummyDiv = angular.element('<div>')[0],
					placesService = new google.maps.places.PlacesService(dummyDiv);

				/**
				 * Manual search bound to controller so it can get executed
				 */
				this.manualSearch = function () {
					var queryObject = angular.extend({
						input : $scope.ngModel
					}, $scope.paOptions);

					acService.getPlacePredictions(queryObject, function (predictionResults) {
						if (!predictionResults || predictionResults.length == 0) {
							return $scope.onDetailsReady(null);
						}
						placesService.getDetails({placeId : predictionResults[0].place_id}, function (place, status) {
							if (status == google.maps.places.PlacesServiceStatus.OK
								|| status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
								$scope.paOnPlaceReady(null, place);
							}
							else {
								$scope.paOnPlaceReady(new Error(moduleString + 'Places returned status: "' + status + '"'));
							}
							$scope.$apply();
						});
					});
				};
			},
			link       : function (scope, element, attributes, controller) {
				// Instantiate the autocompleteion feature on the current element
				var autocomplete = new google.maps.places.Autocomplete(element[0], {});

				/**
				 * On place_changed event
				 */
				google.maps.event.addListener(autocomplete, 'place_changed', function () {
					scope.$apply(function () {
						var result = autocomplete.getPlace();
						result.address_components ? scope.paOnPlaceReady(null, result) : controller.manualSearch();
					});
				});

				/**
				 * Function to set Options to the autocomplete-instance.
				 * It always copies the defaultOptions properties and extends/overwrites this with the options
				 * given (if any). Then it uses the optionNameToFunc for every option to correctly set the option
				 * on the autocomplete feature.
				 */
				function setOptions() {
					if (autocomplete) {
						// Copy the default options and extend the current options.
						scope.paOptions = angular.extend(angular.copy(defaultOptions), scope.paOptions);
						angular.forEach(optionNameToFunc, function (funcName, key) {
							var value = scope.paOptions[key] || undefined;

							// todo not working yet
//							if (key === 'bindTo') {
//								autocomplete.bindTo('bounds', value);
//							}

							// Use the optionNameToFunc to use the right function to set the option
							autocomplete[funcName](value);
						});
					}
				}

				scope.$watch('paOptions', function () {
					setOptions();
				}, true);
			}
		};
	});
