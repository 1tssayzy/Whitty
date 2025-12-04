const prisma = require('../../src/database');
const authService = require('../../src/services/auth.service');

// Налаштування: Очищення бази даних перед кожним тестом
beforeEach(async () => {
    // Каскадне видалення даних у тестовій базі
    await prisma.follows.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.country.deleteMany({});
});

describe('Complex Creation Scenario: User Registration Transaction', () => {

    it('should successfully register a user and create a country if it does not exist', async () => {
        const username = 'testuser1';
        const password = 'securepassword';
        const countryName = 'TestLand';

        // 1. Виконання успішного сценарію
        const user = await authService.registerUserWithTransaction(username, password, countryName);
        
        // 2. Перевірка результату (вимоги курсової)
        expect(user).toBeDefined();
        expect(user.username).toBe(username);
        expect(user.country.country_name).toBe(countryName); // Перевірка, що пов'язана сутність створена
        
        // 3. Перевірка стану БД
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        expect(dbUser).not.toBeNull();
        
        const dbCountry = await prisma.country.findUnique({ where: { country_name: countryName } });
        expect(dbCountry).not.toBeNull();
    });
    
    it('should fail registration and rollback the transaction if user already exists', async () => {
        const username = 'existinguser';
        const password = 'securepassword';
        const countryName = 'NewCountry';

        // Початкове створення (це буде перше створення)
        await authService.registerUserWithTransaction(username, password, 'InitialCountry');
        
        // Спроба повторної реєстрації (це має викликати помилку і rollback)
        await expect(
            authService.registerUserWithTransaction(username, password, countryName)
        ).rejects.toThrow('UserAlreadyExists'); // Перевірка, що обробка помилок працює

        // Перевірка ROLLBACK: Нова країна 'NewCountry' НЕ повинна бути створена
        const newCountry = await prisma.country.findUnique({ where: { country_name: countryName } });
        expect(newCountry).toBeNull();
        
        // Перевірка ROLLBACK: Користувач не був змінений (лишився один)
        const userCount = await prisma.user.count();
        expect(userCount).toBe(1);
    });
});