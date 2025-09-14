const { Router } = require("express");
const router = Router();
const user = require("../models/user");
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
      res.send(`/avatars/${req.file.filename}`);
    } catch (e) {
      res.status(500).json({ message: "Upload avatar error" });
    }
  }
);
module.exports = router;
