/**
 * Created by Antonio on 11/04/15.
 */
angular.module('angular-foursquare-api', ['angular-googlemaps'])
    .constant("SECTIONS", {
        "all": ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending', 'specials', 'topPicks']
    })
    .factory('venuesFromCoordinates', function ($http, $q, angular_foursquare_conf, $rootScope) {
        'use strict';
        var apiVersion = '20150217';
        var venuesFromCoordinates = function (data) {
            var deferred = $q.defer();
            $http({
                url: 'https://api.foursquare.com/v2/venues/explore',
                params: {
                    client_id: angular_foursquare_conf.client_id,
                    client_secret: angular_foursquare_conf.client_secret,
                    //ll: data.coordinates,
                    ll: data.lat + ',' + data.lng,
                    section: data.section,
                    venuePhotos: 1,
                    sortByDistance: 1,
                    radius: 1000,
                    limit: angular_foursquare_conf.limit,
                    offset: $rootScope.offset || 0,
                    v: apiVersion
                },
                method: 'GET',
                //data: data,
                headers: angular.extend({
                    'X-Requested-With': undefined
                })
            }).
                success(function (data) {
                    deferred.resolve({venues:data.response.groups[0].items, coordenates:{lat: data.lat, lng: data.lng}});
                });
            return deferred.promise;
        };

        return venuesFromCoordinates;
    })
    .factory('getVenues', function (coordinatesFromAddress, venuesFromCoordinates) {
        'use strict';

        var getVenues = function (address, section) {
            return coordinatesFromAddress(address, section).then(venuesFromCoordinates);
        };

        return getVenues;
    })
