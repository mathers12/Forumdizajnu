var app = angular.module("forumDizajnu.profile",["ngMaterial","ui.router"]);

app.config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {

  $stateProvider
    .state('profile', {
      url: "/profile",
      controller: 'profileController',
      templateUrl: 'client/profile/profile.html',
      resolve: {
        loggedIn: function($q,$window,$http)
        {
        var deferred = $q.defer();
  /*--Testujeme, ci je uzivatel prihlaseny--*/
  $http.get('/auth/loggedin').success(function (user) {

    if (user)
    {
      deferred.resolve(user); // vratime uspesne vykonanie resolve
    }
    else
    {
      deferred.reject();
      $window.location.assign('/#/products');

    }
  });
  return deferred.promise;
}
      }
    })
});


app.controller("profileController",['$scope','loggedIn',function($scope,loggedIn)
{
  var init = function()
  {

    //./assets/pictures/male_profile.png
    $scope.profilePhoto = loggedIn.photos[0].value;
    $scope.name = loggedIn.displayName;
  };
  console.log(loggedIn);

  $scope.addPhoto = function()
  {
    console.log("ADDED PHOTO");
  }

  init();
}]);
