// src/services/auth.service.js
const prisma = require("../database");
const bcrypt = require("bcrypt");

async function registerUserWithTransaction(login, password, countryName = 'Unknown') {
  return prisma.$transaction(async (tx) => {

    // Проверяем существующего пользователя
    const foundUser = await tx.user.findUnique({ where: { username: login } });
    if (foundUser) throw new Error("User Already Exists");

    // Ищем страну или создаём новую
    let country = await tx.country.findUnique({ where: { country_name: countryName } });
    if (!country) {
      country = await tx.country.create({
        data: { country_name: countryName },
      });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const newUser = await tx.user.create({
      data: {
        username: login,
        password: hashedPassword,
        country_id: country.country_id,
      },
    });

    // Возвращаем пользователя с данными страны
    return tx.user.findUnique({
      where: { user_id: newUser.user_id },
      include: { country: true },
    });
  });
}

module.exports = { registerUserWithTransaction };