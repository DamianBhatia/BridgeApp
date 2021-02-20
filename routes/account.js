const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')

//@desc     User profile
//@route    GET /account/:userID
router.get('/:userID', ensureAuth, async (req, res) => {

    // Get username of every user that the current user is following
    let following = []

    for(let i = 0; i < req.user.following.length; i++) {
        let followingUser = await User.findOne({ _id: req.user.following[i]})
        following.push(followingUser.username)
    }

    // Get username of every user that follows the current user
    let followers = []

    for(let i = 0; i < req.user.followers.length; i++) {
        let followersUser = await User.findOne({ _id: req.user.followers[i]})
        followers.push(followersUser.username)
    }
  

    const user = req.user
    user.layout = 'account'
    user.following = following
    user.followers = followers

    res.render('account', user)
})

module.exports = router