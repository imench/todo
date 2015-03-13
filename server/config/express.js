/**
 * Express configuration
 */

'use strict';
var config = require('../config/environment/development.js');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var path = require('path');

module.exports = function (app) {
    var env = app.get('env');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + '/../../client'));

    if ('production' === env) {
        app.use(express.static(path.join(config.root, 'public')));
        app.set('appPath', config.root + '/public');
    }

    if ('development' === env || 'test' === env) {
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', config.root + '/client');
    }

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

};