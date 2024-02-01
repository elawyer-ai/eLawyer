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

  
  router.get("/criminal", (req,res) => {
    res.render("criminal");
  });


  router.get("/corporate", (req,res) => {
    res.render("corporate");
  });


  router.get("/govt", (req,res) => {
    res.render("govt");
  });


  router.get("/civil", (req,res) => {
    res.render("civil");
  });


  router.get("/property", (req,res) => {
    res.render("property");
  });
  

  
  router.get("/case", (req,res) => {
    res.render("case");
  });

  
  router.get("/consult", (req,res) => {
    res.render("consult");
  });


module.exports = router;