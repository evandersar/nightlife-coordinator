(function() {
    'use strict';

    angular
        .module('app')
        .controller('PollController', PollController);

    PollController.$inject = ["authService", "restService", "$state", "$scope"];

    function PollController(authService, restService, $state, $scope) {
        var vm = this;
        vm.getPoll = getPoll;
        vm.updatePoll = updatePoll;
        vm.renderChart = renderChart;
        vm.deletePoll = deletePoll;

        vm.poll = {};
        vm.authenticated = authService.isAuthenticated();
        vm.answer = "--Select--";
        vm.customAnswer = "";
        vm.isauthor = false;
        vm.pollURL = window.location.href;
        vm.redirectURL = window.location.href;
        //console.log("window.location.href => ", window.location.href);

        var pollId = $state.params.id;
        //console.log("pollId => ", pollId);

        function getPoll() {
            restService.getPollById(
                pollId,
                function(resp) {
                    vm.poll = resp;
                    //console.log("vm.poll => ", vm.poll);
                    vm.renderChart(vm.poll.title, vm.poll.options);
                    vm.isauthor = vm.authenticated ? authService.getPayload()['sub'] === vm.poll.author : false;
                },
                function(err) {
                    console.log(err);
                    alert(`${err.statusText} ${err.status}`);
                }
            );
        }

        vm.getPoll();

        function updatePoll() {
            //console.log("vm.answer => ", vm.answer);
            vm.votingForm.$setSubmitted();
            //console.log("vm.votingForm.$submitted => ", vm.votingForm.$submitted);
            //console.log("vm.votingForm.$valid => ", vm.votingForm.$valid);
            if (vm.votingForm.$valid) {
                //console.log("vm.answer => ", vm.answer);
                //console.log("vm.customAnswer => ", vm.customAnswer);
                var option = (vm.customAnswer && vm.answer === "Custom answer") ? vm.customAnswer : vm.answer;
                //console.log("option => ", option);

                restService.updatePoll(
                    pollId, {
                        option: option,
                        voter: (vm.authenticated ? authService.getPayload()['sub'] : undefined)
                    },
                    function(resp) {
                        if (resp.errMsg) {
                            console.log(resp.errMsg);
                            alert(resp.errMsg);
                        }
                        else {
                            console.log(`Poll with id: ${resp._id} successfully updated`);
                            //console.log("resp => ", resp);
                            vm.poll = resp;
                            vm.renderChart(vm.poll.title, vm.poll.options);
                        }
                    },
                    function(err) {
                        console.log(err);
                        alert(`${err.statusText} ${err.status}`);
                    }
                );
            }
            else if (!vm.answer || vm.answer === "--Select--") {
                alert("Please select the answer");
            }

        }

        function renderChart(title, options) {
            var rows = [];
            for (let item of options) {
                rows.push({ c: [{ v: item.value }, { v: item.votes }] });
            }
            //console.log("rows => ", rows);

            vm.myChartObject = {};
            vm.myChartObject.type = "PieChart";

            vm.myChartObject.data = {
                "cols": [
                    { label: "Value", type: "string" },
                    { label: "Votes", type: "number" }
                ],
                "rows": rows
            };

            vm.myChartObject.options = {
                title: title,
                /*backgroundColor: 'snow',*/
                titleTextStyle: {
                    /*color: <string>,    // any HTML string color ('red', '#cc00cc')
                    fontName: <string>, // i.e. 'Times New Roman'*/
                    fontSize: 20, // 12, 18 whatever you want (don't specify px)
                    bold: false, // true or false
                    /*italic: <boolean>   // true of false*/
                }
            };

        }

        function deletePoll() {
            var confirmed = confirm("Do you really want to delete this Poll ?");
            if (confirmed == true) {
                restService.deletePollById(
                    pollId,
                    function(resp) {
                        console.log(`Poll with id: ${resp._id} successfully deleted`);
                        //alert(`Poll with id: ${resp._id} successfully deleted`);
                        $state.go('home');
                    },
                    function(err) {
                        console.log(err);
                        alert(`${err.statusText} ${err.status}`);
                    }
                );
            }
        }

        $scope.$on('logining', function(event, data) {
            console.log(data);
            reInit();
        });

        function reInit() {
            vm.answer = "--Select--";
            vm.authenticated = authService.isAuthenticated();
            vm.isauthor = vm.authenticated ? authService.getPayload()['sub'] === vm.poll.author : false;
        }

        //console.log("End of PollController");
    }

})();
