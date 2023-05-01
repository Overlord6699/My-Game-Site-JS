const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')

require('dotenv').config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                //userId is given from auth.js
                const user = await User.findById(payload.userId).select('email user_id')

                if (user)
                    done(null, user)
                else
                    done(null, false)
            } catch (e) {
                console.log(e)
            }
        }),
    )
}