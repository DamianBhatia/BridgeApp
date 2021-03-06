const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const User = require('../models/User')

// @desc    Follow another user
// @route   POST /follow/add
router.post('/add/:id', ensureAuth, async (req, res) => {
   try {
        // Cannot follow yourself
        if(req.params.id === req.user._id) return res.redirect('/feed')

        const userToFollow = await User.findOne({ _id: req.params.id }).lean()
        if(!userToFollow) {
            console.log('User not found')
            return res.redirect('/feed')
        } 

        // Add user to following list
        const user = await User.findByIdAndUpdate({
            _id: req.user._id
        }, {
            $addToSet: {
                following: userToFollow._id
            }
        })

        // Add user to followers list
        const user2 = await User.findByIdAndUpdate({
            _id: userToFollow._id
        }, {
            $addToSet: {
                followers: req.user._id
            }
        })

        return res.redirect('/search/community')
   } catch(err) {
       console.error(err)
   }
})


//@desc     Unfollow a user
//@route    POST follow/remove
router.post('/remove/:id', async (req, res) => {
    try {
        // Cannot unfollow yourself
        if(req.params.id === req.user._id) return res.redirect('/feed')

        const userToFollow = await User.findOne({ _id: req.params.id }).lean()
        if(!userToFollow) {
            console.log('User not found')
            return res.redirect('/feed')
        } 

        // Remove user from following list
        const user = await User.findByIdAndUpdate({
            _id: req.user._id
        }, {
            $pull: {
                following: userToFollow._id 
            }
        })

        // Remove user from followers list
        const user2 = await User.findByIdAndUpdate({
            _id: userToFollow._id
        }, {
            $pull: {
                followers: req.user._id
            }
        })

        return res.redirect('/search/community')
   } catch(err) {
       console.error(err)
   }
})

module.exports = router