angular.module('to_do')
    .controller('myController', function (Todos, $http) {
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