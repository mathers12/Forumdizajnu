var app = angular.module('forumDizajn', ['ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('themeProvider')
      .primaryPalette('green')
      .accentPalette('orange');
  });
  app.controller('toolbarCtrl', function($scope) {

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
