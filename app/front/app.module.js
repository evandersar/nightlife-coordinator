(function() {
    'use strict';
    
    angular
        .module('app', ['ui.router', 'ngResource', 'googlechart'])
        .config(routerConfig)
        .factory("restService", restService)
        .controller('MainController', MainController);
    
    restService.$inject = ["$resource"];
    
    
    function MainController() {
        var vm = this;
        vm.authorized = true;
    }
    
    
    function restService($resource) {

        var Poll = $resource( 
            '/api/polls/:id', 
            {id:'@id'}, 
            {"update": {method: "PUT"} }
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
                function (resp) {
    				callback(resp);
    			},
    			function(err){
    			    errorCallback(err);
                }
            );
        }
        
        function getPolls(callback, errorCallback) {
            return Poll.query(
                function (resp) {
    				callback(resp);
    			},
    			function(err){
    			    errorCallback(err);
                }
            );
        }
        
        function getPollById(id, callback, errorCallback) {
            return Poll.get(
                {},
                {id: id},
                function (resp) {
    				callback(resp);
    			},
    			function(err){
    			    errorCallback(err);
                }
            );
        }
        
        function updatePoll(id, option, callback, errorCallback) {
            return Poll.update(
                {id: id}, 
                option,
                function (resp) {
    				callback(resp);
    			},
    			function(err){
    			    errorCallback(err);
                }
            );
        }
        
        function deletePollById(id, callback, errorCallback) {
            return Poll.delete(
                {},
                {id: id},
                function (resp) {
    				callback(resp);
    			},
    			function(err){
    			    errorCallback(err);
                }
            );
        }
        
    }
    
    
    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        
        var states =[
            {
                name: 'home',
                url: '/home',
                templateUrl: 'front/views/home.html'
            },
            
            {
                name: 'mypolls',
                url: '/mypolls',
                templateUrl: 'front/views/mypolls.html'
            },
            
            {
                name: 'newpoll',
                url: '/newpoll',
                templateUrl: 'front/views/newpoll.html'
            },
            
            {
                name: 'poll',
                url: '/poll/:id',
                templateUrl: 'front/views/poll.html'
            },
        ];
        
        states.forEach(function(state) {
            $stateProvider.state(state);
        });
        
        $urlRouterProvider.otherwise('/home');
      
    }
    
    
})();