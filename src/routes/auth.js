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
    const token = jwt.sign(
      { username: newUser.login, id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });
    res.json({ message: "User registered successfully", redirect: "/profile" });
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
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { username: foundUser.login, id: foundUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: "Login successful", redirect: "/profile" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
