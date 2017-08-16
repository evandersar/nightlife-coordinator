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
                templateUrl: 'front/views/mypolls.html',
                resolve: {
                    redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                }
            },

            {
                name: 'newpoll',
                url: '/newpoll',
                templateUrl: 'front/views/newpoll.html',
                resolve: {
                    redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                }
            },

            {
                name: 'poll',
                url: '/poll/:id',
                templateUrl: 'front/views/poll.html'
            },
        ];

        function _redirectIfNotAuthenticated($q, $state, $auth, $timeout, authService) {
            var defer = $q.defer();
            if (authService.isAuthenticated()) {
                defer.resolve(); /* (3) */
            }
            else {
                $timeout(function() {
                    $state.go('home'); /* (4) */
                });
                defer.reject();
            }
            return defer.promise;
        }

        states.forEach(function(state) {
            $stateProvider.state(state);
        });

        $urlRouterProvider.otherwise('/home');

    }

})();
