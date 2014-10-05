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
				'componentRestrictions' : 'setComponentRestrictions',
//				'bindTo'                : 'bindTo'
			}
			, defaultOptions = {
				'bounds'                : null,
				'types'                 : [],
				'componentRestrictions' : null,
				'bindTo'                : null
			};


		return {
			restrict : 'EA',
			scope    : {
				ngModel          : '=', // Query-Model
				paOnDetailsReady : '=',  // Callback for ready Details
				paOptions        : '=?' // Options for autocomplete
			},
			link     : function (scope, element, attributes) {
				if (scope.paOnDetailsReady && typeof scope.paOnDetailsReady !== 'function') {
					throw new Error(moduleString + 'paOnDetailsReady needs to be a function!');
				}

				// Check if google maps is set
				if (!google.maps || !google.maps.places) {
					throw new Error(moduleString + 'Google Places Service not found!');
				}

				var autocomplete = new google.maps.places.Autocomplete(element[0], {});

				function setOptions() {
					if (autocomplete) {
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


				google.maps.event.addListener(autocomplete, 'place_changed', function () {
					var result = autocomplete.getPlace();
					scope.$apply(function () {
						scope.paDetails = result;
						scope.paOnDetailsReady && scope.paOnDetailsReady(result);
					});
				});

				scope.$watch('paOptions', function () {
					setOptions();
				}, true);
			}
		};
	});