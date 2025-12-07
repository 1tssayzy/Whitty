const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../repositories/index");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const postFileMiddleware = require("../middleware/postFileMiddleware");


router.get("/countries", async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { country_name: 'asc' } // Сортуємо за алфавітом
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
      where: { user_id: req.user.id }, // ID з токена
      data: { 
        country_id: Number(country_id) // Перетворюємо рядок "5" у число 5
      },
      include: { country: true } // Повертаємо оновлені дані разом з назвою країни
    });

    res.json({ message: "Country updated!", user: updatedUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update country" });
  }
});