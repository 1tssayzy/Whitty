const prisma = require("../database"); 
const bcrypt = require("bcrypt");

async function registerUserWithTransaction(login, password, countryName = 'Unknown') { return prisma.$transaction(async (tx) => { 
     const foundUser = await tx.user.findUnique({ where: { username: login } }); if (foundUser) { throw new Error("UserAlreadyExists"); }

let country = await tx.country.findUnique({ where: { country_name: countryName } });
if (!country) {
    country = await tx.country.create({
        data: { country_name: countryName, continent: 'N/A' },
    });
}
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await tx.user.create({
  data: {
    username: login,
    password: hashedPassword,
    countryId: country.id,
  },
});
// 4. Повернення
return tx.user.findUnique({
    where: { id: newUser.id },
    include: { country: true },
});
}); }

module.exports = { registerUserWithTransaction, };