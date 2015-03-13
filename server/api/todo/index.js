'use strict';

var express = require('express');
var controller = require('./todo.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.auth, controller.index);
router.post('/', auth.auth, controller.create);
router.put('/:todo_id', auth.auth, controller.update);
router.delete('/done', auth.auth, controller.cleanall);
router.delete('/:todo_id', auth.auth, controller.destroy);

module.exports = router;