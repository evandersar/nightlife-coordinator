(function() {
    'use strict';

    angular
        .module('app', ['ngResource', 'satellizer', 'angularUtils.directives.dirPagination'])
        .config(appConfig)
        .controller('MainController', MainController);

    function appConfig($authProvider) {
        $authProvider.facebook({
            clientId: '490257804656898'
        });
    }

    MainController.$inject = ['restService', 'authService', ];

    function MainController(restService, authService) {
        var vm = this;
        vm.authenticated = authService.isAuthenticated();
        vm.authenticate = authenticate;
        vm.signout = signout;
        vm.getVenues = getVenues;
        vm.updateVenue = updateVenue;
        vm.pageChanged = pageChanged;
        vm.setLimit = setLimit;

        vm.errMsg = '';
        vm.authSuccMsg = '';
        vm.authErrMsg = '';
        vm.venues = [];
        vm.city = '';
        vm.searching = false;
        vm.limit = 10;
        vm.offset = 0;
        vm.totalVenues = 0;
        vm.pagination = {
            current: 1
        };
        vm.previousCity = '';
        vm.limits = [10, 20, 50];

        function resetPagination() {
            vm.offset = 0;
            vm.pagination.current = 1;
        }

        function setLimit(limit) {
            vm.limit = limit;
            resetPagination();
            getVenues();
        }

        function pageChanged(newPage) {
            vm.offset = (newPage - 1) * vm.limit;

            if (vm.previousCity === vm.city) {
                getVenues();
            }
            else {
                vm.city = vm.previousCity;
                getVenues();
            }
        }

        function getVenues() {
            if (vm.previousCity !== vm.city) resetPagination();
            vm.previousCity = vm.city;
            vm.venues = [];

            if (!vm.city) {
                vm.errMsg = 'Please type your city';
                $(".city-err").show();
            }
            else {
                vm.errMsg = '';
                vm.searching = true;
                restService.getVenues(
                    vm.city, vm.limit, vm.offset,
                    function(resp) {
                        vm.searching = false;
                        //console.log("resp => ", resp);
                        if (resp[0].errMsg) {
                            console.log(resp[0].errMsg);
                            vm.errMsg = resp[0].errMsg;
                            $(".city-err").show();
                        }
                        else {
                            vm.totalVenues = resp.pop()["total"];
                            //console.log("vm.totalVenues => ", vm.totalVenues);
                            vm.venues = resp;
                        }
                    },
                    function(err) {
                        vm.searching = false;
                        console.log(err);
                        //alert(`${err.statusText} ${err.status}`);
                        vm.errMsg = `${err.statusText} ${err.status}`;
                        $(".city-err").show();
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
                            $(".city-err").show();
                        }
                        else {
                            //console.log("resp => ", resp);
                            console.log(`Venue with id: ${resp._id} successfully updated`);
                            vm.venues[index].going = resp.going;
                        }
                    },
                    function(err) {
                        console.log(err);
                        //alert(`${err.statusText} ${err.status}`);
                        vm.errMsg = `${err.statusText} ${err.status}`;
                        $(".city-err").show();
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
                    vm.authErrMsg = '';
                    console.log('Signed in with provider');
                    vm.authSuccMsg = `You successfully authorized as ${authService.getPayload()['name']}, now You can add/remove yourself by Going button !`;
                    $(".auth-succ").show();
                    //console.log('response => ', response);
                    //vm.authenticated = authService.isAuthenticated();
                })
                .catch(function(response) {
                    // Something went wrong.
                    vm.authSuccMsg = '';
                    console.log('Something went wrong', response);
                    vm.authErrMsg = response + ". Please try one more time";
                    $(".auth-err").show();
                });
        }

        function signout() {
            authService.logout();
            //vm.authenticated = authService.isAuthenticated();
        }

    }

})();
