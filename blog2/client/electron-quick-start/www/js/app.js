// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','starter.services','ngResource'])

.config(function($stateProvider,$urlRouterProvider) {

	$stateProvider
		.state('root', {
			url:'/root',
			abstract:true,
			controller:'rootCtrl',
			template:'<ion-nav-view/>'	
		})
		.state('root.Login', {
			url:'/login',
			controller:'loginCtrl',
			templateUrl:'partials/login.html'
		})
		.state('root.Home', {
			url:'/home',
			controller:'homeCtrl',
			templateUrl:'partials/home.html'
		})
		.state('root.EditEntry', {
			url:'/editentry',
			controller:'entryCtrl',
			templateUrl:'partials/entry.html'
		});	
			
	$urlRouterProvider.otherwise('/root/login');
		
})
.run(function($ionicPlatform) {
	
	
})
