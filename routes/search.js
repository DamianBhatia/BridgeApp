const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Community = require('../models/Community')

// @desc    Search for a community
// @route   POST /search/community
router.post('/community', ensureAuth, async (req, res) => {
    try {
        const communities = await Community.find({ name: {$regex : ".*"+req.body.community+".*"}, status: 'public' }).lean()

        const dataOBJ = {
            layout: 'feed',
            search: req.body.community,
            results: communities
        }

        return res.render('search', dataOBJ)
    } catch (err) {
        console.error(err)
    }

})

module.exports = router