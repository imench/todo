'use strict';

//var _ = require('lodash');
var Todo = require('./todo.model');

// Get list of todos
exports.index = function (req, res, next) {
    Todo.find({
        owner: req.user.id
    }, function (err, todoS, next) {
        if (err)
            return next(err);
        res.json(todoS);
    });
};

// Creates a new todo in the DB.
exports.create = function (req, res, next) {
    Todo.create({
        name: req.body.name,
        done: false,
        owner: req.user.id
    }, function (err) {
        if (err)
            return next(err);


        Todo.find({
            owner: req.user.id
        }, function (err, todos) {
            if (err)
                return next(err);
            res.json(todos);
        });
    });
};

// Updates an existing todo in the DB.
exports.update = function (req, res, next) {
    Todo.update({_id: req.params.todo_id, owner: req.user.id }, { $set: { done: true }}, function (err, todo) {
        if(!todo)
            return res.status(404).json(err);
        if (err)
            return next(err);

        // get and return all the todos after you create another
        Todo.find({
            owner: req.user.id
        }, function (err, todos) {
            if (err)
                return next(err);
            res.json(todos);
        });
    });
};

// Deletes todos which are done from the DB.
exports.cleanall = function (req, res, next) {
    Todo.remove({
        done: true, owner: req.user.id
    }, function (err, todo) {
        //console.log("f1");
        if(!todo)
            return res.status(404).json(err);
        if (err)
            return next(err);

        // get and return all the todos after you create another
        Todo.find({
            owner: req.user.id
        }, function (err, todos) {
            //console.log("f2");
            if (err)
                return next(err);
            res.json(todos);
        });
    });

};

// Deletes a todo from the DB.
exports.destroy = function (req, res, next) {
    Todo.remove({
        _id: req.params.todo_id, owner: req.user.id
    }, function (err,todo) {
        if(!todo)
            return res.status(404).json(err);
        if (err)
            return next(err);

        // get and return all the todos after you create another
        Todo.find({
            owner: req.user.id
        }, function (err, todos) {
            if (err)
                return next(err);
            res.json(todos);
        });
    });
};



