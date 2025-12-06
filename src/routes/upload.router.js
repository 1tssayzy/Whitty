const { Router } = require("express");
const router = Router();
const prisma = require("../repositories/index"); // Ваш налаштований Prisma Client
const fileMiddleware = require("../middleware/fileMiddleware"); // Мультер
const { requireAuth } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

router.post(
  "/upload-avatar",
  requireAuth, // Перевіряє токен і додає req.user
  fileMiddleware.single("avatar"),
  async (req, res) => {
    try {
      
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newAvatarUrl = `/uploads/avatars/${req.file.filename}`;

      
      const currentUser = await prisma.user.findUnique({
        where: { user_id: userId } 
      });

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldAvatarPath = currentUser.avatar;

      await prisma.user.update({
        where: { user_id: userId },
        data: {
          avatar: newAvatarUrl
        }
      });

      if (oldAvatarPath && !oldAvatarPath.includes("default.png")) {
        const filePathToDelete = path.join(__dirname, "../../", oldAvatarPath);
        console.log(filePathToDelete);
        fs.unlink(filePathToDelete, (err) => {
          if (err) console.error("⚠️ Failed to delete old avatar:", err.message);
        });
      }
      res.json({ 
        message: "Avatar updated", 
        avatar: newAvatarUrl 
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Upload avatar error" });
    }
  }
);

module.exports = router;