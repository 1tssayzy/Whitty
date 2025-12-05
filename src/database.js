// src/database.js
const { PrismaClient } = require('./generated/prisma'); // путь к твоему клиенту Prisma

const prisma = new PrismaClient();

module.exports = prisma;