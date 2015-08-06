var app = angular.module('forumDizajnu.products', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('products', {
      url: "/products",
      views: {
        "main": {
          controller: 'productsController',
          templateUrl: 'client/products/products.html'
        }
      }
    })
    .state('products.detail', {
      url: "/:productId",
      views: {
        "main": {
          controller: 'productsController',
          templateUrl: 'client/products/products.detail.html'
        }
      }
    })


});



app.filter('pagination', function()
{
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

app.controller("productDetailController",["$scope","$stateParams",'$rootScope',
  function($scope,$stateParams,$rootScope)
{
  $rootScope.hideProducts = true;
  console.log("DETAIL");
  $scope.id = $stateParams.productId;



}]);

app.controller("productsController",['$scope','$location','$window','$stateParams','$http','$rootScope',
  function($scope,$location,$window,$stateParams,$http,$rootScope) {

    $scope.itemsPerPage = 16;
    $scope.currentPage = 0;
    $scope.products = [];
    $rootScope.hideProducts = false;


    var data = $http.get("./data/products.json")
      .success(function(data)
      {
        $scope.products = data;
      });


      $scope.range = function () {
      var rangeSize = 4;
      var ps = [];
      var start;

      start = $scope.currentPage;
      //  console.log($scope.pageCount(),$scope.currentPage)
      if (start > $scope.pageCount() - rangeSize) {
        start = $scope.pageCount() - rangeSize + 1;
      }

      for (var i = start; i < start + rangeSize; i++) {
        if (i >= 0)
          ps.push(i);
      }
      return ps;
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }

      $location.search("page", $scope.currentPage + 1);
    };

    $scope.DisablePrevPage = function () {
      return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.pageCount = function () {
      return Math.ceil($scope.products.length / $scope.itemsPerPage) - 1;
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.pageCount()) {
        $scope.currentPage++;
      }
      $location.search("page", $scope.currentPage + 1);

    };

    $scope.DisableNextPage = function () {
      return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    };

    $scope.setPage = function (n) {
      $scope.currentPage = n;


      //Nastavi sa konkretna strana ?page=n
      $location.search("page", n + 1);
    };

    $scope.init = function() {


      var count = $scope.pageCount() + 1;
      var currentNumber = $location.search()["page"];
      /* Zabezpecime aby nesiel cez rozsah stran */
      if (currentNumber && (currentNumber >= 1 && currentNumber <= count))
      {
        $scope.setPage(parseInt($location.search()["page"] - 1));

      }
      else if ($rootScope.hideProducts){
        $scope.setPage(0);
      }


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

    $scope.init();

}]);

