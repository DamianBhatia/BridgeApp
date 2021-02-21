const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Post = require('../models/Post')
const Reply = require('../models/Reply')

// @desc    Create reply
// @route   POST /post/:postID/reply
router.post('/:postID/reply', ensureAuth, async (req, res) => {
    try {
        const newReply = new Reply({
            owner: req.user._id, 
            body: req.body.reply
        })

        newReply.save()
        .then(async () => {
            await Post.findByIdAndUpdate({ _id: req.params.postID}, {
                $push: {
                    replies: newReply._id
                }
            })

            return res.redirect('/post/'+req.params.postID)
        })
        .catch(err => console.error(err))

    } catch(err) {
        console.error(err)
    }
})

// @desc    Display Post
// @route   GET /post/:postID
router.get('/:postID', ensureAuth, async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postID })
                        .populate({
                            path: 'owner',
                        })
                        .populate({
                            path: 'replies',
                            populate: 'owner'
                        })
                        .lean()

    if(!post) return res.render('/error/404')
    
    post.layout = 'post'

    res.render('post/show', post)
})

// @desc    Like Post
// @route   POST /post/:postID/like
router.post('/:postID/like', ensureAuth, async (req, res) => {
    
    const liked = await Post.findOne({ _id: req.params.postID, likes: req.user._id })
    
    if(liked) {
        await Post.findByIdAndUpdate({ _id: liked._id }, {
            $pull: {
                likes: req.user._id
            }
        })

        return res.redirect('/post/'+req.params.postID)
    } else {
        await Post.findByIdAndUpdate({ _id: req.params.postID }, {
            $addToSet: {
                likes: req.user._id
            }
        })
        return res.redirect('/post/'+req.params.postID)
    }
})

module.exports = router