const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

        User.findOne({ email: email })
        .then(user => {
            if(!user) return done(null, false)  // No User Exists

            // Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err

                if(isMatch) {
                    return done(null, user)
                } else { // Wrong password
                    return done(null, false)
                }
            })

        })
        .catch(e => {
            console.error(e)
            return done(null, false)
        })
    }))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))
}