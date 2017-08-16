(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ["authService", "$state"];

    function MainController(authService, $state) {
        var vm = this;
        vm.authenticated = authService.isAuthenticated();
        vm.authenticate = authenticate;
        vm.signout = signout;
        vm.getName = getName;
        
        if (vm.authenticated) vm.getName();

        console.log('vm.authenticated => ', vm.authenticated);

        function authenticate(provider) {
            authService.authenticate(provider)
                .then(function(response) {
                    // Signed in with provider.
                    console.log('Signed in with provider');
                    //console.log('response => ', response);
                    vm.authenticated = authService.isAuthenticated();
                    vm.getName();
                    if ($state.current.name === 'poll') window.location.reload();
                })
                .catch(function(response) {
                    // Something went wrong.
                    console.log('Something went wrong');
                });
        }
        
        function signout(){
             authService.logout();
             $state.go('home');
             //console.log("$state.current => ", $state.current);
             //if ($state.current.name === 'newpoll' || $state.current.name === 'mypolls') $state.go('home');
             vm.authenticated = authService.isAuthenticated();
        }
        
        function getName(){
             vm.username = authService.getPayload()['name'];
        }

    }

})();
