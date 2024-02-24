if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const lodash = require("lodash");
const mongoose = require("mongoose");


const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => clients.find((user) => user.email === email),
  (id) => clients.find((user) => user.id === id)
);

const clients = [];
let posts = [];

const app = express();
const dash = lodash();

const db = require('./config/keys').MongoURI;
const User = require('./models/User')

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


app.post("/login", passport.authenticate("local", {
    successRedirect: "/userClient",
    failureRedirect: "/login",
    failureFlash: true,
  })
);  

app.get("/userLawyer", (req,res) => {
  res.render("userLawyer",{
    newPost: posts 
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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});


