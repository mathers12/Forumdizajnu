var app = angular.module("forumDizajnu.login",["ngMaterial","ui.router","ngResource"]);


app.controller("loginController",function($scope,$mdDialog,$resource)
{



  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };


  $scope.login = function(user)
  {
    var data = {
      email: user.email,
      password: user.password
    };

    var Login = $resource('/auth/');
    Login.save(data,function(user)
    {
      console.log(user);
      /*Neplatne meno alebo heslo, reload stranky login*/
    },function(err)
    {
      if (err.status == 401)
      {
        $scope.messageDialog("/login","Neplatné meno alebo heslo!");
      }
    });

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

  /*--Dialog message---*/
  $scope.messageDialog = function(message,success,title)
  {
    $mdDialog.show({
      controller: "messageDialogController",
      templateUrl: 'assets/messageDialog.tpl.html',
      locals: {
        message: message,
        success: success,
        title: title
      }
    });
  };

});
