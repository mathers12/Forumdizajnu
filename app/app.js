var app = angular.module('forumDizajnu',
  [
    'forumDizajnu.home',
    'forumDizajnu.inspirations',
    'forumDizajnu.products',
    'forumDizajnu.articles',
    'forumDizajnu.forum',
    'forumDizajnu.specialists',
    'ngMaterial',
    'ui.router'
  ])
  .config(function($mdThemingProvider,$locationProvider,$urlRouterProvider,$stateProvider) {
    $mdThemingProvider.theme('themeProvider')
      .primaryPalette('green')
      .accentPalette('orange');


    //Budeme mat vzdy /home
    $urlRouterProvider.otherwise('/home');

  });


  app.controller('toolbarCtrl', function($scope,$timeout, $mdSidenav, $mdUtil, $log) {
    $scope.categoryOn = true;
    $scope.categoryOff = false;
    $scope.categoryDetails = true;
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
      $scope.categoryDetails = true;

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
        $scope.categoryDetails = false;

      }
      else
      {
        $scope.categoryOn = true;
        $scope.categoryOff = false;
        $scope.categoryDetails = true;
      }
    }

    $scope.details = ["Prva","Druha","Tretia"];

  });


app.controller("tabsCtrl",function($scope)
{
  $scope.tabsData =
      [
        {
          name: "Inšpirácie",
          imgName: "INŠPIRÁCIE",
          hrefName: "inspirations",
          description: "Nechajte sa inšpirovať a vytvorte si krásny domov",
          buttonName: "Prejsť na inšpirácie",
          color: "yellow",
          imgSrc: "./assets/pictures/inspirations.jpg"
        },
        {
          name: "Produkty",
          imgName: "PRODUKTY",
          hrefName: "products",
          description: "Produkty od tých najlepších dizajnérov a výrobcov",
          buttonName: "Prejsť na produkty",
          color: "orange",
          imgSrc: "./assets/pictures/products.jpg"
        },
        {
          name: "Články",
          imgName: "ČLÁNKY",
          hrefName: "articles",
          description: "Sledujte novinky a módne trendy zo sveta interiérového dizajnu",
          buttonName: "Prejsť na články",
          color: "red",
          imgSrc: "./assets/pictures/articles.jpg"
        },
        {
          name: "Špecialisti",
          imgName: "ŠPECIALISTOV",
          hrefName: "specialists",
          description: "Najdite si svojho špecialistu, ktorý vám pomôže",
          buttonName: "Prejsť na špecialistov",
          color: "blue",
          imgSrc: "./assets/pictures/specialists.jpg"
        },
        {
          name: "Fórum",
          imgName: "FÓRUM",
          hrefName: "forum",
          description: "Máte špecifické požiadavky?Poraďte sa na našom fóre",
          buttonName: "Prejsť na fórum",
          color: "green",
          imgSrc: "./assets/pictures/forum.jpg"
        }
      ]


});
