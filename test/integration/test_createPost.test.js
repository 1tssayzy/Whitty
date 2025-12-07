const request = require('supertest');
const app = require('../../src/server');
const prisma = require('../../src/repositories/index');
const jwt = require('jsonwebtoken');
const path = require('path');
const buffer = Buffer.from('fake image content'); 

describe('POST /api/post Integration Test', () => {
  let userToken;
  let userId;
  beforeAll(async () => {
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        username: 'testuser_poster',
        password: 'hashedpassword123',
        email: 'poster@test.com'
      }
    });

    userId = user.user_id; 

    userToken = jwt.sign(
      { username: user.username, id: userId },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ✅ ТЕСТ 1: Створення посту тільки з текстом
  it('should create a post with text only', async () => {
    const res = await request(app)
      .post('/api/post') 
      .set('Cookie', [`jwt=${userToken}`])
      .field('caption', 'Hello World')
      .field('content', 'This is a text post');

    expect(res.statusCode).toBe(201);
    expect(res.body.post).toHaveProperty('post_id');
    expect(res.body.post.caption).toBe('Hello World');
    expect(res.body.post.imageUrl).toBeNull();
  });

  // ✅ ТЕСТ 2: Створення посту з Картинкою
  it('should create a post with an image', async () => {
    const res = await request(app)
      .post('/api/post')
      .set('Cookie', [`jwt=${userToken}`])
      .attach('image', buffer, 'test-image.jpg') 
      .field('caption', 'Look at my photo!');

    expect(res.statusCode).toBe(201);
    expect(res.body.post.imageUrl).toContain('/uploads/posts/');
    expect(res.body.post.imageUrl).toContain('test-image.jpg');
    
    const savedPost = await prisma.post.findUnique({
      where: { post_id: res.body.post.post_id }
    });
    expect(savedPost).toBeTruthy();
    expect(savedPost.imageUrl).not.toBeNull();
  });

  // ❌ ТЕСТ 3: Помилка без авторизації
  it('should fail if user is not logged in', async () => {
    const res = await request(app)
      .post('/api/post')
      .field('caption', 'Hacker post');

    
    expect(res.statusCode).toBe(401); 
  });
});