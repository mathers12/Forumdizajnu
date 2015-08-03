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

    // Ak je nieco v local storage, tak to zobraz na formulary
    if (localStorage.getItem("firstName") !== null) {

      $scope.firstName = localStorage.getItem("firstName");
      $scope.lastName =  localStorage.getItem("lastName");
      $scope.email =  localStorage.getItem("email");
      var date = new Date(localStorage.getItem("date_of_birth"));
      $scope.date_of_birth =  date;
      $scope.gender =  localStorage.getItem("gender");

    }

    $scope.gender = "Muž";
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    localStorage.clear();
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


  // registracia SUBMIT
  $scope.register = function(firstName,lastName,email,password,date_of_birth,gender)
  {

    var user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password : password,
      date_of_birth: date_of_birth,
      gender: gender
    };

      var Register = $resource('/auth/registration');
      Register.save(user, function (data) {
        /*--Registracia s rovnakym emailom--*/
        if (data.sameEmail) {
          localStorage.setItem("firstName",firstName);
          localStorage.setItem("lastName",lastName);
          localStorage.setItem("email",email);
          localStorage.setItem("date_of_birth",date_of_birth);
          localStorage.setItem("gender",gender);
          $scope.messageDialog(data.message, false, data.title);
        }
        else {
          /*SUCCESS*/
          $scope.messageDialog(data.message, true, data.title);
        }
      }, function (err) {
        if (err) {
          $scope.messageDialog("Ooops nastala chyba, prosím opakujte akciu!");
        }
      });
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
      localStorage.clear();
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
