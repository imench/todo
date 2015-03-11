'use strict';

angular.module('to_do')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html'
            })
    });