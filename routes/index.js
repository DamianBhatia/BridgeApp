const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Landing/Login Page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc    Register Page
// @route   GET /
router.get('/register', ensureGuest, (req, res) => {
    res.render('register', {
        layout: 'login'
    })
})

module.exports = router