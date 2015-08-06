var app = angular.module("forumDizajnu.profile",["ngMaterial","ui.router"]);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('profile', {
      url: "/profile",
      views: {
        "main": {
          controller: 'profileController',
          templateUrl: 'client/profile/profile.html'
        }
      },
      resolve: {
        loggedIn: function(resolveService)
        {
          return resolveService.profileResolve();
        }
      }
    })
});


app.controller("profileController",['$scope','loggedIn',function($scope,loggedIn)
{
  console.log(loggedIn);
}]);
