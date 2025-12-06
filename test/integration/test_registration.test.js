const dotenv = require('dotenv');
dotenv.config({ path: '.env.test', override: true });
const prisma = require('../../src/repositories/index');
const { registerUserWithTransaction } = require('../../src/services/auth.service');

describe('User Registration Transaction', () => {
  beforeEach(async () => {
    await prisma.country.deleteMany(); 
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.comment.deleteMany();
  });

 afterAll(async()=>{
   await prisma.$disconnect();
 })
  describe('Complex Creation Scenario', () => {

    it(' Check DB Connection', async () => {
        
        console.log('\n🔴 TEST IS USING DATABASE:', process.env.DATABASE_URL); 
    });
  });


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
    await registerUserWithTransaction('vanya', 'password123', 'Ukraine');

    await expect(registerUserWithTransaction('vanya', 'password123', 'Ukraine'))
      .rejects
      .toThrow('User Already Exists');

    const countries = await prisma.country.findMany({ where: { country_name: 'Ukraine' } });
    expect(countries.length).toBe(1);
  });

});