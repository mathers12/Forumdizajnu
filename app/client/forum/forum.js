var app = angular.module('forumDizajnu.forum', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('forum', {
      url: "/forum",
      templateUrl: "client/forum/forum.html"
    });

});

app.controller("forumController",function($scope)
{



});

