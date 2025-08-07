const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

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
    console.log(`New user registered: ${hashedPassword}`);
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
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: ` ${login},You are login successful`});

    console.log(`Введённый пароль: ${passwordMatch}`);
    console.log(`Пароль из базы (хеш): ${foundUser.password}`);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
