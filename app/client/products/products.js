var app = angular.module('forumDizajnu.products', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('products', {
      url: "/products/:page",
      templateUrl: "client/products/products.html"
    })

});

app.controller("productsController",function($scope)
{
  $scope.makePages = function()
  {
    console.log("fdf");
  };
  $scope.products =
  [
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    },
    {
      name: "nazov",
      price: 650
    }
  ];

  $scope.selectCategories =
  [
    {
      keyword: "cheapest",
      name: "Najlacnejšie"
    },
    {
      keyword: "most_popular",
      name: "Najpopulárnejšie"
    },
    {
      keyword: "most_popular_weekly",
      name: "Najpopulárnejšie za týždeň"
    }
  ];

  $scope.productDetail = function()
  {
    console.log("CLICKED");
  }
});

