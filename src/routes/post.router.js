const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../repositories/index");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const postFileMiddleware = require("../middleware/postFileMiddleware");


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