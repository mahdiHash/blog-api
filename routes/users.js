const express = require('express');
const router = express.Router();

router.post('/signup', require('../controllers/users/signup'));

router.post('/login', require('../controllers/users/login'));

router.get('/:username', require('../controllers/users/userProfile'));

router.delete('/:username', require('../controllers/users/deleteUser'));

router.put('/:username', require('../controllers/users/editUserProfile'));

module.exports = router;
