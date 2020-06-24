const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const app = express();
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require('passport');




//setup view engine
app.engine("handlebars", exphbs({defaultLayout: "home", handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set("view engine", "handlebars");



//BODY PARSER
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//config sessions for authentication
app.use(cookieParser());
app.use(session({
    secret: "mySecret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

//SESSION FLASH SETUPS 
app.use(flash());

// //LOCAL VARIABLES USING MIDDLEWARES
app.use((req,res,next)=>{


    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.error_message = req.flash('error_message');
    res.locals.success_message = req.flash("success_message");
    res.locals.delete_message = req.flash("delete_message");
    
        next();
    
    
    
    });


// //PASSPORT 
app.use(passport.initialize());
app.use(passport.session());



//load the keys
const keys = require("./config/key");

mongoose.connect(keys.mongoDbUrl, {useUnifiedTopology: true, useNewUrlParser: true } )
        .then(db=>{
            console.log("Mongo Connect");
        }).catch(error => console.log(error));
 


//set public folder to static file
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public/admin")));



//LOAD ROUTE
const home = require("./routes/home/main");
const admin = require("./routes/admin/index");



//USE ROUTE
app.use("/", home);
app.use("/admin", admin);




//setup environment port
const port = process.env.PORT || 8989;



app.listen(port, ()=>{
    console.log(`Server ${port} is running`);
});