var app = angular.module('forumDizajnu', ['ngMaterial','ui.router'])
  .config(function($mdThemingProvider,$locationProvider,$urlRouterProvider) {
    $mdThemingProvider.theme('themeProvider')
      .primaryPalette('green')
      .accentPalette('orange');



  });


  app.controller('toolbarCtrl', function($scope,$timeout, $mdSidenav, $mdUtil, $log) {
    $scope.categoryOn = true;
    $scope.categoryOff = false;

    $scope.toggleLeft = buildToggler('left');


    function buildToggler(navID) {

      var debounceFn =  $mdUtil.debounce(function(){
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      },300);
      return debounceFn;
    }

    $scope.close = function () {
      $scope.categoryOn = true;
      $scope.categoryOff = false;

      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };

    // Zmena ikony kategorie
    $scope.categoryClick = function()
    {
      if ($scope.categoryOn)
      {
        $scope.categoryOn = false;
        $scope.categoryOff = true;

      }
      else
      {
        $scope.categoryOn = true;
        $scope.categoryOff = false;

      }
    }

  });


app.controller("tabsCtrl",function($scope)
{
  $scope.tabsData =
      [
        {
          name: "Inspiracie",
          description: "Inspirujte sa niecim novym"
        },
        {
          name: "Produkty",
          description: "Pozrite si nase produkty"
        },
        {
          name: "Clanky",
          description: "Sledujte najnovsie clanky"
        },
        {
          name: "Specialisti",
          description: "Nechajte sa poradit nasimi specialistami"
        },
        {
          name: "Forum",
          description: "Pozrite si najcitanejsie forum"
        }
      ]


});
