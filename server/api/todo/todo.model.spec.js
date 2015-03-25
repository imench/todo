'use strict';

var should = require('should');
var app = require('../../app');
var Todo = require('./todo.model');
var User = require('../user/user.model');

var user = new User({
    name: 'Imen',
    email: 'test@test.com',
    password: 'password'
});

var todo = new Todo({
    name: 'Todo 1',
    done: true,
    owner:user
});

describe('Testing the save method', function() {
    it('Should be able to save without problems', function(done) {
        todo.save(function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('Should not be able to save a todo without a title', function(done) {
            todo.name = '';
            todo.save(function(err) {
                should.exist(err);

                done();
            });
        });
});