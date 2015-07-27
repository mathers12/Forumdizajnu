var app = angular.module("forumDizajnu.login",["ngMaterial","ui.router"]);


app.controller("loginController",function($scope,$mdDialog)
{
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };



  $scope.clickForgotPassword = function(ev)
  {
    $mdDialog.show({
      controller: "forgotPasswordController",
      templateUrl: 'client/forgot_password/forgot_password.html',
      parent: angular.element(document.body),
      targetEvent: ev
    })
  };
});
