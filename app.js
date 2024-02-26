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

require("./passport-config")(passport);



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



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});


