var app = angular.module('forumDizajnu.specialists', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('specialists', {
      url: "/specialists",
      templateUrl: "client/specialists/specialists.html"
    });

});

app.controller("specialistsController",function($scope)
{

});
