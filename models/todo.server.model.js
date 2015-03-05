var mongoose = require('mongoose');
//crypto = require('crypto'),
Schema = mongoose.Schema;
crypto = require('crypto'),
    Schema = mongoose.Schema;
var session = require('express-session');
//var ValidationError = require('mongoose/lib/errors/validation');
//var ValidatorError =  require('mongoose/lib/errors/validator');

var UserSchema = new Schema({

    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    email: String,
    password: {
        type: String
        /*validate: [
            function (password) {
                return password && password.length > 6;
            }, 'Password should be longer'
        ]*/
    }
    /*salt: {
     type: String
     },
     provider: {
     type: String,
     required: 'Provider is required'
     },
     providerId: String,
     providerData: {},
     created: {
     type: Date,
     default: Date.now
     }*/
});
/*UserSchema.pre('save', function(next) {
 if (this.password) {
 this.salt = new
 Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
 this.password = this.hashPassword(this.password);
 }
 next();
 });*/
/*
 UserSchema.methods.hashPassword = function(password) {
 return crypto.pbkdf2Sync(password, this.salt, 10000,
 64).toString('base64');
 };*/
UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,
        64).toString('base64');
};

//var virtual = UserSchema.virtual('encrypted_password');
UserSchema.virtual('password').set(function (v) {
    this.salt = new
        Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.encrypted_password = this.hashPassword(v);


});

UserSchema.methods.authenticate = function (password) {
    return this.encrypted_password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};

var User = mongoose.model('User', UserSchema);

User.schema.path('username')
    .validate(function (value, respond) {
        //console.log(this.owner);
        User.find({'username': value.toLowerCase()}, function (err, users) {
            //console.log(err);
            respond(!err && users.length === 0);
            /*Todo.findOne({name: value, 'owner': this.owner}, function(err, todo) {
             if(err) throw err;
             if(todo) return respond(false);
             respond(true);*/
        });
    }, 'username exists');

var TodoSchema = new Schema({
    name: String,
    done: Boolean,
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    }

});


/*Todo.path('name')
 .validate(function (value, respond) {
 //var TodoModel = mongoose.model('TodoSchema');
 Todo.find({'name': value.toLowerCase()}, function (err, todos) {
 respond(!err && todos.length === 0);
 });
 }
 , 'exists'
 );*/

var Todo = mongoose.model('Todo', TodoSchema);

Todo.schema.path('name')
    .validate(function (value, respond) {
        //console.log(this.owner);
        Todo.find({'owner': this.owner, 'name': value.toLowerCase()}, function (err, todos) {
            //console.log(err);
            respond(!err && todos.length === 0);
            /*Todo.findOne({name: value, 'owner': this.owner}, function(err, todo) {
             if(err) throw err;
             if(todo) return respond(false);
             respond(true);*/
        });
    }, 'exists');

//mongoose.model('Todo', TodoSchema);

/*var Toy = mongoose.model('Toy', toySchema);

 Toy.schema.path('color').validate(function (value) {
 return /blue|green|white|red|orange|periwinkle/i.test(value);
 }, 'Invalid color');*/


/*TodoSchema.pre('create', function(err,next){

 if (err && err.errors && err.errors.name) {
 //var error = new ValidationError(this);
 //error.errors.name = new ValidatorError('name', 'exists', this.name);
 var error = new Error();
 error.name = 'NameExists'
 error.message = 'The name is not unique.';
 return next(error);

 }
 });*/
