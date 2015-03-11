'use strict';

angular.module('to_do')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/help', {
                templateUrl: 'app/help/help.html',
                controller: 'helpController',
                resolve: {
                    loggedin: ['Auth', function(Auth) {
                        return Auth.checkLoggedin();
                    }]
                }
            })
    });