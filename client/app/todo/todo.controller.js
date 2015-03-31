angular.module('to_do')
    .controller('myController', ['Todos', function (Todos) {
        var myCtrl = this;
        myCtrl.tk = {};


        Todos.query(function (resp) {
            // Handle successful response here
            myCtrl.todoS = resp;
            //console.log(resp);
        }, function (err) {
            // Handle error here
            console.log(err);
        });


        this.addTodo = function (tk) {
            myCtrl.tk = tk;
            Todos.save(myCtrl.tk, function (resp) {
                // Handle successful response here
                tk.name = '';
                myCtrl.todoS = resp;
                //console.log(resp);
            }, function (err) {
                // Handle error here
                myCtrl.error = err.data;
                console.log(err);
            });
        };

        this.change = function () {
            if (myCtrl.error && myCtrl.error.errors && myCtrl.error.errors.name)
                myCtrl.error.errors.name.message = null;
        };

        this.updateTodo = function (id) {
            // obj.done = true;
            Todos.update({ id: id }, function (resp) {
                // Handle successful response here
                myCtrl.todoS = resp;
                //console.log(resp);
            }, function (err) {
                // Handle error here
                console.log(err);
            });
        };

        this.deleteWithoutConf = function (id) {
        Todos.delete({ id: id }, function (resp) {
            // Handle successful response here
            myCtrl.todoS = resp;
            //console.log(resp);
        }, function (err) {
            // Handle error here
            console.log(err);
        });
        };

        this.delete = function (id) {
            var r = confirm("Are you sure! You want to delete task!");
            if (r === true) {
            this.deleteWithoutConf(id);
            }
            ;
        };


        this.cleanTodoWithoutConf = function () {
            Todos.clean(function (resp) {
                // Handle successful response here
                myCtrl.todoS = resp;
                //console.log(resp);
            }, function (err) {
                // Handle error here
                console.log(err);
            });
        };

        this.cleanTodo = function () {
            var r = confirm("Are you sure! You want to clear tasks marked as Done!");
            if (r === true) {
                this.cleanTodoWithoutConf();
            }
            ;
        };


    }]);