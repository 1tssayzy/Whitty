const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../repositories/index");
const router = express.Router();
const path = require("path");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { 
        username: username,
       },
     });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    })
    const token = jwt.sign(
      { username: newUser.username, id: newUser._id },
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
  const { username, password } = req.body;
  console.log("LOGIN BODY:", req.body); 
  try {
    const foundUser = await prisma.user.findUnique({ 
      where:{
        username: username,
      },
     });

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { username: foundUser.username, id: foundUser._id },
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
