const express = require('express');
const router = express.Router();


router.get("/login", function(req,res){
    res.render("login");
  });


  router.get("/registerC", (req,res) => {
    res.render("registerC");
  });


  router.get("/registerL", function(req,res){
    res.render("registerL");
  });


module.exports = router;