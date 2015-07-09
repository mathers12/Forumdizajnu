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
  this.tabsData = ["Inspiracie","Produkty","Clanky","Specialisti","Forum"];

});
