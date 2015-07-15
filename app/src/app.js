var app = angular.module('forumDizajnu', ['ngMaterial','ui.router'])
  .config(function($mdThemingProvider,$locationProvider,$urlRouterProvider) {
    $mdThemingProvider.theme('themeProvider')
      .primaryPalette('green')
      .accentPalette('orange');



  });


  app.controller('toolbarCtrl', function($scope,$timeout, $mdSidenav, $mdUtil, $log) {

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
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
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };

    $scope.categoryClick = function()
    {

    }
  });


app.controller("tabsCtrl",function($scope)
{
  this.tabsData =
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
