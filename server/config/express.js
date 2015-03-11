/**
 * Express configuration
 */

'use strict';
var config = require('../config/environment/development.js');
var express = require('express');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');

module.exports = function (app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + '/../../client'));

    // app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

};