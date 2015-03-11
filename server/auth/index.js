'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./passport')();
require('./local/local').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;