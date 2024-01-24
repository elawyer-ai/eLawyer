const express = require('express');
const router = express.Router();

  router.get("/team", function(req,res){
   res.render("team");
  });

  router.get("/about", function(req,res){
    res.render("about");
  });


  router.get("/blog", function(req,res){
    res.render("blog");
  });


  router.get("/student", function(req,res){
    res.render("student");
  });

  router.get("/", function(req,res){
    res.render("home");
  });

  router.get("/family", function(req,res){
    res.render("family");
  });



module.exports = router;