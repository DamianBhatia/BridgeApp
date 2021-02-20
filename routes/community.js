const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Community = require('../models/Community')
const User = require('../models/User')
const Post = require('../models/Post')

// @desc    Make new community page
// @route   GET /community/new
router.get('/new', ensureAuth, async (req, res) => {
    res.render('community/new', {
        layout: 'feed',
        _id: req.user._id
    })
})

// @desc    Create the new community
// @route   POST /community/create
router.post('/create', ensureAuth, async (req, res) => {
    try {
        // Community with name already exists
        const community = await Community.findOne({ name: req.body.name })
        if(community) return res.redirect('/community/new')

        const newCommunity = new Community({
            owner: req.user._id,
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            members: [req.user._id]
        })

        // Save and add community to user
        newCommunity.save()
        .then(async () => {
            await User.findByIdAndUpdate({ _id: req.user._id }, {
                $addToSet: {
                    communities: newCommunity._id
                }
            })


            console.log('New Community Created!')
            return res.redirect('/feed')
        })

    } catch(err) {
        console.error(err)
    }
})

// @desc    Show Community Page
// @route   GET /community/:commID
router.get('/:commID', ensureAuth, async (req, res) => {

    const community = await Community.findOne({ _id: req.params.commID })
                            .populate({
                                path: 'posts',
                            })
                            .lean()

    if(!community) return res.redirect('/feed') // Community does not exist

    community.layout = 'feed'

    res.render('community/show', community)
})


// @desc    Add new post page
// @route   GET /community/:commID/new/post
router.get('/:commID/new', ensureAuth, (req, res) => {

    res.render('post/new', {
        layout: 'feed',
        _id: req.params.commID
    })
})


// @desc    Create post
// @route   POST /community/:commID/create
router.post('/:commID/create', ensureAuth, async (req, res) => {
    try {

        const check = await Post.findOne({ title: req.body.title })
        if(check) return res.redirect('/community/'+req.params.commID)

        const newPost = new Post({
            owner: req.user._id,
            title: req.body.title,
            body: req.body.body
        })
        
        newPost.save()
        .then(async () => {
            await Community.findByIdAndUpdate({ _id: req.params.commID }, {
                $addToSet: {
                    posts: newPost
                }
            })

            return res.redirect('/community/'+req.params.commID)
        })
        .catch(err => console.error(err)) 
    } catch(err) {
        console.error(err)
    }
})

// @desc    Subscribe to a community
// @route   POST /community/subscribe/:communityID
router.post('/subscribe/:communityID', ensureAuth, (req, res) => {
    User.findByIdAndUpdate({ _id: req.user._id }, {
        $addToSet: {
            communities: req.params.communityID
        }
    }).then(async () => {

        await Community.findByIdAndUpdate({ _id: req.params.communityID }, {
            $addToSet: {
                members: req.user._id
            }
        })

        res.redirect('/feed')
    }).catch(err => console.error(err))
})

module.exports = router