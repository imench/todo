(function () {
    var app = angular.module('to_do');

    app.factory('Auth', function ($q, $timeout, $http, $location, $rootScope) {
        var service = {};
        service.checkLoggedin = function () {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/auth/local/loggedin').success(function (user) {
                // Authenticated
                if (user !== '0') {
                    /*$timeout(deferred.resolve, 0);*/
                    $rootScope.auth = true;
                    deferred.resolve();
                }
                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);
                    $rootScope.auth = false;
                    deferred.reject();
                    $location.url('/login');
                }
            })
                .error(function () {
                    $rootScope.message = 'Erreurrrrr.';
                    //$timeout(function(){deferred.reject();}, 0);
                    deferred.reject();
                    $location.url('/login');
                });
            return deferred.promise;
        };
        return service;
    });
})();
