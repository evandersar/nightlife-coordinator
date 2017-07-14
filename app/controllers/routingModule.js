var myApp = angular.module('app', ['ui.router']);

myApp.config(function($stateProvider) {
  var myPolls = {
    name: 'mypolls',
    url: '/mypolls',
    template: '<h3>My polls!</h3>'
  };

  var newPoll = {
    name: 'newpoll',
    url: '/newpoll',
    template: '<h3>New poll!</h3>'
  };

  $stateProvider.state(myPolls);
  $stateProvider.state(newPoll);
});