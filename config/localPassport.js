const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose");
const  User = require("../models/user");

module.exports = function(passport){
  
    passport.use(new LocalStrategy({usernameField: "email"}, (email, password,done)=>{

        // console.log(email)
    
        User.findOne({email: email}).then(user=>{
            
            if(!user) return done(null, false, {message: "No user found"});
    
            if(password === user.password){
                    return done(null, user);
               
            }else{
                    return done(null, false, {message: "Incorrect Password"})
    
            }
            
     
        });
    
    
    
    }));
    
    

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