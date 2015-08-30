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

    $scope.modifiedDate = (new Date(loggedIn.modified)).toLocaleString();
    //choosing the correct profile photo by gender
    //./assets/pictures/male_profile.png
    if (loggedIn.photos !== undefined)
    {
      $scope.addPhotoFooter = true;
      $scope.profilePhoto = loggedIn.photos[0].value;
    }
    else
    {
      $scope.addPhotoFooter = false;
      $scope.profilePhoto = (loggedIn.gender == "male") ? "./assets/pictures/male_profile.png" : "./assets/pictures/female_profile.png";
    }

    $scope.name = loggedIn.displayName;
  };

  console.log(loggedIn);

  $scope.addPhoto = function()
  {
    console.log("ADDED PHOTO");
  };

  init();
}]);
