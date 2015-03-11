var config = require('./environment/development'),
    mongoose = require('mongoose');
module.exports = function() {
    var db = mongoose.connect(config.db);
    require('../api/todo/todo.model');
    require('../api/user/user.model');
    return db;
};
