(function() {
    'use strict';
    
    angular
        .module('app', ['ui.router', 'ngResource'])
        .config(routerConfig)
        .factory("restService", restService)
        .controller('MainController', MainController);
        
    
    restService.$inject = ["$resource"];
    
    
    function restService($resource) {

        var Poll = $resource('/api/polls');
        
        return {
            addPoll: addPoll
        };

        function addPoll(pollObj) {
            Poll.save(pollObj, function () {
				console.log("poll saved");
			});
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
                templateUrl: 'front/views/home.html',
                controller: 'HomeController'
            },
            
            {
                name: 'mypolls',
                url: '/mypolls',
                templateUrl: 'front/views/mypolls.html',
                controller: 'MyPollsController'
            },
            
            {
                name: 'newpoll',
                url: '/newpoll',
                templateUrl: 'front/views/newpoll.html',
                controller: 'NewPollController'
            },
        ];
        
        states.forEach(function(state) {
            $stateProvider.state(state);
        });
        
        $urlRouterProvider.otherwise('/home');
      
    }
    
})();