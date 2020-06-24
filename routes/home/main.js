const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const User = require("../../models/user");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require("../../config/key");
const { ensureGuest } = require("../../helpers/auth");

require("../../config/googlePassport")(passport)
require("../../config/facebookPassbook")(passport)
require("../../config/localPassport")(passport)




// const bcrypt = require('bcryptjs');
// const LocalStrategy = require('passport-local').Strategy;


router.all("/*", (req, res, next)=>{

    req.app.locals.layout = "home";
    next();


});




router.get("/", ensureGuest, (req,res)=>{


    res.render("home", {
        title: "9jaDate"
    });


});

router.get("/auth/facebook", passport.authenticate("facebook", {
    scope: ["email"]
}) );

router.get("/auth/facebook/callback", passport.authenticate("facebook",{
    successRedirect: "/admin",
    failureRedirect: "/"
}) );





router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile"]
}) );

router.get("/auth/google/callback", passport.authenticate("google",{
    successRedirect: "/admin",
    failureRedirect: "/"
}) );



router.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/",
        failureFlash: true
    })(req,res, next);

});

//CREATING OUR REGISTER ROUTING
router.post("/register",(req, res)=>{

    //CREATE AN ERROR MESSAGE
    let errors = [];


    if(!req.body.firstName) {

        errors.push({message: 'please add a First Name'});

    }


    if(!req.body.lastName) {

        errors.push({message: 'please add a Last Name'});

    }

    if(!req.body.email) {

        errors.push({message: 'please add an Email'});

    }

    if(!req.body.password) {

        errors.push({message: 'please enter a password'});

    }


    if(!req.body.confirmPassword) {

        errors.push({message: 'This field cannot be blank'});

    }


    if(req.body.password !== req.body.confirmPassword) {

        errors.push({message: "Password fields don't match"});

    }


 if(errors.length > 0){

        res.render('home/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        });

    } else {
        
User.findOne({email: req.body.email}).then(userFound=>{

    if(!userFound){
             //INSTANCIATING THE MODEL CLASS
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,      
        });

    //SAVING THE MODEL INSTANCE
    newUser.save().then(user=>{


            res.render("admin/" , {user})



        });

            } else {

                req.flash('error_message', 'That email exist please login');
                res.redirect('/register');

            }


        });

   



    }
    
});






router.get("/contact", (req, res)=>{

    res.render("home/contact", {
        title: "Contact"
    });
});


router.post("/contact", (req, res)=>{

    const newMessage = {
        fullName: req.body.name,
        email: req.body.email,
        message: req.body.message,
    }

    new Message(newMessage).save((err, message)=>{

        if(err) throw err;

        Message.find({}).then(messages=>{
            if(messages){
                res.render("newMessage", {
                    title: "Sent",
                    message: messages
                });

            }else{

                res.render("newMessage", {
                    title: "Message not Found",
                    message: messages
                });
            }
        })

    });
   

 
});





module.exports = router;