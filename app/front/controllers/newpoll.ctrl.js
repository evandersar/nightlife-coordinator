(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('NewPollController', NewPollController);
        
    NewPollController.$inject = ["restService", "$state"];
    
    function NewPollController(restService, $state) { 
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
            
            restService.addPoll(
                vm.poll,
                function(resp){
                    console.log(`Poll saved with id: ${resp.id}`);
                    alert(`Poll saved with id: ${resp.id}`);
                    $state.go('poll', {id: resp.id});
                },
                function(err){
                    console.log(err);
                    alert(`${err.statusText} ${err.status}`);
                }
            );
        }
        
        //console.log("End of NewPollController");
    }
    
})();