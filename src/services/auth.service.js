const prisma = require("../repositories/index");
const bcrypt = require("bcrypt");

async function registerUserWithTransaction(login, password, countryName = 'Unknown') {
  return prisma.$transaction(async (tx) => {

    const foundUser = await tx.user.findUnique({ where: { username: login } });
    if (foundUser) throw new Error("User Already Exists");


    let country = await tx.country.findUnique({ where: { country_name: countryName } });
    if (!country) {
      country = await tx.country.create({
        data: { country_name: countryName },
      });
    }

    // Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await tx.user.create({
      data: {
        username: login,
        password: hashedPassword,
        country_id: country.country_id,
      },
    });
    return tx.user.findUnique({
      where: { user_id: newUser.user_id },
      include: { country: true },
    });
  });
}

module.exports = { registerUserWithTransaction };