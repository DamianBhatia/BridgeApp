const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Community = require('../models/Community')
const User = require('../models/User')

// @desc    Search for a community
// @route   POST /search/community
router.post('/community', ensureAuth, async (req, res) => {
    try {
        const communities = await Community.find({ name: {$regex : ".*"+req.body.community+".*"}, status: 'public' }).lean()
        const notFollowing = await User.find({ username: {$regex: ".*"+req.body.community+".*"}, followers: { $nin: req.user._id }}).lean()
        const following = await User.find({ username: {$regex : ".*"+req.body.community+".*"}, followers: req.user._id }).lean()

        const dataOBJ = {
            layout: 'search',
            search: req.body.community,
            results: communities,
            following_users: following,
            notfollowing_users: notFollowing,
            _id: req.user._id
        }

        return res.render('search', dataOBJ)
    } catch (err) {
        console.error(err)
    }

})

// @desc    Search for a community
// @route   GET /search/community
router.get('/community', ensureAuth, (req, res) => {
    return res.render('search', {
        layout: 'search',
        _id: req.user._id
    })
})

module.exports = router