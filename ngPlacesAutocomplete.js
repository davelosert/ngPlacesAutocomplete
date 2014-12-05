'use strict';
/**
 * Created by David on 03.10.14.
 */


angular.module('ngPlacesAutocomplete', [])
    .directive('ngPlacesAutocomplete', function () {
        var moduleString = '[ngPlacesAutocomplete] - ' // ModuleString is used for Errors for better identification
        // Mapping from the actual optins object to the functions to set them on the autocomplete
            , optionNameToFunc = {
                'bounds': 'setBounds',
                'types': 'setTypes',
                'componentRestrictions': 'setComponentRestrictions'
//				'bindTo'                : 'bindTo'
            }
            , defaultOptions = {
                'bounds': null,
                'types': [],
                'componentRestrictions': null,
                'bindTo': null,
                'updateModel': false,
                'watchOptions': false,
                'preventSubmit': true
            };


        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                paOnPlaceReady: '=',  // Callback for ready Details
                paOptions: '=?', // Options for autocomplete
                paTrigger: '=?'
            },
            link: function (scope, element, attributes, ngModel) {
                // Do some dirty checking to inform the user if the setup is wrong
                if (!angular.isFunction(scope.paOnPlaceReady)) {
                    throw new Error(moduleString + 'paOnPlaceReady needs to be a function!');
                }

                // Check if google maps is set
                if (!google.maps || !google.maps.places) {
                    throw new Error(moduleString + 'Google Places Service not found!');
                }

                // Instantiate the autocompleteion feature on the current element
                var autocomplete = new google.maps.places.Autocomplete(element[0], {}),
                    acService = new google.maps.places.AutocompleteService(), // acService needed to manual search
                    dummyDiv = angular.element('<div>')[0], // we need a dummy div since the placesService needs an HTML Element (usually a map) to be instantiated
                    placesService = new google.maps.places.PlacesService(dummyDiv); // PlacesService needed for detailed search

                /**
                 * On place_changed event either send the result if any, or execute a manual-search
                 */
                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                    element[0].blur();
                    var result = autocomplete.getPlace();
                    if (result.address_components) {
                        scope.$apply(function () {
                            // An empty search just returns an object with on property "name" which contains the used query:
                            // { name: <query> } - so only if there is the address_components field it means we have an actual result
                            if (scope.paOptions.updateModel) {
                                ngModel.$setViewValue(result.formatted_address);
//                                ngModel.$render();
                            }
                            scope.paOnPlaceReady(null, result);
                        });
                    }
                    else {
                        manualSearch();
                    }
                });

                /**
                 * The manual search first uses the Autocomplete-Service to get Place-Predictions. We could also use the
                 * PlacesService.textSearch here, but the problem is that it doesnt support (yet?) the same options as
                 * autocompletion (especially the componentRestriction to a country). We then take the first prediction
                 * if any and use the PlacesService to do a detailed search about it.
                 *
                 * Credit for this idea actually goes to "wpalahnuk" who did this in his ngAutocomplete-Directive
                 * (https://github.com/wpalahnuk/ngAutocomplete)
                 */
                var manualSearch = function () {
                    element[0].blur();
                    if (!ngModel.$viewValue) {
                        scope.paOnPlaceReady(null);
                    }
                    // Create the query object by using the viewValue
                    var queryObject = angular.extend({
                        input: ngModel.$viewValue
                    }, scope.paOptions);

                    acService.getPlacePredictions(queryObject, function (predictionResults) {
                        // If there is no result
                        if (!predictionResults || predictionResults.length === 0) {
                            return scope.$apply(function () {
                                scope.paOnPlaceReady(null);
                            });
                        }
                        detailSearch(predictionResults[0].place_id);
                    });
                };

                /**
                 * The detailSearch takes a placeId (as specified by the google-places-api) and returns a result-object
                 * with all the information we need.
                 * @param placeId
                 */
                var detailSearch = function (placeId) {
                    placesService.getDetails({placeId: placeId}, function (place, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK
                            || status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {

                            scope.$apply(function () {
                                if (scope.paOptions.updateModel) {
                                    ngModel.$setViewValue(place.formatted_address);
                                    ngModel.$render();
                                }
                                scope.paOnPlaceReady(null, place);
                            });

                        }
                        else {
                            scope.$apply(function () {
                                scope.paOnPlaceReady(new Error(moduleString + 'Places returned status: "' + status + '"'));
                            });
                        }
                    });
                };

                // If the paTrigger is set, assign the manual search function to it so the user is able to trigger it wherever he wants
                if (scope.paTrigger) {
                    scope.paTrigger = manualSearch;
                }


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

                        if (scope.paOptions.preventSubmit) {
                            element.on('keydown', function (e) {
                                if (e.keyCode == 13) {
                                    e.preventDefault();
                                }
                            });
                        }
                    }
                }

                /**
                 * If no options-object given, use the default options.
                 * Only put a $watch on the options if the user explicitly wants it. Else, this costs to much ressources
                 * and is better just done once.
                 */
                if (!angular.isObject(scope.paOptions) || !scope.paOptions.watchOptions) {
                    setOptions();
                }
                else {
                    scope.$watch('paOptions', function () {
                        setOptions();
                    }, true);
                }
            }
        };
    });