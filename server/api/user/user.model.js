'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var validator = require('validator');

var UserSchema = new Schema({

    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    email: String,
    encrypted_password: {
        type: String
        /*validate: [
         function (password) {
         return password && password.length > 6;
         }, 'Password should be longer'
         ]*/
    },
    salt: {
        type: String
    }

});

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

User.schema.path('email')
    .validate(function (value) {

        return(validator.isEmail(value));


    }, 'Email is invalid');


module.exports = mongoose.model('User', UserSchema);