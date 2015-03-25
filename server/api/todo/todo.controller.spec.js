'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Todo = require('./todo.model');
var User = require('../user/user.model');




describe('Todos Controller Unit Tests:', function () {
    var user = new User({
        username: 'username3',
        password: 'password'
    });

    var todo3 = new Todo ({
        name: 'Todo 3',
        done: true,
        owner:user
    });

    var anonymousAgent = request.agent(app);
    var userAgent = request.agent(app);

    beforeEach(function(done) {


        User.remove(function(err) {
            if (err) return done(err);

            Todo.remove(function(err) {
                if (err) return done(err);

            User.create(user, function(err) {
                if (err) return done(err);

                Todo.create(todo3, function(err) {
                    if (err) return done(err);

                userAgent
                    .post('/auth/local/login')
                    .send({
                        username: 'username3',
                        password: 'password'
                    })
                    .end(done);

                });
            });
          });
        });
    });


    describe('GET /api/todos', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

        it('should return a JSON array for a logged in user', function (done) {
            userAgent
                .get('/api/todos')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });
    });

    describe('POST /api/todos', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

        it('should create and return a JSON array for a logged in user', function (done) {
            userAgent
                .post('/api/todos')
                .send(todo3)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });
    });

    describe('PUT /api/todos', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

        it('should return a 404 not found', function (done) {
            userAgent
                .put('/api/todos/'+ user._id)
                .expect(404, done);
        });

        it('should update and return a JSON array for a logged in user', function (done) {
            userAgent
                .put('/api/todos/'+ todo3._id)
                //.send(todo3._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });
    });

   describe('DELETE /api/todos', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

       it('should return a 404 not found', function (done) {
           userAgent
               .delete('/api/todos/'+ user._id)
               .expect(404, done);
       });

        it('should delete and return a JSON array for a logged in user', function (done) {
            userAgent
                .delete('/api/todos/'+ todo3._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });
    });

    describe('DELETE /api/todos/done', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

        it('should delete and return a JSON array for a logged in user', function (done) {
            userAgent
                .delete('/api/todos/done')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });
    });



});
