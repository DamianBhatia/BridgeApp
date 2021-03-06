const mongoose = require('mongoose')

// User Schema 
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followers:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    communities:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)