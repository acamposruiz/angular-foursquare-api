/**
 * Created by Antonio on 11/04/15.
 */
angular.module('angular-foursquare-api', ['angular-googlemaps'])
    .constant("SECTIONS",{
        "all": ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending', 'specials', 'topPicks']
    })
    .factory('getVenues', function($http, $q, SECTIONS, addressFromCoordinates, angular_foursquare_conf) {
        'use strict';
        var apiVersion = '20150217';
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
                    client_id:  angular_foursquare_conf.client_id,
                    client_secret:  angular_foursquare_conf.client_secret,
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
            venuesFromCoordinates: venuesFromCoordinates
        };
    })
