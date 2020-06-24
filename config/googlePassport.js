const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose = require("mongoose");
const  User = require("../models/user");
const  keys = require("./key");

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientId,
        clientSecret: keys.googleSecretId,
        callbackURL: "http://localhost:8989/auth/google/callback",
    },
    
     (accessToken, refreshToken, profile, done)=>{
        console.log(profile);

        User.findOne({google: profile.id}, (err, user)=>{

            if(err){
                return done(err);
            }   //If User exist
            if(user){
                return done(null, user);
            }else{
    
                const newUser = {
                    google: profile.id,
                    fullName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
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
    }
    
    ));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    
    passport.deserializeUser((id, done)=>{
        // done(null, user.id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}