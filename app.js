if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const lodash = require("lodash");
const mongoose = require("mongoose");

require("./passport-config")(passport);
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');



let posts = [];

const app = express();
const dash = lodash();

const db = require('./config/keys').MongoURI;


mongoose.connect(db, {useNewUrlParser: true})
 .then(() => console.log('MongoDB was connected..'))
 .catch(err => console.log(err));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/userClient',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});



app.get("/userLawyer", (req,res) => {
  res.render("userLawyer",{
    newPost: posts ,
  });
}); 

app.post("/userClient", function(req,res){

  const post = {
  title: req.body.postTitle,
  body: req.body.postBody,
  phone: req.body.postPhone
};

posts.push(post);
res.redirect("/");

});

app.get("/post/:topic", function(req,res){

  const requestedTitle = dash.lowerCase(req.params.topic);


  posts.forEach(function(post){

    const storedTitle = dash.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post",{
        title: post.title,
        content: post.body
      });
    } 


  });

});


app.post('/registerC', (req, res) => {
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


app.post("/registerL", async (req, res) => {

  // const data = {
  //     email: req.body.email,
  //     name: req.body.name,
  //     password: req.body.password,
  //     phone: req.body.phone,
  //     copnum: req.body.copnum
  // }

  const { name, email, password, phone, copnum } = req.body;

  const existingUser = await Lawyer.findOne({ email: email });

  if (existingUser) {
      res.send('User already exists. Please choose a different username.');
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
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // data.password = hashedPassword;

      // const userdata = await Lawyer.insertMany(data);
      // console.log(userdata);
      // res.redirect('/lawyer');
  }

});

app.post("/lawyer", async (req, res) => {
  try {
      const check = await Lawyer.findOne({ email: req.body.email });
      if (!check) {
          res.send("User name cannot found")
      }
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (!isPasswordMatch) {
          res.send("wrong Password");
      }
      else {
          res.redirect('/userLawyer');
      }
  }
  catch {
      res.send("wrong Details");
  }
});



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});


