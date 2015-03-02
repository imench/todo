var config = require('./config/env/development');
var mongoose = require('./config/mongoose');
var express = require('express');
var passportConfig = require('./config/passport');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;





var db = mongoose();
var passportConfig = passportConfig();

var Todo = require('mongoose').model('Todo');
var User = require('mongoose').model('User');
var app = express();



// create application/json parser
app.use(bodyParser.json());
//app.use(express.methodOverride());

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + '/public'));
//app.use(cookieParser());

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
}));

app.use(passport.initialize());
app.use(passport.session());


/*exports.create = function(req, res, next) {
 var todoS = new Todo(req.body);
 todoS.save(function(err) {
 if (err) {
 return next(err);
 } else {
 res.json(todoS);
 }
 });
 };

 app.route('/api/todo').post(todoS.create);*/


/*Todo.pre('create', function(err,next){

 if (err && err.errors && err.errors.name) {
 //var error = new ValidationError(this);
 //error.errors.name = new ValidatorError('name', 'exists', this.name);
 var error = new Error();
 error.name = 'NameExists'
 error.message = 'The name is not unique.';
 return next(error);

 }
 });
 */

/*app.get('/login', function(req, res, next) {
 passport.authenticate('local', function(err, user, info) {
 if (err) { return next(err); }
 if (!user) { return res.redirect('/login'); }
 req.logIn(user, function(err) {
 if (err) { return next(err); }
 return res.redirect('/users/' + user.username);
 });
 })(req, res, next);
 });*/

// Define a middleware function to be used for every secured routes
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.sendStatus(401);
    else
        next();
};

/*app.get('/api', function(req, res){
 res.render('index', { title: 'Express' });
 });*/

/*app.get('/users', auth, function(req, res){
 User.find(function (err, todoS, next) {


 if (err)
 return next(err)

 res.json(todoS);
 });
 });*/

app.get('/api/users', auth, function(req, res){
    res.send([{name: "admin"}, {name: "user2"}]);
});

// route to test if the user is logged in or not
app.get('/api/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
// route to log in
app.post('/api/login', passport.authenticate('local'), function (req, res) {

    res.send(req.user);
});
// route to log out
app.post('/api/logout', function (req, res) {

    req.logOut();
    res.sendStatus(200);
});

app.get('/api/todos', auth, function (req, res) {


    Todo.find({
        owner: req.user.id
    },function (err, todoS, next) {


        if (err)
            return next(err)

        res.json(todoS);
    });
});

/*var tasks = [];
 var storeTasks = function(name, data){
 tasks.push({name: name, data: data});

 }*/

/*var todoS=[
 {
 "name": "Javascript",
 "done": true
 },
 {
 "name": "Angular-js",
 "done": true
 },
 {
 "name": "Node-js",
 "done": false

 }
 ];*/


app.post('/api/todos', auth, function (req, res, next) {


    Todo.create({
        name: req.body.name,
        done: false,
        owner: req.user.id
    }, function (err, todo) {
        if (err)
            return next(err);


        Todo.find({
            owner: req.user.id
        },function (err, todos) {
            if (err)
                return next(err)
            res.json(todos);
        });
    });

});


/*app.put('/api/todos/:todo_id', function (req, res, next) {
 // var todoS=req.body
 Todo.findByIdAndUpdate(req.params.todo_id, req.body, function (err) {
 if (err) return next(err);
 //return res.status(404).send('Sorry, we cannot find that!');
 //res.json(todoS);
 res.sendStatus(204);
 });
 });*/


app.put('/api/todos/:todo_id', auth, function (req, res, next) {
    Todo.update({_id: req.params.todo_id }, { $set: { done: true }}, function (err) {
        if (err)
            return next(err);

        // get and return all the todos after you create another
        Todo.find({
            owner: req.user.id
        },function (err, todos) {
            if (err)
                return next(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todos/done', auth, function (req, res, next) {
    //console.log("clean");
    Todo.remove({
            done: true
        },

        function (err) {
            //console.log("f1");
            if (err)
                return next(err);

            // get and return all the todos after you create another
            Todo.find({
                owner: req.user.id
            },function (err, todos) {
                //console.log("f2");
                if (err)
                    return next(err)
                res.json(todos);
            });
        });
});


app.delete('/api/todos/:todo_id', auth, function (req, res, next) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            return next(err);

        // get and return all the todos after you create another
        Todo.find({
            owner: req.user.id
        },function (err, todos) {
            if (err)
                return next(err)
            res.json(todos);
        });
    });
});


/*app.get('/api/todo', function(req, res) {

 res.json(todoS);


 });*/

/*app.post('/api/todo', function(req, res) {


 res.json({body: req.body.text});
 });*/



/*app.get('/api/', function(req, res) {
 res.sendfile('./public/index.html');
 });*/




/*app.put('/api/todo', function(req, res) {

 todoS=req.body;
 res.send(todoS);
 //res.json({parameters: req.params, body: req.body});
 });
 */

app.use(function(err, req, res, next) {
    //console.log(err);

    switch (err.name) {
        case 'ValidationError':
           // res.sendStatus(400);
            return res.status(400).json(err);
        default:
            //console.log(err.name);
            return res.sendStatus(500);
    }
});

app.listen(8080);
