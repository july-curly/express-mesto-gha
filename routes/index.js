const express = require('express');

const router = express.Router();
const signup = require('./signup');
const signin = require('./signin');
const auth = require('../middlewares/auth');

router.use('/signup', signup);
router.use('/signin', signin);
router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;
