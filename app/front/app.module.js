(function() {
    'use strict';

    angular
        .module('app', ['ngResource', 'satellizer'])
        .config(appConfig)
        .controller('MainController', MainController);

    function appConfig($authProvider) {
        $authProvider.facebook({
            clientId: '490257804656898'
        });
    }

    MainController.$inject = ["restService", "authService"];

    function MainController(restService, authService) {
        var vm = this;
        vm.authenticated = authService.isAuthenticated();
        vm.authenticate = authenticate;
        vm.signout = signout;
        vm.getVenues = getVenues;
        vm.updateVenue = updateVenue;
        vm.errMsg = '';
        vm.venues = [];
        vm.city = '';

        function getVenues() {
            if (!vm.city) {
                vm.errMsg = 'Please type your city';
                vm.venues = [];
            }
            else {
                vm.errMsg = '';
                restService.getVenues(
                    vm.city,
                    function(resp) {
                        //console.log("resp => ", resp);
                        if (resp[0].errMsg) {
                            console.log(resp[0].errMsg);
                            vm.errMsg = resp[0].errMsg;
                        }
                        else {
                            vm.venues = resp;
                        }
                    },
                    function(err) {
                        console.log(err);
                        alert(`${err.statusText} ${err.status}`);
                    }
                );
            }
        }

        function updateVenue(venue_id, index) {
            if (authService.isAuthenticated()) {
                restService.updateVenue(
                    venue_id, {
                        voter: authService.getPayload()['facebook']
                    },
                    function(resp) {
                        if (resp.errMsg) {
                            console.log(resp.errMsg);
                            vm.errMsg = resp.errMsg;
                        }
                        else {
                            //console.log("resp => ", resp);
                            console.log(`Venue with id: ${resp._id} successfully updated`);
                            vm.venues[index].going = resp.going;
                        }
                    },
                    function(err) {
                        console.log(err);
                        alert(`${err.statusText} ${err.status}`);
                    }
                );
            }
            else {
                vm.authenticate('facebook');
            }

        }

        function authenticate(provider) {
            authService.authenticate(provider)
                .then(function(response) {
                    // Signed in with provider.
                    console.log('Signed in with provider');
                    //console.log('response => ', response);
                    vm.authenticated = authService.isAuthenticated();
                })
                .catch(function(response) {
                    // Something went wrong.
                    console.log('Something went wrong');
                });
        }

        function signout() {
            authService.logout();
            vm.authenticated = authService.isAuthenticated();
        }

    }

})();
