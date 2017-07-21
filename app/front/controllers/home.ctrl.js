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
            vm.polls = restService.getPolls();
            //console.log(restService.getPolls());
        }
        
        vm.getPolls();
        
        console.log("End of HomeController");
    }
    
})();