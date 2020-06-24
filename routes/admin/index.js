const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const User = require("../../models/user");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require("../../config/key");
const { ensureGuest, requireLogin } = require("../../helpers/auth");




// const bcrypt = require('bcryptjs');
// const LocalStrategy = require('passport-local').Strategy;


router.all("/*", (req, res, next)=>{

    req.app.locals.layout = "admin";
    next();


});



router.get("/", requireLogin,  (req, res)=>{

    User.findById({_id: req.user._id}).then(user=>{


        if(user){

            user.online = true;
            user.save((err, user)=>{
                if(err) {
                    throw err;
                }else{

                    res.render("admin/profile", {
                        title: "Profile",
                        user: user
                    });

                }
                
            })


       
        }
    });

});


router.get("/logout", (req, res)=>{

        User.findById({_id: req.user._id}).then(user=>{
            user.online = false;

            user.save((err, user)=>{
                if(err){
                    throw err;
                }
                if(user){

                    req.logOut();
                    res.redirect("/");
                }
            })
        })




});






module.exports = router;