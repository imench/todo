'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest')
var expect = require('expect')
var Todo = require('./todo.model');
var User = require('../user/user.model');


describe('Todos Controller Unit Tests:', function () {
    var user = new User({
        username: 'username',
        password: 'password'
    });

    var user2 = new User({
        username: 'username2',
        password: 'password'
    });

    var todo3 = new Todo({
        name: 'Todo 3',
        done: false,
        owner: user
    });

    var todo4 = new Todo({
        name: 'Todo 4',
        done: true,
        owner: user
    });

    var anonymousAgent = request.agent(app);
    var userAgent = request.agent(app);
    var user2Agent = request.agent(app);

    beforeEach(function (done) {


        User.remove(function (err) {
            if (err) return done(err);

            Todo.remove(function (err) {
                if (err) return done(err);

                User.create([user, user2], function (err) {
                    if (err) return done(err);

                    Todo.create([todo3,todo4], function (err) {
                        if (err) return done(err);

                        userAgent
                            .post('/auth/local/login')
                            .send({
                                username: 'username',
                                password: 'password'
                            })
                            .expect(200, function (err) {
                                if (err) return done(err);

                                user2Agent
                                    .post('/auth/local/login')
                                    .send({
                                        username: 'username2',
                                        password: 'password'
                                    })
                                    .expect(200, done);
                            });
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
                .put('/api/todos/5512e9cf5a5e577a509f1d6f')
                .expect(404, done);
        });

        it('should update and return a JSON array for a logged in user', function (done) {
            userAgent
                .put('/api/todos/' + todo3._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);

                    should(res.body).be.an.Array;
                    should(res.body[0].done).be.true;

                    done()
                });
        });

        it('user cannot update other user\'s todos', function (done) {
            user2Agent
                .put('/api/todos/' + todo3._id)
                .expect(404, done);
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
                .delete('/api/todos/5512e9cf5a5e577a509f1d6f' )
                .expect(404, done);
        });

        it('should delete and return a JSON array for a logged in user', function (done) {
            userAgent
                .delete('/api/todos/' + todo3._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    should(res.body).be.an.Array;
                    done()
                });
        });

        it('user cannot delete other user\'s todos', function (done) {
            user2Agent
                .delete('/api/todos/' + todo3._id)
                .expect(404, done);
        });
    });

    describe('DELETE /api/todos/done', function () {
        it('should be unauthorized for anonymous users', function (done) {
            anonymousAgent
                .get('/api/todos')
                .expect(401, done);
        });

        it('should delete todos which are done and return a JSON array for a logged in user', function (done) {
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

        it('user cannot clean other user\'s todos', function (done) {
            user2Agent
                .delete('/api/todos/done')
                .expect(404, done);
        });
    });


});
