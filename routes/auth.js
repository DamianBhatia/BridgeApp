const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

const User = require('../models/User')

// @desc    Login User
// @route   POST /auth/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/feed',
        failureRedirect: '/'
    })(req, res, next)
})


// @desc  Register User
// @route POST /auth/register
router.post('/register', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) return res.redirect('/') // user with email already exists

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })

            // Hashing the password and adding user to database
            bcrypt.hash(newUser.password, 10, (err, hash) => {
                if(err) throw err

                newUser.password = hash

                newUser.save()
                .then(() => {
                    console.log('User added successfully')
                    // Login the user once registered
                    passport.authenticate('local', { 
                        successRedirect: '/feed',
                        failureRedirect: '/'
                    })(req, res, next)
                })
                .catch(err => console.log(err))
            })

        }).catch(err => console.error(err))
})

// @desc    Logout
// @route   GET /logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router