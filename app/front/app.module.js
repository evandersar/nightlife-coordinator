(function() {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngResource', 'googlechart', 'satellizer'])
        .config(routerConfig);

    function routerConfig($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {

        $authProvider.facebook({
            clientId: '283756712103783'
        });

        // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
        /*$authProvider.facebook({
            clientId: '283756712103783',
            responseType: 'token'
        });*/

        $locationProvider.html5Mode(true);

        var states = [{
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
