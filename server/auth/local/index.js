'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var router = express.Router();

router.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
router.post('/login', passport.authenticate('local'), function (req, res) {
 res.send(req.user);
 });

/*router.post('/login', function (req, res, next) {
    var authenticate = passport.authenticate('local', function (err, user) {
        if (err) return next(err);
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(user);
        });

    });

    authenticate(req, res, next);
});*/

// route to log out
router.post('/logout', function (req, res) {

    req.logOut();
    res.sendStatus(200);
});

router.post('/signup', function (req, res, next) {

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }, function (err, user) {
        if (err)
            return next(err);
        res.sendStatus(200);
    });
    // res.sendStatus(200);}
});


// ajax target for checking username
router.post('/signup/check/username', function (req, res, next) {

    User.findOne({
        username: req.body.username
    }, function (err, user) {
        //console.log(user);
        if (!user)
            return res.json({
                isUnique: true
            });
        else if (user)
            return res.json({
                isUnique: false
            });
        else
            return next(err);
    });

    // looks like everything is fine
    //res.send(200);
});

module.exports = router;