angular.module('starter.services', [])
.factory('userService', function($q,$resource) {

	return $resource('http://localhost:3000/api/appusers/:id',{},
	{
		'login':{
			'method':'POST',
			'url':'http://localhost:3000/api/appusers/login'
		}
	});

})
.factory('entryService', function($q,$resource) {

	return $resource('http://localhost:3000/api/entries/:id');

});