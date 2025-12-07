const { Router } = require("express");
const router = Router();
const prisma = require("../repositories/index"); 
const fileMiddleware = require("../middleware/fileMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

router.get("/countries", async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { country_name: 'asc' } 
    });
    res.json(countries);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error loading countries" });
  }
});


router.post("/update-country", requireAuth, async (req, res) => {
  const { country_id } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: req.user.id }, 
      data: { 
        country_id: Number(country_id) 
      },
      include: { country: true } 
    });

    res.json({ message: "Country updated!", user: updatedUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update country" });
  }
});

module.exports = router;