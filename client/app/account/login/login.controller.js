'use strict';

angular.module('to_do')
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $location) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function () {
            $http.post('/auth/local/login', {
                username: $scope.user.username,
                password: $scope.user.password
            })
                .success(function (user) {
                    // No error: authentication OK
                    $rootScope.message = 'Authentication successful!';
                    $rootScope.auth = true;
                    $location.url('/todo');
                })
                .error(function (data) {
                    // Error: authentication failed
                    $scope.error=data;
                    //console.log(data);
                    $rootScope.message = 'Authentication failed.';
                    $rootScope.auth = false;
                    $location.url('/login');
                });
        };
    });