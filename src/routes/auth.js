const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../repositories/index");
const router = express.Router();
const path = require("path");
const { requireAuth } = require("../middleware/authMiddleware");
const postFileMiddleware = require("../middleware/postFileMiddleware");

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
    });
    const token = jwt.sign(
      { username: newUser.username, id: newUser.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
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
      where: {
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
      { username: foundUser.username, id: foundUser.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
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

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.id,
      },

      select: {
        user_id: true,
        username: true,
        avatar: true,
        country: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/post", async (req, res) => {
  try {
    const post = await prisma.post.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
      },
    });
    res.json(post);
  } catch (e) {
    alert(e);
  }
});
router.post(
  "/post",
  requireAuth,
  postFileMiddleware.single("image"),
  async (req, res) => {
    let imgUrlPath = null;
   if(req.file){
    imgUrlPath = `/uploads/posts/${req.file.fieldname}`;
   }

    try {
      const createPost = await prisma.post.create({
        data: {
          user_id: req.user.id,
          imageUrl: imgUrlPath,
          caption: req.body.caption,
          content: req.body.content,
          created_at: new Date(),
        },
      });
      res
        .status(201)
        .json({ message: "Post created successfully", post: createPost });
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
