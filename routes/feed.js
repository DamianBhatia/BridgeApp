const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const User = require('../models/User')

// @desc    Feed Page
// @route   GET /feed
router.get('/', ensureAuth, async (req, res) => {

    let following = []

    for(let i = 0; i < req.user.following.length; i++) {
        let followingUser = await User.findOne({ _id: req.user.following[i]})
        following.push(followingUser.username)
    }

    let followers = []

    for(let i = 0; i < req.user.followers.length; i++) {
        let followersUser = await User.findOne({ _id: req.user.followers[i]})
        followers.push(followersUser.username)
    }

    res.render('feed', {
        layout: 'feed',
        username: req.user.username,
        following: following,
        followers: followers
    })
})

module.exports = router