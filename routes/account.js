const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')
const Post = require('../models/Post')

//@desc     User profile
//@route    GET /account/:userID
router.get('/:userID', ensureAuth, async (req, res) => {

    const user = await User.findOne({ _id: req.user._id })
        .populate('following')
        .populate('followers')
        .lean()

    const posts = await Post.find({ owner: req.user._id })
        .sort({ createdAt: 'desc' })
        .lean()

    user.layout = 'account'
    user.posts = posts

    res.render('account', user)
})

module.exports = router