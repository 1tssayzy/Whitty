const { Router } = require("express");
const router = Router();
const express = require("express");
const app = express();
const user = require("../models/user");

const fileMiddleware = require("../middleware/fileMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");


router.get("/me", requireAuth,  async(req, res) => {
     try {
        const userID = req.user.id;
        const currentUser = await user.findById(userID);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ 
            avatar: currentUser.avatar,
            login: currentUser.login
         });
     } catch (e) {
       res.status(500).json({ message: "Fetch user error"})
       alert(e.message);
     }});
module.exports = router;