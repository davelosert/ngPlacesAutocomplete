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
			restrict : 'EA',
			scope    : {
				ngModel          : '=', // Query-Model
				paOnPlaceReady   : '=',  // Callback for ready Details
				paOptions        : '=?' // Options for autocomplete
			},
			link     : function (scope, element, attributes) {
				if (!angular.isFunction(scope.paOnPlaceReady)) {
					throw new Error(moduleString + 'paOnPlaceReady needs to be a function!');
				}

				// Check if google maps is set
				if (!google.maps || !google.maps.places) {
					throw new Error(moduleString + 'Google Places Service not found!');
				}

				// Instantaite the autocompleteion feature on the current element
				var autocomplete = new google.maps.places.Autocomplete(element[0], {});

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

				/**
				 * On place_changed event
 				 */
				google.maps.event.addListener(autocomplete, 'place_changed', function () {
					scope.$apply(function () {
						scope.paOnPlaceReady(autocomplete.getPlace());
					});
				});

				scope.$watch('paOptions', function () {
					setOptions();
				}, true);
			}
		};
	});