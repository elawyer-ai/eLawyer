const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("home");
  });


  app.get("/team", function(req,res){
    res.render("team");
  });


  app.get("/about", function(req,res){
    res.render("about");
  });


  app.get("/blog", function(req,res){
    res.render("blog");
  });


  app.get("/student", function(req,res){
    res.render("student");
  });


  app.get("/login", function(req,res){
    res.render("login");
  });


  app.get("/family", function(req,res){
    res.render("family");
  });

 


 
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
