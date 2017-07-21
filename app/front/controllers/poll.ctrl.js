(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('PollController', PollController);
        
    PollController.$inject = ["restService", "$stateParams"];
    
    function PollController(restService, $stateParams) { 
        var vm = this;
        vm.poll = {};
        vm.getPoll = getPoll;
        
        var pollId = $stateParams.id;
        console.log("pollId => ", pollId);
        
        function getPoll(){
            vm.poll = restService.getPollById(pollId);
        }
        
        vm.getPoll();
        
        console.log("End of PollController");
    }
    
})();