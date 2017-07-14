(function() {
    'use strict';
    
    angular
        .module('app')
        .controller('MyPollsController', MyPollsController);
    
    function MyPollsController() { 
        var vm = this;
        vm.title = "My polls!";
    }
    
})();