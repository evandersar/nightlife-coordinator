(function() {
    'use strict';

    angular
        .module('app')
        .factory("restService", restService);

    restService.$inject = ["$resource"];

    function restService($resource) {

        var Venue = $resource(
            '/api/venue/:id', {
                id: '@id'
            }, {
                "update": {
                    method: "PUT"
                },
                getvenues: { method: 'POST', isArray: true }
            }
        );

        return {
            getVenues: getVenues,
            updateVenue: updateVenue
        };


        function getVenues(city, limit, offset, callback, errorCallback) {
            return Venue.getvenues({}, {
                    city: city,
                    limit: limit,
                    offset: offset
                },
                function(resp) {
                    callback(resp);
                },
                function(err) {
                    errorCallback(err);
                }
            );
        }

        function updateVenue(id, body, callback, errorCallback) {
            return Venue.update({
                    id: id
                },
                body,
                function(resp) {
                    callback(resp);
                },
                function(err) {
                    errorCallback(err);
                }
            );
        }

    }

})();
