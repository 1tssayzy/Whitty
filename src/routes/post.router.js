const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../repositories/index");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const postFileMiddleware = require("../middleware/postFileMiddleware");

router.post(
  "/post",
  requireAuth,
  postFileMiddleware.single("image"),
  async (req, res) => {
    let imgUrlPath = null;
   if(req.file){
    imgUrlPath = `/uploads/posts/${req.file.filename}`;
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

router.post(
  "/comment",
  requireAuth,
  async (req, res) => {
   const { post_id,comment_text } = req.body;
    try {
      const createComment = await prisma.comment.create({
        data: {
          post_id: Number(post_id),
          user_id: req.user.id,
          comment_text:comment_text,
          created_at: new Date()
        },
        include: {
          user:{
            select : {
              username : true,
              avatar:true,
            }
          }
        }
      });
      res
        .status(201)
        .json({ message: "Comment created successfully", createComment });
    } catch (e) {
      console.log(e);
      res.status(500).json({message : "Failed to post comment"});
    }
  }
);

router.get("/post", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { username: true, avatar: true },
        },
        comments: {
            orderBy: { created_at: "asc" }, 
            include: {
                user: {
                    select: { username: true, avatar: true } 
                }
            }
        }
      },
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

module.exports =  router;