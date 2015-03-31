// testing controller
describe('Testing Todos Controller', function () {
    var $httpBackend, $rootScope, createController;

    // Set up the module
    beforeEach(module('to_do'));

    beforeEach(inject(function ($injector) {
        jasmine.addMatchers({
            toEqualData: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, expected) {
                        return {
                            pass: angular.equals(actual, expected)
                        };
                    }
                };
            }
        });
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        inject(function (Todos) {
            _Todos = Todos;
        });
        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('myController', {'$scope': $rootScope });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should use $resource to retrieve a list of todos', function () {
        var sampleTodo = new _Todos({
            name: 'Todo 1',
            done: false
        });
        var sampleTodos = [sampleTodo];
        $httpBackend.expectGET('/api/todos').respond(sampleTodos);
        var controller = createController();
        $httpBackend.flush();
        expect(controller.todoS).toEqualData(sampleTodos);
    });

    it('Should have a updateTodo method that uses $resource to update a single of todo', function () {
        var sampleTodo = new _Todos({
            id: 0,
            name: 'Todo 2',
            done: false
        });
        $httpBackend.expectGET('/api/todos').respond([]);
        var sampleTodos = [sampleTodo];
        $httpBackend.expectPUT('/api/todos/0').
            respond(sampleTodos);
        var controller = createController();
        controller.updateTodo(sampleTodo.id);
        $httpBackend.flush();
        expect(controller.todoS).toEqualData(sampleTodos);
    });

    it('Should have an addTodo method that uses $resource to add todos', function () {
        var sampleTodo = new _Todos({
            name: '',
            done: false
        });
        var sampleTodos = [sampleTodo];
        $httpBackend.expectGET('/api/todos').respond([]);
        $httpBackend.expectPOST('/api/todos', {name: '',
            done: false
        }).respond(sampleTodos);
        var controller = createController();
        controller.addTodo(sampleTodo);
        $httpBackend.flush();
        expect(controller.todoS).toEqualData(sampleTodos);
    });

    it('Should have a clean method that uses $resource to clean todos which are done', function () {
        $httpBackend.expectGET('/api/todos').respond([]);
        $httpBackend.expectDELETE('/api/todos/done').
            respond([]);
        var controller = createController();
        controller.cleanTodoWithoutConf();
        $httpBackend.flush();
        expect(controller.todoS).toEqualData([]);
    });

    it('Should have a delete method that uses $resource to delete a single of todo', function () {
        $httpBackend.expectGET('/api/todos').respond([]);
        $httpBackend.expectDELETE('/api/todos/1').
            respond([]);
        var controller = createController();
        controller.deleteWithoutConf(1);
        $httpBackend.flush();
        expect(controller.todoS).toEqualData([]);
    });
});
