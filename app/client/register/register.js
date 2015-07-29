var app = angular.module("forumDizajnu.register",["ngMaterial","ui.router"]);

app.controller("registerController",function($scope,$mdDialog,$resource)
{
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };


  /*--Dialog message---*/
  $scope.messageDialog = function(message,link)
  {
    $mdDialog.show({
      controller: "messageDialogController",
      templateUrl: 'assets/messageDialog.tpl.html',
      locals: {
        message: message,
        link: link
      }
    });
  };

  $scope.register = function(user)
  {
    var Register = $resource('/auth/registration');
    Register.save(user, function (data)
    {
      /*--Registracia s rovnakym emailom--*/
      if (data.sameEmail)
      {
        $scope.messageDialog("V systéme sa už nachádza klient s daným e-mailom!");
      }
      /*--Registracia so zle opisanym heslom--*/
      else if (!data.comparePasswords)
      {
        $scope.messageDialog("Zadané hesla nie sú rovnaké, opakujte akciu prosím!");
      }
      /*--Uspesna registracia--*/

      else
      {
        /*SUCCESS*/
        $scope.messageDialog("Pre úplne dokončenie registrácie, prosím potvrdťe verifikačný e-mail!");
      }
    },function(err)
    {
      if (err)
      {
        $scope.messageDialog("Ooops nastala chyba, prosím opakujte akciu!");
      }
    });

  };
});

app.controller("messageDialogController",function($scope,$window,message,link)
{
  $scope.message = message;
  $scope.closeDialog = function()
  {
    if (link !== undefined)
    {
      $window.location.assign(link);
    }
    else
    {
      $window.location.reload();
    }
  };
});
