const { Router } = require("express");
const router = Router();
const user = require("../models/user");
const fileMiddleware = require("../middleware/fileMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");
router.post(
  "/upload-avatar",
  requireAuth,
  fileMiddleware.single("avatar"),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const currentUser = await user.findById(userID);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const oldAvatar = currentUser.avatar;
      const avatarUrl = `/avatars/${req.file.filename}`;
      currentUser.avatar = avatarUrl;
      await user.findByIdAndUpdate(userID, { avatar: avatarUrl });
      if (oldAvatar && oldAvatar !== "/avatars/default.png") {
        const oldPath = path.join(
          __dirname,
          "../uploads",
          oldAvatar.replace("/avatars/", "avatars/")
        );
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Failed to delete old avatar:", err);
        });
      }
      res.send(`/avatars/${req.file.filename}`);
    } catch (e) {
      res.status(500).json({ message: "Upload avatar error" });
    }
  }
);
module.exports = router;
