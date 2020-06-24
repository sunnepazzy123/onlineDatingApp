const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require("mongoose");
const  User = require("../models/user");
const  keys = require("./key");

module.exports = function(passport){
  
passport.use(new FacebookStrategy({
    clientID: keys.facebookAppId,
    clientSecret: keys.facebookSecretKey,
    callbackURL: "http://localhost:8989/auth/facebook/callback",
    profileFields: ["email", "name", "displayName", "photos"]
}, (accessToken, refreshToken, profile, done)=>{

    console.log(profile);

    User.findOne({facebook: profile.id}, (err, user)=>{

        if(err){
            return done(err);
        }   //If User exist
        if(user){
            return done(null, user);
        }else{

            const newUser = {
                facebook: profile.id,
                fullName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: `https://graph.facebook.com/${profile.id}/picture?
                type=large`,
                email: profile.emails[0].value
            }

            new User(newUser).save((err, user)=>{

                if(err){
                    return done(err)
                }

                if(user){
                    console.log(user)
                    return done(null, user)
                }
            });






        }

    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
}