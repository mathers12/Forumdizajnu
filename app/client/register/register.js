var app = angular.module("forumDizajnu.register",["ngMaterial","ui.router","ngMessages"]);


var compareTo = function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
};

app.directive("compareTo", compareTo);

app.controller("registerController",function($scope,$mdDialog,$resource)
{

  var init = function()
  {

    var clientData = localStorage.getItem("firstName");
    $scope.user = {
      gender: "Muž"
    };

  }
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
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


  $scope.register = function(user)
  {
    //Ukladanie do localStorage
    localStorage.setItem("clientData",user);

    if (user.password1 !== user.password2)
    {
      $scope.errorMessage = "NESPRAVNE HESLO";
    }
    else {

      var Register = $resource('/auth/registration');
      Register.save(user, function (data) {
        /*--Registracia s rovnakym emailom--*/
        if (data.sameEmail) {
          $scope.messageDialog(data.message, false, data.title);
        }
        /*--Registracia so zle opisanym heslom--*/
        else if (!data.comparePasswords) {
          $scope.messageDialog(data.message, false, data.title);
        }
        /*--Uspesna registracia--*/

        else {
          /*SUCCESS*/
          $scope.messageDialog(data.message, true, data.title);
        }
      }, function (err) {
        if (err) {
          $scope.messageDialog("Ooops nastala chyba, prosím opakujte akciu!");
        }
      });
    }
  };

  init();
});

app.controller("messageDialogController",function($scope,$window,message,success,title,$mdDialog)
{
  $scope.message = message;
  $scope.title = title;
  $scope.closeDialog = function()
  {
    if (success)
    {
      $mdDialog.show({
        controller: "loginController",
        templateUrl: 'client/login/login.html',
        parent: angular.element(document.body)
      })
    }
    else {
      $mdDialog.show({
        controller: "registerController",
        templateUrl: 'client/register/register.html',
        parent: angular.element(document.body)
      })
    }

  };
});
