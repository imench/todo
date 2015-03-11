'use strict';

//var _ = require('lodash');
var User = require('./user.model');

exports.index = function(req, res) {
    res.send([
        {name: "admin"},
        {name: "user2"}
    ]);
};
