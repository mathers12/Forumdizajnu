var app = angular.module("forumDizajnu.login",["ngMaterial","ui.router"]);


app.controller("loginController",function($scope,$mdDialog)
{
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
});
