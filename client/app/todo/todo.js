'use strict';

angular.module('to_do')
    .config(function ($routeProvider, $locationProvider, $httpProvider) {


        $routeProvider
            .when('/todo', {
                templateUrl: 'app/todo/todo.html',
                controller: 'myController',
                controllerAs: 'myCtrl',
                resolve: {
                    loggedin: ['Auth', function (Auth) {
                        return Auth.checkLoggedin();
                    }]
                }
            })
    });