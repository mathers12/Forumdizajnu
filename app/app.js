var app = angular.module('forumDizajnu',
  [
    'forumDizajnu.home',
    'forumDizajnu.inspirations',
    'forumDizajnu.products',
    'forumDizajnu.articles',
    'forumDizajnu.forum',
    'forumDizajnu.login',
    'forumDizajnu.specialists',
    'forumDizajnu.register',
    'forumDizajnu.forgot_password',
    'forumDizajnu.profile',
    'ngMaterial',
    'ui.router',
    'ngResource'
  ])
  .config(function($mdThemingProvider,$locationProvider,$urlRouterProvider) {
    $mdThemingProvider.theme('themeProvider')
      .primaryPalette('green')
      .accentPalette('orange');


    //Budeme mat vzdy /home
    $urlRouterProvider.otherwise('/home');

  });

app.service('resolveService', function($q,$http,$window,$location) {
  return {
    profileResolve: function () {
      var deferred = $q.defer();
      /*--Testujeme, ci je uzivatel prihlaseny--*/
      $http.get('/auth/loggedin').success(function (user) {

        if (user)
        {
          deferred.resolve(user); // vratime uspesne vykonanie resolve
        }
        else
        {
          deferred.reject();
          $window.location.assign('/#/home');
        }
      });
      return deferred.promise;
    }
  }
});

app.directive("scroll", function ($window) {

  return function(scope, element, attrs) {

    /* header DOM element with md-page-header attribute */
    var header         = document.querySelector('[md-page-header]');
    /* Store header dimensions to initialize header styling */
    var baseDimensions = header.getBoundingClientRect();
    /* DOM element with md-header-title attribute (title in toolbar) */
    var title          = angular.element(document.querySelector('[md-header-title]'));
    /* DOM element with md-header-picture attribute (picture in header) */
    var picture        = angular.element(document.querySelector('[md-header-picture]'));
    /* DOM element with main-fab class (a DOM element which contains the main float action button element) */
    //var fab            = angular.element(document.querySelector('.main-fab'));
    /* The height of a toolbar by default in Angular Material */
    var legacyToolbarH = 64;
    /* The mid-height of a float action button by default in Angular Material */
    var legacyFabMid   = 56/2;
    /* The zoom scale of the toolbar title when it's placed at the bottom of the header picture */
    var titleZoom      = 1.5;
    /* The primary color palette used by Angular Material */
    var primaryColor   = [63,81,181];

    function styleInit () {
      title.css('padding-left','16px');
      title.css('position','relative');
      title.css('transform-origin', '24px');
    }

    function handleStyle(dim) {
      //fab.css('top',(dim.height-legacyFabMid)+'px');
      if ((dim.bottom-baseDimensions.top) > legacyToolbarH) {
        title.css('top', ((dim.bottom-baseDimensions.top)-legacyToolbarH)+'px');
        element.css('height', (dim.bottom-baseDimensions.top)+'px');
        title.css('transform','scale('+((titleZoom-1)*ratio(dim)+1)+','+((titleZoom-1)*ratio(dim)+1)+')');

      } else {
        title.css('top', '0px');
        element.css('height', legacyToolbarH+'px');
        title.css('transform','scale(1,1)');
      }
      //if ((dim.bottom-baseDimensions.top) < legacyToolbarH*2 && !fab.hasClass('hide')) {
        //fab.addClass('hide');
      //}
      //if((dim.bottom-baseDimensions.top)>legacyToolbarH*2 && fab.hasClass('hide')) {
        //fab.removeClass('hide');
      //}
      element.css('background-color','rgba('+primaryColor[0]+','+primaryColor[1]+','+primaryColor[2]+','+(1-ratio(dim))+')');
      picture.css('background-position','50% '+(ratio(dim)*50)+'%');
      /* Uncomment the line below if you want shadow inside picture (low performance) */
      //element.css('box-shadow', '0 -'+(dim.height*3/4)+'px '+(dim.height/2)+'px -'+(dim.height/2)+'px rgba(0,0,0,'+ratio(dim)+') inset');
    }

    function ratio(dim) {
      var r = (dim.bottom-baseDimensions.top)/dim.height;
      if(r<0) return 0;
      if(r>1) return 1;
      return Number(r.toString().match(/^\d+(?:\.\d{0,2})?/));
    }

    styleInit();
    handleStyle(baseDimensions);

    /* Scroll event listener */
    angular.element($window).bind("scroll", function() {
      var dimensions = header.getBoundingClientRect();
      handleStyle(dimensions);
      scope.$apply();
    });

    /* Resize event listener */
    angular.element($window).bind('resize',function () {
      baseDimensions = header.getBoundingClientRect();
      var dimensions = header.getBoundingClientRect();
      handleStyle(dimensions);
      scope.$apply();
    });

  };

});


  app.controller('appController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $mdDialog,$resource) {

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
    };

    $scope.clickLogin = function(ev) {
      $mdDialog.show({
        controller: "loginController",
        templateUrl: 'client/login/login.html',
        parent: angular.element(document.body),
        targetEvent: ev
      })
    };

    $scope.clickLogout = function()
    {
      $http.get("/auth/logout")
        .success(function()
        {
          $window.location.assign("/#/home");
        });
    };


    $scope.clickRegister = function(ev)
    {
      $mdDialog.show({
        controller: "registerController",
        templateUrl: 'client/register/register.html',
        parent: angular.element(document.body),
        targetEvent: ev
      })
    };

    $scope.details = ["Prva","Druha","Tretia"];

    $scope.tabsData =
      [
        {
          name: "Inšpirácie",
          imgName: "INŠPIRÁCIE",
          hrefName: "inspirations",
          description: "Nechajte sa inšpirovať a vytvorte si krásny domov",
          buttonName: "Prejsť na inšpirácie",
          color: "chocolate",
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
          color: "blue",
          imgSrc: "./assets/pictures/articles.jpg"
        },
        {
          name: "Špecialisti",
          imgName: "ŠPECIALISTOV",
          hrefName: "specialists",
          description: "Najdite si svojho špecialistu, ktorý vám pomôže",
          buttonName: "Prejsť na špecialistov",
          color: "green",
          imgSrc: "./assets/pictures/specialists.jpg"
        },
        {
          name: "Fórum",
          imgName: "FÓRUM",
          hrefName: "forum",
          description: "Máte špecifické požiadavky? Poraďte sa na našom fóre",
          buttonName: "Prejsť na fórum",
          color: "gray",
          imgSrc: "./assets/pictures/forum.jpg"
        }
      ]
    var init = function()
    {
      /*--Ak  uzivatel klikol na verifikaciu, vidime ?verify_id=123--*/
      if ($location.search().verify_id !== undefined)
      {
        var id = $location.search().verify_id;
        var User_id = $resource('/auth/getVerifyMessage');
        User_id.get({verify_id: id},function (data) {
          $scope.messageDialog(data.message,true,data.title);
        },function(err)
        {

        });
      }

      /* Oznaceny tab po zadani url */
      $scope.urlPath = $location.path().replace("/","");
      for(var i = 0; i< $scope.tabsData.length; i++)
      {
        if ($scope.tabsData[i].hrefName == $scope.urlPath)
        {
          $scope.tabValue = i;
        }

      }
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

init();
  });

