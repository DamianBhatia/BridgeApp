const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')

// @desc    Feed Page
// @route   GET /feed
router.get('/', ensureAuth, async (req, res) => {

    const user = await User.findOne({ _id: req.user._id })
                        .populate('communities')
                        .lean()

    user.layout = 'feed'

    res.render('feed', user)
})

module.exports = router