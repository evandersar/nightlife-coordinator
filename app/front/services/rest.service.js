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
            addPoll: addPoll,
            getPolls: getPolls,
            getPollById: getPollById,
            updatePoll: updatePoll,
            deletePollById: deletePollById
        };

        function addPoll(pollObj, callback, errorCallback) {
            return Poll.save(
                pollObj,
                function(resp) {
                    callback(resp);
                },
                function(err) {
                    errorCallback(err);
                }
            );
        }

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

        function getPollById(id, callback, errorCallback) {
            return Poll.get({}, {
                    id: id
                },
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

        function deletePollById(id, callback, errorCallback) {
            return Poll.delete({}, {
                    id: id
                },
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