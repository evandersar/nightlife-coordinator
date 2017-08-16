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
            getUserName: getUserName
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
        
        function getUserName() {
            console.log('$auth.getPayload()["name"] => ', $auth.getPayload()["name"]);
            return $auth.getPayload()["name"];
        }
        
    }
    
})();