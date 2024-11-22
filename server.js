const mongoose = require("mongoose");
const express = require('express');
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcryptjs")
require('dotenv').config();

const staticRoute = require("./src/routes/route")
// test validator
const { signupValidators, loginValidators } = require("./src/validators/users-validator");
const User = require("./src/models/users-schema");

const app = express();
const port = process.env.PORT;
const url = process.env.DB_CONNECTION;
const origin = process.env.DB_URL;
const dbColl = process.env.DB_COLLECTION;

mongoose.connect(url,{
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then((res) => {
  console.log("mongodb Connected");
  });

const store = new MongoDBSession({
  uri: url,
  collection: dbColl,
});

app.use(session({
  secret: "key that will sign cookie",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 hari
  }
}));

app.use(cors({
  origin: origin, 
  credentials: true
}));
app.use(bodyParser.json());
app.use(staticRoute);

const isAuth = (req, res, next) => {
  if(req.session.isAuth){
    next();
  }
  else{
    res.redirect("/login/login-and-signup.html");
  }
}

app.post("/signup", async (req, res) => {
  const { error } = signupValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { username, email, password } = req.body;

  try {
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(400).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // req.session.isAuth = true;
    // res.send('Login Succesfully')

    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { error } = loginValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    req.session.isAuth = true;
    res.send('Login Succesfully')
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

// logout nya belom ada ui nya
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
    // res.clearCookie("connect.sid"); keknya bagus
    res.status(200).send("Logged out successfully");
  });
});

app.get("/login-and-signup", (req, res) => {
  res.sendFile(__dirname + "/src/views/login/login-and-signup.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/home.html"); 
});

app.get("/menu", isAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/menu.html"); 
});

app.get("/training", isAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/training.html");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});