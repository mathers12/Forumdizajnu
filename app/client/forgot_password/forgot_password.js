var app = angular.module("forumDizajnu.forgot_password",["ngMaterial","ui.router"]);

app.controller("forgotPasswordController",function($scope,$mdDialog)
{
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

});
