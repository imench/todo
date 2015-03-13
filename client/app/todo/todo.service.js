/**
 * Created by Imen.Chebbi on 03/02/15.
 */
(function () {
    var app = angular.module('to_do');

    app.factory('Todos', [
        '$resource', function ($resource) {
            return $resource('/api/todos/:id', {id: '@id'},
                {
                    'save': { method: 'POST', isArray: true },
                    'update': { method: 'PUT', isArray: true },
                    'clean': { method: 'DELETE', params: { id: 'done' }, isArray: true},
                    'delete': { method: 'DELETE', isArray: true}
                });
        }]);
})();

