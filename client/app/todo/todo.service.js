/**
 * Created by Imen.Chebbi on 03/02/15.
 */
(function () {
    var app = angular.module('to_do');

    app.factory('Todos', function ($http) {
        return {
            get: function () {
                return $http.get('/api/todos/');
            },
            save: function (tk) {
                return $http.post('/api/todos/',tk);
            },
            update: function (id) {
                return $http.put('/api/todos/'+ id );
            },
            clean: function () {
                return $http.delete('/api/todos/done');
            },
            delete: function (id) {
                return $http.delete('/api/todos/'+ id);
            }
            /*login: function () {
             return $http.post('/login');
             }*/

        };
    });
})();
