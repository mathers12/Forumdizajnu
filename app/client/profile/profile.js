var app = angular.module("forumDizajnu.profile",["ngMaterial","ui.router"]);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('profile', {
      url: "/profile",
      templateUrl: "client/profile/profile.html",
      controller: "profileController",
      resolve: {
        isLogged: function(resolveService)
        {
          return resolveService.profileResolve();
        }
      }
    })
});


app.controller("profileController",function($scope,isLogged)
{
  console.log(isLogged);
});
