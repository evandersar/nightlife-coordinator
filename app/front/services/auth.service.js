(function() {
    'use strict';
    
    angular
        .module('app')
        .factory("authService", authService);
        
    authService.$inject = ["$auth"];
    
    function authService($auth) {
        
        return {
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,
            logout: logout,
            getPayload: getPayload
        };
        
        function isAuthenticated(){
            return $auth.isAuthenticated();
        }
        
        function authenticate(provider) {
            return $auth.authenticate(provider);
        }
        
        function logout() {
            return $auth.logout();
        }
        
        function getPayload() {
            console.log('$auth.getPayload() => ', $auth.getPayload());
            return $auth.getPayload();
        }
        
    }
    
})();