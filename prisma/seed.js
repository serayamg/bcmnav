const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Database initialized.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
