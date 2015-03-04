var config = require('./config/env/development');
var mongoose = require('./config/mongoose');
var express = require('express');
var passportConfig = require('./config/passport');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');




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

// dummy db
/*var dummyDb = [
    {username: 'john', email: 'john@email.com'},
    {username: 'jack', email: 'jack@email.com'},
    {username: 'jim', email: 'jim@email.com'}
];*/



//validator.isEmail('foo@bar.com'); //=> true

app.post('/api/signup', function(req, res, next) {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var verification = req.body.verification;

    var error = null;
    // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
   // var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

    // check for valid inputs
    console.log("post received: %s %s %s %s", username, password, email, verification);
    if (!username || !email || !password || !verification) {
        error = 'All fields are required';
    } else if (!validator.isEmail(email)) {
        error = 'Email is invalid';
    }

    if (error) {

        return res.status(403).json({
            error: error
        });

    }
  /*  var body = req.body;

    User.findOne({ username: body.username
    },function(err, user) {
        if (err)
            res.send(500, {'message': err});
            //res.status(500).json(err);
            //return next(err);
        if (user) {
            res.send(403, {'message': 'User already exist!'});
            //res.status(400).json(err);
            //return next(err);
        }else {
            var newUser = new User({ username: body.username,email: body.email, password:body.password})
            newUser.save(function (err, user) {
                if (err){
                    res.send(500, {'message': err});
                    //res.status(500).json(err);
                    //return next(err);
                }
                 res.json({ 'message': 'User was successfully registered!'});
            });
        }
    });*/
    else{
    User.create({
        username: username,
        email: email,
        password: password
    }, function (err, user) {
        if (err)
            return next(err);
});
        res.sendStatus(200);}
});
/*app.post('/api/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    //var verification = req.body.verification;

    console.log("post received: %s %s %s", username, password, email);
});*/


// ajax target for checking username
app.post('/api/signup/check/username', function(req, res, next) {
    /*var username = req.body.username;
    console.log("post received: %s %s %s", username, password, email);
  /* var username = req.body.username;
   console.log("post received: %s %s %s", username, password, email);
    // check if username contains non-url-safe characters
    if (username !== encodeURIComponent(username)) {
        res.json(403, {
            invalidChars: true
        });
        return;
    }
    // check if username is already taken - query your db here
    var usernameTaken = false;
    for (var i = 0; i < dummyDb.length; i++) {
        if (dummyDb[i].username === username) {
            usernameTaken = true;
            break;
        }
    }
    if (usernameTaken) {
        return res.json(403, {
            isUnique: true
        });

    }*/

   User.findOne({
        username: req.body.username
    }, function (err, user) {
       //console.log(user);
       if (!user)
            return res.json( {
                isUnique: true
            });
       else if(user)
            return res.json({
                isUnique: false
            });
       else
       return next(err);
    });

    // looks like everything is fine
    //res.send(200);
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
