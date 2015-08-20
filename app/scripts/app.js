'use strict';

/**
 * @ngdoc overview
 * @name road2mathApp
 * @description
 * # road2mathApp
 *
 * Main module of the application.
 */
angular
  .module('road2mathApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'selectStratergyGameApp',
    'arrowGame' //,'gridGame3App'
    
  ])
  .config(function ($routeProvider,$logProvider) {
    $logProvider.debugEnabled(true)
    $routeProvider
      .when('/', {
         templateUrl: 'game/selectstrategy/views/main.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/game/3', {
        templateUrl: 'game/selectstrategy/views/main.html',
      })
      .when('/game/:type', {
        templateUrl: 'game/arrowgame/views/main.html',
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }).run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
