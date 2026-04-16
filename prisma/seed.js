import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        siteTitle: 'Developer Portfolio',
        heroTitle: 'I build modern web experiences',
        heroSubtitle: 'Software Engineer | Web Developer',
        aboutText: 'This is a starter content entry for your portfolio website.',
        githubUrl: 'https://github.com/aothymoon59',
        email: 'admin@example.com'
      }
    });
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
