const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



// const User = require('../models/User')
// const Lawyer = require('../models/Lawyer')




const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');




router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/registerC', forwardAuthenticated, (req, res) => res.render('registerC'));

  router.get("/lawyer", (req,res) => {
    res.render("lawyer");
  });




  router.get("/registerL",  (req,res) => {
    res.render("registerL");
  });

  router.get('/userClient', ensureAuthenticated, (req, res) =>
  res.render('userClient', {
    name: req.user.name
  })
);



  // router.post('/registerC', (req, res) => {
  //   const { name, email, password, phone, pincode } = req.body;
  //   let errors = [];
  
  //   if (!name || !email || !password || !phone || !pincode) {
  //     errors.push({ msg: 'Please enter all fields' });
  //   }
  
  //   if (password.length < 6) {
  //     errors.push({ msg: 'Password must be at least 6 characters' });
  //   }
  
  //   if (phone.length > 10) {
  //     errors.push({ msg: 'Enter valid Phone' });
  //   }
    
  //   if (pincode.length > 7) {
  //     errors.push({ msg: 'Enter valid Pincode' });
  //   }
  
  //   if (errors.length > 0) {
  //     res.render('registerC', {
  //       errors,
  //       name,
  //       email,
  //       password,
  //       phone,
  //       pincode
  //     });
  //   } else {
  //     User.findOne({ email: email }).then(user => {
  //       if (user) {
  //         errors.push({ msg: 'Email already exists' });
  //         res.render('registerC', {
  //           errors,
  //           name,
  //           email,
  //           password,
  //           phone,
  //           pincode
  //         });
  //       } else {
  //         const newUser = new User({
  //           name,
  //           email,
  //           password,
  //           phone,
  //           pincode
  //         });
  
  //         bcrypt.genSalt(10, (err, salt) => {
  //           bcrypt.hash(newUser.password, salt, (err, hash) => {
  //             if (err) throw err;
  //             newUser.password = hash;
  //             newUser
  //               .save()
  //               .then(user => {
  //                 req.flash(
  //                   'success_msg',
  //                   'You are now registered and can log in'
  //                 );
  //                 res.redirect('/login');
  //               })
  //               .catch(err => console.log(err));
  //           });
  //         });
  //       }
  //     });
  //   }
  // })


//   router.post("/registerL", async (req, res) => {

//     const data = {
//         email: req.body.email,
//         name: req.body.name,
//         password: req.body.password,
//         phone: req.body.phone,
//         copnum: req.body.copnum
//     }

//     const existingUser = await Lawyer.findOne({ email: data.email });

//     if (existingUser) {
//         res.send('User already exists. Please choose a different username.');
//     } else {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//         data.password = hashedPassword;

//         // const userdata = await Lawyer.insertMany(data);
//         // console.log(userdata);
//         res.redirect('/lawyer');
//     }

// });

// router.post("/lawyer", async (req, res) => {
//     try {
//         const check = await Lawyer.findOne({ email: req.body.email });
//         if (!check) {
//             res.send("User name cannot found")
//         }
//         const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//         if (!isPasswordMatch) {
//             res.send("wrong Password");
//         }
//         else {
//             res.redirect('/userLawyer');
//         }
//     }
//     catch {
//         res.send("wrong Details");
//     }
// });

  router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/userClient');
    });;
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
  

module.exports = router;