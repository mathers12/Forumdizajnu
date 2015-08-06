var app = angular.module('forumDizajnu.articles', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('articles', {
      url: "/articles",
      controller: 'articlesController',
      templateUrl: 'client/articles/articles.html'
      });

});

app.controller("articlesController",function($scope)
{

});

