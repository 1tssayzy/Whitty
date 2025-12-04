const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  await prisma.user.create({
    data: { username: "vanya",
  });
  
  const posts = await prisma.posts.findMany({
    include: { likes: true }
  });
  console.log(posts);
}

main();