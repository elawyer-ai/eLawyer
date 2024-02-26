const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');



const User = require('../models/User')
const Lawyer = require('../models/Lawyer')



const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/registerC', forwardAuthenticated, (req, res) => res.render('registerC'));

// require("../pass-port-config")(passport);

// router.use(passport.initialize());
// router.use(passport.session());


// router.get("/login", (req,res) => {
//     res.render("login");
//   });  


// router.get("/registerC", (req,res) => {
//   res.render("registerC");
// });

  router.get("/lawyer", (req,res) => {
    res.render("lawyer");
  });




  router.get("/registerL", (req,res) => {
    res.render("registerL");
  });

  router.get('/userClient', ensureAuthenticated, (req, res) =>
  res.render('userClient', {
    name: req.user.name
  })
);



  router.post('/registerC', (req, res) => {
    const { name, email, password, phone, pincode } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !phone || !pincode) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (phone.length > 10) {
      errors.push({ msg: 'Enter valid Phone' });
    }
    
    if (pincode.length > 7) {
      errors.push({ msg: 'Enter valid Pincode' });
    }
  
    if (errors.length > 0) {
      res.render('registerC', {
        errors,
        name,
        email,
        password,
        phone,
        pincode
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('registerC', {
            errors,
            name,
            email,
            password,
            phone,
            pincode
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            phone,
            pincode
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  })


  router.post('/registerL', (req, res) => {
    const { name, email, password, phone, copnum } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !phone || !copnum) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (phone.length > 10) {
      errors.push({ msg: 'Enter valid Phone' });
    }
    
    if (copnum.length > 7) {
      errors.push({ msg: 'Enter valid COP no.' });
    }
  
    if (errors.length > 0) {
      res.render('registerL', {
        errors,
        name,
        email,
        password,
        phone,
        copnum
      });
    } else {
      Lawyer.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('registerL', {
            errors,
            name,
            email,
            password,
            phone,
            copnum
          });
        } else {
          const newLawyer = new Lawyer({
            name,
            email,
            password,
            phone,
            copnum
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newLawyer.password, salt, (err, hash) => {
              if (err) throw err;
              newLawyer.password = hash;
              newLawyer
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/lawyer');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  })

  router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/userClient');
    });;
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
  

module.exports = router;