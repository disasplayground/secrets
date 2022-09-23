//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

console.log(md5("123456"));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


//USER DATABASE//

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const User = new mongoose.model("user", userSchema);


//EXPRESS GET//

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


//EXPRESS POST//

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save(function(err){
    if(err){
      console.log(err)
    } else {
      res.render("secrets");
    };
  });
});

app.post("/login", function(req, res){

  User.findOne({email: req.body.username}, function(err, foundUser){
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        if (foundUser.password === md5(req.body.password)) {
          res.render("secrets");
        };
      };
    };
  });
});


//CONNECTION//

app.listen(3000, function(){
  console.log("Server started on port 3000.")
});
