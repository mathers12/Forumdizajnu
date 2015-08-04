var app = angular.module("forumDizajnu.login",["ngMaterial","ui.router","ngResource"]);


app.controller("loginController",function($scope,$mdDialog,$resource) {


  var init = function()
  {
    if (localStorage.getItem("login_email") !== null)
    {
      $scope.email = localStorage.getItem("login_email");
    }
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    localStorage.clear();
    $mdDialog.cancel();
  };

  $scope.messageDialog = function(message,success,title)
  {
    $mdDialog.show({
      controller: "loginDialogController",
      templateUrl: 'assets/messageDialog.tpl.html',
      locals: {
        message: message,
        success: success,
        title: title
      }
    });
  };


  $scope.login = function (email,password) {

    //Ulozenie emailu do local Storage
    localStorage.setItem("login_email",email);

    var data = {
      email: email,
      password: password
    };

    var Login = $resource('/auth/');
    Login.save(data, function (user) {
      console.log(user);
      $scope.messageDialog("Prihlásenie prebehlo úspešne.",true,"Vitajte "+user.firstName+" "+user.lastName);
      /*Neplatne meno alebo heslo, reload stranky login*/
    }, function (err) {
      if (err.status == 401) {
        $scope.messageDialog("Neplatný e-mail alebo heslo!",false,"Nesprávne prihlasovacie údaje");
      }
    });

  };



  $scope.clickForgotPassword = function (ev) {
    $mdDialog.show({
      controller: "forgotPasswordController",
      templateUrl: 'client/forgot_password/forgot_password.html',
      parent: angular.element(document.body),
      targetEvent: ev
    })
  };

  init();
});


/*--Dialog message---*/
app.controller("loginDialogController", function ($scope, $window, message, success, title, $mdDialog,$location) {
  $scope.message = message;
  $scope.title = title;

  $scope.closeDialog = function()
  {
    if (success)
    {
      $location.path("/profile");
    }
    else
    {
      $mdDialog.show({
        controller: "loginController",
        templateUrl: 'client/login/login.html',
        parent: angular.element(document.body)
      })
    }

  };

});

