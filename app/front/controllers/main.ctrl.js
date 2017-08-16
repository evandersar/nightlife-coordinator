(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ["authService"];

    function MainController(authService) {
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
                    console.log('response => ', response);
                    vm.authenticated = authService.isAuthenticated();
                    vm.getName();
                })
                .catch(function(response) {
                    // Something went wrong.
                    console.log('Something went wrong');
                });
        }
        
        function signout(){
             authService.logout();
             vm.authenticated = authService.isAuthenticated();
        }
        
        function getName(){
             vm.username = authService.getUserName();
        }

    }

})();
