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

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const initializePassportClient = require("./passport-config");
initializePassport(
  passport,
  (email) => clients.find((user) => user.email === email),
  (id) => clients.find((user) => user.id === id)
);

const users = [];
const clients = [];

const app = express();

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

app.post("/lawyer", passport.authenticate("local", {
    successRedirect: "/userLawyer",
    failureRedirect: "/lawyer",
    failureFlash: true,
  })
);

app.post("/registerL", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/lawyer");
    return;
  } catch {
    res.redirect("/registerL");
  }
  console.log(users);
});

app.post("/registerc", async (req, res) => {
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
    res.redirect("/registerL");
  }
  console.log(clients);
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});


