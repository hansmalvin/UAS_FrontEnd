const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const staticRoute = require("./src/routes/route");
// test validator
const {
  signupValidators,
  loginValidators,
} = require("./src/validators/users-validator");
const User = require("./src/models/users-schema");

const app = express();
const port = process.env.PORT;
const url = process.env.DB_CONNECTION;
const origin = process.env.DB_URL;
const dbColl = process.env.DB_COLLECTION;

mongoose
  .connect(url, {
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

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
  })
);

app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(staticRoute);

//auth user
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login/login-and-signup.html");
  }
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "try again in 1 minute",
});

//auth admin
const isAdminAuth = (req, res, next) => {
  if (req.session.isAdminAuth) {
    next();
  } else {
    res.status(403).send("Access denied");
    res.redirect("/login/loginAdmin.html");
  }
};

//Signup
app.post("/signup", async (req, res) => {
  const { error } = signupValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }
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
    })
    await newUser.save();

    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});

app.post("/login", limiter, async (req, res) => {
  const { error } = loginValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // regex email ditaro sini dulu nanti baru dipindahin ke validator, pw regex belum
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    req.session.isAuth = true;
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    res.send("Login Succesfully");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    // res.clearCookie("connect.sid");
    res.status(200).send("Logged out successfully");
  });
});

//admin login function database
app.post("/loginAdmin", async (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@gmail.com" || password !== "123456") {
    return res.status(403).send("Invalid admin credentials");
  }

  req.session.isAdminAuth = true;
  res.status(200).send("Admin login successful");
});

// admin logout destroy session
app.post("/logoutAdmin", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    // res.clearCookie("connect.sid");
    res.redirect("/admin");
  });
});

//get user
app.get("/users", isAdminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// get user
app.get("/user", async (req, res) => {
  if (req.session.isAuth && req.session.user) {
    try {
      const user = await User.findOne(
        { email: req.session.user.email },
        "_id username email"
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Error fetching user data" });
    }
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

// update user by user
app.put("/users/:id", async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

// delete user by admin
app.delete("/users/:id", isAdminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

// delete user by user /api bisa diapus
app.delete("/api/users/:id", isAuth, async (req, res) => {
  const userId = req.params.id;

  // if (req.session.user._id !== userId) {
  //   return res.status(403).send("Unauthorized action");
  // }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
      res.status(200).send("User deleted and session terminated");
    });
  } catch (err) {
    res.status(500).send("Error deleting user: " + err.message);
  }
});

// admin login
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/src/views/login/loginAdmin.html");
});

app.get("/adminDashboard", isAdminAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/adminDashboard.html");
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

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/src/views/contact.html");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

