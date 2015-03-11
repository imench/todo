'use strict';

angular.module('to_do')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupCtrl'
            })
    })