(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('MyPollsController', MyPollsController);
        
    MyPollsController.$inject = ["restService", "authService"];
    
    function MyPollsController(restService, authService) { 
        var vm = this;
        
        vm.polls = [];
        
        vm.getPolls = getPolls;
        
        function getPolls(){
            restService.getMyPolls(
                authService.getPayload()['sub'],
                function(resp){
                    vm.polls = resp;
                },
                function(err){
                    console.log(err);
                    alert(`${err.statusText} ${err.status}`);
                }
            );
        }
        
        vm.getPolls();
        
    }
    
})();