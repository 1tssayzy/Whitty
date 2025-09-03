const { Router } = require("express");
const router = Router();
const express = require("express");
const app = express();
const user = require("../models/user");
app.use(express.json());
const fileMiddleware = require("../middleware/fileMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

router.post(
  "/upload-avatar",
  requireAuth,
  fileMiddleware.single("avatar"),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const avatarUrl = `/avatars/${req.file.filename}`;
      await user.findByIdAndUpdate(userID, { avatar: avatarUrl });
      res.json({ success: true, avatarUrl });
    } catch (e) {
      res.status(500).json({ message: "Upload avatar error" });
    }
  }
);
module.exports = router;
