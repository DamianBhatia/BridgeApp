const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User = require('../models/User')

//@desc     User profile
//@route    GET /account/:userID
router.get('/:userID', ensureAuth, async (req, res) => {

    const user = await User.findOne({ _id: req.user._id })
                        .populate('following')
                        .populate('followers')
                        .lean()

    user.layout = 'account'

    res.render('account', user)
})

module.exports = router