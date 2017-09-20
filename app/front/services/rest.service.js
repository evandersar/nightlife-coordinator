(function() {
    'use strict';

    angular
        .module('app')
        .factory("restService", restService);

    restService.$inject = ["$resource"];

    function restService($resource) {

        var Poll = $resource(
            '/api/polls/:id', {
                id: '@id'
            }, {
                "update": {
                    method: "PUT"
                }
            }
        );

        return {
            getPolls: getPolls,
            updatePoll: updatePoll
        };


        function getPolls(callback, errorCallback) {
            return Poll.query(
                function(resp) {
                    callback(resp);
                },
                function(err) {
                    errorCallback(err);
                }
            );
        }

        function updatePoll(id, option, callback, errorCallback) {
            return Poll.update({
                    id: id
                },
                option,
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
