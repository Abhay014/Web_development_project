const express = require('express');
const user = require('../modules/user');
const router = express.Router();
const User = require('../modules/user');
const catchAsync = require('../utils/catchAsync');
const { route } = require('./campground');
const passport = require('passport')
const users = require('../controllers/users')


// routes for registration
router.get('/register', users.renderRegister)
router.post('/register', catchAsync(users.register));



// routes for logging a user in
router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login)

// routes for loggout of a user
router.get('/logout', users.logout)

module.exports = router;
