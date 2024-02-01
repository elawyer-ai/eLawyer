const express = require('express');
const router = express.Router();

  router.get("/team", (req,res) => {
   res.render("team");
  });

  router.get("/about", (req,res) => {
    res.render("about");
  });


  router.get("/blog", (req,res) => {
    res.render("blog");
  });

  
  router.get("/", (req,res) => {
    res.render("home");
  });

  router.get("/family", (req,res) => {
    res.render("family");
  });



module.exports = router;