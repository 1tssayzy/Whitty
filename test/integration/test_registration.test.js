// test/integration/test_registration.test.js
const prisma = require('../../src/database');
const { registerUserWithTransaction } = require('../../src/services/auth.service');

describe('User Registration Transaction', () => {

  // Очищаем таблицы перед каждым тестом
  beforeEach(async () => {
    await prisma.follow.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();
  });

  // Отключаем Prisma после всех тестов
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should successfully register a user and create a country', async () => {
    const user = await registerUserWithTransaction('vanya', 'password123', 'Ukraine');

    expect(user).toHaveProperty('user_id');
    expect(user.username).toBe('vanya');

    const country = await prisma.country.findUnique({ where: { country_name: 'Ukraine' } });
    expect(country).not.toBeNull();
  });

  it('should fail registration and rollback if user already exists', async () => {
    // Регистрируем пользователя первый раз
    await registerUserWithTransaction('vanya', 'password123', 'Ukraine');

    // Попытка зарегистрировать такого же пользователя должна упасть
    await expect(registerUserWithTransaction('vanya', 'password123', 'Ukraine'))
      .rejects
      .toThrow('User Already Exists');

    // Проверяем, что не создалась новая страна
    const countries = await prisma.country.findMany({ where: { country_name: 'Ukraine' } });
    expect(countries.length).toBe(1);
  });

});