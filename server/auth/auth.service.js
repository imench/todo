'use strict';
var config = require('../config/environment');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');


// Define a middleware function to be used for every secured routes
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.sendStatus(401);
    else
        next();
};

exports.auth = auth;
