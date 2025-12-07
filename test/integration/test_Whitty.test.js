const request = require('supertest');
const app = require('../../src/server'); 
const prisma = require('../../src/repositories/index');
const jwt = require('jsonwebtoken');

describe('Social Features Integration Test', () => {
  let userToken;
  let userId;
  let postId;
  let countryId;

  beforeAll(async () => {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    const country = await prisma.country.create({
      data: { country_name: 'Testland' }
    });
    countryId = country.country_id;

    const user = await prisma.user.create({
      data: {
        username: 'social_tester',
        password: 'hashedpassword',
        email: 'social@test.com'
      }
    });
    userId = user.user_id;

    userToken = jwt.sign(
      { username: user.username, id: userId },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    const post = await prisma.post.create({
      data: {
        user_id: userId,
        caption: 'Test Post',
        content: 'Content for testing',
        created_at: new Date()
      }
    });
    postId = post.post_id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Comments', () => {
    it('should create a comment successfully', async () => {
      const res = await request(app)
        .post('/api/comment') 
        .set('Cookie', [`jwt=${userToken}`])
        .send({
          post_id: postId,
          comment_text: 'This is a test comment!'
        });

      expect(res.statusCode).toBe(201);
    
      expect(res.body.createComment).toHaveProperty('comment_text', 'This is a test comment!');

      expect(res.body.createComment.user).toBeDefined(); 
    }); 

    it('should fail to comment without text', async () => {
        const res = await request(app)
          .post('/api/comment')
          .set('Cookie', [`jwt=${userToken}`])
          .send({ post_id: postId }); 
        

        expect(res.statusCode).not.toBe(201); 
    });
  });
  describe('Likes', () => {
    it('should like a post (first time)', async () => {
      const res = await request(app)
        .post('/api/like')
        .set('Cookie', [`jwt=${userToken}`])
        .send({ post_id: postId });

      expect(res.statusCode).toBe(200);
      expect(res.body.liked).toBe(true);
      expect(res.body.message).toBe('Liked');

      const updatedPost = await prisma.post.findUnique({ where: { post_id: postId }});
      expect(updatedPost.likes_count).toBe(1);
    });

    it('should unlike a post (second time)', async () => {
      const res = await request(app)
        .post('/api/like')
        .set('Cookie', [`jwt=${userToken}`])
        .send({ post_id: postId });

      expect(res.statusCode).toBe(200);
      expect(res.body.liked).toBe(false);
      expect(res.body.message).toBe('Unliked');

      const updatedPost = await prisma.post.findUnique({ where: { post_id: postId }});
      expect(updatedPost.likes_count).toBe(0);
    });
  });

  describe('Countries', () => {
    it('should fetch list of countries', async () => {
    
      const res = await request(app)
        .get('/api/countries'); 

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('country_name');
    });

    it('should update user country', async () => {
      const res = await request(app)
        .post('/api/update-country') 
        .set('Cookie', [`jwt=${userToken}`])
        .send({ country_id: countryId });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.country_id).toBe(countryId);

      const updatedUser = await prisma.user.findUnique({ 
          where: { user_id: userId },
          include: { country: true }
      });
      expect(updatedUser.country.country_name).toBe('Testland');
    });
  });
});