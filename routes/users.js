const express = require('express');
const router = express.Router();




router.get("/login", (req,res) => {
    res.render("login");
  });

  router.get("/lawyer", (req,res) => {
    res.render("lawyer");
  });


  router.get("/registerC", (req,res) => {
    res.render("registerC");
  });


  router.get("/registerL", (req,res) => {
    res.render("registerL");
  });

 

  router.get("/userClient", (req,res) => {
    res.render("userClient");
  });

  


module.exports = router;