const { PrismaClient } = require('@prisma/client');

// Створюємо єдиний екземпляр клієнта для всіх операцій.
// Використання глобальної змінної є гарною практикою для запобігання
// створенню кількох екземплярів PrismaClient, особливо в тестовому середовищі (Jest)
// та під час гарячої перезавантаження коду (hot reload).
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Використовуємо глобальний простір
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;