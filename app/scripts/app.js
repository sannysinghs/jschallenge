'use strict';

/**
 * @ngdoc overview
 * @name jschallengeApp
 * @description
 * # jschallengeApp
 *
 * Main module of the application.
 */
angular

.module('jschallengeApp', ['ui.router','uiGmapgoogle-maps'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
	
  /* if none of the above states are matched, use this as the fallback */
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
		.state('home', {
	      url: "/home",
	      templateUrl: "views/main.html"
	    });

}]);
