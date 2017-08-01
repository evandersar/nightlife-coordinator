(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('HomeController', HomeController);
        
    HomeController.$inject = ["restService"];
    
    function HomeController(restService) { 
        var vm = this;
        vm.polls = [];
        
        vm.getPolls = getPolls;
        
        function getPolls(){
            restService.getPolls(
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
        
        //console.log("End of HomeController");
    }
    
})();