// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','tabSlideBox', 'ionic-material', 'ionicRipple', 'ngRoute', 'infinite-scroll', 'pasvaz.bindonce', 'yaru22.angular-timeago'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.views.maxCache(15);
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.views.transition('none');
})

.run(['$q', '$http', '$rootScope', '$location', '$window', '$timeout', '$ionicLoading',
  function($q, $http, $rootScope, $location, $window, $timeout, $ionicLoading) {

    $rootScope.$on("$stateChangeStart", function(event, next, current){
      $rootScope.error = null;
      $ionicLoading.show();
    });
    
    $rootScope.$on("$stateChangeSuccess", function(event, next, current){
      $ionicLoading.hide();
    });
 }
])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
          url: '/',
          templateUrl: 'partials/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch: false,
          resolve: {
              ids: function (commonServices, dataService) {
                  if (dataService.getIds()) {
                      return dataService.getIds();
                  }
                  else {
                      return commonServices.getHotNewIds();
                  }
              },
              categories: function (commonServices, dataService) {
                  if (dataService.getCategories()) {
                      return dataService.getCategories();
                  }
                  else {
                    return commonServices.getCategories();
                  }
              }
          }
      })

      .state('category', {
        url: '/chu-de/:catSlug',
        cache: true,
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl',
        reloadOnSearch: false,
        resolve: {
            ids: function (commonServices, dataService) {
                if (dataService.getIds()) {
                    return dataService.getIds();
                }
                else {
                    return commonServices.getHotNewIds();
                }
            },
            categories: function (commonServices, dataService) {
                if (dataService.getCategories()) {
                    return dataService.getCategories();
                }
                else {
                    return commonServices.getCategories();
                }
            }
        }
      })

      //.state('category1', {
      //  url: '/chu-de/:catSlug/',
      //  cache: true,
      //  templateUrl: 'partials/home.html',
      //  controller: 'HomeCtrl',
      //  reloadOnSearch: false,
      //})

      .state('detail', {
          url: '/chu-de/:catSlug/:slug',
          cache: false,
          templateUrl: 'partials/detail.html',
          controller: 'DetailCtrl',
          params: { viewCatId: null, backToPrevious: true },
          reloadOnSearch: false
      })
      
      .state('detail1', {
          url: '/chu-de/:catSlug/:slug/',
          cache: false,
        templateUrl: 'partials/detail.html',
        controller: 'DetailCtrl',
        params : { viewCatId : null, backToPrevious: true },
        reloadOnSearch: false
      })

      .state('trendingDetail', {
          url: '/chu-de/list-xu-huong/:trendingId/',
          templateUrl: 'partials/trendingDetail.html',
          controller: 'TrendingDetailCtrl',
          params: {
              trendingId: null,
              trendingTitle: null
          },
          reloadOnSearch: false,
          resolve: {
              ids: function (commonServices, $stateParams) {
                  return commonServices.getTrendingNewsBytrendingId($stateParams.trendingId);
              }
          }
      });

    $urlRouterProvider.otherwise('/');
})
  
//.config(["$locationProvider", function($locationProvider) {
//  $locationProvider.html5Mode(true);
//}])

// .config(['$urlRouterProvider', function ($urlRouterProvider) {
//     $urlRouterProvider.deferIntercept();
// }])

.directive('ngLastRepeat', function ($timeout) {
  return {
      restrict: 'A',
      link: function (scope, element, attr) {
          if (scope.$last === true) {
              $timeout(function () {
                  scope.$emit('ngLastRepeat'+ (attr.ngLastRepeat ? '.'+ attr.ngLastRepeat : ''));
              });
          }
      }
  }
});
  
var debugFlag = true;
 debugFlag = false;
var debug = (function () {
    return {
        log: function () {
            if (debugFlag) {
                var args = Array.prototype.slice.call(arguments);
                console.log.apply(console, args);
            }
        },
        warn: function () {
            if (debugFlag) {
                var args = Array.prototype.slice.call(arguments);
                console.warn.apply(console, args);
            }
        },
        error: function () {
            if (debugFlag) {
                var args = Array.prototype.slice.call(arguments);
                console.error.apply(console, args);
            }
        }
    }
}());
