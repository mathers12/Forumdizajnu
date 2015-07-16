var app = angular.module('forumDizajnu.inspirations', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('inspirations', {
      url: "/inspirations",
      templateUrl: "client/inspirations/inspirations.html"
    });

});

app.controller("inspirationsController",function($scope)
{

});

