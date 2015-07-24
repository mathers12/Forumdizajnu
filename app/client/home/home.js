var app = angular.module('forumDizajnu.home', ['ngMaterial','ui.router']);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider.state('home', {
    url: "/home",
    templateUrl: "client/home/home.html"
    });

  /*$stateProvider.state('home', {
    url: "/home",
    views: {
      "homeView": {
        templateUrl: "client/home/home.html"
      }
    }
    .state('route1.list', {
     url: "/list",
     templateUrl: "route1.list.html",
     controller: function($scope){
     }
     })

  });*/
});

app.controller("homeController",function($scope,$window,$location)
{

  $scope.urlPath = $location.path().replace("/","");
  for(var i = 0; i< $scope.tabsData.length; i++)
  {
    if ($scope.tabsData[i].hrefName == $scope.urlPath)
    {
      $scope.tabValue = i;
    }

  }


  $scope.homeClickButton = function(url)
  {
    $window.location.assign("#/"+url);

  }

});

