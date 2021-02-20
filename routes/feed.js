const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

// @desc    Feed Page
// @route   GET /feed
router.get('/', ensureAuth, async (req, res) => {
    res.render('feed', {
        layout: 'feed',
        _id: req.user._id
    })
})

module.exports = router