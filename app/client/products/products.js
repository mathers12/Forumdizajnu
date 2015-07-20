var app = angular.module('forumDizajnu.products', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('products', {
      url: "/products",
      templateUrl: "client/products/products.html"
    });

});

app.controller("productsController",function($scope)
{
  $scope.products = [1,2,3,4,5,6,7,8];
});

