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
const { signupValidators, loginValidators, forgotPasswordValidators,} = require("./src/validators/users-validator");
const User = require("./src/models/users-schema");

const app = express();
const port = process.env.PORT;
const url = process.env.DB_CONNECTION;
const origin = process.env.DB_URL;
const dbColl = process.env.DB_COLLECTION;

mongoose
  .connect(url, {

  })
  .then((res) => {
    console.log("mongodb Connected");
  });

const store = new MongoDBSession({
  uri: url,
  collection: dbColl,
});

// session cookies
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

// cors
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

// login limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
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

//Signup by user
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
    // cek email sudah ada atau belum
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(400).send("Email already registered");
    }
    // hash password
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

// login limiter untuk user login
app.post("/login", limiter, async (req, res) => {
  const { error } = loginValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // regex email
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

    // create session cookies dan session khusus user
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

// logout by user
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
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

// delete user by user
app.delete("/api/users/:id", isAuth, async (req, res) => {
  const userId = req.params.id;

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

// forgot password by user
app.post("/forgot-password", async (req, res) => {
  const { error } = forgotPasswordValidators.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password successfully reset.");
  } catch (error) {
    res.status(500).send("Error resetting password: " + error.message);
  }
});

// Routers
const trainingRoutes = require("./src/routes/trainingRoutes");
app.use("/trainings", trainingRoutes);

const todolistRoutes = require("./src/routes/todolistRoutes");
app.use("/todolist", todolistRoutes);

const menuRoutes = require("./src/routes/menuRoutes"); 
app.use("/menus", menuRoutes);

const contactRoutes = require("./src/routes/contactRoutes");
app.use("/contacts", contactRoutes);

// express routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/home.html");
});

// admin login
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/src/views/login/loginAdmin.html");
});

// user login
app.get("/login-and-signup", (req, res) => {
  res.sendFile(__dirname + "/src/views/login/login-and-signup.html");
});

// menu route
app.get("/menu", isAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/menu.html");
});

// training route
app.get("/training", isAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/training.html");
});

// contact route
app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/src/views/contact.html");
});

// admin dashboard route
app.get("/adminDashboard", isAdminAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/adminDashboard.html");
});

// training dashboard route
app.get("/trainingDashboard", isAdminAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/trainingDashboard.html");
});

// menu dashboard route
app.get("/menuDashboard", isAdminAuth, (req, res) => {
  res.sendFile(__dirname + "/src/views/menuDashboard.html");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});