(function() {
    'use strict';
    
    angular
        .module('app', ['ui.router', 'ngResource'])
        .config(routerConfig)
        .factory("restService", restService)
        .controller('MainController', MainController);
        
    
    restService.$inject = ["$resource"];
    
    
    function restService($resource) {

        var Poll = $resource( 
            '/api/polls/:id', 
            {id:'@id'}, 
            {"update": {method: "PUT"} }
        );
        
        return {
            addPoll: addPoll,
            getPolls: getPolls,
            getPollById: getPollById
        };

        function addPoll(pollObj) {
            return Poll.save(
                pollObj, 
                function (resp) {
    				console.log(resp);
    			},
    			function(err){
    			    console.log(err);
                }
            );
        }
        
        function getPolls() {
            return Poll.query(
                function (resp) {
    				console.log(resp);
    			},
    			function(err){
    			    console.log(err);
                }
            );
        }
        
        function getPollById(id) {
            return Poll.get(
                {},
                {id: id},
                function (resp) {
    				console.log(resp);
    			},
    			function(err){
    			    console.log(err);
                }
            );
        }
    }
    
    
    function MainController() { 
        
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