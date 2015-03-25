var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var User = require('../user/user.model');

var TodoSchema = new Schema({
    name: {type: String, required: true},
    done: Boolean,
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

var Todo = mongoose.model('Todo', TodoSchema);

Todo.schema.path('name')
    .validate(function (value, respond) {
        Todo.find({'owner': this.owner, 'name': value.toLowerCase()}, function (err, todos) {
            respond(!err && todos.length === 0);
        });
    }, 'exists');

module.exports = mongoose.model('Todo', TodoSchema);