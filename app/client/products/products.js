var app = angular.module('forumDizajnu.products', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('products', {
      url: "/products",
      templateUrl: "client/products/products.html"
    })


});

app.controller("productsController",['$scope','$location','$window','$stateParams','$http',
  function($scope,$location,$window,$stateParams,$http) {

  var init = function()
  {
    /* URL parameter, start at 1 */

    if ($location.search()["page"])
    {
      $scope.orangePage = $location.search()["page"];
    }
    else
    {
      console.log("TU SME");
      $location.search("page",1);
    }


    $http.get("./data/products.json").success(function(data) {
      $scope.products = data;
      $scope.copyProducts = data;
      /* Vypocitame si pocet stran na zaklade poctu poloziek, max 16 za stranu */
      $scope.count = Math.ceil($scope.products.length / 16);

    });

  };

    /*Next Label*/
  $scope.nextClickButton = function()
  {
    var number = $scope.orangePage + 1;
    $location.search("page",number);
    $scope.orangePage = $location.search()["page"];


  };

    /* Click na dalsiu stranu*/
  $scope.pageClickButton = function(number)
  {
    $location.search("page",number);
    $scope.orangePage = $location.search()["page"];

    var toCount = (number * 16); // strana krat pocet zobrazeni
    var fromCount = toCount - 16;

    // vytvorenie pola s produktami od a do akeho poctu
    $scope.products = $scope.copyProducts.slice(fromCount,toCount);
    console.log($scope.products.length);
  };

  $scope.getNumber = function(count) {
    return new Array(count);
  };



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

  init();


}]);

