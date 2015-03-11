(function () {
    var app = angular.module('to_do');

app.controller('SignupCtrl', function ($scope, $http, $location) {
    // This object will be filled by the form
    //$scope.user = {};


    $scope.signup = function () {
        $http.post('/auth/local/signup', {
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

app.directive('ensureUnique', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            // console.log('ensureUnique::link');
            scope.$watch(attrs.ngModel, function(newValue) {
                $http({
                    method: 'POST',
                    url: '/auth/local/signup/check/username' ,
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