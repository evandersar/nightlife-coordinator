(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('NewPollController', NewPollController);
        
    NewPollController.$inject = ["restService"];
    
    function NewPollController(restService) { 
        var vm = this;
        
        vm.addPollOption = addPollOption;
        vm.savePoll = savePoll;
        
        vm.poll = {
            author: "",
            title : "",
            options: [
                {value: "", votes: 0},
                {value: "", votes: 0}
            ]
        };
        
        
        function addPollOption(){
            vm.poll.options.push({value: "", votes: 0});
        }
        
        function savePoll(){
            console.log(vm.poll);
            restService.addPoll(vm.poll);
        }
        
    }
    
})();