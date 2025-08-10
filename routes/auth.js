const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const path = require("path"); 

router.post("/register", async (req, res) => {
  const { login, password } = req.body;

  try {
    const foundUser = await User.findOne({ login });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ login, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const foundUser = await User.findOne({ login });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    console.log("Password match:", );
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid password" });
    }
    res.sendFile(path.join(__dirname, "../pages/profile.html"));
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
