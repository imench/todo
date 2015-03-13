'use strict';

angular.module('to_do')

    .controller('NavActiveCtrl', function ($location, $http) {
        this.isActive = function (route) {
            //console.log($location.path());
            return route === $location.path();
        };
    });