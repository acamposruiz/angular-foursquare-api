/**
 * Created by Antonio on 11/04/15.
 */
angular.module('angular-foursquare-api', [])
    .constant("SECTIONS",{
        "all": ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending', 'specials', 'topPicks']
    })
    .factory('getVenues', function($http, $q, SECTIONS) {
        'use strict';
        var client_id = 'WU3OIROB5N3J1U3JPWWP0EUVICAZTMDCL2MUFLM2RKZ4HZFO';
        var client_secret = 'YF3BCWYDRXLSRUOSJ24WDBKWFZMYDGS1EYF5TSHM2O35VACU';
        var apiVersion = '20150217';
        var addressFromCoordinates = function(latlng) {
            var deferred = $q.defer();
            $http({
                url: 'http://maps.googleapis.com/maps/api/geocode/json',
                params: {
                    sensor: 'true_or_false',
                    latlng: latlng
                },
                method: 'GET',
                headers: angular.extend({
                    'X-Requested-With': undefined
                })
            }).
                success(function(data){
                    deferred.resolve(data);
                });
            return deferred.promise;
        };
        var coordinatesFromAddress = function(address, section) {
            var deferred = $q.defer();
            $http({
                url: 'http://maps.googleapis.com/maps/api/geocode/json',
                params: {
                    address: address,
                    components:'country:ES'
                },
                method: 'GET',
                //data: data,
                headers: angular.extend({
                    'X-Requested-With': undefined
                })
            }).
                success(function(data){
                    deferred.resolve({
                        coordinates: data.results[0].geometry.location.lat + ',' + data.results[0].geometry.location.lng,
                        section:section
                    });
                });
            return deferred.promise;
        };
        var venuesFromCoordinates = function(data) {
            var deferred = $q.defer();
            $http({
                url: 'https://api.foursquare.com/v2/venues/explore',
                params: {
                    client_id: client_id,
                    client_secret: client_secret,
                    ll: data.coordinates,
                    section: data.section,
                    venuePhotos: 1,
                    sortByDistance: 1,
                    radius: 300,
                    v: apiVersion
                },
                method: 'GET',
                //data: data,
                headers: angular.extend({
                    'X-Requested-With': undefined
                })
            }).
                success(function(data){
                    deferred.resolve(data.response.groups[0].items);
                });
            return deferred.promise;
        };

        return{
            get: function(address, section){
                return coordinatesFromAddress(address, section).then(venuesFromCoordinates);
            },
            defaultSearch: function(scope, callback){
                navigator.geolocation.getCurrentPosition(GetLocation);
                function GetLocation(location) {
                    addressFromCoordinates(location.coords.latitude + ',' + location.coords.longitude).then(function(data){
                        scope.address = data.results[0].formatted_address;
                    });
                    venuesFromCoordinates({
                        coordinates: location.coords.latitude + ',' + location.coords.longitude,
                        section: SECTIONS.all[0]
                    }).then(callback);
                }
            }
        };
    })
