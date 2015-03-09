/**
 * Created by Imen.Chebbi on 03/02/15.
 */
'use strict';
(function () {
    var app = angular.module('to_do', ['ngRoute']);

    app.controller('myController', function (Todos, $http) {
        var myCtrl = this;
        myCtrl.tk = {};

        /*Todos.login()
         .success(function (data) {
         myCtrl.todoS = data;
         console.log(data);
         })
         .error(function (data) {
         console.log('Error: ' + data);
         });*/

        Todos.get()
            .success(function (data) {
                myCtrl.todoS = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });


        this.addTodo = function (tk, form) {
            /* var todo = { name: tk.name, done: false};
             myCtrl.todoS.push(todo);

             save().success(function (data) {
             //myCtrl.todoS = data;
             tk.name = '';
             });*/
            myCtrl.tk = tk;
            Todos.save(myCtrl.tk)
                .success(function (data) {
                    tk.name = '';
                    //myCtrl.tk= {}; // clear the form so our user is ready to enter another
                    myCtrl.todoS = data;
                    console.log(data);
                })
                .error(function (data) {
                    // if(data.errors.name.message === 'exists')
                    myCtrl.error = data;
                    // console.log(data.errors.name.value + " already exists");
                });

            /*$http.get('/api/todo').success(function(data) {
             myCtrl.todoS = data;
             });*/
        };

        this.change = function () {
            if (myCtrl.error && myCtrl.error.errors && myCtrl.error.errors.name)
                myCtrl.error.errors.name.message = null;
        };

        this.updateTodo = function (id) {
            // obj.done = true;

            Todos.update(id).success(function (data) {
                myCtrl.todoS = data;
                //console.log(data);

            })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

            /* Todos.get('/api/todo').success(function(data) {
             myCtrl.todoS = data;
             });*/
        };


        this.delete = function (id) {
            /*var index = myCtrl.todoS.indexOf(obj);


             myCtrl.todoS.splice(index, 1);*/
            Todos.delete(id).success(function (data) {
                var r = confirm("Are you sure! You want to delete task!");
                if (r === true)
                    myCtrl.todoS = data;
                console.log(data);
            })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

            //myCtrl.todoS.pop(obj);
        };


        this.cleanTodo = function () {
            /*var index = myCtrl.todoS.indexOf(obj);


             myCtrl.todoS.splice(index, 1);*/
            Todos.clean().success(function (data) {
                var r = confirm("Are you sure! You want to clear tasks marked as Done!");
                if (r === true)
                    myCtrl.todoS = data;
                console.log(data);
            })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

            //myCtrl.todoS.pop(obj);
        };


        /*function save() {
         return Todo.save(myCtrl.todoS);
         }*/
    });

    app.controller('helpController', function ($routeParams) {
        this.name = "helpController";
        this.params = $routeParams;
    });


    /*app.controller('LoggedinCtrl', function ($http) {

        this.isAuth = function () {
            var auth = 0;
            $http.get('/api/loggedin')
                .success(function (user) {
                    // Authenticated
                    if (user !== '0')
                        auth = true;
                    // Not Authenticated
                    else {
                        auth = false;
                    }
                })
                .error(function () {
                    auth = false;
                });

            return auth;
        };
    });*/

    /*app.config(['$routeProvider',
     function($routeProvider) {
     $routeProvider
     .when('/', {
     templateUrl: 'todo.html',
     controller: 'myController',
     controllerAs: 'myCtrl'
     })
     .when('/help', {
     templateUrl: 'help.html',
     controller: 'helpController'
     })
     .otherwise({
     redirectTo: '/'
     });
     }]);*/
    app.config(function ($routeProvider, $locationProvider, $httpProvider) {
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/api/loggedin').success(function (user) {
                // Authenticated
                if (user !== '0'){
                /*$timeout(deferred.resolve, 0);*/
                    $rootScope.auth=true;
                    deferred.resolve();
                }
                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);
                    $rootScope.auth=false;
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
        //================================================

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
                    if (response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            };
        });
        //================================================

        //================================================
        // Define all the routes
        //================================================
        $routeProvider
            .when('/', {
                templateUrl: 'main.html'
            })
            .when('/admin', {
                templateUrl: 'admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'signup.html',
                controller: 'SignupCtrl'
            })
            .when('/todo', {
                templateUrl: 'todo.html',
                controller: 'myController',
                controllerAs: 'myCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/help', {
                templateUrl: 'help.html',
                controller: 'helpController',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .otherwise({
                redirectTo: '/'
            });
        //================================================

    }) // end of config()
    app.run(function ($rootScope, $http) {
        $rootScope.message = '';
        $rootScope.auth = false;

        // Logout function is available in any pages
        $rootScope.logout = function () {
            $rootScope.message = 'Logged out.';
            $rootScope.auth = false;
            $http.post('/api/logout');
        };


    });

    app.controller('ActiveCtrl', function ($location) {
        this.isActive = function (route) {
            //console.log($location.path());
            return route === $location.path();
        }
    });

    /**********************************************************************
     * Login controller
     **********************************************************************/
    app.controller('LoginCtrl', function ($scope, $rootScope, $http, $location) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function () {
            $http.post('/api/login', {
                username: $scope.user.username,
                password: $scope.user.password
            })
                .success(function (user) {
                    // No error: authentication OK
                    $rootScope.message = 'Authentication successful!';
                    $rootScope.auth = true;
                    $location.url('/todo');
                })
                .error(function () {
                    // Error: authentication failed
                    $rootScope.message = 'Authentication failed.';
                    $rootScope.auth = false;
                    $location.url('/login');
                });
        };
    });

    /**********************************************************************
     * Login controller
     **********************************************************************/
    app.controller('SignupCtrl', function ($scope, $http, $location) {
        // This object will be filled by the form
        //$scope.user = {};


        $scope.signup = function () {
            $http.post('/api/signup', {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                verification: $scope.verification
            })
                .success(function() {
                    $location.path('/login');


                })
                .error(function(response) {
                    $location.path('/signup');
                });
        };
    });


    /**********************************************************************
     * Admin controller
     **********************************************************************/
    app.controller('AdminCtrl', function ($scope, $http) {
        // List of users got from the server
        $scope.users = [];

        // Fill the array to display it in the page
        $http.get('/api/users').success(function (users) {
            for (var i in users)
                $scope.users.push(users[i]);
        });
    });

    app.controller('NavActiveCtrl', function ($location, $http) {
        this.isActive = function (route) {
            //console.log($location.path());
            return route === $location.path();
        };


        /*app.directive('uniqueUsername', ['$http', function($http) {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    scope.busy = false;
                    scope.$watch(attrs.ngModel, function(value) {

                        // hide old error messages
                        ctrl.$setValidity('isTaken', true);
                        ctrl.$setValidity('invalidChars', true);

                        if (!value) {
                            // don't send undefined to the server during dirty check
                            // empty username is caught by required directive
                            return;
                        }

                        scope.busy = true;
                        $http.post('/api/signup/check/username', {username: value})
                            .success(function(data) {
                                // everything is fine -> do nothing
                                scope.busy = false;
                            })
                            .error(function(data) {

                                // display new error message
                                if (data.isTaken) {
                                    ctrl.$setValidity('isTaken', false);
                                } else if (data.invalidChars) {
                                    ctrl.$setValidity('invalidChars', false);
                                }

                                scope.busy = false;
                            });
                    })
                }
            }
        }]);
*/
    });

        app.directive('ensureUnique', ['$http', function($http) {
            return {
                require: 'ngModel',
                link: function(scope, ele, attrs, c) {
                   // console.log('ensureUnique::link');
                    scope.$watch(attrs.ngModel, function(newValue) {
                        $http({
                            method: 'POST',
                            url: '/api/signup/check/username' ,
                            data: {username: newValue}
                        }).success(function(data, status, headers, cfg) {
                            c.$setValidity('unique', data.isUnique);

                        }).error(function(data, status, headers, cfg) {
                            c.$setValidity('unique', false);

                        });
                    });
                }
            };
        }]);

        app.directive('match', [function () {
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                   // console.log('match::link');
                    scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
                       // console.log(value[0],value[1]);
                        ctrl.$setValidity('match', value[0] === value[1] );
                    }, true);
                //console.log('match');
                }
            }
        }]);

    app.directive('overwriteEmail', function() {
        var EMAIL_REGEXP =  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });


})();
