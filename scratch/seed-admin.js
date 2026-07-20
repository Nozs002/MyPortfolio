import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'Nozs002';
  const password = '123';
  const email = 'phamson26082005@gmail.com';
  const name = 'Sơn Phạm';

  console.log('Hashing password...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log(`Upserting admin user "${username}"...`);
  const admin = await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      email,
      name,
    },
    create: {
      username,
      passwordHash,
      email,
      name,
    },
  });

  console.log('Admin user seeded successfully:', admin);
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
