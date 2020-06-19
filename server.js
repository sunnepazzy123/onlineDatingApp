const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const port = process.env.PORT || 8989;

//setup view engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public/admin")));


app.get("/", (req,res)=>{
    res.render("home", {
        title: "9jaDate"
});



app.listen(port, ()=>{
    console.log(`Server ${port} is running`);
});