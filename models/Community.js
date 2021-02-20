const mongoose = require('mongoose')

// Community Schema 
const CommunitySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'public',
    },
    members:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Community', CommunitySchema)