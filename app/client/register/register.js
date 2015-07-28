var app = angular.module("forumDizajnu.register",["ngMaterial","ui.router"]);

app.controller("registerController",function($scope,$mdDialog)
{
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.register = function(user)
  {
    console.log(user);
  };
});
