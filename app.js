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

app.post("/registerC", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    clients.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
    return;
  } catch {
    res.redirect("/registerC");
  }
  console.log(users);
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



app.listen(3000, () => {
  console.log("Server started on port 3000");
});


