angular.module('to_do')
    .controller('myController', function (Todos, $http) {
        var myCtrl = this;
        myCtrl.tk = {};

        Todos.get()
            .success(function (data) {
                myCtrl.todoS = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

        this.addTodo = function (tk, form) {
            myCtrl.tk = tk;
            Todos.save(myCtrl.tk)
                .success(function (data) {
                    tk.name = ''; // clear the form so our user is ready to enter another
                    myCtrl.todoS = data;
                    console.log(data);
                })
                .error(function (data) {
                    myCtrl.error = data;
                });
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
        };

        this.delete = function (id) {
            var r = confirm("Are you sure! You want to delete task!");
            if (r === true) {
                Todos.delete(id).success(function (data) {
                    myCtrl.todoS = data;
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            }
            ;
        };

        this.cleanTodo = function () {
            var r = confirm("Are you sure! You want to clear tasks marked as Done!");
            if (r === true) {
                Todos.clean().success(function (data) {
                    myCtrl.todoS = data;
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            }
            ;
        };
    });