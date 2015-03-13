'use strict';

angular.module('to_do', [
        'ngResource',
        'ngRoute'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                response: function (response) {
                    // do something on success
                    return response;
                },
                responseError: function (response) {
                    /* if (response.status === 401)
                     $location.url('/login');*/
                    return $q.reject(response);
                }
            };
        });
    }) // end of config()

    .run(function ($rootScope, $http) {
        $rootScope.message = '';
        $rootScope.auth = false;

        // Logout function is available in any pages
        $rootScope.logout = function () {
            $rootScope.message = 'Logged out.';
            $rootScope.auth = false;
            $http.post('/auth/local/logout');
        };


    });